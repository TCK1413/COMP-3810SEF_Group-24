
// ------------------------Import the User model------------------------
const User = require('../models/User');

//------------------------Function------------------------
// === Registration Functions ===
// Display the registration page
exports.getRegisterPage = (req, res) => {
  res.render('register', { error: null });
};

// Display the register-success page
exports.getRegisterSuccessPage = (req, res) => {
  res.render('register-success');
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
    res.redirect('/auth/register-success'); // Redirect to the register-success page path

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

// === Login Functions ===
// Function: Display the login page
exports.getLoginPage = (req, res) => {
  res.render('login', { error: null }); // Pass null error initially
};

// Function: Handle login form submission
exports.handleLogin = async (req, res) => {
  // Get form data from request body
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username: username });

    // Check if user exists
    if (!user) {
      // User not found
      return res.render('login', { error: 'Invalid username or password.' });
    }

    const isMatch = (password === user.password);

    // Check if password matches
    if (!isMatch) {
      // Password does not match
      return res.render('login', { error: 'Invalid username or password.' });
    }

    // Login successful: Create a session
    // Store session data in the cookie
    req.session.authenticated = true;
    req.session.username = user.username;
    req.session.userId = user._id; // Store user ID for future use

    // Redirect to the home page (or user profile)
    res.redirect('/'); // Redirect to home page

  } catch (err) {
    // Handle any server errors
    console.error("Login error:", err);
    res.render('login', { error: 'Login failed. Please try again.' });
  }
};

// === Logout Functions ===
// Add controller function for logout
exports.handleLogout = (req, res) => {
  req.session = null; // 
  res.redirect('/');
};


