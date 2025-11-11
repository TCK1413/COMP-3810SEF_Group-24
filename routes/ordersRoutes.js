// routes/ordersRoutes.js
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// 登录保护（保持与 addressRoutes 同风格）
router.use((req, res, next) => {
  if (!req.session || !req.session.authenticated || !req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
});

// 订单列表：GET /user/orders
router.get('/', ordersController.getOrdersPage);

// 订单详情：GET /user/orders/:orderId
router.get('/:orderId', ordersController.getOrderDetail);

module.exports = router;

