 # Real-Time Chat Application with Socket.io

A modern, full-featured real-time chat application built with React, Node.js, Express, Socket.io, and MongoDB. This application demonstrates bidirectional communication between clients and servers with advanced features like typing indicators, read receipts, message reactions, and more.

![Chat Application](https://img.shields.io/badge/Status-Complete-success)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-lightgrey)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Features Implementation](#features-implementation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Chat Functionality
- ✅ **User Authentication** - JWT-based secure authentication system
- ✅ **Real-time Messaging** - Instant message delivery using Socket.io
- ✅ **Multiple Chat Rooms** - Create and join public chat rooms
- ✅ **Private Messaging** - Direct one-on-one conversations
- ✅ **Online/Offline Status** - Real-time user presence indicators
- ✅ **Typing Indicators** - See when other users are typing
- ✅ **Message Timestamps** - Display when messages were sent

### Advanced Features
- ✅ **Message Reactions** - React to messages with emojis (👍 ❤️ 😂 😮 😢 🎉)
- ✅ **Read Receipts** - Know when your messages are delivered and read
- ✅ **Message Search** - Search through conversation history
- ✅ **Message Pagination** - Load older messages efficiently
- ✅ **Browser Notifications** - Get notified even when tab is inactive
- ✅ **Sound Notifications** - Audio alerts for new messages
- ✅ **Delivery Acknowledgment** - Confirmation when messages are sent

### Performance & UX
- ✅ **Socket.io Namespaces** - Optimized performance using `/chat` namespace
- ✅ **Automatic Reconnection** - Seamless reconnection on network issues
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Real-time User List** - See all online users instantly
- ✅ **Room Management** - Create, join, and leave rooms dynamically

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Socket.io Client** - WebSocket client
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud - Recommended for beginners)
  - [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (Local installation)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/real-time-chat-app.git
cd real-time-chat-app
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Server Configuration

Create a `.env` file in the `server` directory:
```bash
cd server
touch .env
```

Add the following environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
```

**For Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/chatapp
```

### Client Configuration

Create a `.env` file in the `client` directory:
```bash
cd client
touch .env
```

Add the following:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🏃 Running the Application

### Start the Backend Server
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: your-mongodb-host
```

### Start the Frontend Client

Open a new terminal window:
```bash
cd client
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 📁 Project Structure
```
real-time-chat-app/
│
├── server/                      # Backend application
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           # Database configuration
│   │   │   └── socket.js       # Socket.io configuration
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── messageController.js
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Message.js
│   │   │   └── Room.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── messageRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   └── server.js           # Main server file
│   ├── .env                    # Environment variables
│   └── package.json
│
├── client/                      # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Chat/
│   │   │   │   ├── ChatRoom.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   ├── RoomList.jsx
│   │   │   │   ├── UserList.jsx
│   │   │   │   └── TypingIndicator.jsx
│   │   │   └── Notifications/
│   │   │       ├── NotificationBadge.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── SocketContext.js
│   │   │   └── ChatContext.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── ChatPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── utils/
│   │   │   ├── formatDate.js
│   │   │   └── notificationSound.js
│   │   ├── styles/
│   │   │   └── chat.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/users` | Get all users (protected) |

### Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Get all rooms |
| POST | `/api/rooms` | Create a new room |
| GET | `/api/rooms/:roomId` | Get room details |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:roomId` | Get messages for a room |
| POST | `/api/messages` | Send a message |
| PUT | `/api/messages/:messageId/read` | Mark message as read |
| PUT | `/api/messages/:messageId/reaction` | Add reaction to message |
| GET | `/api/messages/search/query` | Search messages |

## 🔌 Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `room:join` | `roomId` | Join a chat room |
| `room:leave` | `roomId` | Leave a chat room |
| `message:send` | `{ content, roomId, messageType, fileUrl }` | Send a message |
| `typing:start` | `roomId` | User started typing |
| `typing:stop` | `roomId` | User stopped typing |
| `message:read` | `{ messageId, roomId }` | Mark message as read |
| `message:reaction` | `{ messageId, emoji, roomId }` | Add reaction |
| `private:message` | `{ recipientId, content }` | Send private message |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message:received` | `message` | New message received |
| `users:online` | `[userIds]` | Updated list of online users |
| `user:joined` | `{ user, message }` | User joined room |
| `user:left` | `{ user, message }` | User left room |
| `typing:user` | `{ userId, username, isTyping }` | User typing status |
| `message:read:update` | `{ messageId, userId }` | Message read status |
| `message:reaction:update` | `{ messageId, reactions }` | Reaction added |
| `notification:new` | `{ userId, message, roomId }` | New notification |

## 🎯 Features Implementation

### Task 1: Project Setup ✅
- Set up Node.js server with Express
- Configured Socket.io on server side
- Created React front-end application
- Set up Socket.io client in React app
- Established basic connection between client and server

### Task 2: Core Chat Functionality ✅
- Implemented JWT-based user authentication
- Created global chat rooms
- Display messages with sender's name and timestamp
- Implemented typing indicators
- Online/offline status for users

### Task 3: Advanced Chat Features ✅
- Private messaging between users
- Multiple chat rooms/channels
- "User is typing" indicator
- Message reactions (6 different emojis)
- Read receipts for messages

### Task 4: Real-Time Notifications ✅
- Notifications for new messages
- User join/leave notifications
- Sound notifications for new messages
- Browser notifications (Web Notifications API)

### Task 5: Performance and UX Optimization ✅
- Message pagination for loading older messages
- Automatic reconnection logic
- Socket.io namespaces for performance optimization
- Message delivery acknowledgment
- Message search functionality
- Fully responsive design (mobile, tablet, desktop)

## 📱 Screenshots

### Login Page
![Login Page]("C:\Users\user\OneDrive\Pictures\Screenshots\Screenshot 2025-11-05 171906.png")
*User authentication with clean, modern UI*



## 🧪 Testing the Application

### Test with Multiple Users

1. **Register First User**
   - Open `http://localhost:3000`
   - Click "Register here"
   - Create account: `user1@test.com / password123`

2. **Register Second User (Incognito Window)**
   - Open a new incognito/private browser window
   - Go to `http://localhost:3000`
   - Create account: `user2@test.com / password123`

3. **Create and Join Room**
   - User 1: Create a room called "General Chat"
   - User 2: Join "General Chat"

4. **Test Features**
   - Send messages between users
   - Try typing to see typing indicators
   - Add reactions to messages
   - Test search functionality
   - Check online/offline status

## 🐛 Troubleshooting

### Server won't start
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify `.env` file configuration

### Client can't connect to server
- Check if server is running
- Verify CORS settings
- Check `.env` file in client

### Messages not appearing in real-time
- Check browser console for errors
- Verify Socket.io connection
- Check network tab for WebSocket connection

## 🚀 Deployment

### Deploy to Heroku (Backend)
```bash
cd server
heroku create your-app-name
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Deploy to Vercel (Frontend)
```bash
cd client
vercel deploy
```

Update client `.env` with deployed backend URL.

## 📝 Future Enhancements

- [ ] File and image sharing
- [ ] Video/Voice calling
- [ ] Message editing and deletion
- [ ] User profiles with avatars upload
- [ ] Group video calls
- [ ] End-to-end encryption
- [ ] Message forwarding
- [ ] Pinned messages
- [ ] Custom themes
- [ ] Message translator


## 🙏 Acknowledgments

- Socket.io documentation
- React documentation
- MongoDB documentation
- Tailwind CSS
- All contributors who helped with this project

// deployment link ={https://real-time-communication-with-socket-io-z18r.onrender.com}

