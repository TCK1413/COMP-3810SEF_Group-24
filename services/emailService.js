// services/emailService.js
const nodemailer = require('nodemailer');

// 1. 創建 Nodemailer "Transporter" (發送器)
// 我們從 .env 檔案中讀取 Gmail 的登入憑證
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,       // 您的 Gmail
    pass: process.env.GMAIL_APP_PASSWORD // 您的 16 位應用程式密碼
  }
});

// 2. 創建一個函數來發送訂單確認郵件
exports.sendOrderConfirmation = async (order) => {
  if (!order || !order.customerEmail) {
    console.error('Invalid order data for email.');
    return;
  }

  // 創建郵件內容
  let itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name} (x${item.quantity})</td>
      <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"My Shopping Platform" <${process.env.GMAIL_USER}>`, // 發件人
    to: order.customerEmail, // 收件人 (遊客或用戶的 Email)
    subject: `Order Confirmed - #${order._id.toString().slice(-6)}`, // 主題
    html: `
      <h1>Thank you for your order!</h1>
      <p>Hi, your order has been confirmed.</p>
      <h3>Order Summary (ID: ${order._id.toString().slice(-6)})</h3>
      <table border="1" cellpadding="10" cellspacing="0" style="width: 100%;">
        <thead>
          <tr><th>Item</th><th>Price</th></tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td style="text-align: right;"><strong>Total:</strong></td>
            <td style="text-align: right;"><strong>$${order.totalPrice.toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
      <h4>Shipping to:</h4>
      <p>
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>
    `
  };

  // 3. 發送郵件
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${order.customerEmail}:`, error);
  }
};
