const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Admin login route
router.post('/login', authController.login);

module.exports = router;