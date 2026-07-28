import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an ad title'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an ad image path'],
    },
    targetLink: {
      type: String,
      required: [true, 'Please add a target URL link'],
    },
    placement: {
      type: String,
      enum: [
        'header',
        'sidebar',
        'in-feed',
        'footer',
        'popup',
        'scholarship-detail-top',
        'scholarship-detail-bottom',
        'blog-sidebar',
      ],
      default: 'header',
    },
    active: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);
export default Ad;
