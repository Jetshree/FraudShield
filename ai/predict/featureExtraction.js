/**
 * Feature Extraction Module
 * 
 * This module extracts relevant features from transaction data
 * for use in fraud detection models and rules.
 */

/**
 * Extract features from transaction data
 * @param {Object} transaction - Raw transaction data
 * @returns {Object} Extracted features for model input
 */
export const extractFeatures = (transaction) => {
  // Basic transaction features
  const features = {
    amount: transaction.amount || 0,
    
    // Time-based features
    hour: new Date(transaction.createdAt || Date.now()).getHours(),
    dayOfWeek: new Date(transaction.createdAt || Date.now()).getDay(),
    isWeekend: [0, 6].includes(new Date(transaction.createdAt || Date.now()).getDay()),
    
    // Card-related features
    isDebit: transaction.cardType === 'debit',
    isCredit: transaction.cardType === 'credit',
    isPrepaid: transaction.cardType === 'prepaid',
    
    // Location features
    country: transaction.location?.country || 'unknown',
    isHighRiskCountry: isHighRiskCountry(transaction.location?.country),
    isLocationMismatch: checkLocationMismatch(transaction),
    
    // Device and IP features
    isNewIp: true,  // In a real system, this would check historical data
    isNewDevice: true,  // In a real system, this would check historical data
    
    // Velocity features (in a real system, these would be calculated from historical data)
    numTransactionsLast24h: Math.floor(Math.random() * 10),  // Simulated
    numTransactionsLast7d: Math.floor(Math.random() * 30),  // Simulated
    totalAmountLast24h: Math.floor(Math.random() * 2000),  // Simulated
    numDeclinedLast24h: Math.floor(Math.random() * 3),  // Simulated
    
    // Merchant features
    merchantCategory: 'shopping',  // In a real system, this would be from merchant data
    
    // Additional computed features would go here
    amountDeviation: 0,  // Would be calculated based on user's typical spending
    isAbnormalTime: false,  // Would be calculated based on user's typical activity times
  };
  
  return features;
};

/**
 * Check if a country is in the high-risk list
 * This is a simplified example - a real implementation would use a more complete list
 */
const isHighRiskCountry = (country) => {
  const highRiskCountries = [
    'example-country-1',
    'example-country-2',
    'example-country-3'
  ];
  
  return highRiskCountries.includes(country);
};

/**
 * Check if there's a mismatch between IP location and billing address
 * This is a simplified implementation
 */
const checkLocationMismatch = (transaction) => {
  // In a real implementation, this would compare IP geolocation with
  // the user's billing address from their profile
  
  // For demonstration, we'll randomly determine if there's a mismatch
  return Math.random() > 0.7;  // 30% chance of a mismatch
};