const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  // Event Reference
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  
  // Participant Information
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Team Information (if applicable)
  teamName: {
    type: String,
    default: ''
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Result Details
  position: {
    type: Number,
    required: true,
    min: 1
  },
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 100
  },
  
  // Status
  status: {
    type: String,
    enum: ['winner', 'runner_up', 'participant', 'disqualified'],
    required: true
  },
  
  // Prize Information
  prize: {
    title: String,
    description: String,
    value: String,
    type: {
      type: String,
      enum: ['trophy', 'medal', 'certificate', 'cash', 'gift', 'scholarship']
    }
  },
  
  // Evaluation Details
  evaluationCriteria: [{
    criterion: String,
    score: Number,
    maxScore: Number,
    remarks: String
  }],
  
  // Judge Information
  judges: [{
    name: String,
    designation: String,
    signature: String
  }],
  
  // Certificate Information
  certificate: {
    generated: {
      type: Boolean,
      default: false
    },
    certificateId: String,
    generatedAt: Date,
    downloadUrl: String
  },
  
  // Additional Information
  remarks: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    default: ''
  },
  
  // Media
  images: [String],
  videos: [String],
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  
  // Points Awarded
  pointsAwarded: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  announcedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
resultSchema.index({ event: 1, position: 1 });
resultSchema.index({ participant: 1, status: 1 });
resultSchema.index({ status: 1, announcedAt: -1 });

// Virtual for percentage score
resultSchema.virtual('percentageScore').get(function() {
  if (this.maxScore === 0) return 0;
  return Math.round((this.score / this.maxScore) * 100);
});

// Virtual for position text
resultSchema.virtual('positionText').get(function() {
  const positions = {
    1: '1st Place',
    2: '2nd Place',
    3: '3rd Place'
  };
  return positions[this.position] || `${this.position}th Place`;
});

// Ensure virtual fields are serialized
resultSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Result', resultSchema);
