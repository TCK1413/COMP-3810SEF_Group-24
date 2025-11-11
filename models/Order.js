// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  // 關聯到用戶 (如果是登入用戶)
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null // 遊客為 null
  },
  
  // Stripe 付款 ID，確保我們不會重複處理同一個訂單
  stripeSessionId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },

  // 儲存顧客是誰
  customerEmail: {
    type: String,
    required: true
  },
  
  // 複製購物車中的商品
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String }
  }],
  
  // 儲存總價
  totalPrice: {
    type: Number,
    required: true
  },

  // 儲存送貨地址（我們從用戶輸入或 Address 模型中複製過來）
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String }
  }

}, {
  timestamps: true // 儲存 createdAt 和 updatedAt
});

module.exports = mongoose.model('Order', OrderSchema);
