// controllers/cartController.js

// --- 1. GET /cart (Read) ---
// Renders the main shopping cart page
exports.getCartPage = (req, res) => {
  // English Comment: We don't need to query anything.
  // The 'cart' variable (which is req.session.cart)
  // is already loaded by the middleware in server.js
  // and passed to *all* templates as 'cart' and 'initialTotalPrice'.
  res.render('cart', {
    title: 'Your Shopping Cart'
  });
};

// --- 2. POST /cart/item/update (Update) ---
// Updates the quantity of a specific item in the session cart
exports.updateCartItem = async (req, res, next) => {
  try {
    // Get product ID and new quantity from the form body
    const { productId, quantity } = req.body;
    const numQuantity = parseInt(quantity);

    if (numQuantity <= 0) {
      // If user sets quantity to 0 or less, treat it as a removal
      return exports.removeCartItem(req, res, next);
    }

    if (req.session.cart && Array.isArray(req.session.cart)) {
      // Find the specific item in the session cart array
      const itemIndex = req.session.cart.findIndex(item => item.productId === productId);
      
      if (itemIndex > -1) {
        // Update its quantity
        // TODO: We should also check against product.stock here
        req.session.cart[itemIndex].quantity = numQuantity;
      }
    }
    
    res.redirect('/cart');

  } catch (err) {
    next(err);
  }
};


// --- 3. POST /cart/item/remove (Delete) ---
// Removes an item from the session cart
exports.removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (req.session.cart && Array.isArray(req.session.cart)) {
      // Filter out the item that matches the productId
      req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    }
    
    res.redirect('/cart');

  } catch (err) {
    next(err);
  }
};
