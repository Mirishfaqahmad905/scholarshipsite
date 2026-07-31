import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Global Scholarship Portal' },
    siteLink: { type: String, default: 'https://scholarship-portal.vercel.app' },
    siteLogoUrl: { type: String, default: '' },
    contactEmail: { type: String, default: 'techhub905@gmail.com' },
    whatsapp: { type: String, default: '+1234567890' },
    whatsappMessage: { type: String, default: 'Hello! I need scholarship application assistance.' },
    github: { type: String, default: 'https://github.com' },
    snapchat: { type: String, default: 'https://snapchat.com' },
    instagram: { type: String, default: 'https://instagram.com' },
    telegram: { type: String, default: 'https://t.me' },
    facebook: { type: String, default: 'https://facebook.com' },
    twitter: { type: String, default: 'https://x.com' },
    linkedin: { type: String, default: 'https://linkedin.com' },
    youtube: { type: String, default: 'https://youtube.com' },
    googleAdSensePublisherId: { type: String, default: '' },
    googleAutoAdsEnabled: { type: Boolean, default: true },
    headerAdScript: { type: String, default: '' },
    customLinks: [
      {
        platformName: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, default: 'globe' },
      },
    ],
  },
  { timestamps: true }
);

const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

export default Setting;
