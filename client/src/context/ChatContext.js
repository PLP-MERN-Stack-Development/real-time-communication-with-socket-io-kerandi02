import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRooms, getRoom, getMessages, createRoom as createRoomAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  // Fetch all rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Join a room
  const joinRoom = async (roomId) => {
    try {
      setLoading(true);
      
      // Fetch room details
      const roomResponse = await getRoom(roomId);
      setCurrentRoom(roomResponse.data);
      
      // Fetch messages
      const messagesResponse = await getMessages(roomId);
      setMessages(messagesResponse.data.messages);
      
      // Join socket room
      socketService.joinRoom(roomId);
      
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setLoading(false);
    }
  };

  // Leave current room
  const leaveRoom = () => {
    if (currentRoom) {
      socketService.leaveRoom(currentRoom._id);
      setCurrentRoom(null);
      setMessages([]);
      setTypingUsers([]);
    }
  };

  // Send a message
  const sendMessage = (content, messageType = 'text', fileUrl = null) => {
    if (!currentRoom) return;

    socketService.sendMessage({
      content,
      roomId: currentRoom._id,
      messageType,
      fileUrl,
    });
  };

  // Create a new room
  const createRoom = async (roomData) => {
    try {
      const response = await createRoomAPI(roomData);
      setRooms([response.data, ...rooms]);
      return { success: true, room: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create room',
      };
    }
  };

  // Start typing
  const startTyping = () => {
    if (currentRoom) {
      socketService.startTyping(currentRoom._id);
    }
  };

  // Stop typing
  const stopTyping = () => {
    if (currentRoom) {
      socketService.stopTyping(currentRoom._id);
    }
  };

  // Mark message as read
  const markAsRead = (messageId) => {
    if (currentRoom) {
      socketService.markMessageAsRead(messageId, currentRoom._id);
    }
  };

  // Add reaction
  const addReaction = (messageId, emoji) => {
    if (currentRoom) {
      socketService.addReaction(messageId, emoji, currentRoom._id);
    }
  };

  // Socket event listeners
  useEffect(() => {
    if (isAuthenticated) {
      // Message received
      socketService.onMessageReceived((message) => {
        setMessages((prev) => [...prev, message]);
      });

      // User typing
      socketService.onUserTyping((data) => {
        if (data.isTyping) {
          setTypingUsers((prev) => [...prev.filter(u => u.userId !== data.userId), data]);
        } else {
          setTypingUsers((prev) => prev.filter(u => u.userId !== data.userId));
        }
      });

      // Message read update
      socketService.onMessageReadUpdate((data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId
              ? { ...msg, readBy: [...(msg.readBy || []), { user: data.userId }] }
              : msg
          )
        );
      });

      // Reaction update
      socketService.onReactionUpdate((data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
          )
        );
      });

      // User joined
      socketService.onUserJoined((data) => {
        console.log(data.message);
      });

      // User left
      socketService.onUserLeft((data) => {
        console.log(data.message);
      });
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [isAuthenticated]);

  // Fetch rooms on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms();
    }
  }, [isAuthenticated]);

  const value = {
    rooms,
    currentRoom,
    messages,
    loading,
    typingUsers,
    fetchRooms,
    joinRoom,
    leaveRoom,
    sendMessage,
    createRoom,
    startTyping,
    stopTyping,
    markAsRead,
    addReaction,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};