import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  // Server Configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  
  // MongoDB Configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fraudshield',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI Model Configuration
  modelPath: process.env.MODEL_PATH || './ai/models/fraud_detection_model.pkl',
  
  // Fraud Detection Thresholds
  riskThresholds: {
    low: 0.3,
    medium: 0.7,
    high: 0.9
  },
  
  // Email Configuration (if needed)
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@fraudshield.com'
  }
};