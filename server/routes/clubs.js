const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Club = require('../models/Club');
const User = require('../models/User');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { sendClubMembershipEmail } = require('../utils/emailService');

const router = express.Router();

// @route   GET /api/clubs
// @desc    Get all clubs with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'literary', 'dance', 'music', 'drama', 'photography', 'debate', 'environmental']),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended', 'inactive']),
  query('search').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: 'approved' };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const clubs = await Club.find(filter)
      .populate('president', 'firstName lastName email profilePicture')
      .populate('vicePresident', 'firstName lastName email profilePicture')
      .populate('secretary', 'firstName lastName email profilePicture')
      .populate('treasurer', 'firstName lastName email profilePicture')
      .populate('members.user', 'firstName lastName email profilePicture')
      .sort({ foundedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Club.countDocuments(filter);

    res.json({
      success: true,
      data: {
        clubs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalClubs: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/clubs/:id
// @desc    Get single club by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('president', 'firstName lastName email profilePicture phone')
      .populate('vicePresident', 'firstName lastName email profilePicture phone')
      .populate('secretary', 'firstName lastName email profilePicture phone')
      .populate('treasurer', 'firstName lastName email profilePicture phone')
      .populate('members.user', 'firstName lastName email profilePicture studentId year department')
      .populate('events', 'title eventType startDate endDate status')
      .populate('facultyAdvisor.facultyId', 'firstName lastName email phone department');

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.json({
      success: true,
      data: { club }
    });

  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/clubs
// @desc    Create a new club
// @access  Private (Students can create clubs)
router.post('/', protect, [
  body('name').trim().notEmpty().withMessage('Club name is required'),
  body('description').trim().notEmpty().withMessage('Club description is required'),
  body('category').isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'literary', 'dance', 'music', 'drama', 'photography', 'debate', 'environmental']).withMessage('Invalid category'),
  body('type').optional().isIn(['official', 'student_led', 'faculty_led']).withMessage('Invalid type'),
  body('maxMembers').optional().isInt({ min: 5, max: 200 }).withMessage('Max members must be between 5 and 200'),
  body('membershipFee').optional().isFloat({ min: 0 }).withMessage('Membership fee must be non-negative'),
  body('contactInfo.email').optional().isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').optional().trim(),
  body('facultyAdvisor.name').optional().trim(),
  body('facultyAdvisor.email').optional().isEmail().withMessage('Valid faculty advisor email is required'),
  body('facultyAdvisor.department').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const clubData = req.body;
    clubData.president = req.user.id;

    // Check if club name already exists
    const existingClub = await Club.findOne({ name: clubData.name });
    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: 'Club with this name already exists'
      });
    }

    const club = await Club.create(clubData);

    // Add creator as president member
    club.members.push({
      user: req.user.id,
      role: 'president',
      status: 'approved'
    });
    club.currentMembers = 1;
    await club.save();

    // Update user's clubs
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        clubs: {
          club: club._id,
          role: 'president',
          status: 'approved'
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: { club }
    });

  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/clubs/:id/join
// @desc    Request to join a club
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check if club is recruiting
    if (!club.isRecruiting) {
      return res.status(400).json({
        success: false,
        message: 'Club is not currently recruiting new members'
      });
    }

    // Check if club is full
    if (club.currentMembers >= club.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Club is full'
      });
    }

    // Check if user is already a member or has pending request
    const existingMember = club.members.find(
      member => member.user.toString() === req.user.id
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member or have a pending request for this club'
      });
    }

    // Add membership request
    club.members.push({
      user: req.user.id,
      role: 'member',
      status: 'pending'
    });
    await club.save();

    // Add club to user's clubs with pending status
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        clubs: {
          club: club._id,
          role: 'member',
          status: 'pending'
        }
      }
    });

    // Send email notification to user
    await sendClubMembershipEmail(req.user, club, 'pending');

    res.json({
      success: true,
      message: 'Join request sent successfully',
      data: { club }
    });

  } catch (error) {
    console.error('Join club error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/clubs/:id/leave
// @desc    Leave a club
// @access  Private
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Find member
    const memberIndex = club.members.findIndex(
      member => member.user.toString() === req.user.id
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this club'
      });
    }

    const member = club.members[memberIndex];

    // Check if user is president
    if (member.role === 'president') {
      return res.status(400).json({
        success: false,
        message: 'President cannot leave the club. Please transfer presidency first.'
      });
    }

    // Remove member
    club.members.splice(memberIndex, 1);
    club.currentMembers -= 1;
    await club.save();

    // Remove club from user's clubs
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        clubs: { club: club._id }
      }
    });

    res.json({
      success: true,
      message: 'Successfully left the club',
      data: { club }
    });

  } catch (error) {
    console.error('Leave club error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/clubs/:id/members/:memberId
// @desc    Update member status (approve/reject)
// @access  Private (Club Leadership or Admin)
router.put('/:id/members/:memberId', protect, [
  body('status').isIn(['pending', 'approved', 'rejected', 'inactive']).withMessage('Invalid status'),
  body('role').optional().isIn(['member', 'treasurer', 'secretary', 'vice_president', 'president']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isClubLeader = club.members.some(member => 
      member.user.toString() === req.user.id && 
      ['president', 'vice_president', 'secretary'].includes(member.role)
    );

    if (!isAdmin && !isClubLeader) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage club members'
      });
    }

    // Find member
    const member = club.members.find(
      member => member.user.toString() === req.params.memberId
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Update member status and role
    member.status = req.body.status;
    if (req.body.role) {
      member.role = req.body.role;
    }

    // Update current members count
    if (req.body.status === 'approved' && member.status !== 'approved') {
      club.currentMembers += 1;
    } else if (req.body.status !== 'approved' && member.status === 'approved') {
      club.currentMembers -= 1;
    }

    await club.save();

    // Update user's club status
    await User.findOneAndUpdate(
      { 
        _id: req.params.memberId,
        'clubs.club': club._id
      },
      {
        $set: {
          'clubs.$.status': req.body.status,
          'clubs.$.role': req.body.role || member.role
        }
      }
    );

    // Send email notification to the member
    const memberUser = await User.findById(req.params.memberId);
    if (memberUser) {
      await sendClubMembershipEmail(memberUser, club, req.body.status);
    }

    res.json({
      success: true,
      message: 'Member status updated successfully',
      data: { club }
    });

  } catch (error) {
    console.error('Update member status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/clubs/:id
// @desc    Update club information
// @access  Private (Club Leadership or Admin)
router.put('/:id', protect, [
  body('name').optional().trim().notEmpty().withMessage('Club name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Club description cannot be empty'),
  body('category').optional().isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'literary', 'dance', 'music', 'drama', 'photography', 'debate', 'environmental']),
  body('maxMembers').optional().isInt({ min: 5, max: 200 }),
  body('membershipFee').optional().isFloat({ min: 0 }),
  body('isRecruiting').optional().isBoolean(),
  body('contactInfo.email').optional().isEmail(),
  body('contactInfo.phone').optional().trim(),
  body('meetingSchedule.day').optional().isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('meetingSchedule.time').optional().trim(),
  body('meetingSchedule.venue').optional().trim(),
  body('meetingSchedule.frequency').optional().isIn(['weekly', 'bi-weekly', 'monthly'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isClubLeader = club.members.some(member => 
      member.user.toString() === req.user.id && 
      ['president', 'vice_president', 'secretary'].includes(member.role)
    );

    if (!isAdmin && !isClubLeader) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this club'
      });
    }

    // Check if club name is being changed and if it's unique
    if (req.body.name && req.body.name !== club.name) {
      const existingClub = await Club.findOne({ name: req.body.name });
      if (existingClub) {
        return res.status(400).json({
          success: false,
          message: 'Club with this name already exists'
        });
      }
    }

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('president', 'firstName lastName email profilePicture')
     .populate('vicePresident', 'firstName lastName email profilePicture')
     .populate('secretary', 'firstName lastName email profilePicture')
     .populate('treasurer', 'firstName lastName email profilePicture');

    res.json({
      success: true,
      message: 'Club updated successfully',
      data: { club: updatedClub }
    });

  } catch (error) {
    console.error('Update club error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/clubs/:id
// @desc    Delete a club
// @access  Private (Club President or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isPresident = club.members.some(member => 
      member.user.toString() === req.user.id && member.role === 'president'
    );

    if (!isAdmin && !isPresident) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this club'
      });
    }

    // Check if club has active events
    const activeEvents = await Event.countDocuments({
      club: club._id,
      status: { $in: ['approved', 'ongoing'] }
    });

    if (activeEvents > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete club with active events'
      });
    }

    // Remove club from all users' clubs
    await User.updateMany(
      { 'clubs.club': club._id },
      { $pull: { clubs: { club: club._id } } }
    );

    await Club.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Club deleted successfully'
    });

  } catch (error) {
    console.error('Delete club error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
