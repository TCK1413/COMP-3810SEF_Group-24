// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// GET /checkout
router.get('/', checkoutController.getCheckoutPage);

// POST /checkout/create-session  
router.post('/create-session', checkoutController.createCheckoutSession);

// POST /checkout/save-address
router.post('/save-address', checkoutController.saveAddressAjax);

// GET /checkout/success
router.get('/success', checkoutController.getSuccessPage);

// GET /checkout/cancel
router.get('/cancel', checkoutController.getCancelPage);

module.exports = router;

