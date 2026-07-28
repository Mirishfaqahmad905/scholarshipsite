import mongoose from 'mongoose';
import User from '../models/User.js';
import Scholarship from '../models/Scholarship.js';
import Blog from '../models/Blog.js';
import Ad from '../models/Ad.js';
import Category from '../models/Category.js';
import Country from '../models/Country.js';
import { inMemoryStore } from '../config/inMemoryStore.js';

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  if (!isDbConnected()) {
    const store = getStore(req);
    const users = store.users.map(({ password, ...rest }) => rest);
    return res.json(users);
  }

  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    const store = getStore(req);
    const users = store.users.map(({ password, ...rest }) => rest);
    return res.json(users);
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (req, res) => {
  if (!isDbConnected()) {
    const store = getStore(req);
    const totalScholarships = store.scholarships.length;
    const openScholarships = store.scholarships.filter((s) => s.status === 'open').length;
    const totalBlogs = store.blogs.length;
    const activeAds = store.ads.filter((a) => a.active).length;
    const totalUsers = store.users.length;
    const totalCountries = store.countries.length;

    return res.json({
      totalScholarships,
      openScholarships,
      totalBlogs,
      activeAds,
      totalUsers,
      totalCountries,
    });
  }

  try {
    const totalScholarships = await Scholarship.countDocuments();
    const openScholarships = await Scholarship.countDocuments({ status: 'open' });
    const totalBlogs = await Blog.countDocuments();
    const activeAds = await Ad.countDocuments({ active: true });
    const totalUsers = await User.countDocuments();
    const totalCountries = await Country.countDocuments();

    return res.json({
      totalScholarships,
      openScholarships,
      totalBlogs,
      activeAds,
      totalUsers,
      totalCountries,
    });
  } catch (error) {
    const store = getStore(req);
    return res.json({
      totalScholarships: store.scholarships.length,
      openScholarships: store.scholarships.filter((s) => s.status === 'open').length,
      totalBlogs: store.blogs.length,
      activeAds: store.ads.filter((a) => a.active).length,
      totalUsers: store.users.length,
      totalCountries: store.countries.length,
    });
  }
};

// @desc    Update user role or profile (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role, name, email } = req.body;

  if (!isDbConnected()) {
    const store = getStore(req);
    const index = store.users.findIndex((u) => u._id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (role) store.users[index].role = role;
    if (name) store.users[index].name = name;
    if (email) store.users[index].email = email;
    const { password, ...rest } = store.users[index];
    return res.json(rest);
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) user.role = role;
    if (name) user.name = name;
    if (email) user.email = email;

    const updated = await user.save();
    return res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (error) {
    const store = getStore(req);
    const index = store.users.findIndex((u) => u._id === id);
    if (index !== -1) {
      if (role) store.users[index].role = role;
      if (name) store.users[index].name = name;
      if (email) store.users[index].email = email;
      const { password, ...rest } = store.users[index];
      return res.json(rest);
    }
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const store = getStore(req);

  if (store && store.users) {
    store.users = store.users.filter(
      (u) => u._id !== id && u._id?.toString() !== id.toString()
    );
  }

  if (!isDbConnected()) {
    return res.json({ message: 'User deleted successfully' });
  }

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await User.findByIdAndDelete(id);
    }
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.json({ message: 'User deleted successfully' });
  }
};

// Category / Country management endpoints for Admin
export const addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  if (!isDbConnected()) {
    const store = getStore(req);
    const exists = store.categories.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) return res.status(400).json({ message: 'Category already exists' });
    const newCat = { _id: 'cat-' + Date.now(), name };
    store.categories.push(newCat);
    return res.status(201).json(newCat);
  }

  try {
    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (err) {
    const store = getStore(req);
    const newCat = { _id: 'cat-' + Date.now(), name };
    store.categories.push(newCat);
    return res.status(201).json(newCat);
  }
};

export const addCountry = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Country name is required' });

  if (!isDbConnected()) {
    const store = getStore(req);
    const exists = store.countries.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) return res.status(400).json({ message: 'Country already exists' });
    const newC = { _id: 'cnt-' + Date.now(), name };
    store.countries.push(newC);
    return res.status(201).json(newC);
  }

  try {
    const country = await Country.create({ name });
    return res.status(201).json(country);
  } catch (err) {
    const store = getStore(req);
    const newC = { _id: 'cnt-' + Date.now(), name };
    store.countries.push(newC);
    return res.status(201).json(newC);
  }
};

