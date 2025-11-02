import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';
import { playNotificationSound, showBrowserNotification } from '../utils/notificationSound';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = socketService.getSocket();

      if (socket) {
        socket.on('connect', () => {
          setConnected(true);
          console.log('Socket connected');
        });

        socket.on('disconnect', () => {
          setConnected(false);
          console.log('Socket disconnected');
        });

        // Listen for online users
        socketService.onUsersOnline((users) => {
          setOnlineUsers(users);
        });

        // Listen for notifications
        socketService.onNotification((notification) => {
          playNotificationSound();
          showBrowserNotification('New Message', {
            body: notification.message,
          });
        });
      }
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [isAuthenticated, user]);

  const value = {
    socket: socketService.getSocket(),
    connected,
    onlineUsers,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};