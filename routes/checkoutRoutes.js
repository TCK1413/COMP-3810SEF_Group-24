// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// GET /checkout
// 顯示結帳頁面 (包含表單)
router.get('/', checkoutController.getCheckoutPage);

// POST /checkout/create-session
// 處理結帳表單提交，創建 Stripe session
router.post('/create-session', checkoutController.createCheckoutSession);

// GET /checkout/success
// 用戶付款成功後，Stripe 重定向回來的地方
router.get('/success', checkoutController.getSuccessPage);

// GET /checkout/cancel
// 用戶取消付款後，Stripe 重定向回來的地方
router.get('/cancel', checkoutController.getCancelPage);

module.exports = router;
