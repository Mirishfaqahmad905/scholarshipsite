import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      default: 'Scholarship Inquiry',
    },
    inquiryType: {
      type: String,
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'replied', 'archived'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const ContactInquiry = mongoose.model('ContactInquiry', contactInquirySchema);
export default ContactInquiry;
