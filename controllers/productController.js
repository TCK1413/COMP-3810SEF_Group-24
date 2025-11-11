const Product = require('../models/Product');

// Display the product list page
exports.getProductsPage = async (req, res) => {
  try {
    const products = await Product.find().limit(10);
    res.render('products/index', { 
      title: 'Products', 
      products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).render('error', { message: 'Failed to load products' });
  }
};

// Display product details page
exports.getProductDetailPage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    res.render('products/detail', { 
      title: product.name, 
      product
    });
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).render('error', { message: 'Failed to load product details' });
  }
};

// Add to Cart function
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const numQuantity = parseInt(quantity);

    // Allow guest to add to cart (fulfills Req 3)
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    if (product.stock < numQuantity) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    const existingItemIndex = req.session.cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      req.session.cart[existingItemIndex].quantity += numQuantity;
    } else {
      req.session.cart.push({
        productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl, // Using singular 'imageUrl' as confirmed
        quantity: numQuantity
      });
    }
    
    // Calculate new totals to send back to the client
    let totalCartItems = 0;
    let newTotalPrice = 0;

    if (req.session.cart) {
      totalCartItems = req.session.cart.reduce((total, item) => total + item.quantity, 0);
      newTotalPrice = req.session.cart.reduce((total, item) => total + (item.quantity * item.price), 0);
    }

    // Send the new totals AND the full cart back in the JSON response
    res.json({ 
      success: true, 
      message: 'Product added to cart',
      totalCartItems: totalCartItems,
      newTotalPrice: newTotalPrice.toFixed(2), // Send formatted price
      newCart: req.session.cart // Send the entire updated cart
    });

  } catch (err) {
    console.error('Error adding product to cart:', err);
    res.status(500).json({ success: false, message: 'Failed to add product to cart' });
  }
};
