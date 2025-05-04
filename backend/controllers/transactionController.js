import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';
import { assessRisk } from '../ai/predict/riskAssessment.js';
import logger from '../utils/logger.js';

// @desc    Get all transactions with filtering, sorting, and pagination
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      status,
      riskLevel,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      search 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (riskLevel) filter.riskLevel = riskLevel;
    
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    if (search) {
      filter.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { userId: { $regex: search, $options: 'i' } },
        { merchantId: { $regex: search, $options: 'i' } },
        { cardLast4: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);
    
    res.json({
      transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error(`Error fetching transactions: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Get associated alerts
    const alerts = await Alert.find({ transactionId: transaction._id })
      .sort('-createdAt')
      .populate('assignedTo', 'name email')
      .populate('resolvedBy', 'name email');
    
    res.json({
      transaction,
      alerts
    });
  } catch (error) {
    logger.error(`Error fetching transaction by ID: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new transaction and assess risk
// @route   POST /api/transactions
// @access  Private/API
export const createTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    
    // Check if transaction already exists
    const existingTransaction = await Transaction.findOne({ 
      transactionId: transactionData.transactionId 
    });
    
    if (existingTransaction) {
      return res.status(400).json({ message: 'Transaction already exists' });
    }
    
    // Assess risk using AI model
    const riskAssessment = await assessRisk(transactionData);
    
    // Add risk assessment to transaction data
    const enrichedTransaction = {
      ...transactionData,
      riskScore: riskAssessment.score,
      riskLevel: riskAssessment.level
    };
    
    // Create transaction
    const transaction = await Transaction.create(enrichedTransaction);
    
    // If high risk, create alert
    if (riskAssessment.createAlert) {
      const alert = await Alert.create({
        transactionId: transaction._id,
        alertType: riskAssessment.alertType || 'high_risk_transaction',
        severity: riskAssessment.alertSeverity || 'high',
        description: riskAssessment.alertDescription || 'High risk transaction detected',
        riskScore: riskAssessment.score,
        status: 'new',
        aiInsights: {
          reasons: riskAssessment.reasons || [],
          recommendedAction: riskAssessment.recommendedAction || 'Review transaction details'
        }
      });
      
      res.status(201).json({
        transaction,
        alert,
        message: 'Transaction created and alert generated'
      });
    } else {
      res.status(201).json({
        transaction,
        message: 'Transaction created successfully'
      });
    }
  } catch (error) {
    logger.error(`Error creating transaction: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction review status
// @route   PUT /api/transactions/:id/review
// @access  Private/Analyst
export const updateTransactionReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewStatus, notes } = req.body;
    
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Update transaction review status
    transaction.reviewStatus = reviewStatus;
    transaction.reviewedBy = req.user._id;
    transaction.reviewedAt = Date.now();
    
    // If marked as fraud, update isFraud flag
    if (reviewStatus === 'confirmed_fraud') {
      transaction.isFraud = true;
    }
    
    await transaction.save();
    
    // Update any associated alerts
    if (reviewStatus === 'confirmed_fraud' || reviewStatus === 'false_positive') {
      await Alert.updateMany(
        { transactionId: transaction._id },
        { 
          status: reviewStatus === 'confirmed_fraud' ? 'confirmed_fraud' : 'false_positive',
          resolvedBy: req.user._id,
          resolvedAt: Date.now(),
          resolutionNotes: notes || 'Updated by analyst review'
        }
      );
    }
    
    res.json({
      transaction,
      message: 'Transaction review status updated successfully'
    });
  } catch (error) {
    logger.error(`Error updating transaction review: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private
export const getTransactionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if no dates provided
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Get overall statistics
    const totalTransactions = await Transaction.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });
    
    const flaggedTransactions = await Transaction.countDocuments({
      createdAt: { $gte: start, $lte: end },
      riskLevel: { $in: ['medium', 'high'] }
    });
    
    const confirmedFraud = await Transaction.countDocuments({
      createdAt: { $gte: start, $lte: end },
      isFraud: true
    });
    
    // Get total transaction amount
    const amountAggregation = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          average: { $avg: '$amount' },
          fraudAmount: {
            $sum: {
              $cond: [{ $eq: ['$isFraud', true] }, '$amount', 0]
            }
          }
        }
      }
    ]);
    
    // Get breakdown by risk level
    const riskLevelBreakdown = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Format risk level data
    const riskLevels = {};
    riskLevelBreakdown.forEach(level => {
      riskLevels[level._id] = {
        count: level.count,
        amount: level.amount
      };
    });
    
    // Get time-series data for trend analysis
    const dailyTransactions = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          flagged: { 
            $sum: { 
              $cond: [
                { $in: ['$riskLevel', ['medium', 'high']] },
                1,
                0
              ]
            }
          },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      summary: {
        totalTransactions,
        flaggedTransactions,
        confirmedFraud,
        flagRate: totalTransactions > 0 ? (flaggedTransactions / totalTransactions) * 100 : 0,
        fraudRate: totalTransactions > 0 ? (confirmedFraud / totalTransactions) * 100 : 0,
        totalAmount: amountAggregation.length > 0 ? amountAggregation[0].total : 0,
        averageAmount: amountAggregation.length > 0 ? amountAggregation[0].average : 0,
        fraudAmount: amountAggregation.length > 0 ? amountAggregation[0].fraudAmount : 0
      },
      riskLevels,
      dailyTrends: dailyTransactions
    });
  } catch (error) {
    logger.error(`Error fetching transaction stats: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};