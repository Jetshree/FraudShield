import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    merchantId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      enum: ['credit', 'debit', 'prepaid', 'other'],
      default: 'credit',
    },
    cardNumber: {
      type: String,
      required: true,
      select: false, // Not included in query results by default
    },
    cardLast4: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    location: {
      country: String,
      city: String,
      postalCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    userAgent: {
      type: String,
    },
    transactionType: {
      type: String,
      enum: ['purchase', 'refund', 'authorization', 'capture', 'void'],
      default: 'purchase',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'flagged'],
      default: 'pending',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    isFraud: {
      type: Boolean,
      default: false,
    },
    reviewStatus: {
      type: String,
      enum: ['not_reviewed', 'reviewed', 'confirmed_fraud', 'false_positive'],
      default: 'not_reviewed',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ riskScore: -1 });
transactionSchema.index({ isFraud: 1 });
transactionSchema.index({ reviewStatus: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;