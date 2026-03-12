const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const Club = require('../models/Club');
const { protect, authorize } = require('../middleware/auth');
const { sendEventRegistrationEmail, sendEventCreatedEmail } = require('../utils/emailService');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('eventType').optional().isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'workshop', 'competition', 'seminar']),
  query('status').optional().isIn(['upcoming', 'ongoing', 'completed']),
  query('club').optional().isMongoId().withMessage('Invalid club ID'),
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
    const filter = { status: { $in: ['approved', 'ongoing', 'completed'] } };

    if (req.query.eventType) {
      filter.eventType = req.query.eventType;
    }

    if (req.query.club) {
      filter.club = req.query.club;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Date filtering based on status
    const now = new Date();
    if (req.query.status === 'upcoming') {
      filter.startDate = { $gt: now };
    } else if (req.query.status === 'ongoing') {
      filter.startDate = { $lte: now };
      filter.endDate = { $gte: now };
    } else if (req.query.status === 'completed') {
      filter.endDate = { $lt: now };
    }

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName email')
      .populate('club', 'name category logo')
      .populate('participants.user', 'firstName lastName email profilePicture')
      .sort({ startDate: 1 })
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

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email phone')
      .populate('club', 'name category logo contactInfo')
      .populate('participants.user', 'firstName lastName email profilePicture studentId')
      .populate('results.participant', 'firstName lastName email profilePicture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Increment views
    event.views += 1;
    await event.save();

    res.json({
      success: true,
      data: { event }
    });

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Club Rep or Admin)
router.post('/', protect, authorize('club_rep', 'admin'), [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('description').trim().notEmpty().withMessage('Event description is required'),
  body('eventType').isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'workshop', 'competition', 'seminar']).withMessage('Invalid event type'),
  body('category').isIn(['individual', 'team', 'group']).withMessage('Invalid category'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('registrationDeadline').isISO8601().withMessage('Valid registration deadline is required'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('maxParticipants').isInt({ min: 1 }).withMessage('Max participants must be at least 1'),
  body('registrationFee').optional().isFloat({ min: 0 }).withMessage('Registration fee must be non-negative'),
  body('club').isMongoId().withMessage('Valid club ID is required')
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

    const eventData = req.body;
    eventData.organizer = req.user.id;

    // Check if club exists and user has permission
    const club = await Club.findById(eventData.club);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check if user is club rep for this club or admin
    if (req.user.role !== 'admin') {
      const isClubRep = club.members.some(member => 
        member.user.toString() === req.user.id && 
        ['president', 'vice_president', 'secretary'].includes(member.role)
      );
      
      if (!isClubRep) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to create events for this club'
        });
      }
    }

    // Validate dates
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    const registrationDeadline = new Date(eventData.registrationDeadline);

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (registrationDeadline >= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline must be before start date'
      });
    }

    const event = await Event.create(eventData);

    // Add event to club's events array
    club.events.push(event._id);
    club.totalEvents += 1;
    await club.save();

    // Send email notification to event creator
    await sendEventCreatedEmail(req.user, event);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Event Organizer, Club Rep, or Admin)
router.put('/:id', protect, [
  body('title').optional().trim().notEmpty().withMessage('Event title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Event description cannot be empty'),
  body('eventType').optional().isIn(['academic', 'cultural', 'sports', 'technical', 'social', 'workshop', 'competition', 'seminar']),
  body('category').optional().isIn(['individual', 'team', 'group']),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('registrationDeadline').optional().isISO8601(),
  body('venue').optional().trim().notEmpty(),
  body('maxParticipants').optional().isInt({ min: 1 }),
  body('registrationFee').optional().isFloat({ min: 0 })
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

    // Check authorization
    const isOrganizer = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Don't allow updates if event is completed
    if (event.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed events'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'firstName lastName email')
     .populate('club', 'name category logo');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', protect, [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('studentId').optional().trim(),
  body('department').optional().trim(),
  body('year').optional().trim(),
  body('additionalInfo').optional().trim(),
  body('emergencyContact').optional().trim(),
  body('dietaryRequirements').optional().trim(),
  body('tshirtSize').optional().trim(),
  body('experience').optional().trim(),
  body('motivation').optional().trim(),
  body('teamName').optional().trim(),
  body('teamMembers').optional().isArray().withMessage('Team members must be an array')
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

    // Check if registration is open
    if (!event.isRegistrationOpen || new Date() > event.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event'
      });
    }

    // Check if user is already registered
    const alreadyRegistered = event.participants.some(
      participant => participant.user.toString() === req.user.id
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Add participant with form data
    const participantData = {
      user: req.user.id,
      registeredAt: new Date(),
      status: 'registered',
      // Personal information
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      studentId: req.body.studentId,
      department: req.body.department,
      year: req.body.year,
      // Additional information
      additionalInfo: req.body.additionalInfo,
      emergencyContact: req.body.emergencyContact,
      dietaryRequirements: req.body.dietaryRequirements,
      tshirtSize: req.body.tshirtSize,
      experience: req.body.experience,
      motivation: req.body.motivation,
      // Team information
      teamName: req.body.teamName || '',
      teamMembers: req.body.teamMembers || []
    };

    event.participants.push(participantData);
    event.currentParticipants += 1;
    await event.save();

    // Add event to user's participated events
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        eventsParticipated: {
          event: event._id,
          status: 'registered'
        }
      }
    });

    // Create user object for email (with form data)
    const userForEmail = {
      ...req.user.toObject(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };

    // Send email notification to user
    await sendEventRegistrationEmail(userForEmail, event);

    res.json({
      success: true,
      message: 'Successfully registered for the event',
      data: { event }
    });

  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Unregister from an event
// @access  Private
router.delete('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if registration is still open
    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Cannot unregister after registration deadline'
      });
    }

    // Find and remove participant
    const participantIndex = event.participants.findIndex(
      participant => participant.user.toString() === req.user.id
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    event.participants.splice(participantIndex, 1);
    event.currentParticipants -= 1;
    await event.save();

    // Remove event from user's participated events
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        eventsParticipated: { event: event._id }
      }
    });

    res.json({
      success: true,
      message: 'Successfully unregistered from the event',
      data: { event }
    });

  } catch (error) {
    console.error('Event unregistration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Event Organizer or Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check authorization
    const isOrganizer = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Don't allow deletion if event has participants
    if (event.participants.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with participants'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
