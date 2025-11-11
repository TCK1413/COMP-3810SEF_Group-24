// controllers/checkoutController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // 初始化 Stripe
const Order = require('../models/Order');
const User = require('../models/User'); // 用於獲取登入用戶的 Email
const Address = require('../models/Address'); // 用於獲取登入用戶的地址
const emailService = require('../services/emailService'); // 引入郵件服務

// 1. 顯示結帳頁面 (GET /checkout)
exports.getCheckoutPage = async (req, res) => {
  // 購物車是空的，不應該在這裡
  if (!res.locals.cart || res.locals.cart.length === 0) {
    return res.redirect('/cart');
  }

  let userEmail = null;
  let userAddresses = [];

  // 如果用戶已登入，預先獲取他們的 Email 和地址
  if (req.session.authenticated) {
    try {
      const user = await User.findById(req.session.userId).lean();
      userEmail = user.email;
      
      // 獲取已保存的地址
      userAddresses = await Address.find({ user: req.session.userId }).lean();
      
    } catch (err) {
      console.error(err);
      // 即使出錯也繼續，讓他們手動輸入
    }
  }

  res.render('checkout', {
    title: 'Checkout',
    cart: res.locals.cart,
    totalPrice: res.locals.initialTotalPrice,
    userEmail: userEmail, // 可能是 null（遊客）或用戶 Email
    userAddresses: userAddresses // 可能是 []（遊客）或地址列表
  });
};

// 2. 創建 Stripe 付款 Session (POST /checkout/create-session)
exports.createCheckoutSession = async (req, res) => {
  const cart = res.locals.cart;
  if (!cart || cart.length === 0) {
    return res.redirect('/cart');
  }

  // 從表單獲取數據
  const { 
    customerEmail, 
    selectedAddress, // 可能是 'new' 或一個地址 ID
    street, city, postalCode, country, phone // 僅當 'new' 時使用
  } = req.body;

  let shippingAddress = {};
  let emailToUse = customerEmail; // 默認使用表單中的 Email（遊客）

  // 決定送貨地址和 Email
  try {
    if (req.session.authenticated) {
      const user = await User.findById(req.session.userId).lean();
      emailToUse = user.email; // 登入用戶，強制使用他們帳戶的 Email

      if (selectedAddress === 'new') {
        shippingAddress = { street, city, postalCode, country, phone };
        // (可選) 幫用戶保存這個新地址
        await Address.create({
          user: req.session.userId,
          ...shippingAddress,
          isDefault: false
        });
      } else {
        // 從數據庫加載已選的地址
        const address = await Address.findOne({ _id: selectedAddress, user: req.session.userId }).lean();
        shippingAddress = {
          street: address.street,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone
        };
      }
    } else {
      // 遊客，必須手動填寫地址
      shippingAddress = { street, city, postalCode, country, phone };
    }
  } catch (err) {
    console.error(err);
    return res.redirect('/checkout'); // 出錯了，重試
  }

  // 將我們的購物車格式轉換為 Stripe 需要的格式
  const line_items = cart.map(item => {
    return {
      price_data: {
        currency: 'usd', // 貨幣
        product_data: {
          name: item.name,
          images: [item.imageUrl], // 圖片
        },
        unit_amount: Math.round(item.price * 100), // 價格 (以美分為單位)
      },
      quantity: item.quantity,
    };
  });

  // 將訂單的臨時數據儲存在 Session 中，以便在 'success' 頁面使用
  // 這是因為 Stripe Session 只會返回一個 ID，我們需要自己儲存訂單內容
  req.session.pendingOrderData = {
    customerEmail: emailToUse,
    items: cart,
    totalPrice: parseFloat(res.locals.initialTotalPrice),
    shippingAddress: shippingAddress,
    user: req.session.userId || null
  };

  // 創建 Stripe Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      customer_email: emailToUse,
      // 成功和取消的 URL
      success_url: `http://localhost:${port}/checkout/success?stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:${port}/checkout/cancel`,
    });

    // 3. 重定向到 Stripe 的付款頁面
    res.redirect(303, session.url);

  } catch (e) {
    console.error(e);
    res.redirect('/checkout');
  }
};

// 3. 付款成功頁面 (GET /checkout/success)
exports.getSuccessPage = async (req, res, next) => {
  const stripeSessionId = req.query.stripe_session_id;

  // 檢查是否有臨時訂單數據
  const pendingOrder = req.session.pendingOrderData;

  if (!stripeSessionId || !pendingOrder) {
    return res.redirect('/'); // 沒有 session ID 或臨時數據，跳轉回主頁
  }

  try {
    // 檢查這個 Stripe 訂單是否已經被處理過了（防止刷新頁面導致重複下單）
    const existingOrder = await Order.findOne({ stripeSessionId: stripeSessionId });
    if (existingOrder) {
      // 已經處理過了，直接顯示成功頁面，但不再發送郵件或清空購物車
      return res.render('checkout-success', { title: 'Order Confirmed' });
    }

    // --- 關鍵邏輯：這是第一次處理這個成功的訂單 ---

    // 1. 創建一個新訂單並儲存到我們的數據庫
    const newOrder = new Order({
      ...pendingOrder,
      stripeSessionId: stripeSessionId // 儲存 Stripe ID
    });
    await newOrder.save();
    
    // 2. 清空購物車
    req.session.cart = null; // 清空 cookie/session 中的購物車

    // 3. (可選) 清除臨時訂單數據
    req.session.pendingOrderData = null;

    // 4. 發送訂單確認郵件
    await emailService.sendOrderConfirmation(newOrder);

    // 5. 顯示成功頁面
    res.render('checkout-success', { title: 'Order Confirmed' });

  } catch (err) {
    next(err);
  }
};

// 4. 取消付款頁面 (GET /checkout/cancel)
exports.getCancelPage = (req, res) => {
  // (可選) 清除臨時訂單數據
  req.session.pendingOrderData = null;
  res.render('checkout-cancel', { title: 'Payment Canceled' });
};
