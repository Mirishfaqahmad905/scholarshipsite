import mongoose from 'mongoose';
import Internship from '../models/Internship.js';
import { inMemoryStore } from '../config/inMemoryStore.js';
import { notifySubscribersNewScholarship } from './subscriberController.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
export const getInternships = async (req, res) => {
  const { degreeLevel, country, category, fundingType, search, status } = req.query;

  if (!isDbConnected()) {
    const store = getStore(req);
    let items = (store.internships || store.scholarships.filter(s => s.opportunityType === 'internship')) || [];

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

    const items = await Internship.find(query).sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    const store = getStore(req);
    return res.json(store.internships || []);
  }
};

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public
export const getInternshipById = async (req, res) => {
  const { id } = req.params;

  if (!isDbConnected()) {
    const store = getStore(req);
    const item = (store.internships || []).find((s) => s._id === id || s._id?.toString() === id.toString());
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Internship not found' });
  }

  try {
    const item = await Internship.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    return res.json(item);
  } catch (error) {
    const store = getStore(req);
    const item = (store.internships || []).find((s) => s._id === id || s._id?.toString() === id.toString());
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Internship not found' });
  }
};

// @desc    Create an internship
// @route   POST /api/internships
// @access  Private/Admin
export const createInternship = async (req, res) => {
  const {
    title,
    description,
    companyOrOrg,
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

  const newInternship = {
    opportunityType: 'internship',
    title,
    description,
    companyOrOrg: companyOrOrg || hostUniversity || 'CERN / Global Org',
    hostUniversity: hostUniversity || companyOrOrg || 'Global Institute',
    degreeLevel: degreeLevel || 'BS / MS',
    country,
    category,
    fundingType: fundingType || 'Fully Funded',
    financialCoverage: financialCoverage || 'Stipend + Accommodation Allowance + Travel Grant',
    eligibilityCriteria: eligibilityCriteria || 'Open to candidates meeting minimum eligibility.',
    requiredDocuments: requiredDocuments || 'CV, Transcripts, Cover Letter',
    applicationFee: applicationFee || 'Free / No Fee',
    deadline: new Date(deadline),
    officialLink: officialLink || 'https://example.com/internship',
    applyLink: applyLink || officialLink || 'https://example.com/apply',
    image: image || '/uploads/cern-switzerland.svg',
    status: status || 'open',
  };

  const store = getStore(req);

  if (!isDbConnected()) {
    const created = {
      _id: 'int-' + Date.now(),
      ...newInternship,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store) {
      if (!store.internships) store.internships = [];
      store.internships.unshift(created);
    }
    await notifySubscribersNewScholarship(req, created);
    return res.status(201).json(created);
  }

  try {
    const createdDoc = await Internship.create({
      _id: 'int-' + Date.now(),
      ...newInternship,
    });
    const createdObj = createdDoc.toObject ? createdDoc.toObject() : createdDoc;
    if (store) {
      if (!store.internships) store.internships = [];
      store.internships.unshift(createdObj);
    }
    await notifySubscribersNewScholarship(req, createdDoc);
    return res.status(201).json(createdDoc);
  } catch (error) {
    console.error('MongoDB create error for internship:', error.message);
    const created = {
      _id: 'int-' + Date.now(),
      ...newInternship,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (store) {
      if (!store.internships) store.internships = [];
      store.internships.unshift(created);
    }
    return res.status(201).json(created);
  }
};

// @desc    Update an internship
// @route   PUT /api/internships/:id
// @access  Private/Admin
export const updateInternship = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  const updateFields = { ...req.body };
  if (updateFields.deadline) {
    updateFields.deadline = new Date(updateFields.deadline);
  }

  if (store && store.internships) {
    const index = store.internships.findIndex(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (index !== -1) {
      store.internships[index] = {
        ...store.internships[index],
        ...updateFields,
        updatedAt: new Date(),
      };
    }
  }

  if (!isDbConnected()) {
    const item = store?.internships?.find(
      (s) => s._id === id || s._id?.toString() === id.toString()
    );
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Internship not found' });
  }

  try {
    let item = await Internship.findById(id);
    if (!item) item = await Internship.findOne({ _id: id });

    if (item) {
      Object.assign(item, updateFields);
      const updated = await item.save();
      return res.json(updated);
    }

    const memoryItem = store?.internships?.find((s) => s._id === id);
    if (memoryItem) return res.json(memoryItem);
    return res.status(404).json({ message: 'Internship not found' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
export const deleteInternship = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  if (store && store.internships) {
    store.internships = store.internships.filter(
      (s) => s._id !== id && s._id?.toString() !== id.toString()
    );
  }

  if (isDbConnected()) {
    try {
      await Internship.findByIdAndDelete(id);
      await Internship.deleteOne({ _id: id });
    } catch (error) {
      console.warn('MongoDB delete notice:', error.message);
    }
  }

  return res.json({ message: 'Internship deleted successfully', id });
};
