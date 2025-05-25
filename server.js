const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle contact form submission
app.post('/api/contact', async (req, res) => {
  console.log('📨 Form submitted:', req.body); // Log form data

  const { name, email, phone, company, message } = req.body;

  // Create mail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email to yourself
  const internalMailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'New Control Systems Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nMessage: ${message}`,
  };

  // Confirmation email to user
  const confirmationMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting Control Systems Integrated',
    text: `Hi ${name},\n\nThank you for reaching out to us. We’ve received your message and will get back to you shortly.\n\nYour submission:\n- Name: ${name}\n- Phone: ${phone}\n- Company: ${company}\n- Message: ${message}\n\nBest regards,\nControl Systems Integrated`,
  };

  try {
    console.log('📧 Sending internal email...');
    await transporter.sendMail(internalMailOptions);
    console.log('✅ Internal email sent');

    console.log('📧 Sending confirmation email...');
    await transporter.sendMail(confirmationMailOptions);
    console.log('✅ Confirmation email sent');

    res.status(200).json({ message: 'Thanks! Your message has been sent and a confirmation email has been delivered.' });
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    res.status(500).json({ message: 'Failed to send emails. Please try again later.' });
  }
});

// Serve index.html for root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
