const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  imageUrls: [{
    type: String,
    required: [true, 'Product image URLs are required']
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['shirt', 'pants', 'dress', 'shoes', 'accessories', 'other']
  },
  gender: {
    type: String,
    required: [true, 'Product gender classification is required'],
    enum: ['male', 'female', 'unisex'],
    default: 'unisex'
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
