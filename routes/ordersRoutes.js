// routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.use((req, res, next) => {
  if (!req.session || !req.session.authenticated || !req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
});

// GET /user/orders
router.get('/', ordersController.getOrdersPage);

// GET /user/orders/:orderId
router.get('/:orderId', ordersController.getOrderDetail);

module.exports = router;

