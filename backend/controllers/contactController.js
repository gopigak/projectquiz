const Contact = require('../models/Contact');
const { getIsConnected } = require('../config/db');
const mockDb = require('../data/mockDb');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Submit a contact inquiry
 * @route   POST /api/contact
 * @access  Public
 */
const submitContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Manual backend validations
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: 'All contact fields are required.' });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // Basic phone validation check (digits and space/hyphen/brackets)
  const phoneRegex = /^[+]?[0-9\s()+-]{7,20}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Please provide a valid phone number.' });
  }

  try {
    let newMessage;

    if (!getIsConnected()) {
      newMessage = {
        _id: 'mock-contact-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone,
        subject,
        message,
        createdAt: new Date()
      };
      mockDb.contacts.push(newMessage);
    } else {
      newMessage = await Contact.create({
        name,
        email,
        phone,
        subject,
        message
      });
    }

    // Try sending email notification
    try {
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px;">
          <h2 style="color: #4f46e5;">New Contact Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f8fafc; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${message}</p>
        </div>
      `;

      await sendEmail({
        email: 'support@eduquiz.com', // Admin support email destination
        subject: `Contact Inquiry: ${subject}`,
        message: `New message from ${name} (${email}): ${message}`,
        html: emailHtml
      });
    } catch (mailErr) {
      console.warn('Nodemailer contact dispatch skipped or failed:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been successfully received!',
      data: newMessage
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContactMessage };
