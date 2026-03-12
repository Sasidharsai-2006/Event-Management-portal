const express = require('express');
const { body, validationResult } = require('express-validator');
const Result = require('../models/Result');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/results
// @desc    Get all results with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { event, participant, status, limit = 20, page = 1 } = req.query;
    
    const filter = {};
    if (event) filter.event = event;
    if (participant) filter.participant = participant;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await Result.find(filter)
      .populate('event', 'title eventType startDate endDate')
      .populate('participant', 'firstName lastName email profilePicture studentId')
      .populate('teamMembers', 'firstName lastName email profilePicture')
      .sort({ position: 1, announcedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Result.countDocuments(filter);

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalResults: total,
          hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/results/:id
// @desc    Get single result by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('event', 'title eventType startDate endDate venue')
      .populate('participant', 'firstName lastName email profilePicture studentId department year')
      .populate('teamMembers', 'firstName lastName email profilePicture studentId')
      .populate('verifiedBy', 'firstName lastName email');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.json({
      success: true,
      data: { result }
    });

  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/results
// @desc    Create a new result
// @access  Private (Event Organizer, Club Rep, or Admin)
router.post('/', protect, authorize('club_rep', 'admin'), [
  body('event').isMongoId().withMessage('Valid event ID is required'),
  body('participant').isMongoId().withMessage('Valid participant ID is required'),
  body('position').isInt({ min: 1 }).withMessage('Position must be a positive integer'),
  body('status').isIn(['winner', 'runner_up', 'participant', 'disqualified']).withMessage('Invalid status'),
  body('score').optional().isFloat({ min: 0 }).withMessage('Score must be non-negative'),
  body('maxScore').optional().isFloat({ min: 0 }).withMessage('Max score must be non-negative'),
  body('teamName').optional().trim(),
  body('teamMembers').optional().isArray().withMessage('Team members must be an array'),
  body('prize.title').optional().trim(),
  body('prize.description').optional().trim(),
  body('prize.value').optional().trim(),
  body('prize.type').optional().isIn(['trophy', 'medal', 'certificate', 'cash', 'gift', 'scholarship']),
  body('remarks').optional().trim(),
  body('feedback').optional().trim()
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

    const { event, participant, position, status, score, maxScore, teamName, teamMembers, prize, remarks, feedback } = req.body;

    // Check if event exists
    const eventDoc = await Event.findById(event);
    if (!eventDoc) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if participant exists
    const participantDoc = await User.findById(participant);
    if (!participantDoc) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Check if participant was registered for the event
    const isRegistered = eventDoc.participants.some(
      p => p.user.toString() === participant
    );

    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'Participant was not registered for this event'
      });
    }

    // Check authorization - user must be event organizer, club rep, or admin
    const isEventOrganizer = eventDoc.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isEventOrganizer && !isAdmin) {
      // Check if user is club rep for the event's club
      const club = await Club.findById(eventDoc.club);
      const isClubRep = club && club.members.some(member => 
        member.user.toString() === req.user.id && 
        ['president', 'vice_president', 'secretary'].includes(member.role)
      );

      if (!isClubRep) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to create results for this event'
        });
      }
    }

    // Check if result already exists for this participant in this event
    const existingResult = await Result.findOne({
      event,
      participant
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Result already exists for this participant in this event'
      });
    }

    // Create result
    const resultData = {
      event,
      participant,
      position,
      status,
      score: score || 0,
      maxScore: maxScore || 100,
      teamName: teamName || '',
      teamMembers: teamMembers || [],
      prize: prize || {},
      remarks: remarks || '',
      feedback: feedback || ''
    };

    const result = await Result.create(resultData);

    // Update event's results array
    eventDoc.results.push({
      participant,
      position,
      score: score || 0,
      remarks: remarks || '',
      certificateGenerated: false
    });
    await eventDoc.save();

    // Update participant's event status
    await User.findOneAndUpdate(
      { 
        _id: participant,
        'eventsParticipated.event': event
      },
      {
        $set: {
          'eventsParticipated.$.status': status === 'winner' ? 'won' : 'lost',
          'eventsParticipated.$.position': position
        }
      }
    );

    // Award points based on position
    let pointsAwarded = 0;
    if (status === 'winner') {
      pointsAwarded = position === 1 ? 100 : position === 2 ? 75 : position === 3 ? 50 : 25;
    } else if (status === 'runner_up') {
      pointsAwarded = 30;
    } else if (status === 'participant') {
      pointsAwarded = 10;
    }

    if (pointsAwarded > 0) {
      await User.findByIdAndUpdate(participant, {
        $inc: { points: pointsAwarded },
        $push: {
          achievements: {
            title: `${positionText} in ${eventDoc.title}`,
            description: `Achieved ${positionText} in ${eventDoc.title}`,
            event: event
          }
        }
      });

      result.pointsAwarded = pointsAwarded;
      await result.save();
    }

    // Populate the result for response
    const populatedResult = await Result.findById(result._id)
      .populate('event', 'title eventType startDate endDate')
      .populate('participant', 'firstName lastName email profilePicture studentId')
      .populate('teamMembers', 'firstName lastName email profilePicture');

    res.status(201).json({
      success: true,
      message: 'Result created successfully',
      data: { result: populatedResult }
    });

  } catch (error) {
    console.error('Create result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/results/:id
// @desc    Update a result
// @access  Private (Event Organizer, Club Rep, or Admin)
router.put('/:id', protect, authorize('club_rep', 'admin'), [
  body('position').optional().isInt({ min: 1 }).withMessage('Position must be a positive integer'),
  body('status').optional().isIn(['winner', 'runner_up', 'participant', 'disqualified']).withMessage('Invalid status'),
  body('score').optional().isFloat({ min: 0 }).withMessage('Score must be non-negative'),
  body('maxScore').optional().isFloat({ min: 0 }).withMessage('Max score must be non-negative'),
  body('remarks').optional().trim(),
  body('feedback').optional().trim(),
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

    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Check authorization
    const event = await Event.findById(result.event);
    const isEventOrganizer = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isEventOrganizer && !isAdmin) {
      const club = await Club.findById(event.club);
      const isClubRep = club && club.members.some(member => 
        member.user.toString() === req.user.id && 
        ['president', 'vice_president', 'secretary'].includes(member.role)
      );

      if (!isClubRep) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this result'
        });
      }
    }

    // Update verification status if provided
    if (req.body.isVerified !== undefined) {
      req.body.verifiedBy = req.user.id;
      req.body.verifiedAt = new Date();
    }

    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('event', 'title eventType startDate endDate')
     .populate('participant', 'firstName lastName email profilePicture studentId')
     .populate('teamMembers', 'firstName lastName email profilePicture')
     .populate('verifiedBy', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Result updated successfully',
      data: { result: updatedResult }
    });

  } catch (error) {
    console.error('Update result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/results/:id
// @desc    Delete a result
// @access  Private (Event Organizer, Club Rep, or Admin)
router.delete('/:id', protect, authorize('club_rep', 'admin'), async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Check authorization
    const event = await Event.findById(result.event);
    const isEventOrganizer = event.organizer.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isEventOrganizer && !isAdmin) {
      const club = await Club.findById(event.club);
      const isClubRep = club && club.members.some(member => 
        member.user.toString() === req.user.id && 
        ['president', 'vice_president', 'secretary'].includes(member.role)
      );

      if (!isClubRep) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this result'
        });
      }
    }

    // Remove result from event's results array
    await Event.findByIdAndUpdate(result.event, {
      $pull: { results: { participant: result.participant } }
    });

    // Reset participant's event status
    await User.findOneAndUpdate(
      { 
        _id: result.participant,
        'eventsParticipated.event': result.event
      },
      {
        $set: {
          'eventsParticipated.$.status': 'attended',
          'eventsParticipated.$.position': null
        }
      }
    );

    // Remove points if they were awarded
    if (result.pointsAwarded > 0) {
      await User.findByIdAndUpdate(result.participant, {
        $inc: { points: -result.pointsAwarded }
      });
    }

    await Result.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Result deleted successfully'
    });

  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/results/event/:eventId
// @desc    Get all results for a specific event
// @access  Public
router.get('/event/:eventId', async (req, res) => {
  try {
    const results = await Result.find({ event: req.params.eventId })
      .populate('participant', 'firstName lastName email profilePicture studentId department year')
      .populate('teamMembers', 'firstName lastName email profilePicture studentId')
      .sort({ position: 1 });

    res.json({
      success: true,
      data: { results }
    });

  } catch (error) {
    console.error('Get event results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/results/participant/:participantId
// @desc    Get all results for a specific participant
// @access  Public
router.get('/participant/:participantId', async (req, res) => {
  try {
    const results = await Result.find({ participant: req.params.participantId })
      .populate('event', 'title eventType startDate endDate venue')
      .populate('teamMembers', 'firstName lastName email profilePicture studentId')
      .sort({ announcedAt: -1 });

    res.json({
      success: true,
      data: { results }
    });

  } catch (error) {
    console.error('Get participant results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
