import express from 'express';
import mongoose from 'mongoose';
import Setting from '../models/Setting.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { inMemoryStore } from '../config/inMemoryStore.js';

const router = express.Router();

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get site settings & social links
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      let setting = await Setting.findOne();
      if (!setting) {
        setting = await Setting.create({
          siteName: 'Global Scholarship Portal',
          siteLink: 'https://scholarship-portal.vercel.app',
          siteLogoUrl: '',
          contactEmail: 'techhub905@gmail.com',
          whatsapp: '+1234567890',
          whatsappMessage: 'Hello! I need scholarship assistance.',
          github: 'https://github.com/techhub905',
          snapchat: 'https://snapchat.com',
          instagram: 'https://instagram.com',
          telegram: 'https://t.me',
          facebook: 'https://facebook.com',
          twitter: 'https://x.com',
          linkedin: 'https://linkedin.com',
          youtube: 'https://youtube.com',
          googleAdSensePublisherId: '',
          googleAutoAdsEnabled: true,
          headerAdScript: '',
          customLinks: [],
        });
      }
      return res.json(setting);
    }
  } catch (err) {
    console.warn('MongoDB query notice for settings, fallback to in-memory store:', err.message);
  }

  const store = getStore(req);
  if (!store.settings) {
    store.settings = {
      _id: 'settings-global-1',
      siteName: 'Global Scholarship Portal',
      siteLink: 'https://scholarship-portal.vercel.app',
      siteLogoUrl: '',
      contactEmail: 'techhub905@gmail.com',
      whatsapp: '+1234567890',
      whatsappMessage: 'Hello! I need scholarship assistance.',
      github: 'https://github.com/techhub905',
      snapchat: 'https://snapchat.com',
      instagram: 'https://instagram.com',
      telegram: 'https://t.me',
      facebook: 'https://facebook.com',
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
      googleAdSensePublisherId: '',
      googleAutoAdsEnabled: true,
      headerAdScript: '',
      customLinks: [],
      updatedAt: new Date(),
    };
  }
  return res.json(store.settings);
});

// @desc    Update site settings & social links
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  const {
    siteName,
    siteLink,
    siteLogoUrl,
    contactEmail,
    whatsapp,
    whatsappMessage,
    github,
    snapchat,
    instagram,
    telegram,
    facebook,
    twitter,
    linkedin,
    youtube,
    googleAdSensePublisherId,
    googleAutoAdsEnabled,
    headerAdScript,
    customLinks,
  } = req.body;

  const updateData = {
    siteName: siteName || 'Global Scholarship Portal',
    siteLink: siteLink || 'https://scholarship-portal.vercel.app',
    siteLogoUrl: siteLogoUrl !== undefined ? siteLogoUrl : '',
    contactEmail: contactEmail || '',
    whatsapp: whatsapp || '',
    whatsappMessage: whatsappMessage || 'Hello! I need scholarship assistance.',
    github: github || '',
    snapchat: snapchat || '',
    instagram: instagram || '',
    telegram: telegram || '',
    facebook: facebook || '',
    twitter: twitter || '',
    linkedin: linkedin || '',
    youtube: youtube || '',
    googleAdSensePublisherId: googleAdSensePublisherId !== undefined ? googleAdSensePublisherId : '',
    googleAutoAdsEnabled: googleAutoAdsEnabled !== undefined ? Boolean(googleAutoAdsEnabled) : true,
    headerAdScript: headerAdScript !== undefined ? headerAdScript : '',
    customLinks: Array.isArray(customLinks) ? customLinks : [],
    updatedAt: new Date(),
  };

  try {
    if (isDbConnected()) {
      let setting = await Setting.findOne();
      if (setting) {
        Object.assign(setting, updateData);
        await setting.save();
      } else {
        setting = await Setting.create(updateData);
      }

      // Also keep store synced
      const store = getStore(req);
      store.settings = { ...setting.toObject() };

      return res.json({ message: 'Social links and site settings updated successfully', settings: setting });
    }
  } catch (err) {
    console.warn('MongoDB update notice for settings, updating in-memory store:', err.message);
  }

  const store = getStore(req);
  store.settings = {
    _id: store.settings?._id || 'settings-global-1',
    ...updateData,
  };

  return res.json({
    message: 'Social links and site settings updated successfully',
    settings: store.settings,
  });
});

export default router;
