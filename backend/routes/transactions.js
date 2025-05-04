import express from 'express';
import { 
  getTransactions, 
  getTransactionById, 
  createTransaction, 
  updateTransactionReview, 
  getTransactionStats 
} from '../controllers/transactionController.js';
import { protect, analyst } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// General routes
router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.get('/:id', getTransactionById);

// Routes that require analyst role
router.post('/', createTransaction);
router.put('/:id/review', analyst, updateTransactionReview);

export default router;