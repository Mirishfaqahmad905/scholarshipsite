import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed,
    },
    opportunityType: {
      type: String,
      enum: ['scholarship', 'internship', 'fellowship', 'seminar'],
      default: 'scholarship',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    hostUniversity: {
      type: String,
      default: 'Top Universities & Organizations',
    },
    degreeLevel: {
      type: String,
      required: true,
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
      enum: ['Full', 'Partial'],
      default: 'Full',
    },
    financialCoverage: {
      type: String,
      default: 'Full Tuition Fee + Monthly Living Allowance + Accommodation + Health Insurance',
    },
    eligibilityCriteria: {
      type: String,
      default: 'Non-Chinese citizen in good health. Academic performance transcript GPA 3.0+. Language Proficiency IELTS/TOEFL or English Medium Instruction certificate.',
    },
    requiredDocuments: {
      type: String,
      default: '1. Passport Copy\n2. Highest Degree Diploma & Transcripts\n3. Two Recommendation Letters\n4. Study Plan / Proposal\n5. Foreigner Physical Exam Form\n6. Non-Criminal Record',
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
      default: '/uploads/default-scholarship.jpg',
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

const Scholarship = mongoose.models.Scholarship || mongoose.model('Scholarship', scholarshipSchema);
export default Scholarship;
