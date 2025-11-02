import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, logout as logoutAPI } from '../services/api';
import socketService from '../services/socket';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Connect to socket
      socketService.connect(userData.token);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      const userData = response.data;
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Connect to socket
      socketService.connect(userData.token);
      
      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      const newUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Connect to socket
      socketService.connect(newUser.token);
      
      return { success: true, data: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      socketService.disconnect();
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};