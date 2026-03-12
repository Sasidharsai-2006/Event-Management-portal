const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  
  // Event Details
  eventType: {
    type: String,
    enum: ['academic', 'cultural', 'sports', 'technical', 'social', 'workshop', 'competition', 'seminar'],
    required: true
  },
  category: {
    type: String,
    enum: ['individual', 'team', 'group'],
    required: true
  },
  
  // Organizer Information
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  
  // Date & Time
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  
  // Location
  venue: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: {
    type: String,
    default: ''
  },
  
  // Registration & Participation
  maxParticipants: {
    type: Number,
    required: true
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  isRegistrationOpen: {
    type: Boolean,
    default: true
  },
  
  // Media
  poster: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  
  // Rules & Guidelines
  rules: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  prizes: [{
    position: Number,
    title: String,
    description: String,
    value: String
  }],
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'absent'],
      default: 'registered'
    },
    teamName: {
      type: String,
      default: ''
    },
    teamMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  
  // Results & Winners
  results: [{
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    position: Number,
    score: Number,
    remarks: String,
    certificateGenerated: {
      type: Boolean,
      default: false
    }
  }],
  
  // Status & Approval
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Additional Information
  tags: [{
    type: String
  }],
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  
  // Timestamps
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ eventType: 1, status: 1 });
eventSchema.index({ club: 1, status: 1 });

// Virtual for registration status
eventSchema.virtual('isRegistrationClosed').get(function() {
  return new Date() > this.registrationDeadline || !this.isRegistrationOpen;
});

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now >= this.startDate && now <= this.endDate) return 'ongoing';
  return 'completed';
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Event', eventSchema);
