const express = require('express');
const router = express.Router();

// English Comment: Import the controller that handles user profile logic
const userController = require('../controllers/userController');

// English Comment: Middleware to protect all routes defined in this file.
// It checks if the user is authenticated before allowing access to profile pages.
router.use((req, res, next) => {
  if (!req.session.authenticated) {
    return res.redirect('/auth/login'); // Redirect to login if not authenticated
  }
  next(); // Proceed if authenticated
});

// === Profile Routes ===

// English Comment: Route to GET (display) the user profile page.
// Will handle requests to GET /user/profile
router.get('/profile', userController.getProfile);

// English Comment: Route to POST (handle update) the user profile form.
// Will handle requests to POST /user/profile
router.post('/profile', userController.updateProfile);

module.exports = router;
