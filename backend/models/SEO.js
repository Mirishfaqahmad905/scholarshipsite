import mongoose from 'mongoose';

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      default: 'Global Scholarship Portal | Fully Funded Overseas Grants 2026',
    },
    metaDescription: {
      type: String,
      default: 'Find and apply for fully funded international scholarships, CSC China, Fulbright USA, Chevening UK, DAAD Germany, and higher education grants worldwide.',
    },
    metaKeywords: {
      type: String,
      default: 'scholarships, fully funded scholarships, study abroad, CSC scholarship, Fulbright, Chevening, DAAD, master scholarship, bachelor scholarship, phd fellowship',
    },
    author: {
      type: String,
      default: 'Global Scholarship Portal Team',
    },
    canonicalUrl: {
      type: String,
      default: 'https://scholarship-portal.vercel.app',
    },
    ogTitle: {
      type: String,
      default: 'Global Scholarship Portal - Verified International Grants & Fellowships',
    },
    ogDescription: {
      type: String,
      default: 'Explore thousands of verified international scholarships with step-by-step application guidance, eligibility criteria, and deadline alerts.',
    },
    ogImage: {
      type: String,
      default: '/uploads/default-scholarship.jpg',
    },
    twitterCard: {
      type: String,
      default: 'summary_large_image',
    },
    twitterSite: {
      type: String,
      default: '@scholarshipportal',
    },
    googleSiteVerification: {
      type: String,
      default: '',
    },
    bingSiteVerification: {
      type: String,
      default: '',
    },
    structuredDataJson: {
      type: String,
      default: JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: 'Global Scholarship Portal',
          url: 'https://scholarship-portal.vercel.app',
          logo: 'https://scholarship-portal.vercel.app/uploads/default-scholarship.jpg',
          sameAs: [
            'https://facebook.com',
            'https://x.com',
            'https://linkedin.com',
          ],
        },
        null,
        2
      ),
    },
    robotsTxtContent: {
      type: String,
      default: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /register

Sitemap: https://scholarship-portal.vercel.app/sitemap.xml`,
    },
    sitemapAutoGenerate: {
      type: Boolean,
      default: true,
    },
    noIndexRoutes: {
      type: [String],
      default: ['/admin', '/login', '/register', '/dashboard'],
    },
  },
  { timestamps: true }
);

const SEO = mongoose.models.SEO || mongoose.model('SEO', seoSchema);

export default SEO;
