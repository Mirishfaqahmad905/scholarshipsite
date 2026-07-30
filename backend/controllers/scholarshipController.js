import mongoose from 'mongoose';
import Scholarship from '../models/Scholarship.js';
import Category from '../models/Category.js';
import Country from '../models/Country.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { notifySubscribersNewScholarship } from './subscriberController.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Fetch all scholarships with filters
// @route   GET /api/scholarships
// @access  Public
export const getScholarships = async (req, res) => {
  const { degreeLevel, country, category, fundingType, search, status, opportunityType, type } = req.query;
  const targetType = opportunityType || type;

  // In-memory store fallback when DB is disconnected
  if (!isDbConnected()) {
    const store = getStore(req);
    let scholarships = [...store.scholarships];

    if (targetType && targetType !== 'All') {
      scholarships = scholarships.filter(
        (s) => (s.opportunityType || 'scholarship').toLowerCase() === targetType.toLowerCase()
      );
    }
    if (degreeLevel && degreeLevel !== 'All') {
      scholarships = scholarships.filter(
        (s) => s.degreeLevel.toUpperCase() === degreeLevel.toUpperCase()
      );
    }
    if (country && country !== 'All') {
      scholarships = scholarships.filter(
        (s) => s.country.toLowerCase() === country.toLowerCase()
      );
    }
    if (category && category !== 'All') {
      scholarships = scholarships.filter(
        (s) => s.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (fundingType && fundingType !== 'All') {
      scholarships = scholarships.filter(
        (s) => s.fundingType.toLowerCase() === fundingType.toLowerCase()
      );
    }
    if (status && status !== 'All') {
      scholarships = scholarships.filter(
        (s) => s.status.toLowerCase() === status.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase();
      scholarships = scholarships.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      );
    }

    return res.json(scholarships);
  }

  try {
    const query = {};

    if (targetType && targetType !== 'All') {
      query.opportunityType = targetType.toLowerCase();
    }
    if (degreeLevel && degreeLevel !== 'All') {
      query.degreeLevel = degreeLevel;
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

    const scholarships = await Scholarship.find(query).sort({ createdAt: -1 });
    return res.json(scholarships);
  } catch (error) {
    const store = getStore(req);
    return res.json(store.scholarships);
  }
};

// @desc    Get single scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
export const getScholarshipById = async (req, res) => {
  const { id } = req.params;

  if (!isDbConnected()) {
    const store = getStore(req);
    const item = store.scholarships.find((s) => s._id === id);
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Scholarship not found' });
  }

  try {
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    return res.json(scholarship);
  } catch (error) {
    const store = getStore(req);
    const item = store.scholarships.find((s) => s._id === id);
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Scholarship not found' });
  }
};

// @desc    Create a scholarship
// @route   POST /api/scholarships
// @access  Private/Admin
export const createScholarship = async (req, res) => {
  const {
    opportunityType,
    title,
    description,
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

  const newScholarship = {
    opportunityType: opportunityType || 'scholarship',
    title,
    description,
    hostUniversity: hostUniversity || 'Top Universities & Institutions',
    degreeLevel: degreeLevel || 'All Levels',
    country,
    category,
    fundingType: fundingType || 'Full',
    financialCoverage: financialCoverage || 'Full Tuition + Monthly Stipend + Accommodation + Health Insurance',
    eligibilityCriteria: eligibilityCriteria || 'Open to eligible international candidates meeting academic standards.',
    requiredDocuments: requiredDocuments || 'Passport, Transcripts, Study Plan, Recommendation Letters',
    applicationFee: applicationFee || 'Free / No Application Fee',
    deadline: new Date(deadline),
    officialLink: officialLink || 'https://example.com/scholarship',
    applyLink: applyLink || officialLink || 'https://example.com/apply',
    image: image || '/uploads/default-scholarship.jpg',
    status: status || 'open',
  };

  const store = getStore(req);

  if (!isDbConnected()) {
    const created = {
      _id: 'sch-' + Date.now(),
      ...newScholarship,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store && store.scholarships) {
      store.scholarships.unshift(created);
    }
    await notifySubscribersNewScholarship(req, created);
    return res.status(201).json(created);
  }

  try {
    const scholarship = await Scholarship.create({
      _id: 'sch-' + Date.now(),
      ...newScholarship,
    });
    const createdObj = scholarship.toObject ? scholarship.toObject() : scholarship;
    if (store && store.scholarships) {
      store.scholarships.unshift(createdObj);
    }
    await notifySubscribersNewScholarship(req, scholarship);
    return res.status(201).json(scholarship);
  } catch (error) {
    console.error('MongoDB create error, using memory fallback:', error.message);
    const created = {
      _id: 'sch-' + Date.now(),
      ...newScholarship,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store && store.scholarships) {
      store.scholarships.unshift(created);
    }
    await notifySubscribersNewScholarship(req, created);
    return res.status(201).json(created);
  }
};

// @desc    Update a scholarship
// @route   PUT /api/scholarships/:id
// @access  Private/Admin
export const updateScholarship = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  const updateFields = { ...req.body };
  if (updateFields.deadline) {
    updateFields.deadline = new Date(updateFields.deadline);
  }

  // Sync in-memory store
  if (store && store.scholarships) {
    const index = store.scholarships.findIndex(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (index !== -1) {
      store.scholarships[index] = {
        ...store.scholarships[index],
        ...updateFields,
        updatedAt: new Date(),
      };
    }
  }

  if (!isDbConnected()) {
    const item = store?.scholarships?.find(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Scholarship not found' });
  }

  try {
    let scholarship = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      scholarship = await Scholarship.findById(id);
    }
    if (!scholarship) {
      scholarship = await Scholarship.findOne({ _id: id });
    }

    if (scholarship) {
      Object.assign(scholarship, updateFields);
      const updated = await scholarship.save();
      return res.json(updated);
    }

    const item = store?.scholarships?.find(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Scholarship not found' });
  } catch (error) {
    const item = store?.scholarships?.find(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (item) return res.json(item);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private/Admin
export const deleteScholarship = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  // 1. Permanently remove from in-memory store
  if (store && store.scholarships) {
    store.scholarships = store.scholarships.filter(
      (s) => s._id !== id && s._id?.toString() !== id.toString()
    );
  }

  // 2. Permanently delete from MongoDB if connected
  if (isDbConnected()) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Scholarship.findByIdAndDelete(id);
      }
      await Scholarship.deleteOne({ _id: id });
    } catch (error) {
      console.warn('MongoDB delete notice:', error.message);
    }
  }

  return res.json({ message: 'Scholarship deleted successfully', id });
};

// @desc    Get Categories and Countries list
// @route   GET /api/scholarships/meta/options
// @access  Public
export const getScholarshipMeta = async (req, res) => {
  if (!isDbConnected()) {
    const store = getStore(req);
    const categories = store.categories;
    const countries = store.countries;
    return res.json({ categories, countries });
  }

  try {
    const categories = await Category.find().sort({ name: 1 });
    const countries = await Country.find().sort({ name: 1 });
    return res.json({ categories, countries });
  } catch (error) {
    const store = getStore(req);
    return res.json({ categories: store.categories, countries: store.countries });
  }
};

