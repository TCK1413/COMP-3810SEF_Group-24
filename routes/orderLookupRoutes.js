// routes/orderLookupRoutes.js
const express = require('express');
const router = express.Router();
const orderLookupController = require('../controllers/orderLookupController');

// GET /orders/lookup
router.get('/lookup', orderLookupController.getTrackPage);

// POST /orders/lookup
router.post('/lookup', orderLookupController.postTrack);

module.exports = router;

