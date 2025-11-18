// controllers/cartController.js
const Product = require('../models/Product');

// Helper to compute cart summary
function getCartSummary(cart) {
  let totalItems = 0;
  let totalPrice = 0;

  if (Array.isArray(cart)) {
    totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    totalPrice = cart.reduce(
      (total, item) => total + ((item.quantity || 0) * (item.price || 0)),
      0
    );
  }

  return {
    totalItems,
    totalPrice: Number(totalPrice.toFixed(2)),
  };
}

// --- 1. GET /cart (Read - webpage) ---
// Renders the main shopping cart page
exports.getCartPage = (req, res) => {
  res.render('cart/index', {
    title: 'Your Shopping Cart',
  });
};

// --- 2. POST /cart/item/update (Update - webpage form) ---
// Updates the quantity of a specific item in the session cart
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const numQuantity = parseInt(quantity, 10);

    if (Number.isNaN(numQuantity) || numQuantity <= 0) {
      // If user sets quantity <= 0, treat it as remove
      return exports.removeCartItem(req, res, next);
    }

    if (req.session.cart && Array.isArray(req.session.cart)) {
      const itemIndex = req.session.cart.findIndex(
        (item) => String(item.productId) === String(productId)
      );
      if (itemIndex > -1) {
        req.session.cart[itemIndex].quantity = numQuantity;
      }
    }

    res.redirect('/cart');
  } catch (err) {
    next(err);
  }
};

// --- 3. POST /cart/item/remove (Delete - webpage form) ---
// Removes a specific item from the cart via traditional HTML form
exports.removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (req.session.cart && Array.isArray(req.session.cart)) {
      req.session.cart = req.session.cart.filter(
        (item) => String(item.productId) !== String(productId)
      );
    }

    res.redirect('/cart');
  } catch (err) {
    next(err);
  }
};

/**
 * --- RESTful service: Cart CRUD for guests and logged-in users ---
 * Base path: /cart/items
 * All operations read/write the same req.session.cart that webpage uses.
 */

// GET /cart/items  -> Read cart (JSON)
exports.apiGetCart = (req, res) => {
  const cart = req.session.cart || [];
  const summary = getCartSummary(cart);

  res.status(200).json({
    success: true,
    items: cart,
    totalItems: summary.totalItems,
    totalPrice: summary.totalPrice,
  });
};

// POST /cart/items  -> Create (add item) (JSON)
exports.apiAddCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const numQuantity = parseInt(quantity, 10);

    if (!productId || Number.isNaN(numQuantity) || numQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'productId and positive quantity are required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < numQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingIndex = req.session.cart.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (existingIndex > -1) {
      req.session.cart[existingIndex].quantity += numQuantity;
    } else {
      req.session.cart.push({
        productId: productId,
        name: product.name,
        price: product.price,
        imageUrls: product.imageUrls[0],
        quantity: numQuantity,
      });
    }

    const summary = getCartSummary(req.session.cart);

    res.status(201).json({
      success: true,
      message: 'Product added to cart',
      totalCartItems: summary.totalItems,
      newTotalPrice: summary.totalPrice.toFixed(2),
      newCart: req.session.cart,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /cart/items/:productId  -> Update quantity (JSON)
exports.apiUpdateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const numQuantity = parseInt(quantity, 10);

    if (Number.isNaN(numQuantity) || numQuantity <= 0) {
      // Treat <= 0 as delete in API
      return exports.apiRemoveCartItem(req, res, next);
    }

    const cart = req.session.cart || [];
    const itemIndex = cart.findIndex(
      (item) => String(item.productId) === String(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    cart[itemIndex].quantity = numQuantity;
    req.session.cart = cart;

    const summary = getCartSummary(cart);

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      items: cart,
      totalItems: summary.totalItems,
      totalPrice: summary.totalPrice,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /cart/items/:productId -> Remove item (JSON)
exports.apiRemoveCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = req.session.cart || [];
    const before = cart.length;
    const updated = cart.filter(
      (item) => String(item.productId) !== String(productId)
    );

    if (updated.length === before) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    req.session.cart = updated;
    const summary = getCartSummary(updated);

    res.status(200).json({
      success: true,
      message: 'Cart item removed',
      items: updated,
      totalItems: summary.totalItems,
      totalPrice: summary.totalPrice,
    });
  } catch (err) {
    next(err);
  }
};

