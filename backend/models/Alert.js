import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    alertType: {
      type: String,
      enum: [
        'high_risk_transaction',
        'unusual_ip_location',
        'multiple_transactions',
        'new_device',
        'suspicious_pattern',
        'velocity_check',
        'amount_threshold',
        'bin_check',
        'high_risk_country',
        'other'
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'under_review', 'resolved', 'false_positive', 'confirmed_fraud'],
      default: 'new',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNotes: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    aiInsights: {
      reasons: [String],
      similarCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }],
      recommendedAction: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
alertSchema.index({ createdAt: -1 });
alertSchema.index({ status: 1 });
alertSchema.index({ severity: 1 });
alertSchema.index({ assignedTo: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;