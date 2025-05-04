import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Remove token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Transaction API calls
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  getStats: () => api.get('/transactions/stats'),
};

// Alert API calls
export const alertAPI = {
  getAll: (params) => api.get('/alerts', { params }),
  getById: (id) => api.get(`/alerts/${id}`),
  markAsReviewed: (id) => api.put(`/alerts/${id}/review`),
  markAsFalsePositive: (id) => api.put(`/alerts/${id}/false-positive`),
  markAsConfirmedFraud: (id) => api.put(`/alerts/${id}/confirm`),
};

// Report API calls
export const reportAPI = {
  getAll: (params) => api.get('/reports', { params }),
  generate: (reportType, params) => api.post('/reports/generate', { reportType, params }),
  download: (reportId) => api.get(`/reports/${reportId}/download`, { 
    responseType: 'blob' 
  }),
};

// Dashboard API calls
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getRecentAlerts: () => api.get('/dashboard/recent-alerts'),
  getRecentTransactions: () => api.get('/dashboard/recent-transactions'),
  getStats: () => api.get('/dashboard/stats'),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Settings API calls
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (settings) => api.put('/settings', settings),
};

export default api;