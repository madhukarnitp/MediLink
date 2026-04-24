const mongoose = require('mongoose');
const { CONSULTATION_STATUS } = require('../utils/constants');

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const intakeSchema = new mongoose.Schema(
  {
    chiefComplaint: {
      type: String,
      trim: true,
      maxlength: [500, 'Issue cannot exceed 500 characters'],
    },
    symptoms: [{ type: String, trim: true, maxlength: 80 }],
    duration: { type: String, trim: true, maxlength: 120 },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'urgent', ''],
      default: '',
    },
    existingConditions: { type: String, trim: true, maxlength: 500 },
    currentMedicines: { type: String, trim: true, maxlength: 500 },
    allergies: { type: String, trim: true, maxlength: 300 },
    notes: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false }
);

const consultationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CONSULTATION_STATUS),
      default: CONSULTATION_STATUS.PENDING,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [300, 'Reason cannot exceed 300 characters'],
    },
    intake: intakeSchema,
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: { type: Number },

    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },

    review: reviewSchema,

    roomId: {
      type: String,
      //unique: true,
      required: true,
    },

    notes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Unique roomId generator
const generateRoomId = () => {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `room-${ts}-${rand}`;
};

// Auto-generate roomId before validation so required roomId is satisfied.
consultationSchema.pre('validate', function (next) {
  if (this.isNew && !this.roomId) {
    this.roomId = generateRoomId();
  }
  next();
});

// Calculate duration on end
consultationSchema.methods.endConsultation = async function () {
  this.endedAt = new Date();
  this.status = CONSULTATION_STATUS.COMPLETED;

  if (this.startedAt) {
    this.duration = Math.round(
      (this.endedAt.getTime() - this.startedAt.getTime()) / 60000
    );
  }

  await this.save();
};

// Query indexes for consultation lists and realtime room lookup.
consultationSchema.index({ patient: 1, status: 1 });
consultationSchema.index({ doctor: 1, status: 1 });
consultationSchema.index({ patient: 1, createdAt: -1 });
consultationSchema.index({ doctor: 1, createdAt: -1 });
consultationSchema.index({ patient: 1, status: 1, createdAt: -1 });
consultationSchema.index({ doctor: 1, status: 1, createdAt: -1 });
consultationSchema.index({ roomId: 1 });
consultationSchema.index({ status: 1, createdAt: -1 }); // Dashboard lists

module.exports = mongoose.model('Consultation', consultationSchema);
