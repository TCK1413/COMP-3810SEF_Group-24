// routes/orderLookupRoutes.js
const express = require('express');
const router = express.Router();
const orderLookupController = require('../controllers/orderLookupController');

// GET /orders/lookup   -> 表单页
router.get('/lookup', orderLookupController.getTrackPage);

// POST /orders/lookup  -> 提交订单号+邮箱后查询
router.post('/lookup', orderLookupController.postTrack);

// （可选）GET /orders/lookup/:orderId?token=... 也可以做成带 token 的链接

module.exports = router;

