// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

exports.sendOrderConfirmation = async (order) => {
  if (!order || !order.customerEmail) return;

  const orderLookupUrl = `http://localhost:8099/orders/lookup`;

  const itemListHTML = order.items
    .map(
      (item) => `
      <tr style="border-bottom:1px solid #eee;">
        <td style="padding:10px 0;">
          <img src="${item.imageUrl || '/images/placeholder.png'}" 
               alt="${item.name}" 
               style="width:80px;height:80px;object-fit:cover;border-radius:8px;margin-right:10px;">
        </td>
        <td style="padding:10px 0;">
          <div style="font-weight:600;color:#333;">${item.name}</div>
          <div style="color:#555;">Quantity: ${item.quantity}</div>
          <div style="color:#555;">Price: $${item.price.toFixed(2)}</div>
        </td>
      </tr>
    `
    )
    .join('');

  const html = `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f9f9f9;padding:30px;">
    <div style="max-width:700px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      <div style="background-color:#007bff;color:#fff;padding:20px 30px;">
        <h2 style="margin:0;">Order Confirmation</h2>
        <p style="margin:0;font-size:14px;">Thank you for shopping with us!</p>
      </div>

      <div style="padding:30px;">
        <h3 style="margin-top:0;">Hello ${order.customerEmail.split('@')[0]},</h3>
        <p>We’ve received your order and it’s now being processed.</p>

        <h4 style="margin-top:25px;">🛍️ Order Details</h4>
        <table style="width:100%;border-collapse:collapse;">${itemListHTML}</table>

        <div style="margin-top:20px;font-size:16px;font-weight:bold;">
          Total: $${order.totalPrice.toFixed(2)}
        </div>

        <h4 style="margin-top:30px;">🚚 Shipping Address</h4>
        <p style="color:#555;">
          ${order.shippingAddress.street}, ${order.shippingAddress.city}<br/>
          ${order.shippingAddress.country}, ${order.shippingAddress.postalCode}<br/>
          Phone: ${order.shippingAddress.phone}
        </p>

        <div style="margin-top:30px;">
          <a href="${orderLookupUrl}" 
             style="background-color:#007bff;color:#fff;padding:12px 22px;
                    text-decoration:none;border-radius:6px;font-weight:600;">
            View Order Status
          </a>
        </div>

        <p style="margin-top:25px;color:#555;">
          You can view your full order status and delivery updates by clicking the button above.
        </p>
      </div>

      <div style="background:#f0f0f0;text-align:center;padding:15px;font-size:12px;color:#777;">
        This is an automated email. Please do not reply.<br/>
        &copy; ${new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </div>
  </div>
  `;

  const mailOptions = {
    from: `"MyStore" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Your Order Confirmation - #${order._id}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${order.customerEmail}`);
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
  }
};

