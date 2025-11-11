const mongoose = require('mongoose');
const Product = require('./models/Product');

// Database connection
const MONGO_URI = 'mongodb+srv://admin:student@cluster0.azyhovs.mongodb.net/?appName=Cluster0';
const DB_NAME = 'myShoppingDB';

mongoose.connect(MONGO_URI, { dbName: DB_NAME })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

const sampleProducts = [
  {
    name: "sport bag",
    description: "Comfortable cotton t-shirt, perfect for everyday wear. Available in multiple colors.",
    price: 19.99,
    imageUrl: "https://m.media-amazon.com/images/I/71LWmkhS-aL._AC_SX679_.jpg",
    category: "shirt",
    gender: "unisex",
    stock: 100
  },
  {
    name: "Slim Fit Jeans",
    description: "Stylish slim fit jeans made from high-quality denim. Durable and comfortable.",
    price: 49.99,
    imageUrl: "https://m.media-amazon.com/images/I/61wFyUVrhOL._AC_SY879_.jpg",
    category: "pants",
    gender: "male",
    stock: 75
  },
  {
    name: "Summer Sundress",
    description: "Lightweight summer dress, ideal for hot weather. Breathable fabric and elegant design.",
    price: 59.99,
    imageUrl: "https://m.media-amazon.com/images/I/71TZhvtwmUL._AC_SY879_.jpg",
    category: "dress",
    gender: "female",
    stock: 50
  },
  {
    name: "Running Shoes",
    description: "High-performance running shoes with excellent cushioning and support.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3",
    category: "shoes",
    gender: "male",
    stock: 60
  },
  {
    name: "Leather Jacket",
    description: "Genuine leather jacket, perfect for cooler weather. Timeless style.",
    price: 199.99,
    imageUrl: "https://m.media-amazon.com/images/I/815AXfMXblL._AC_SX679_.jpg",
    category: "shirt",
    gender: "unisex",
    stock: 30
  },
  {
    name: "Designer Sunglasses",
    description: "Trendy sunglasses with UV protection. Stylish accessory for any outfit.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3",
    category: "accessories",
    gender: "unisex",
    stock: 45
  },
  {
    name: "Yoga Pants",
    description: "Flexible and comfortable yoga pants, perfect for workouts or casual wear.",
    price: 39.99,
    imageUrl: "https://m.media-amazon.com/images/I/51Z+xKHvxpL._AC_SY879_.jpg",
    category: "pants",
    gender: "female",
    stock: 80
  },
  {
    name: "Winter Coat",
    description: "Warm winter coat with insulation. Water-resistant and stylish.",
    price: 149.99,
    imageUrl: "https://m.media-amazon.com/images/I/61wHw2le+vL._AC_SY879_.jpg",
    category: "shirt",
    gender: "female",
    stock: 25
  },
  {
    name: "Fashion Watch",
    description: "Elegant wristwatch with leather strap. Suitable for both casual and formal occasions.",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3",
    category: "accessories",
    gender: "unisex",
    stock: 40
  },
  {
    name: "Casual Sneakers",
    description: "Stylish casual sneakers, perfect for everyday wear. Comfortable and trendy.",
    price: 69.99,
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3",
    category: "shoes",
    gender: "female",
    stock: 55
  }
];

// Insert product data
async function seedProducts() {
  try {
    await Product.deleteMany({}); // Clear existing products
    const result = await Product.insertMany(sampleProducts);
    console.log(`${result.length} products added to the database`);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding products:', err);
    mongoose.connection.close();
  }
}

seedProducts();
