const express = require('express');
const {
  registerUser,
  loginUser,
  getUsers,
  logoutUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, getUsers);
router.post('/logout', protect, logoutUser);

module.exports = router;