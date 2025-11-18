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

function formatDate(d) { try { return new Date(d).toLocaleString(); } catch { return ''; } }

// GET /orders/lookup
exports.getTrackPage = (req, res) => {
  res.render('orders/track', {
    title: 'Track Your Order',
    error: null,
    formData: {}
  });
};

// POST /orders/lookup
exports.postTrack = async (req, res) => {
  const { orderId, email } = req.body;
  const formData = { orderId, email };

  if (!orderId || !email) {
    return res.render('orders/track', {
      title: 'Track Your Order',
      error: 'Please enter both Order ID and Email.',
      formData
    });
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.render('orders/track', {
      title: 'Track Your Order',
      error: 'Invalid Order ID.',
      formData
    });
  }

  const order = await Order.findOne({ _id: orderId, customerEmail: email }).lean();

  if (!order) {
    return res.render('orders/track', {
      title: 'Track Your Order',
      error: 'Order not found for the provided Order ID and Email.',
      formData
    });
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const computedTotal = items.reduce((s, it) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
  const totalAmount = typeof order.totalPrice === 'number' ? order.totalPrice : computedTotal;

  return res.render('user/orders/detail', {
    title: `Order #${order._id}`,
    order: { ...order, statusView: presentStatus(order.status) },
    items,
    totalAmount,
    publicView: true,
    helpers: { formatDate }
  });
};

