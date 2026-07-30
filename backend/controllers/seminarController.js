import mongoose from 'mongoose';
import Seminar from '../models/Seminar.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { notifySubscribersNewScholarship } from './subscriberController.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all seminars
// @route   GET /api/seminars
// @access  Public
export const getSeminars = async (req, res) => {
  const { degreeLevel, country, category, fundingType, search, status } = req.query;

  if (!isDbConnected()) {
    const store = getStore(req);
    let items = (store.seminars || store.scholarships.filter(s => s.opportunityType === 'seminar')) || [];

    if (degreeLevel && degreeLevel !== 'All') {
      items = items.filter((s) => s.degreeLevel.toUpperCase().includes(degreeLevel.toUpperCase()));
    }
    if (country && country !== 'All') {
      items = items.filter((s) => s.country.toLowerCase() === country.toLowerCase());
    }
    if (category && category !== 'All') {
      items = items.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (fundingType && fundingType !== 'All') {
      items = items.filter((s) => s.fundingType.toLowerCase() === fundingType.toLowerCase());
    }
    if (status && status !== 'All') {
      items = items.filter((s) => s.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      );
    }
    return res.json(items);
  }

  try {
    const query = {};
    if (degreeLevel && degreeLevel !== 'All') {
      query.degreeLevel = new RegExp(degreeLevel, 'i');
    }
    if (country && country !== 'All') {
      query.country = new RegExp(`^${country}$`, 'i');
    }
    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }
    if (fundingType && fundingType !== 'All') {
      query.fundingType = fundingType;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Seminar.find(query).sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    const store = getStore(req);
    return res.json(store.seminars || []);
  }
};

// @desc    Get single seminar by ID
// @route   GET /api/seminars/:id
// @access  Public
export const getSeminarById = async (req, res) => {
  const { id } = req.params;

  if (!isDbConnected()) {
    const store = getStore(req);
    const item = (store.seminars || []).find((s) => s._id === id || s._id?.toString() === id.toString());
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Seminar not found' });
  }

  try {
    const item = await Seminar.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Seminar not found' });
    }
    return res.json(item);
  } catch (error) {
    const store = getStore(req);
    const item = (store.seminars || []).find((s) => s._id === id || s._id?.toString() === id.toString());
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Seminar not found' });
  }
};

// @desc    Create a seminar
// @route   POST /api/seminars
// @access  Private/Admin
export const createSeminar = async (req, res) => {
  const {
    title,
    description,
    eventOrganizer,
    hostUniversity,
    degreeLevel,
    country,
    category,
    fundingType,
    financialCoverage,
    eligibilityCriteria,
    requiredDocuments,
    applicationFee,
    deadline,
    officialLink,
    applyLink,
    image,
    status,
  } = req.body;

  if (!title || !description || !country || !category || !deadline) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const newSeminar = {
    opportunityType: 'seminar',
    title,
    description,
    eventOrganizer: eventOrganizer || hostUniversity || 'World Youth Forum',
    hostUniversity: hostUniversity || eventOrganizer || 'Global Venue',
    degreeLevel: degreeLevel || 'All Levels',
    country,
    category,
    fundingType: fundingType || 'Fully Funded',
    financialCoverage: financialCoverage || 'Airfare + 5-Star Hotel Stay + All Meals + Delegate Pass',
    eligibilityCriteria: eligibilityCriteria || 'Open to international youth delegates meeting criteria.',
    requiredDocuments: requiredDocuments || 'Application Form, Passport Copy, Photo, Essay',
    applicationFee: applicationFee || 'Free / No Fee',
    deadline: new Date(deadline),
    officialLink: officialLink || 'https://example.com/seminar',
    applyLink: applyLink || officialLink || 'https://example.com/apply',
    image: image || '/uploads/wyf-egypt.svg',
    status: status || 'open',
  };

  const store = getStore(req);

  if (!isDbConnected()) {
    const created = {
      _id: 'sem-' + Date.now(),
      ...newSeminar,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store) {
      if (!store.seminars) store.seminars = [];
      store.seminars.unshift(created);
    }
    await notifySubscribersNewScholarship(req, created);
    return res.status(201).json(created);
  }

  try {
    const createdDoc = await Seminar.create({
      _id: 'sem-' + Date.now(),
      ...newSeminar,
    });
    const createdObj = createdDoc.toObject ? createdDoc.toObject() : createdDoc;
    if (store) {
      if (!store.seminars) store.seminars = [];
      store.seminars.unshift(createdObj);
    }
    await notifySubscribersNewScholarship(req, createdDoc);
    return res.status(201).json(createdDoc);
  } catch (error) {
    console.error('MongoDB create error for seminar:', error.message);
    const created = {
      _id: 'sem-' + Date.now(),
      ...newSeminar,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store) {
      if (!store.seminars) store.seminars = [];
      store.seminars.unshift(created);
    }
    return res.status(201).json(created);
  }
};

// @desc    Update a seminar
// @route   PUT /api/seminars/:id
// @access  Private/Admin
export const updateSeminar = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  const updateFields = { ...req.body };
  if (updateFields.deadline) {
    updateFields.deadline = new Date(updateFields.deadline);
  }

  if (store && store.seminars) {
    const index = store.seminars.findIndex(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (index !== -1) {
      store.seminars[index] = {
        ...store.seminars[index],
        ...updateFields,
        updatedAt: new Date(),
      };
    }
  }

  if (!isDbConnected()) {
    const item = store?.seminars?.find(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Seminar not found' });
  }

  try {
    let item = await Seminar.findById(id);
    if (!item) item = await Seminar.findOne({ _id: id });

    if (item) {
      Object.assign(item, updateFields);
      const updated = await item.save();
      return res.json(updated);
    }

    const memoryItem = store?.seminars?.find((s) => s._id === id);
    if (memoryItem) return res.json(memoryItem);
    return res.status(404).json({ message: 'Seminar not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a seminar
// @route   DELETE /api/seminars/:id
// @access  Private/Admin
export const deleteSeminar = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  if (store && store.seminars) {
    store.seminars = store.seminars.filter(
      (s) => s._id !== id && s._id?.toString() !== id.toString()
    );
  }

  if (isDbConnected()) {
    try {
      await Seminar.findByIdAndDelete(id);
      await Seminar.deleteOne({ _id: id });
    } catch (error) {
      console.warn('MongoDB delete notice:', error.message);
    }
  }

  return res.json({ message: 'Seminar deleted successfully', id });
};
