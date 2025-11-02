const Message = require('../models/Message');
const Room = require('../models/Room');

// Get messages for a room
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ room: roomId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Message.countDocuments({ room: roomId });

    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalMessages: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a message
const createMessage = async (req, res) => {
  try {
    const { content, roomId, messageType, fileUrl } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      content,
      room: roomId,
      messageType: messageType || 'text',
      fileUrl,
    });

    // Update room's last message
    await Room.findByIdAndUpdate(roomId, { lastMessage: message._id });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if already read by user
    const alreadyRead = message.readBy.some(
      (read) => read.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: req.user._id,
        readAt: Date.now(),
      });
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reaction to message
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted
    const existingReaction = message.reactions.findIndex(
      (reaction) => reaction.user.toString() === req.user._id.toString()
    );

    if (existingReaction !== -1) {
      // Update existing reaction
      message.reactions[existingReaction].emoji = emoji;
    } else {
      // Add new reaction
      message.reactions.push({
        user: req.user._id,
        emoji,
      });
    }

    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search messages
const searchMessages = async (req, res) => {
  try {
    const { query, roomId } = req.query;

    const messages = await Message.find({
      room: roomId,
      content: { $regex: query, $options: 'i' },
    })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  createMessage,
  markAsRead,
  addReaction,
  searchMessages,
};