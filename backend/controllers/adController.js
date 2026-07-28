import mongoose from 'mongoose';
import Ad from '../models/Ad.js';
import { inMemoryStore } from '../config/inMemoryStore.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get active ads by placement
// @route   GET /api/ads
// @access  Public
export const getAds = async (req, res) => {
  const { placement, activeOnly } = req.query;

  if (!isDbConnected()) {
    const store = getStore(req);
    let ads = [...store.ads];
    if (placement && placement !== 'all') {
      ads = ads.filter((a) => a.placement === placement);
    }
    if (activeOnly !== 'false') {
      ads = ads.filter((a) => a.active === true);
    }
    return res.json(ads);
  }

  try {
    const query = {};
    if (placement && placement !== 'all') {
      query.placement = placement;
    }
    if (activeOnly !== 'false') {
      query.active = true;
    }
    const ads = await Ad.find(query).sort({ createdAt: -1 });
    return res.json(ads);
  } catch (error) {
    const store = getStore(req);
    let ads = [...store.ads];
    if (placement && placement !== 'all') {
      ads = ads.filter((a) => a.placement === placement);
    }
    if (activeOnly !== 'false') {
      ads = ads.filter((a) => a.active === true);
    }
    return res.json(ads);
  }
};

// @desc    Get ad by ID
// @route   GET /api/ads/:id
// @access  Public
export const getAdById = async (req, res) => {
  const { id } = req.params;

  if (!isDbConnected()) {
    const store = getStore(req);
    const ad = store.ads.find((a) => a._id === id);
    if (ad) return res.json(ad);
    return res.status(404).json({ message: 'Ad banner not found' });
  }

  try {
    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: 'Ad banner not found' });
    return res.json(ad);
  } catch (error) {
    const store = getStore(req);
    const ad = store.ads.find((a) => a._id === id);
    if (ad) return res.json(ad);
    return res.status(404).json({ message: 'Ad banner not found' });
  }
};

// @desc    Create ad banner
// @route   POST /api/ads
// @access  Private/Admin
export const createAd = async (req, res) => {
  const { title, image, targetLink, placement, active, startDate, endDate } = req.body;

  if (!title || !image || !targetLink) {
    return res.status(400).json({ message: 'Title, image, and targetLink are required' });
  }

  const newAd = {
    title,
    image,
    targetLink,
    placement: placement || 'header',
    active: active !== undefined ? active : true,
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: endDate ? new Date(endDate) : null,
  };

  if (!isDbConnected()) {
    const store = getStore(req);
    const created = {
      _id: 'ad-' + Date.now(),
      ...newAd,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.ads.unshift(created);
    return res.status(201).json(created);
  }

  try {
    const ad = await Ad.create(newAd);
    return res.status(201).json(ad);
  } catch (error) {
    const store = getStore(req);
    const created = {
      _id: 'ad-' + Date.now(),
      ...newAd,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.ads.unshift(created);
    return res.status(201).json(created);
  }
};

// @desc    Update ad banner
// @route   PUT /api/ads/:id
// @access  Private/Admin
export const updateAd = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  const index = store.ads.findIndex((a) => a._id === id || a._id?.toString() === id.toString());
  if (index !== -1) {
    store.ads[index] = {
      ...store.ads[index],
      ...req.body,
      updatedAt: new Date(),
    };
  }

  if (!isDbConnected()) {
    if (index !== -1) return res.json(store.ads[index]);
    return res.status(404).json({ message: 'Ad banner not found' });
  }

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const ad = await Ad.findById(id);
      if (ad) {
        Object.assign(ad, req.body);
        const updated = await ad.save();
        return res.json(updated);
      }
    }
    if (index !== -1) return res.json(store.ads[index]);
    return res.status(404).json({ message: 'Ad banner not found' });
  } catch (error) {
    if (index !== -1) return res.json(store.ads[index]);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete ad banner
// @route   DELETE /api/ads/:id
// @access  Private/Admin
export const deleteAd = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  if (store && store.ads) {
    store.ads = store.ads.filter(
      (a) => a._id !== id && a._id?.toString() !== id.toString()
    );
  }

  if (!isDbConnected()) {
    return res.json({ message: 'Ad banner deleted successfully' });
  }

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Ad.findByIdAndDelete(id);
    }
    return res.json({ message: 'Ad banner deleted successfully' });
  } catch (error) {
    return res.json({ message: 'Ad banner deleted successfully' });
  }
};

