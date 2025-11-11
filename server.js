
// ------------------------Import necessary modules------------------------
const express = require('express'); 
const mongoose = require('mongoose'); 
const cookieSession = require('cookie-session'); 
const path = require('path'); 
const methodOverride = require('method-override');
require('dotenv').config();

// Import route files
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const ordersRoutes = require('./routes/ordersRoutes');

// ------------------------Initialize Express app and port------------------------
const app = express(); 
const port = 8099; 

// ------------------------Database Connection------------------------
const MONGO_URI = 'mongodb+srv://admin:student@cluster0.azyhovs.mongodb.net/?appName=Cluster0'; 
const DB_NAME = 'myShoppingDB';

mongoose.connect(MONGO_URI, {
  dbName: DB_NAME
})
  .then(() => console.log(`Successfully connected to MongoDB database: ${DB_NAME}`))
  .catch(err => console.error('MongoDB connection error:', err));

// ------------------------Configure Template Engine------------------------
app.set('view engine', 'ejs'); 

// ------------------------Configure Middleware------------------------
// cookie Session
const SECRETKEY = '3810SEF-GP24'; 
app.use(cookieSession({ 
  name: 'mysession', 
  keys: [SECRETKEY], 
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Make session available to all views 
app.use((req, res, next) => {
  // 1. Make session object available to all templates (for login status)
  res.locals.session = req.session;

  // 2. Load cart data from the session for all templates
  let cart = req.session.cart || [];
  let totalItems = 0;
  let totalPrice = 0;

  if (Array.isArray(cart)) {
    totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    totalPrice = cart.reduce((total, item) => total + ((item.quantity || 0) * (item.price || 0)), 0);
  }
  
  // Pass cart data to all EJS templates
  res.locals.cart = cart; // The cart array (for cart.ejs)
  res.locals.initialCartCount = totalItems; // (for _top.ejs badge)
  res.locals.initialTotalPrice = totalPrice.toFixed(2); // (for _top.ejs preview)
  
  next(); // Continue to the next middleware or route
});

// Static Files
app.use(express.static('public')); 

// Body Parsers
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

// Method Override Middleware
app.use(methodOverride('_method'));

// ------------------------Define Routes------------------------
// Authentication Routes 
app.use('/auth', authRoutes);

// User Routes
app.use('/user', userRoutes);

// Address Routes
app.use('/user/addresses', addressRoutes);

// Product Routes
app.use('/products', productRoutes);

// Cart Routes
app.use('/cart', cartRoutes);

// Checkout Routes
app.use('/checkout', checkoutRoutes);

// Order Routes
app.use('/user/orders', ordersRoutes);

// Index/Home Route
app.get('/', (req, res) => { 
  res.render('index', { title: 'Home' }); 
});

// ------------------------Error Handling Middleware------------------------
app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).send('Something broke!'); 
});

// ------------------------Start the Server------------------------
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
