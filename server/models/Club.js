  const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    unique: true,
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
  
  // Category & Type
  category: {
    type: String,
    enum: ['academic', 'cultural', 'sports', 'technical', 'social', 'literary', 'dance', 'music', 'drama', 'photography', 'debate', 'environmental'],
    required: true
  },
  type: {
    type: String,
    enum: ['official', 'student_led', 'faculty_led'],
    default: 'student_led'
  },
  
  // Visual Identity
  logo: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  colors: {
    primary: String,
    secondary: String
  },
  
  // Leadership
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vicePresident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  secretary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  treasurer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Faculty Advisor
  facultyAdvisor: {
    name: String,
    email: String,
    phone: String,
    department: String,
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Members
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['member', 'treasurer', 'secretary', 'vice_president', 'president'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'inactive'],
      default: 'pending'
    },
    contributions: {
      type: Number,
      default: 0
    }
  }],
  
  // Membership Settings
  maxMembers: {
    type: Number,
    default: 50
  },
  currentMembers: {
    type: Number,
    default: 0
  },
  isRecruiting: {
    type: Boolean,
    default: true
  },
  membershipFee: {
    type: Number,
    default: 0
  },
  
  // Contact Information
  contactInfo: {
    email: String,
    phone: String,
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
      linkedin: String
    }
  },
  
  // Meeting Information
  meetingSchedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: String,
    venue: String,
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly'],
      default: 'weekly'
    }
  },
  
  // Premises & Resources
  premises: [{
    name: String,
    location: String,
    capacity: Number,
    facilities: [String],
    bookingSchedule: [{
      startTime: Date,
      endTime: Date,
      purpose: String,
      bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  }],
  
  // Activities & Achievements
  activities: [{
    title: String,
    description: String,
    date: Date,
    type: {
      type: String,
      enum: ['meeting', 'event', 'workshop', 'competition', 'social']
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    images: [String],
    outcomes: String
  }],
  
  achievements: [{
    title: String,
    description: String,
    date: Date,
    level: {
      type: String,
      enum: ['college', 'university', 'state', 'national', 'international']
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    certificate: String,
    prize: String
  }],
  
  // Events
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  
  // Financial Information
  budget: {
    allocated: Number,
    spent: Number,
    remaining: Number
  },
  transactions: [{
    type: {
      type: String,
      enum: ['income', 'expense']
    },
    amount: Number,
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Status & Approval
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended', 'inactive'],
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
  
  // Statistics
  totalEvents: {
    type: Number,
    default: 0
  },
  totalMembers: {
    type: Number,
    default: 0
  },
  totalAchievements: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Additional Information
  tags: [String],
  rules: [String],
  requirements: [String],
  
  // Timestamps
  foundedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
clubSchema.index({ category: 1, status: 1 });
clubSchema.index({ name: 'text', description: 'text' });
clubSchema.index({ status: 1, foundedAt: -1 });

// Virtual for member count
clubSchema.virtual('memberCount').get(function() {
  return this.members.filter(member => member.status === 'approved').length;
});

// Virtual for active events count
clubSchema.virtual('activeEventsCount').get(function() {
  return this.events.filter(event => 
    event.status === 'approved' && 
    new Date(event.startDate) > new Date()
  ).length;
});

// Ensure virtual fields are serialized
clubSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Club', clubSchema);
