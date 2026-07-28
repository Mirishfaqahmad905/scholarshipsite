import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Country from '../models/Country.js';
import Scholarship from '../models/Scholarship.js';
import Blog from '../models/Blog.js';
import Ad from '../models/Ad.js';
import { inMemoryStore } from './inMemoryStore.js';

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial admin users into MongoDB...');
      for (const u of inMemoryStore.users) {
        await User.create({
          name: u.name,
          email: u.email,
          password: 'AAshfAAq123@', // User pre-save middleware will hash
          role: u.role,
        });
      }
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('🌱 Seeding initial categories into MongoDB...');
      for (const c of inMemoryStore.categories) {
        await Category.create({ name: c.name });
      }
    }

    const cntCount = await Country.countDocuments();
    if (cntCount === 0) {
      console.log('🌱 Seeding initial countries into MongoDB...');
      for (const c of inMemoryStore.countries) {
        await Country.create({ name: c.name });
      }
    }

    const schCount = await Scholarship.countDocuments();
    if (schCount === 0) {
      console.log('🌱 Seeding initial scholarships into MongoDB...');
      for (const s of inMemoryStore.scholarships) {
        await Scholarship.create({
          title: s.title,
          description: s.description,
          hostUniversity: s.hostUniversity || 'Top Universities & Institutions',
          degreeLevel: s.degreeLevel,
          country: s.country,
          category: s.category,
          fundingType: s.fundingType,
          financialCoverage: s.financialCoverage || 'Full Tuition + Monthly Stipend',
          eligibilityCriteria: s.eligibilityCriteria || 'International student criteria',
          requiredDocuments: s.requiredDocuments || 'Passport, Transcripts, Study Plan',
          applicationFee: s.applicationFee || 'Free / No Application Fee',
          deadline: new Date(s.deadline),
          officialLink: s.officialLink,
          applyLink: s.applyLink,
          status: s.status,
          image: s.image,
        });
      }
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log('🌱 Seeding initial blogs into MongoDB...');
      for (const b of inMemoryStore.blogs) {
        await Blog.create({
          title: b.title,
          slug: b.slug,
          content: b.content,
          coverImage: b.coverImage,
          author: b.author,
          tags: b.tags,
          published: b.published,
          publishedAt: new Date(b.publishedAt),
        });
      }
    }

    const adCount = await Ad.countDocuments();
    if (adCount === 0) {
      console.log('🌱 Seeding initial ads into MongoDB...');
      for (const a of inMemoryStore.ads) {
        await Ad.create({
          title: a.title,
          image: a.image,
          targetLink: a.targetLink,
          placement: a.placement,
          active: a.active,
          startDate: new Date(a.startDate),
          endDate: new Date(a.endDate),
        });
      }
    }
  } catch (err) {
    console.warn('⚠️ Auto-seeding notice:', err.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    'mongodb+srv://techhub905_db_user:lE6ZJ2Ygh5sujI1t@cluster0.efqbfvq.mongodb.net/scholarship_portal?retryWrites=true&w=majority';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    await seedInitialData();
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection notice: ${error.message}. Fallback in-memory database store active.`);
    return null;
  }
};

export default connectDB;
