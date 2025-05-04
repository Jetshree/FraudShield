/**
 * Model Loader Module
 * 
 * This module handles loading the fraud detection model.
 * In a real implementation, this would load a trained machine learning model.
 */

import config from '../../backend/config/config.js';
import logger from '../../backend/utils/logger.js';

// Cache for loaded model
let cachedModel = null;

/**
 * Load the fraud detection model
 * @returns {Object} The loaded model
 */
export const loadModel = async () => {
  // Return cached model if available
  if (cachedModel) {
    return cachedModel;
  }
  
  try {
    // In a real implementation, this would load a trained model from a file
    // For example:
    // const model = await tf.loadLayersModel(`file://${config.modelPath}`);
    
    // For this demo, we'll create a mock model
    const mockModel = {
      name: 'Fraud Detection Model v1.0',
      type: 'Random Forest',
      features: [
        'amount', 'hour', 'dayOfWeek', 'isWeekend', 'isDebit', 'isCredit',
        'country', 'isHighRiskCountry', 'isLocationMismatch', 'isNewIp',
        'isNewDevice', 'numTransactionsLast24h', 'numDeclinedLast24h'
      ],
      
      // Mock prediction function
      predict: (features) => {
        // In a real model, this would use the actual prediction logic
        // For demo purposes, this returns a risk score based on some basic rules
        let score = 0.1; // Base risk
        
        if (features.amount > 1000) score += 0.3;
        if (features.isNewIp) score += 0.2;
        if (features.isNewDevice) score += 0.2;
        if (features.isLocationMismatch) score += 0.3;
        if (features.numTransactionsLast24h > 5) score += 0.2;
        
        // Ensure score is between 0 and 1
        return Math.min(Math.max(score, 0), 1);
      }
    };
    
    // Cache the model
    cachedModel = mockModel;
    logger.info('Fraud detection model loaded successfully');
    
    return mockModel;
  } catch (error) {
    logger.error(`Error loading fraud detection model: ${error.message}`);
    throw new Error('Failed to load fraud detection model');
  }
};