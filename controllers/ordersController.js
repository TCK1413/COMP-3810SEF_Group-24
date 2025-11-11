// controllers/ordersController.js
const mongoose = require('mongoose');
const Order = require('../models/Order');

// 简单的日期格式化（传给 EJS 使用）
function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return '';
  }
}

// GET /user/orders
exports.getOrdersPage = async (req, res, next) => {
  try {
    const userId = req.session.userId;

    // 查询当前用户的订单，按创建时间倒序
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    res.render('user/orders/index', {
      title: 'My Orders',
      orders,
      helpers: { formatDate }
    });
  } catch (err) {
    next(err);
  }
};

// GET /user/orders/:orderId
exports.getOrderDetail = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(404).render('error', { message: 'Order not found' });
    }

    const order = await Order.findOne({ _id: orderId, user: userId }).lean();
    if (!order) {
      return res.status(404).render('error', { message: 'Order not found' });
    }

    // items 快照容错（若下单时已存 name/price/quantity，这里直接展示）
    const items = Array.isArray(order.items) ? order.items : [];

    // 若模型中已有 totalAmount，优先使用；否则按 items 即时计算
    const computedTotal = items.reduce((sum, it) => {
      const price = Number(it.price || 0);
      const qty = Number(it.quantity || 0);
      return sum + price * qty;
    }, 0);

    const totalAmount = (typeof order.totalAmount === 'number')
      ? order.totalAmount
      : computedTotal;

    res.render('user/orders/detail', {
      title: `Order #${order._id}`,
      order,
      items,
      totalAmount,
      helpers: { formatDate }
    });
  } catch (err) {
    next(err);
  }
};

