import ContactInquiry from '../models/ContactInquiry.js';
import mongoose from 'mongoose';

const isDbConnected = () => mongoose.connection.readyState === 1;

const getStore = (req) => {
  if (req.app && req.app.locals && req.app.locals.inMemoryStore) {
    return req.app.locals.inMemoryStore;
  }
  const globalStore = global.inMemoryStore;
  if (globalStore) return globalStore;
  throw new Error('Memory store unavailable');
};

// @desc    Submit a new contact / scholarship inquiry
// @route   POST /api/contact
// @access  Public
export const submitContactInquiry = async (req, res) => {
  const { name, email, phone, subject, message, inquiryType } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email address, and message.' });
  }

  const newInquiry = {
    _id: 'inq-' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : '',
    subject: subject ? subject.trim() : 'Scholarship Inquiry',
    inquiryType: inquiryType || 'General Inquiry',
    message: message.trim(),
    status: 'pending',
    createdAt: new Date(),
  };

  if (!isDbConnected()) {
    const store = getStore(req);
    if (!store.contactInquiries) {
      store.contactInquiries = [];
    }
    store.contactInquiries.unshift(newInquiry);

    return res.status(201).json({
      message: 'Thank you! Your inquiry has been saved and forwarded to Mir Ishfaq Ahmad.',
      inquiry: newInquiry,
    });
  }

  try {
    const inquiry = await ContactInquiry.create({
      name: newInquiry.name,
      email: newInquiry.email,
      phone: newInquiry.phone,
      subject: newInquiry.subject,
      inquiryType: newInquiry.inquiryType,
      message: newInquiry.message,
    });

    return res.status(201).json({
      message: 'Thank you! Your inquiry has been saved and forwarded to Mir Ishfaq Ahmad.',
      inquiry,
    });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    return res.status(500).json({ message: 'Error processing inquiry', error: error.message });
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
export const getContactInquiries = async (req, res) => {
  if (!isDbConnected()) {
    const store = getStore(req);
    return res.json(store.contactInquiries || []);
  }

  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    return res.json(inquiries);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
};
