const express = require('express');
const {
  getMessages,
  createMessage,
  markAsRead,
  addReaction,
  searchMessages,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:roomId', protect, getMessages);
router.post('/', protect, createMessage);
router.put('/:messageId/read', protect, markAsRead);
router.put('/:messageId/reaction', protect, addReaction);
router.get('/search/query', protect, searchMessages);

module.exports = router;