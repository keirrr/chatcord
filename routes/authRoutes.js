const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Login
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)

// Register
router.get('/register', authController.register_get)
router.post('/register', authController.register_post)

// Logout
router.get('/logout', authController.logout_get)

module.exports = router;