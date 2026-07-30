import mongoose from 'mongoose';

const fellowshipSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    opportunityType: {
      type: String,
      default: 'fellowship',
    },
    title: {
      type: String,
      required: [true, 'Please add a fellowship title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    foundationOrInst: {
      type: String,
      default: 'International Foundation / Institute',
    },
    hostUniversity: {
      type: String,
      default: 'Host Institution / University',
    },
    degreeLevel: {
      type: String,
      default: 'MS / PhD / PostDoc',
    },
    country: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please specify a country'],
    },
    category: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please specify a category'],
    },
    fundingType: {
      type: String,
      default: 'Full',
    },
    financialCoverage: {
      type: String,
      default: 'Full Research Grant + Monthly Living Stipend + Travel Expense Reimbursement',
    },
    eligibilityCriteria: {
      type: String,
      default: 'Master/PhD degree holder or experienced professional with leadership background.',
    },
    requiredDocuments: {
      type: String,
      default: '1. Research Proposal\n2. CV with publication list\n3. Recommendation Letters\n4. Academic Certificates',
    },
    applicationFee: {
      type: String,
      default: 'Free / No Application Fee',
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify a deadline'],
    },
    officialLink: {
      type: String,
      required: [true, 'Please add an official link URL'],
    },
    applyLink: {
      type: String,
      required: [true, 'Please add an apply link URL'],
    },
    image: {
      type: String,
      default: '/uploads/rotary-peace.svg',
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const Fellowship = mongoose.models.Fellowship || mongoose.model('Fellowship', fellowshipSchema);
export default Fellowship;
