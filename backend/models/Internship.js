import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    opportunityType: {
      type: String,
      default: 'internship',
    },
    title: {
      type: String,
      required: [true, 'Please add an internship title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    companyOrOrg: {
      type: String,
      default: 'Global Corporation / Research Lab',
    },
    hostUniversity: {
      type: String,
      default: 'Partner Institute / Organization',
    },
    degreeLevel: {
      type: String,
      default: 'BS / MS',
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
      default: 'Fully Funded',
    },
    financialCoverage: {
      type: String,
      default: 'Paid Stipend + Travel Allowance + Accommodation Support + Health Insurance',
    },
    eligibilityCriteria: {
      type: String,
      default: 'Enrolled in Bachelor/Master program, strong academic standing, English proficiency.',
    },
    requiredDocuments: {
      type: String,
      default: '1. CV/Resume\n2. Transcripts\n3. Cover Letter / Statement of Interest\n4. Recommendation Letter',
    },
    applicationFee: {
      type: String,
      default: 'Free / No Fee',
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
      default: '/uploads/cern-switzerland.svg',
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

const Internship = mongoose.models.Internship || mongoose.model('Internship', internshipSchema);
export default Internship;
