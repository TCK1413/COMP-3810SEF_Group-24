// services/emailService.js
// Send order confirmation email via Resend HTTP API instead of SMTP.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'Fashion Shop <no-reply@example.com>';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8099';

if (!RESEND_API_KEY) {
  console.warn(
    '[emailService] RESEND_API_KEY is not set. Order confirmation emails will not be sent.'
  );
}

/**
 * Build HTML for order confirmation email.
 * @param {object} order - Order mongoose document or plain object.
 * @param {string} orderLookupUrl - URL for customer to view/track their order.
 */
function buildOrderHtml(order, orderLookupUrl) {
  const itemsRows = order.items
    .map((item) => {
      const image = item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;border:1px solid #eee;margin-right:10px;" />`
        : '';

      const lineTotal = (item.price * item.quantity).toFixed(2);

      return `
        <tr>
          <td style="padding:8px 12px;vertical-align:top;">
            <div style="display:flex;align-items:center;">
              ${image}
              <div>
                <div style="font-weight:600;color:#111827;">${item.name}</div>
                <div style="font-size:12px;color:#6B7280;">Qty: ${
                  item.quantity
                } · $${item.price.toFixed(2)} each</div>
              </div>
            </div>
          </td>
          <td style="padding:8px 12px;text-align:right;font-weight:600;color:#111827;">
            $${lineTotal}
          </td>
        </tr>
      `;
    })
    .join('');

  const shipping = order.shippingAddress || {};
  const shippingAddressHtml = `
    <p style="margin:4px 0;">${shipping.street || ''}</p>
    <p style="margin:4px 0;">${shipping.city || ''}</p>
    <p style="margin:4px 0;">${shipping.postalCode || ''}</p>
    <p style="margin:4px 0;">${shipping.country || ''}</p>
    ${
      shipping.phone
        ? `<p style="margin:4px 0;">Phone: ${shipping.phone}</p>`
        : ''
    }
  `;

  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#F3F4F6;padding:24px 0;">
    <div style="max-width:640px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.12);">
      <div style="padding:24px 32px;border-bottom:1px solid #E5E7EB;">
        <h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">Thank you for your order!</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#6B7280;">
          Hi ${order.customerEmail || 'customer'}, your order has been received.
        </p>
        <p style="margin:4px 0 0;font-size:13px;color:#6B7280;">
          Order ID: <span style="font-family:monospace;">${order._id}</span>
        </p>
      </div>

      <div style="padding:24px 32px;">
        <h2 style="margin:0 0 12px;font-size:16px;font-weight:600;color:#111827;">Order summary</h2>
        <table style="width:100%;border-collapse:collapse;border-spacing:0;font-size:14px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 12px;color:#6B7280;font-weight:500;border-bottom:1px solid #E5E7EB;">Item</th>
              <th style="text-align:right;padding:8px 12px;color:#6B7280;font-weight:500;border-bottom:1px solid #E5E7EB;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding:12px 12px;text-align:right;font-weight:700;border-top:1px solid #E5E7EB;">Order total</td>
              <td style="padding:12px 12px;text-align:right;font-weight:700;border-top:1px solid #E5E7EB;">
                $${order.totalPrice.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:16px;">
          <div style="flex:1 1 220px;min-width:220px;">
            <h3 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Shipping address</h3>
            <div style="font-size:13px;color:#4B5563;line-height:1.5;">
              ${shippingAddressHtml}
            </div>
          </div>

          <div style="flex:1 1 220px;min-width:220px;">
            <h3 style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Track your order</h3>
            <p style="margin:0 0 12px;font-size:13px;color:#4B5563;">
              You can view your order status and details on the order tracking page.
            </p>
            <a href="${orderLookupUrl}"
               style="display:inline-block;padding:9px 16px;border-radius:999px;background:#111827;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;">
              View order
            </a>
          </div>
        </div>
      </div>

      <div style="padding:16px 32px;border-top:1px solid #E5E7EB;background:#F9FAFB;">
        <p style="margin:0;font-size:12px;color:#9CA3AF;">
          This is a demo store for a coursework project. No physical goods will be shipped.
        </p>
      </div>
    </div>
  </div>
  `;
}

/**
 * Send order confirmation using Resend HTTP API.
 * @param {object} order - Order mongoose document.
 */
async function sendOrderConfirmation(order) {
  if (!RESEND_API_KEY) {
    console.warn('[emailService] RESEND_API_KEY is not set, skip sending email.');
    return;
  }

  const orderLookupUrl = `${BASE_URL.replace(/\/+$/, '')}/orders/lookup`;

  const html = buildOrderHtml(order, orderLookupUrl);

  const payload = {
    from: EMAIL_FROM,
    to: order.customerEmail,
    subject: `Your order confirmation (#${order._id})`,
    html,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend API error ${response.status}: ${text}`);
  }
}

module.exports = {
  sendOrderConfirmation,
};

