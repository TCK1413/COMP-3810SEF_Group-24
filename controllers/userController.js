const User = require('../models/User');

// === Controller function to GET (display) the profile page ===
// This handles GET /user/profile
exports.getProfile = async (req, res, next) => {
  try {
    // Get the user ID stored in the session during login.
    const userId = req.session.userId;
    
    // Find the user in the database by their ID.
    // .lean() is used for faster read-only operations when we just need to render.
    const user = await User.findById(userId).lean();

    // If no user is found, clear session and redirect to login.
    if (!user) {
      req.session = null; // Clear the invalid session
      return res.redirect('/auth/login');
    }

    // Render the profile page (views/user/profile.ejs) and pass the user data to it.
    res.render('user/profile', { 
      user: user, 
      error: null // Pass null error initially
    });

  } catch (e) {
    // Pass any database or other errors to the error handling middleware.
    next(e);
  }
};

// === Controller function to POST (update) the profile data ===
// This handles POST /user/profile
exports.updateProfile = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    // Get the data submitted from the profile.ejs form.
    const { email, firstName, lastName } = req.body;

    // Check if the new email is already taken by ANOTHER user.
    if (email) {
      const existingUser = await User.findOne({ 
        email: email, 
        _id: { $ne: userId } // $ne means "not equal to" this user's own ID
      });
      
      if (existingUser) {
        // Email is taken. Re-render the form with an error message.
        const user = await User.findById(userId).lean(); // Get current user data again
        return res.status(400).render('user/profile', { 
          user: user, 
          error: 'Email is already in use by another account.' 
        });
      }
    }

    // Find the user by ID and update them with the new data.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, firstName, lastName }, // Data to update
      { new: true, runValidators: true }
    ).lean(); // Use .lean() as we are just rendering

    res.render('user/profile', { user: updatedUser, error: null }); 

  } catch (e) {
    const user = await User.findById(userId).lean();
    res.status(400).render('user/profile', { 
      user: user, 
      error: e.message // Pass the error message to the view
    });
  }
};
