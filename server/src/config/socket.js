 const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Room = require('../models/Room');

const setupSocket = (io) => {
  // Create namespace for chat
  const chatNamespace = io.of('/chat');
  
  // Store online users
  const onlineUsers = new Map();
  const typingUsers = new Map();

  // Socket.io middleware for authentication
  chatNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  chatNamespace.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.username}`);

    // Add user to online users
    onlineUsers.set(socket.user._id.toString(), socket.id);

    // Update user online status
    User.findByIdAndUpdate(socket.user._id, { 
      isOnline: true,
      lastSeen: Date.now() 
    }).exec();

    // Emit online users to all clients
    chatNamespace.emit('users:online', Array.from(onlineUsers.keys()));

    // Join user to their rooms
    socket.on('room:join', async (roomId) => {
      try {
        const room = await Room.findById(roomId);
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is a member
        if (!room.members.includes(socket.user._id)) {
          room.members.push(socket.user._id);
          await room.save();
        }

        socket.join(roomId);
        console.log(`User ${socket.user.username} joined room ${room.name}`);

        // Notify others in the room
        socket.to(roomId).emit('user:joined', {
          user: {
            _id: socket.user._id,
            username: socket.user.username,
            avatar: socket.user.avatar,
          },
          message: `${socket.user.username} joined the room`,
        });

        socket.emit('room:joined', { roomId, room });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Leave room
    socket.on('room:leave', async (roomId) => {
      socket.leave(roomId);
      
      socket.to(roomId).emit('user:left', {
        user: {
          _id: socket.user._id,
          username: socket.user.username,
        },
        message: `${socket.user.username} left the room`,
      });
    });

    // Send message with acknowledgment
    socket.on('message:send', async (data, callback) => {
      try {
        const { content, roomId, messageType, fileUrl } = data;

        const message = await Message.create({
          sender: socket.user._id,
          content,
          room: roomId,
          messageType: messageType || 'text',
          fileUrl,
        });

        // Update room's last message
        await Room.findByIdAndUpdate(roomId, { lastMessage: message._id });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar email');

        // Emit to all users in the room
        chatNamespace.to(roomId).emit('message:received', populatedMessage);

        // Send acknowledgment back to sender
        if (callback) {
          callback({ 
            success: true, 
            messageId: message._id,
            timestamp: message.createdAt 
          });
        }

        // Send notification to offline users
        const room = await Room.findById(roomId).populate('members', '_id isOnline');
        const offlineMembers = room.members.filter(
          member => !member.isOnline && member._id.toString() !== socket.user._id.toString()
        );

        offlineMembers.forEach(member => {
          chatNamespace.emit('notification:new', {
            userId: member._id,
            message: `New message from ${socket.user.username}`,
            roomId,
          });
        });
      } catch (error) {
        console.error('Error sending message:', error);
        if (callback) {
          callback({ success: false, error: error.message });
        }
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing:start', (roomId) => {
      const roomTyping = typingUsers.get(roomId) || new Set();
      roomTyping.add(socket.user._id.toString());
      typingUsers.set(roomId, roomTyping);

      socket.to(roomId).emit('typing:user', {
        userId: socket.user._id,
        username: socket.user.username,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (roomId) => {
      const roomTyping = typingUsers.get(roomId);
      if (roomTyping) {
        roomTyping.delete(socket.user._id.toString());
        if (roomTyping.size === 0) {
          typingUsers.delete(roomId);
        }
      }

      socket.to(roomId).emit('typing:user', {
        userId: socket.user._id,
        username: socket.user.username,
        isTyping: false,
      });
    });

    // Message read receipt
    socket.on('message:read', async (data) => {
      try {
        const { messageId, roomId } = data;

        const message = await Message.findById(messageId);
        
        if (!message) return;

        const alreadyRead = message.readBy.some(
          (read) => read.user.toString() === socket.user._id.toString()
        );

        if (!alreadyRead) {
          message.readBy.push({
            user: socket.user._id,
            readAt: Date.now(),
          });
          await message.save();
        }

        chatNamespace.to(roomId).emit('message:read:update', {
          messageId,
          userId: socket.user._id,
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Message reaction
    socket.on('message:reaction', async (data) => {
      try {
        const { messageId, emoji, roomId } = data;

        const message = await Message.findById(messageId);
        
        if (!message) return;

        const existingReaction = message.reactions.findIndex(
          (reaction) => reaction.user.toString() === socket.user._id.toString()
        );

        if (existingReaction !== -1) {
          message.reactions[existingReaction].emoji = emoji;
        } else {
          message.reactions.push({
            user: socket.user._id,
            emoji,
          });
        }

        await message.save();

        chatNamespace.to(roomId).emit('message:reaction:update', {
          messageId,
          reactions: message.reactions,
        });
      } catch (error) {
        console.error('Error adding reaction:', error);
      }
    });

    // Private message
    socket.on('private:message', async (data) => {
      try {
        const { recipientId, content } = data;

        // Create or get private room
        let room = await Room.findOne({
          roomType: 'private',
          members: { $all: [socket.user._id, recipientId] },
        });

        if (!room) {
          room = await Room.create({
            name: 'Private Chat',
            roomType: 'private',
            members: [socket.user._id, recipientId],
            createdBy: socket.user._id,
          });
        }

        const message = await Message.create({
          sender: socket.user._id,
          content,
          room: room._id,
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username avatar');

        // Send to recipient if online
        const recipientSocketId = onlineUsers.get(recipientId.toString());
        if (recipientSocketId) {
          chatNamespace.to(recipientSocketId).emit('private:message:received', {
            message: populatedMessage,
            roomId: room._id,
          });
        }

        // Send back to sender
        socket.emit('private:message:sent', {
          message: populatedMessage,
          roomId: room._id,
        });
      } catch (error) {
        console.error('Error sending private message:', error);
        socket.emit('error', { message: 'Failed to send private message' });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ User disconnected: ${socket.user.username}`);

      // Remove from online users
      onlineUsers.delete(socket.user._id.toString());

      // Update user status
      await User.findByIdAndUpdate(socket.user._id, {
        isOnline: false,
        lastSeen: Date.now(),
      });

      // Clean up typing indicators
      typingUsers.forEach((users, roomId) => {
        if (users.has(socket.user._id.toString())) {
          users.delete(socket.user._id.toString());
          chatNamespace.to(roomId).emit('typing:user', {
            userId: socket.user._id,
            username: socket.user.username,
            isTyping: false,
          });
        }
      });

      // Emit updated online users
      chatNamespace.emit('users:online', Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = setupSocket;