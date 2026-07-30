import mongoose from 'mongoose';
import Fellowship from '../models/Fellowship.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { notifySubscribersNewScholarship } from './subscriberController.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all fellowships
// @route   GET /api/fellowships
// @access  Public
export const getFellowships = async (req, res) => {
  const { degreeLevel, country, category, fundingType, search, status } = req.query;

  if (!isDbConnected()) {
    const store = getStore(req);
    let items = (store.fellowships || store.scholarships.filter(s => s.opportunityType === 'fellowship')) || [];

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

    const items = await Fellowship.find(query).sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    const store = getStore(req);
    return res.json(store.fellowships || []);
  }
};

// @desc    Get single fellowship by ID
// @route   GET /api/fellowships/:id
// @access  Public
export const getFellowshipById = async (req, res) => {
  const { id } = req.params;

  if (!isDbConnected()) {
    const store = getStore(req);
    const item = (store.fellowships || []).find((s) => s._id === id || s._id?.toString() === id.toString());
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Fellowship not found' });
  }

  try {
    const item = await Fellowship.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Fellowship not found' });
    }
    return res.json(item);
  } catch (error) {
    const store = getStore(req);
    const item = (store.fellowships || []).find((s) => s._id === id || s._id?.toString() === id.toString());
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Fellowship not found' });
  }
};

// @desc    Create a fellowship
// @route   POST /api/fellowships
// @access  Private/Admin
export const createFellowship = async (req, res) => {
  const {
    title,
    description,
    foundationOrInst,
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

  const newFellowship = {
    opportunityType: 'fellowship',
    title,
    description,
    foundationOrInst: foundationOrInst || hostUniversity || 'Rotary Foundation / Institute',
    hostUniversity: hostUniversity || foundationOrInst || 'Global University',
    degreeLevel: degreeLevel || 'MS / PhD / PostDoc',
    country,
    category,
    fundingType: fundingType || 'Full',
    financialCoverage: financialCoverage || 'Full Research Stipend + Airfare + Accommodation + Medical Insurance',
    eligibilityCriteria: eligibilityCriteria || 'Open to fellows meeting eligibility qualifications.',
    requiredDocuments: requiredDocuments || 'Research Proposal, CV, Transcripts, Recommendation Letters',
    applicationFee: applicationFee || 'Free / No Application Fee',
    deadline: new Date(deadline),
    officialLink: officialLink || 'https://example.com/fellowship',
    applyLink: applyLink || officialLink || 'https://example.com/apply',
    image: image || '/uploads/rotary-peace.svg',
    status: status || 'open',
  };

  const store = getStore(req);

  if (!isDbConnected()) {
    const created = {
      _id: 'fel-' + Date.now(),
      ...newFellowship,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store) {
      if (!store.fellowships) store.fellowships = [];
      store.fellowships.unshift(created);
    }
    await notifySubscribersNewScholarship(req, created);
    return res.status(201).json(created);
  }

  try {
    const createdDoc = await Fellowship.create({
      _id: 'fel-' + Date.now(),
      ...newFellowship,
    });
    const createdObj = createdDoc.toObject ? createdDoc.toObject() : createdDoc;
    if (store) {
      if (!store.fellowships) store.fellowships = [];
      store.fellowships.unshift(createdObj);
    }
    await notifySubscribersNewScholarship(req, createdDoc);
    return res.status(201).json(createdDoc);
  } catch (error) {
    console.error('MongoDB create error for fellowship:', error.message);
    const created = {
      _id: 'fel-' + Date.now(),
      ...newFellowship,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store) {
      if (!store.fellowships) store.fellowships = [];
      store.fellowships.unshift(created);
    }
    return res.status(201).json(created);
  }
};

// @desc    Update a fellowship
// @route   PUT /api/fellowships/:id
// @access  Private/Admin
export const updateFellowship = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  const updateFields = { ...req.body };
  if (updateFields.deadline) {
    updateFields.deadline = new Date(updateFields.deadline);
  }

  if (store && store.fellowships) {
    const index = store.fellowships.findIndex(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (index !== -1) {
      store.fellowships[index] = {
        ...store.fellowships[index],
        ...updateFields,
        updatedAt: new Date(),
      };
    }
  }

  if (!isDbConnected()) {
    const item = store?.fellowships?.find(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Fellowship not found' });
  }

  try {
    let item = await Fellowship.findById(id);
    if (!item) item = await Fellowship.findOne({ _id: id });

    if (item) {
      Object.assign(item, updateFields);
      const updated = await item.save();
      return res.json(updated);
    }

    const memoryItem = store?.fellowships?.find((s) => s._id === id);
    if (memoryItem) return res.json(memoryItem);
    return res.status(404).json({ message: 'Fellowship not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a fellowship
// @route   DELETE /api/fellowships/:id
// @access  Private/Admin
export const deleteFellowship = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  if (store && store.fellowships) {
    store.fellowships = store.fellowships.filter(
      (s) => s._id !== id && s._id?.toString() !== id.toString()
    );
  }

  if (isDbConnected()) {
    try {
      await Fellowship.findByIdAndDelete(id);
      await Fellowship.deleteOne({ _id: id });
    } catch (error) {
      console.warn('MongoDB delete notice:', error.message);
    }
  }

  return res.json({ message: 'Fellowship deleted successfully', id });
};
