
// ------------------------Import necessary modules------------------------
const express = require('express'); 
const mongoose = require('mongoose'); 
const cookieSession = require('cookie-session'); 
const path = require('path'); 

// Import route files
const authRoutes = require('./routes/authRoutes'); 

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

// Static Files
app.use(express.static('public')); 

// Body Parsers
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

// ------------------------Define Routes------------------------
// Authentication Routes 
app.use('/auth', authRoutes);

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
