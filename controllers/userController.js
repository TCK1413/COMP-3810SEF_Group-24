// controllers/userController.js
const User = require('../models/User'); // Ensure models/User.js exists

// === Controller function to GET (display) the profile page ===
// This handles GET /user/profile
exports.getProfile = async (req, res, next) => {
  try {
    // English Comment: Get the user ID stored in the session during login.
    const userId = req.session.userId;
    
    // English Comment: Find the user in the database by their ID.
    // .lean() is used for faster read-only operations when we just need to render.
    const user = await User.findById(userId).lean();

    // English Comment: If no user is found (e.g., bad session), clear session and redirect to login.
    if (!user) {
      req.session = null; // Clear the invalid session
      return res.redirect('/auth/login');
    }

    // English Comment: Render the profile page (views/user/profile.ejs) and pass the user data to it.
    res.render('user/profile', { 
      user: user, 
      error: null // Pass null error initially
    });

  } catch (e) {
    // English Comment: Pass any database or other errors to the error handling middleware.
    next(e);
  }
};

// === Controller function to POST (update) the profile data ===
// This handles POST /user/profile
exports.updateProfile = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    // English Comment: Get the data submitted from the profile.ejs form.
    const { email, firstName, lastName } = req.body;

    // English Comment: Check if the new email is already taken by ANOTHER user.
    if (email) {
      const existingUser = await User.findOne({ 
        email: email, 
        _id: { $ne: userId } // $ne means "not equal to" this user's own ID
      });
      
      if (existingUser) {
        // English Comment: Email is taken. Re-render the form with an error message.
        const user = await User.findById(userId).lean(); // Get current user data again
        return res.status(400).render('user/profile', { 
          user: user, 
          error: 'Email is already in use by another account.' 
        });
      }
    }

    // English Comment: Find the user by ID and update them with the new data.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, firstName, lastName }, // Data to update
      { new: true, runValidators: true } // Options: return the new doc, run schema validators
    ).lean(); // Use .lean() as we are just rendering

    // English Comment: Re-render the profile page with the newly updated user data.
    // We could also pass a 'success' message here.
    res.render('user/profile', { user: updatedUser, error: null }); 

  } catch (e) {
    // English Comment: If validation (e.g., invalid email format) or other errors occur.
    const user = await User.findById(userId).lean();
    res.status(400).render('user/profile', { 
      user: user, 
      error: e.message // Pass the error message to the view
    });
  }
};
