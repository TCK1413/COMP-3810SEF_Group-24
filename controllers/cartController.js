// controllers/checkoutController.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');
const Address = require('../models/Address');
const emailService = require('../services/emailService');
const Product = require('../models/Product');
const { getNames } = require('country-list');

/* ---------- helpers ---------- */
function ensureNumber(n, d = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : d;
}

async function adjustStockForItems(items) {
  if (!Array.isArray(items) || items.length === 0) return { ok: true, failed: [] };
  const failed = [];
  for (const it of items) {
    const productId = it.productId || it._id;
    const qty = Number(it.quantity || 0);
    if (!productId || !qty) continue;
    const res = await Product.updateOne(
      { _id: productId, stock: { $gte: qty } },
      { $inc: { stock: -qty } }
    );
    if (!res || res.modifiedCount !== 1) failed.push({ productId, qty });
  }
  return { ok: failed.length === 0, failed };
}

function normalizeCart(req, res) {
  const cands = [
    res.locals?.cart,
    req.session?.cart,
    Array.isArray(res.locals?.cartItems) ? { items: res.locals.cartItems } : null,
    Array.isArray(req.session?.cartItems) ? { items: req.session.cartItems } : null,
  ].filter(Boolean);

  for (const c of cands) {
    if (Array.isArray(c)) return { items: c };
    if (Array.isArray(c?.items)) return { items: c.items };
  }
  return { items: [] };
}

/* ---------- 1) Checkout page ---------- */
exports.getCheckoutPage = async (req, res, next) => {
  try {
    const cart = normalizeCart(req, res);
    if (!cart.items.length) return res.redirect('/cart');

    let totalPrice = res.locals?.initialTotalPrice;
    if (typeof totalPrice !== 'number') {
      totalPrice = cart.items.reduce(
        (sum, it) => sum + ensureNumber(it.price) * ensureNumber(it.quantity, 1),
        0
      );
    }

    const isGuest = !(req.session?.authenticated && req.session?.userId);

    let userEmail = null;
    let userAddresses = [];
    if (!isGuest) {
      try {
        const user = await User.findById(req.session.userId).lean();
        if (user?.email) userEmail = user.email;
        userAddresses = await Address.find({ user: req.session.userId }).lean();
      } catch (e) {
        console.error(e);
      }
    }

    const countries = getNames();

    return res.render('checkout/index', {
      title: 'Checkout',
      cart,
      totalPrice,
      userEmail,
      userAddresses,
      countries,
      isGuest,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------- 2) Save address (AJAX for logged-in users) ---------- */
exports.saveAddressAjax = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { street, city, postalCode, country, phone, setDefault } = req.body || {};
    if (!street || !city || !postalCode || !country) {
      return res.status(400).json({ error: 'Please fill all required address fields.' });
    }

    const address = await Address.create({
      user: userId,
      street,
      city,
      postalCode,
      country,
      phone: phone || '',
      isDefault: !!setDefault,
    });

    if (setDefault) {
      await Address.updateMany({ user: userId, _id: { $ne: address._id } }, { $set: { isDefault: false } });
    }

    return res.json({
      ok: true,
      address: { _id: address._id, label: `${address.street}, ${address.city}` }
    });
  } catch (err) {
    next(err);
  }
};

/* ---------- 3) Create Stripe session (JSON: {url}) ---------- */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const cartNorm = normalizeCart(req, res);
    if (!cartNorm.items.length) return res.status(400).json({ error: 'Your cart is empty.' });

    const {
      useSavedAddress,
      addressId,
      address,
      setDefaultAddress,
      email,
    } = req.body || {};

    const isGuest = !(req.session?.authenticated && req.session?.userId);
    const userId = isGuest ? null : req.session.userId;

    const rawEmail = email ? String(email).trim() : '';
    let finalCustomerEmail = rawEmail;

    if (!finalCustomerEmail && !isGuest && req.session?.user?.email) {
      finalCustomerEmail = String(req.session.user.email).trim();
    }

    if (!finalCustomerEmail) {
      return res.status(400).json({ error: 'Please provide an email address.' });
    }

    let shippingAddress = null;

    if (!isGuest && useSavedAddress && addressId) {
      const addr = await Address.findOne({ _id: addressId, user: userId }).lean();
      if (!addr) return res.status(400).json({ error: 'Selected address not found.' });
      shippingAddress = {
        street: addr.street, city: addr.city, postalCode: addr.postalCode,
        country: addr.country, phone: addr.phone || ''
      };
      if (setDefaultAddress) {
        await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
        await Address.updateOne({ _id: addressId }, { $set: { isDefault: true } });
      }
    } else {
      const a = address || {};
      if (!a.street || !a.city || !a.postalCode || !a.country) {
        return res.status(400).json({ error: 'Please complete your shipping address.' });
      }
      shippingAddress = {
        street: a.street, city: a.city, postalCode: a.postalCode,
        country: a.country, phone: a.phone || ''
      };
      if (!isGuest && setDefaultAddress) {
        const saved = await Address.create({ user: userId, ...shippingAddress, isDefault: true });
        await Address.updateMany({ user: userId, _id: { $ne: saved._id } }, { $set: { isDefault: false } });
      }
    }

    const lineItems = [];
    let totalAmount = 0;
    for (const it of cartNorm.items) {
      const product = await Product.findById(it.productId).lean();
      if (!product) continue;
      const unitAmount = Math.round(ensureNumber(product.price) * 100);
      totalAmount += ensureNumber(product.price) * ensureNumber(it.quantity, 1);
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: product.name, images: product.imageUrl ? [product.imageUrl] : [] },
          unit_amount: unitAmount,
        },
        quantity: ensureNumber(it.quantity, 1),
      });
    }

    const successUrl = `${req.protocol}://${req.get('host')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl  = `${req.protocol}://${req.get('host')}/checkout/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: finalCustomerEmail,
    });

    req.session.pendingOrderData = {
      user: userId || null,
      customerEmail: finalCustomerEmail,
      items: cartNorm.items.map(i => ({
        productId: i.productId,
        name: i.name,
        price: ensureNumber(i.price),
        quantity: ensureNumber(i.quantity, 1),
        imageUrl: i.imageUrl || '',
      })),
      shippingAddress,
      totalPrice: Number(totalAmount.toFixed(2)),
    };

    return res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

/* ---------- 4) Success / 5) Cancel ---------- */
exports.getSuccessPage = async (req, res, next) => {
  try {
    const stripeSessionId = req.query.session_id || req.query.stripe_session_id;
    const pendingOrder = req.session.pendingOrderData;
    if (!stripeSessionId || !pendingOrder) return res.redirect('/cart');

    const existed = await Order.findOne({ stripeSessionId });
    if (existed) return res.render('checkout/success', { title: 'Order Confirmed' });

    const newOrder = new Order({ ...pendingOrder, stripeSessionId, status: 'in_transit' });
    await newOrder.save();

    const stockResult = await adjustStockForItems(pendingOrder.items);
    if (!stockResult.ok) console.warn('Stock deduction failed for items:', stockResult.failed);

    req.session.cart = null;
    req.session.pendingOrderData = null;

    try { await emailService.sendOrderConfirmation(newOrder); }
    catch (e) { console.warn('Email send failed:', e?.message || e); }

    res.render('checkout/success', { title: 'Order Confirmed' });
  } catch (err) {
    next(err);
  }
};

exports.getCancelPage = (req, res) => {
  req.session.pendingOrderData = null;
  res.render('checkout/cancel', { title: 'Payment Canceled' });
};

