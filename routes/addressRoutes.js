// routes/addressRoutes.js
const express = require('express');
const router = express.Router();

// Import the controller that handles address logic
const addressController = require('../controllers/addressController');

// Middleware to protect all routes defined in this file.
// Ensures user is logged in before accessing any address management pages.
router.use((req, res, next) => {
  if (!req.session.authenticated) {
    return res.redirect('/auth/login');
  }
  next();
});

// === Address Routes ===

// Will handle requests to GET /user/addresses/
router.get('/', addressController.listAddresses);

// Route to GET the form for creating a new address.
// Will handle requests to GET /user/addresses/new
router.get('/new', addressController.newAddressForm);

// Route to POST data for creating a new address.
// Will handle requests to POST /user/addresses/
router.post('/', addressController.createAddress);

// Route to GET the form for editing an existing address.
// Will handle requests to GET /user/addresses/:addressId/edit
router.get('/:addressId/edit', addressController.editAddressForm);

// Route to PUT (update) an existing address.
// Will handle requests to PUT /user/addresses/:addressId
router.put('/:addressId', addressController.updateAddress);

// Route to DELETE an existing address.
// Will handle requests to DELETE /user/addresses/:addressId
router.delete('/:addressId', addressController.deleteAddress);

// Route to POST (set) an address as default.
// Will handle requests to POST /user/addresses/:addressId/default
router.post('/:addressId/default', addressController.setDefaultAddress);

module.exports = router;
