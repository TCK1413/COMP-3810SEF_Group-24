const Product = require('../models/Product');

// Display the product list page
exports.getProductsPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .limit(limit)
      .skip(skip);
      
    const totalPages = Math.ceil(totalProducts / limit);

    res.render('products/index', { 
      title: 'Products', 
      products,
      user: req.session,
      currentPage: page,
      totalPages,
      totalProducts,
      filters: req.query
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
      product,
      user: req.session 
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
        imageUrls: product.imageUrls, // Using singular 'imageUrl' as confirmed
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
