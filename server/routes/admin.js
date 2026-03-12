const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Event = require('../models/Event');
const Club = require('../models/Club');
const Result = require('../models/Result');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin authentication
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalClubs,
      pendingEvents,
      pendingClubs,
      recentUsers,
      recentEvents,
      topClubs,
      eventStats
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Club.countDocuments(),
      Event.countDocuments({ status: 'pending' }),
      Club.countDocuments({ status: 'pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt'),
      Event.find().sort({ createdAt: -1 }).limit(5).populate('organizer', 'firstName lastName').populate('club', 'name'),
      Club.find({ status: 'approved' }).sort({ totalEvents: -1 }).limit(5).select('name category totalEvents totalMembers'),
      Event.aggregate([
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 },
            totalParticipants: { $sum: '$currentParticipants' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers,
          totalEvents,
          totalClubs,
          pendingEvents,
          pendingClubs
        },
        recentUsers,
        recentEvents,
        topClubs,
        eventStats
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin only)
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['student', 'club_rep', 'admin']),
  query('status').optional().isIn(['active', 'inactive']),
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }

    if (req.query.status === 'active') {
      filter.isActive = true;
    } else if (req.query.status === 'inactive') {
      filter.isActive = false;
    }

    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { studentId: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .populate('clubs.club', 'name category')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user status or role
// @access  Private (Admin only)
router.put('/users/:id', [
  body('role').optional().isIn(['student', 'club_rep', 'admin']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be boolean')
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

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role or status
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify your own account'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/events
// @desc    Get all events for admin management
// @access  Private (Admin only)
router.get('/events', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['draft', 'pending', 'approved', 'rejected', 'ongoing', 'completed', 'cancelled']),
  query('eventType').optional().isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'workshop', 'competition', 'seminar'])
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.eventType) {
      filter.eventType = req.query.eventType;
    }

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName email')
      .populate('club', 'name category')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalEvents: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/events/:id/approve
// @desc    Approve or reject an event
// @access  Private (Admin only)
router.put('/events/:id/approve', [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('rejectionReason').optional().trim()
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

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Event is not pending approval'
      });
    }

    const updateData = {
      status: req.body.status,
      approvedBy: req.user.id,
      approvedAt: new Date()
    };

    if (req.body.status === 'rejected' && req.body.rejectionReason) {
      updateData.rejectionReason = req.body.rejectionReason;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('organizer', 'firstName lastName email')
     .populate('club', 'name category')
     .populate('approvedBy', 'firstName lastName');

    res.json({
      success: true,
      message: `Event ${req.body.status} successfully`,
      data: { event: updatedEvent }
    });

  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/clubs
// @desc    Get all clubs for admin management
// @access  Private (Admin only)
router.get('/clubs', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended', 'inactive']),
  query('category').optional().isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'literary', 'dance', 'music', 'drama', 'photography', 'debate', 'environmental'])
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const clubs = await Club.find(filter)
      .populate('president', 'firstName lastName email')
      .populate('vicePresident', 'firstName lastName email')
      .populate('secretary', 'firstName lastName email')
      .populate('treasurer', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
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

// @route   PUT /api/admin/clubs/:id/approve
// @desc    Approve or reject a club
// @access  Private (Admin only)
router.put('/clubs/:id/approve', [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('rejectionReason').optional().trim()
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

    if (club.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Club is not pending approval'
      });
    }

    const updateData = {
      status: req.body.status,
      approvedBy: req.user.id,
      approvedAt: new Date()
    };

    if (req.body.status === 'rejected' && req.body.rejectionReason) {
      updateData.rejectionReason = req.body.rejectionReason;
    }

    const updatedClub = await Club.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('president', 'firstName lastName email')
     .populate('vicePresident', 'firstName lastName email')
     .populate('secretary', 'firstName lastName email')
     .populate('treasurer', 'firstName lastName email')
     .populate('approvedBy', 'firstName lastName');

    res.json({
      success: true,
      message: `Club ${req.body.status} successfully`,
      data: { club: updatedClub }
    });

  } catch (error) {
    console.error('Approve club error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private (Admin only)
router.get('/analytics', async (req, res) => {
  try {
    const [
      userStats,
      eventStats,
      clubStats,
      monthlyStats,
      topParticipants,
      topClubs
    ] = await Promise.all([
      // User statistics
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Event statistics
      Event.aggregate([
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 },
            totalParticipants: { $sum: '$currentParticipants' }
          }
        }
      ]),
      
      // Club statistics
      Club.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalMembers: { $sum: '$currentMembers' }
          }
        }
      ]),
      
      // Monthly statistics for the last 12 months
      Event.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            events: { $sum: 1 },
            participants: { $sum: '$currentParticipants' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      
      // Top participants
      User.aggregate([
        { $sort: { points: -1 } },
        { $limit: 10 },
        { $project: { firstName: 1, lastName: 1, points: 1, eventsParticipated: 1 } }
      ]),
      
      // Top clubs by events
      Club.aggregate([
        { $match: { status: 'approved' } },
        { $sort: { totalEvents: -1 } },
        { $limit: 10 },
        { $project: { name: 1, category: 1, totalEvents: 1, totalMembers: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        userStats,
        eventStats,
        clubStats,
        monthlyStats,
        topParticipants,
        topClubs
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
