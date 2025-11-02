 import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    // Connect to /chat namespace
    this.socket = io(`${SOCKET_URL}/chat`, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Room events
  joinRoom(roomId) {
    this.socket?.emit('room:join', roomId);
  }

  leaveRoom(roomId) {
    this.socket?.emit('room:leave', roomId);
  }

  // Message events with acknowledgment
  sendMessage(data, callback) {
    this.socket?.emit('message:send', data, callback);
  }

  onMessageReceived(callback) {
    this.socket?.on('message:received', callback);
  }

  // Typing events
  startTyping(roomId) {
    this.socket?.emit('typing:start', roomId);
  }

  stopTyping(roomId) {
    this.socket?.emit('typing:stop', roomId);
  }

  onUserTyping(callback) {
    this.socket?.on('typing:user', callback);
  }

  // Read receipts
  markMessageAsRead(messageId, roomId) {
    this.socket?.emit('message:read', { messageId, roomId });
  }

  onMessageReadUpdate(callback) {
    this.socket?.on('message:read:update', callback);
  }

  // Reactions
  addReaction(messageId, emoji, roomId) {
    this.socket?.emit('message:reaction', { messageId, emoji, roomId });
  }

  onReactionUpdate(callback) {
    this.socket?.on('message:reaction:update', callback);
  }

  // Private messages
  sendPrivateMessage(recipientId, content) {
    this.socket?.emit('private:message', { recipientId, content });
  }

  onPrivateMessageReceived(callback) {
    this.socket?.on('private:message:received', callback);
  }

  onPrivateMessageSent(callback) {
    this.socket?.on('private:message:sent', callback);
  }

  // User status
  onUsersOnline(callback) {
    this.socket?.on('users:online', callback);
  }

  onUserJoined(callback) {
    this.socket?.on('user:joined', callback);
  }

  onUserLeft(callback) {
    this.socket?.on('user:left', callback);
  }

  // Notifications
  onNotification(callback) {
    this.socket?.on('notification:new', callback);
  }

  // Room events
  onRoomJoined(callback) {
    this.socket?.on('room:joined', callback);
  }

  // Error handling
  onError(callback) {
    this.socket?.on('error', callback);
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

const socketService = new SocketService();
export default socketService;