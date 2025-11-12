// controllers/ordersController.js
const mongoose = require('mongoose');
const Order = require('../models/Order');

function presentStatus(s) {

  switch (s) {
    case 'delivered':
      return { label: 'Delivered', className: 'text-bg-success' };
    case 'in_transit':
    default:
      return { label: 'In transit', className: 'text-bg-info' };
  }
}

function formatDate(d) {
  try { return new Date(d).toLocaleString(); } catch { return ''; }
}

// GET /user/orders
exports.getOrdersPage = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    let orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();

    orders = orders.map(o => ({
      ...o,
      statusView: presentStatus(o.status)
    }));

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
    if (!order) return res.status(404).render('error', { message: 'Order not found' });

    const items = Array.isArray(order.items) ? order.items : [];
    const computedTotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    const totalAmount = typeof order.totalPrice === 'number' ? order.totalPrice : computedTotal;

    res.render('user/orders/detail', {
      title: `Order #${order._id}`,
      order: { ...order, statusView: presentStatus(order.status) },
      items,
      totalAmount,
      publicView: false, 
      helpers: { formatDate }
    });
  } catch (err) {
    next(err);
  }
};

