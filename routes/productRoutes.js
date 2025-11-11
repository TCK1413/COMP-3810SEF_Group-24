const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product list page
router.get('/', productController.getProductsPage);

// Product Details Page
router.get('/:productId', productController.getProductDetailPage);

// Add to Cart
router.post('/add-to-cart', productController.addToCart);

module.exports = router;
