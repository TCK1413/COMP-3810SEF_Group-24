// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// All routes here read/write from req.session.cart

// GET /cart
// This is the main shopping cart page
router.get('/', cartController.getCartPage);

// POST /cart/item/update
// This will UPDATE the quantity of an item in the cart.
router.post('/item/update', cartController.updateCartItem);

// POST /cart/item/remove
// This will REMOVE an item from the cart.
router.post('/item/remove', cartController.removeCartItem);

module.exports = router;
