/**
 * AI Risk Assessment Module
 * 
 * This module provides the functionality to assess the risk of transactions
 * using machine learning models and rules-based systems.
 */

import config from '../../backend/config/config.js';
import logger from '../../backend/utils/logger.js';

// Import helper modules
import { extractFeatures } from './featureExtraction.js';
import { loadModel } from './modelLoader.js';

// Risk thresholds from config
const { riskThresholds } = config;

/**
 * Assess the risk of a transaction
 * @param {Object} transaction - The transaction data
 * @returns {Object} Risk assessment results
 */
export const assessRisk = async (transaction) => {
  try {
    // Extract features from the transaction
    const features = extractFeatures(transaction);
    
    // Load model (it's loaded on first call and then cached)
    const model = await loadModel();
    
    // Predict risk score using the model
    const riskScore = await predictRiskScore(model, features);
    
    // Determine risk level based on thresholds
    const riskLevel = determineRiskLevel(riskScore);
    
    // Check if an alert should be created
    const shouldCreateAlert = riskLevel === 'high' || 
                             (riskLevel === 'medium' && hasRedFlags(transaction, features));
    
    // Generate additional insights for high-risk transactions
    const insights = generateInsights(transaction, features, riskScore, riskLevel);
    
    return {
      score: riskScore,
      level: riskLevel,
      createAlert: shouldCreateAlert,
      alertType: insights.alertType,
      alertSeverity: insights.alertSeverity,
      alertDescription: insights.alertDescription,
      reasons: insights.reasons,
      recommendedAction: insights.recommendedAction
    };
  } catch (error) {
    logger.error(`Error in risk assessment: ${error.message}`);
    
    // Default to medium risk if assessment fails
    return {
      score: 0.5,
      level: 'medium',
      createAlert: true,
      alertType: 'system_error',
      alertSeverity: 'medium',
      alertDescription: 'Risk assessment failed, flagged as precaution',
      reasons: ['Risk assessment system error'],
      recommendedAction: 'Manual review required due to assessment failure'
    };
  }
};

/**
 * Predict risk score using the model
 * In a real implementation, this would use the actual loaded model
 * For this demo, we're simulating model predictions
 */
const predictRiskScore = async (model, features) => {
  // In a real implementation, this would be:
  // return model.predict(features);
  
  // For demo purposes, we'll simulate a prediction based on some rules
  let score = 0;
  
  // Higher amounts are riskier
  if (features.amount > 1000) {
    score += 0.3;
  } else if (features.amount > 500) {
    score += 0.2;
  } else if (features.amount > 200) {
    score += 0.1;
  }
  
  // New IP or device is riskier
  if (features.isNewIp) {
    score += 0.2;
  }
  
  if (features.isNewDevice) {
    score += 0.2;
  }
  
  // High velocity of transactions is risky
  if (features.numTransactionsLast24h > 5) {
    score += 0.3;
  } else if (features.numTransactionsLast24h > 2) {
    score += 0.1;
  }
  
  // Location mismatch with billing address is risky
  if (features.isLocationMismatch) {
    score += 0.3;
  }
  
  // Ensure score is between 0 and 1
  return Math.min(Math.max(score, 0), 1);
};

/**
 * Determine risk level based on score
 */
const determineRiskLevel = (score) => {
  if (score >= riskThresholds.high) {
    return 'high';
  } else if (score >= riskThresholds.medium) {
    return 'medium';
  } else {
    return 'low';
  }
};

/**
 * Check for specific red flags that would warrant an alert
 * even for medium-risk transactions
 */
const hasRedFlags = (transaction, features) => {
  // Check for specific high-risk patterns
  const redFlags = [
    features.isHighRiskCountry,
    features.isLocationMismatch && features.amount > 200,
    features.isNewIp && features.isNewDevice && features.amount > 300,
    features.numTransactionsLast24h > 5,
    features.numDeclinedLast24h > 1
  ];
  
  // Return true if any red flags are present
  return redFlags.some(flag => flag === true);
};

/**
 * Generate insights based on the transaction and risk assessment
 */
const generateInsights = (transaction, features, riskScore, riskLevel) => {
  const insights = {
    reasons: [],
    alertType: 'high_risk_transaction',
    alertSeverity: riskLevel,
    recommendedAction: 'Review transaction details'
  };
  
  // Generate alert description
  insights.alertDescription = `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk transaction detected (score: ${riskScore.toFixed(2)})`;
  
  // Add reasons based on features
  if (features.amount > 1000) {
    insights.reasons.push('Unusually high transaction amount');
  }
  
  if (features.isNewIp) {
    insights.reasons.push('Transaction from new IP address');
  }
  
  if (features.isNewDevice) {
    insights.reasons.push('Transaction from new device');
  }
  
  if (features.isLocationMismatch) {
    insights.reasons.push('Location mismatch with billing address');
    insights.alertType = 'unusual_ip_location';
  }
  
  if (features.isHighRiskCountry) {
    insights.reasons.push('Transaction from high-risk country');
    insights.alertType = 'high_risk_country';
  }
  
  if (features.numTransactionsLast24h > 5) {
    insights.reasons.push('Unusual number of transactions in last 24 hours');
    insights.alertType = 'velocity_check';
  }
  
  if (features.numDeclinedLast24h > 1) {
    insights.reasons.push('Multiple declined transactions in last 24 hours');
    insights.alertType = 'multiple_transactions';
  }
  
  // If no specific reasons identified, add a generic one
  if (insights.reasons.length === 0) {
    insights.reasons.push('Combination of factors resulted in elevated risk score');
  }
  
  // Generate recommended action based on risk level
  if (riskLevel === 'high') {
    insights.recommendedAction = 'Hold transaction for manual review';
  } else if (riskLevel === 'medium') {
    insights.recommendedAction = 'Additional verification recommended';
  } else {
    insights.recommendedAction = 'Normal processing';
  }
  
  return insights;
};