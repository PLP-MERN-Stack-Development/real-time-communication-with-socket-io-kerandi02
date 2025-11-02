const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const setupSocket = require('./config/socket');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Room = require('./models/Room');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Room routes
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ roomType: 'public' })
      .populate('createdBy', 'username')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const { name, description, roomType } = req.body;
    const userId = req.body.userId; // In production, get from auth middleware

    const room = await Room.create({
      name,
      description,
      roomType: roomType || 'public',
      createdBy: userId,
      members: [userId],
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/rooms/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId)
      .populate('members', 'username avatar isOnline')
      .populate('createdBy', 'username');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Setup Socket.io
setupSocket(io);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Chat API is running' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});