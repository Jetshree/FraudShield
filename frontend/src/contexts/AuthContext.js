import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      toast.success('Registration successful. Please login.');
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    toast.info('You have been logged out');
  };

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Check if token is expired
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        // Token expired, logout user
        logout();
        setLoading(false);
        return;
      }
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get current user data
      const response = await axios.get('/api/auth/me');
      
      // Update state
      setCurrentUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      await axios.post('/api/auth/forgot-password', { email });
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset instructions');
      return false;
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password: newPassword });
      toast.success('Password has been reset successfully');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/api/auth/profile', userData);
      setCurrentUser({ ...currentUser, ...response.data });
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    requestPasswordReset,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};