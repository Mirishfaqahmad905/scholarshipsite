import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Country from '../models/Country.js';
import Scholarship from '../models/Scholarship.js';
import Internship from '../models/Internship.js';
import Fellowship from '../models/Fellowship.js';
import Seminar from '../models/Seminar.js';
import Blog from '../models/Blog.js';
import Ad from '../models/Ad.js';
import { inMemoryStore } from './inMemoryStore.js';

let lastDbError = null;

export const getDbStatus = async () => {
  const readyState = mongoose.connection.readyState;
  const isConnected = readyState === 1;
  let count = 0;
  if (isConnected) {
    try {
      count = await Scholarship.countDocuments();
    } catch (e) {
      // count failed
    }
  }
  return {
    connected: isConnected,
    readyState,
    statusText: isConnected ? 'Connected to MongoDB' : 'Disconnected / Fallback Mode',
    host: isConnected ? mongoose.connection.host : null,
    dbName: isConnected ? mongoose.connection.name : null,
    error: lastDbError,
    scholarshipCount: count,
  };
};

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
          opportunityType: s.opportunityType || 'scholarship',
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
      console.log(`✅ Successfully seeded ${inMemoryStore.scholarships.length} scholarships to MongoDB.`);
    }

    const intCount = await Internship.countDocuments();
    if (intCount === 0 && inMemoryStore.internships) {
      console.log('🌱 Seeding initial internships into MongoDB...');
      for (const item of inMemoryStore.internships) {
        await Internship.create({
          opportunityType: 'internship',
          title: item.title,
          description: item.description,
          companyOrOrg: item.companyOrOrg,
          hostUniversity: item.hostUniversity,
          degreeLevel: item.degreeLevel,
          country: item.country,
          category: item.category,
          fundingType: item.fundingType,
          financialCoverage: item.financialCoverage,
          eligibilityCriteria: item.eligibilityCriteria,
          requiredDocuments: item.requiredDocuments,
          applicationFee: item.applicationFee,
          deadline: new Date(item.deadline),
          officialLink: item.officialLink,
          applyLink: item.applyLink,
          status: item.status,
          image: item.image,
        });
      }
    }

    const felCount = await Fellowship.countDocuments();
    if (felCount === 0 && inMemoryStore.fellowships) {
      console.log('🌱 Seeding initial fellowships into MongoDB...');
      for (const item of inMemoryStore.fellowships) {
        await Fellowship.create({
          opportunityType: 'fellowship',
          title: item.title,
          description: item.description,
          foundationOrInst: item.foundationOrInst,
          hostUniversity: item.hostUniversity,
          degreeLevel: item.degreeLevel,
          country: item.country,
          category: item.category,
          fundingType: item.fundingType,
          financialCoverage: item.financialCoverage,
          eligibilityCriteria: item.eligibilityCriteria,
          requiredDocuments: item.requiredDocuments,
          applicationFee: item.applicationFee,
          deadline: new Date(item.deadline),
          officialLink: item.officialLink,
          applyLink: item.applyLink,
          status: item.status,
          image: item.image,
        });
      }
    }

    const semCount = await Seminar.countDocuments();
    if (semCount === 0 && inMemoryStore.seminars) {
      console.log('🌱 Seeding initial seminars into MongoDB...');
      for (const item of inMemoryStore.seminars) {
        await Seminar.create({
          opportunityType: 'seminar',
          title: item.title,
          description: item.description,
          eventOrganizer: item.eventOrganizer,
          hostUniversity: item.hostUniversity,
          degreeLevel: item.degreeLevel,
          country: item.country,
          category: item.category,
          fundingType: item.fundingType,
          financialCoverage: item.financialCoverage,
          eligibilityCriteria: item.eligibilityCriteria,
          requiredDocuments: item.requiredDocuments,
          applicationFee: item.applicationFee,
          deadline: new Date(item.deadline),
          officialLink: item.officialLink,
          applyLink: item.applyLink,
          status: item.status,
          image: item.image,
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
          startDate: a.startDate ? new Date(a.startDate) : new Date(),
          endDate: a.endDate ? new Date(a.endDate) : null,
        });
      }
    }
  } catch (err) {
    console.warn('⚠️ Auto-seeding notice:', err.message);
    lastDbError = `Seeding error: ${err.message}`;
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  let uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    'mongodb+srv://techhub905_db_user:lE6ZJ2Ygh5sujI1t@cluster0.efqbfvq.mongodb.net/scholarship_portal?retryWrites=true&w=majority';

  if (typeof uri === 'string') {
    uri = uri.trim().replace(/^["']|["']$/g, '').trim();
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected successfully to host: ${conn.connection.host}`);
    lastDbError = null;
    await seedInitialData();
    return conn;
  } catch (error) {
    lastDbError = error.message;
    console.log(`ℹ️ Data Store Info: MongoDB Atlas cluster is restricted or offline (${error.message.split('.')[0]}). Seamless in-memory persistence active.`);
    return null;
  }
};

export default connectDB;

