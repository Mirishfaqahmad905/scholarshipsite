import mongoose from 'mongoose';

const seminarSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    opportunityType: {
      type: String,
      default: 'seminar',
    },
    title: {
      type: String,
      required: [true, 'Please add a seminar/summit title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    eventOrganizer: {
      type: String,
      default: 'International Youth Council / Organization',
    },
    hostUniversity: {
      type: String,
      default: 'Summit Host Venue / City',
    },
    degreeLevel: {
      type: String,
      default: 'All Levels',
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
      default: '100% Roundtrip Airfare Ticket + Accommodation + Meals + Summit Delegate Pass',
    },
    eligibilityCriteria: {
      type: String,
      default: 'Youth delegates aged 18-35 from around the world, passionate about international cooperation.',
    },
    requiredDocuments: {
      type: String,
      default: '1. Online Application Form\n2. Passport Copy\n3. Short Essay / Statement\n4. Headshot Photograph',
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
      default: '/uploads/wyf-egypt.svg',
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

const Seminar = mongoose.models.Seminar || mongoose.model('Seminar', seminarSchema);
export default Seminar;
