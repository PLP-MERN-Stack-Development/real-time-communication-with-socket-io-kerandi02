import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');
export const getUsers = () => api.get('/auth/users');

// Room APIs
export const getRooms = () => api.get('/rooms');
export const getRoom = (roomId) => api.get(`/rooms/${roomId}`);
export const createRoom = (roomData) => api.post('/rooms', roomData);

// Message APIs
export const getMessages = (roomId, page = 1) => api.get(`/messages/${roomId}?page=${page}`);
export const sendMessage = (messageData) => api.post('/messages', messageData);
export const markAsRead = (messageId) => api.put(`/messages/${messageId}/read`);
export const addReaction = (messageId, emoji) => api.put(`/messages/${messageId}/reaction`, { emoji });
export const searchMessages = (query, roomId) => api.get(`/messages/search/query?query=${query}&roomId=${roomId}`);

export default api;