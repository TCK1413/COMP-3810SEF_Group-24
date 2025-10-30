const express = require('express');
const router = express.Router(); // Create a new router object

// ------------------------Import the corresponding controller------------------------
const authController = require('../controllers/authController');

// Define route rules

// ------------------------register request------------------------
// GET request to /register path - For displaying the registration page
router.get('/register', authController.getRegisterPage);

// POST request to /register path - For handling the submitted registration form data
router.post('/register', authController.handleRegistration);

// GET request to /register/register-success path - For displaying the register-success page
router.get('/register-success', authController.getRegisterSuccessPage);

// ------------------------login------------------------
// GET request to /login - For displaying the login page
router.get('/login', authController.getLoginPage);

// POST request to /login - For handling the login form submission
router.post('/login', authController.handleLogin);
// router.get('/logout', authController.handleLogout);

module.exports = router; // Export the router object for use in server.js

