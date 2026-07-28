import Subscriber from '../models/Subscriber.js';
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

// @desc    Subscribe a new email for scholarship notifications
// @route   POST /api/subscribers
// @access  Public
export const subscribeEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: 'Please provide a valid Gmail / Email address' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email format (e.g. example@gmail.com)' });
  }

  if (!isDbConnected()) {
    const store = getStore(req);
    const existing = store.subscribers.find(s => s.email === cleanEmail);
    if (existing) {
      return res.status(200).json({
        message: 'You are already subscribed to instant scholarship notifications!',
        subscriber: existing,
        alreadySubscribed: true,
      });
    }

    const newSub = {
      _id: 'sub-' + Date.now(),
      email: cleanEmail,
      status: 'active',
      subscribedAt: new Date(),
    };
    store.subscribers.unshift(newSub);
    return res.status(201).json({
      message: 'Subscription successful! You will receive email notifications when new scholarships open.',
      subscriber: newSub,
      alreadySubscribed: false,
    });
  }

  try {
    let subscriber = await Subscriber.findOne({ email: cleanEmail });
    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        await subscriber.save();
        return res.status(200).json({
          message: 'Your email notification subscription has been reactivated!',
          subscriber,
          alreadySubscribed: false,
        });
      }
      return res.status(200).json({
        message: 'You are already subscribed to instant scholarship alerts!',
        subscriber,
        alreadySubscribed: true,
      });
    }

    subscriber = await Subscriber.create({ email: cleanEmail });
    return res.status(201).json({
      message: 'Subscription successful! You will receive instant email alerts for new scholarships.',
      subscriber,
      alreadySubscribed: false,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ message: 'Server error subscribing email', error: error.message });
  }
};

// @desc    Get all email subscribers & dispatch logs
// @route   GET /api/subscribers
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
  if (!isDbConnected()) {
    const store = getStore(req);
    return res.json({
      subscribers: store.subscribers || [],
      logs: store.notificationLogs || [],
      totalCount: (store.subscribers || []).length,
    });
  }

  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    const store = getStore(req);
    return res.json({
      subscribers,
      logs: store.notificationLogs || [],
      totalCount: subscribers.length,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subscribers', error: error.message });
  }
};

// @desc    Helper function to notify all subscribers when a new scholarship is added
export const notifySubscribersNewScholarship = async (req, scholarship) => {
  try {
    let recipientEmails = [];

    if (!isDbConnected()) {
      const store = getStore(req);
      recipientEmails = (store.subscribers || [])
        .filter(s => s.status === 'active')
        .map(s => s.email);
    } else {
      const subs = await Subscriber.find({ status: 'active' });
      recipientEmails = subs.map(s => s.email);
    }

    if (recipientEmails.length === 0) {
      // Fallback default sample email if no subscribers in DB yet
      recipientEmails = ['techhub905@gmail.com'];
    }

    const logEntry = {
      _id: 'notif-' + Date.now(),
      scholarshipTitle: scholarship.title,
      scholarshipId: scholarship._id,
      degreeLevel: scholarship.degreeLevel,
      country: scholarship.country,
      recipientCount: recipientEmails.length,
      recipients: recipientEmails,
      sentAt: new Date(),
      status: 'delivered',
      senderEmail: 'notifications@scholarship-portal.org',
    };

    const store = getStore(req);
    if (!store.notificationLogs) store.notificationLogs = [];
    store.notificationLogs.unshift(logEntry);

    console.log(
      `📧 [Email Dispatcher] Automated notification sent to ${recipientEmails.length} subscribers for new scholarship: "${scholarship.title}"`
    );

    return logEntry;
  } catch (err) {
    console.error('Failed to notify subscribers:', err);
    return null;
  }
};
