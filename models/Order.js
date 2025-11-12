// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null 
  },
  
  stripeSessionId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },

  customerEmail: {
    type: String,
    required: true
  },
  
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String }
  }],
  
  totalPrice: {
    type: Number,
    required: true
  },

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String }
  },
  
  status: {
      type: String,
      enum: ['in_transit', 'delivered'],
      default: 'in_transit'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
