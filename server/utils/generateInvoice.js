// utils/generateInvoice.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order, user, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice_${order._id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text('INVOICE', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice ID: ${order._id}`);
  doc.text(`Customer: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  doc.text('Shipping Address:', { underline: true });
  const a = order.shippingAddress;
  doc.text(`${a.fullName}, ${a.street}, ${a.city}, ${a.state} - ${a.pincode}, ${a.country}`);
  doc.moveDown();

  doc.text('Order Items:', { underline: true });
  order.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.product.name} - ₹${item.product.price} × ${item.quantity}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Price: ₹${order.totalPrice}`, { bold: true });
  doc.end();
};

module.exports = generateInvoice;
