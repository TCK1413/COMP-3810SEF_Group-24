// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// All routes here read/write from req.session.cart

// ---------------- Webpage routes (HTML) ----------------

// GET /cart
// Main shopping cart page
router.get('/', cartController.getCartPage);

// ---------------- RESTful service routes (JSON) ----------------
// Base resource: /cart/items

// GET /cart/items -> Read cart
router.get('/items', cartController.apiGetCart);

// POST /cart/items -> Add item to cart (Create)
router.post('/items', cartController.apiAddCartItem);

// PUT /cart/items/:productId -> Update quantity
router.put('/items/:productId', cartController.apiUpdateCartItem);

// DELETE /cart/items/:productId -> Remove item
router.delete('/items/:productId', cartController.apiRemoveCartItem);

module.exports = router;

