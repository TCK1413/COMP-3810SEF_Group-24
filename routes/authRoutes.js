const express = require('express');
const router = express.Router(); // Create a new router object

// ------------------------Import the corresponding controller------------------------
const authController = require('../controllers/authController');

// Define route rules

// GET request to /register path - For displaying the registration page
router.get('/register', authController.getRegisterPage);

// POST request to /register path - For handling the submitted registration form data
router.post('/register', authController.handleRegistration);

// --- Add other authentication-related routes here later, e.g., login ---
// router.get('/login', authController.getLoginPage);
// router.post('/login', authController.handleLogin);
// router.get('/logout', authController.handleLogout);

module.exports = router; // Export the router object for use in server.js

