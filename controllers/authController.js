
// ------------------------Import the User model------------------------
const User = require('../models/User');

//------------------------Function------------------------
// Display the registration page
exports.getRegisterPage = (req, res) => {
  res.render('register', { error: null });
};

// Handle registration form submission
exports.handleRegistration = async (req, res) => {

  const { username, email, password, confirmPassword, firstName, lastName } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    // Re-render the registration page with an error message
    return res.render('register', { error: 'Passwords do not match!' });
  }

  // Check if username or email already exists in the database
  try { 
    const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
    if (existingUser) {
      // If user found, render registration page with error
      return res.render('register', { error: 'Username or email already exists!' });
    }

    // Create a new user instance
    const newUser = new User({
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName
    });

    // Save the new user to the database
    await newUser.save();

    // Registration successful, redirect to login page or another page
    console.log('User registered successfully:', newUser.username);
    res.redirect('/login'); // Redirect to the login page path

  } catch (err) {
    // Handle errors during findOne or save, or other unexpected errors
    console.error("Registration error:", err);

    // Provide specific feedback for Mongoose validation errors
    if (err.name === 'ValidationError') {
        let errorMessages = Object.values(err.errors).map(el => el.message);
        // Join messages or take the first one
        let displayError = errorMessages.join(' ');
        return res.render('register', { error: displayError });
    }

    // Generic error message for other failures
    res.render('register', { error: 'Registration failed. Please try again.' });
  }
};

// --- Add other controller functions here later, e.g., for login, logout ---
// exports.getLoginPage = (req, res) => { ... };
// exports.handleLogin = async (req, res) => { ... };
// exports.handleLogout = (req, res) => { ... };

