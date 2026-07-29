import express from 'express';
import mongoose from 'mongoose';
import SEO from '../models/SEO.js';
import Scholarship from '../models/Scholarship.js';
import Blog from '../models/Blog.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { inMemoryStore } from '../config/inMemoryStore.js';

const router = express.Router();

const getStore = (req) => req?.app?.locals?.inMemoryStore || inMemoryStore;
const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to construct default SEO object
const getDefaultSeoData = () => ({
  _id: 'seo-global-1',
  metaTitle: 'Global Scholarship Portal | Fully Funded Overseas Grants 2026',
  metaDescription:
    'Find and apply for fully funded international scholarships, CSC China, Fulbright USA, Chevening UK, DAAD Germany, and higher education grants worldwide.',
  metaKeywords:
    'scholarships, fully funded scholarships, study abroad, CSC scholarship, Fulbright, Chevening, DAAD, master scholarship, bachelor scholarship, phd fellowship',
  author: 'Global Scholarship Portal Team',
  canonicalUrl: 'https://scholarship-portal.vercel.app',
  ogTitle: 'Global Scholarship Portal - Verified International Grants & Fellowships',
  ogDescription:
    'Explore thousands of verified international scholarships with step-by-step application guidance, eligibility criteria, and deadline alerts.',
  ogImage: '/uploads/default-scholarship.jpg',
  twitterCard: 'summary_large_image',
  twitterSite: '@scholarshipportal',
  googleSiteVerification: '',
  bingSiteVerification: '',
  structuredDataJson: JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Global Scholarship Portal',
      url: 'https://scholarship-portal.vercel.app',
      logo: 'https://scholarship-portal.vercel.app/uploads/default-scholarship.jpg',
    },
    null,
    2
  ),
  robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /register\n\nSitemap: https://scholarship-portal.vercel.app/sitemap.xml`,
  sitemapAutoGenerate: true,
  noIndexRoutes: ['/admin', '/login', '/register', '/dashboard'],
  updatedAt: new Date(),
});

// @desc    Get global SEO settings
// @route   GET /api/seo
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      let seo = await SEO.findOne();
      if (!seo) {
        seo = await SEO.create(getDefaultSeoData());
      }
      return res.json(seo);
    }
  } catch (err) {
    console.warn('MongoDB query notice for SEO, fallback to in-memory store:', err.message);
  }

  const store = getStore(req);
  if (!store.seo) {
    store.seo = getDefaultSeoData();
  }
  return res.json(store.seo);
});

// @desc    Update global SEO settings
// @route   PUT /api/seo
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    author,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterSite,
    googleSiteVerification,
    bingSiteVerification,
    structuredDataJson,
    robotsTxtContent,
    sitemapAutoGenerate,
    noIndexRoutes,
  } = req.body;

  const updateData = {
    metaTitle: metaTitle || 'Global Scholarship Portal',
    metaDescription: metaDescription || '',
    metaKeywords: metaKeywords || '',
    author: author || 'Global Scholarship Portal Team',
    canonicalUrl: canonicalUrl || 'https://scholarship-portal.vercel.app',
    ogTitle: ogTitle || metaTitle || '',
    ogDescription: ogDescription || metaDescription || '',
    ogImage: ogImage || '/uploads/default-scholarship.jpg',
    twitterCard: twitterCard || 'summary_large_image',
    twitterSite: twitterSite || '',
    googleSiteVerification: googleSiteVerification || '',
    bingSiteVerification: bingSiteVerification || '',
    structuredDataJson: structuredDataJson || '',
    robotsTxtContent: robotsTxtContent || `User-agent: *\nAllow: /\n\nSitemap: https://scholarship-portal.vercel.app/sitemap.xml`,
    sitemapAutoGenerate: sitemapAutoGenerate !== undefined ? Boolean(sitemapAutoGenerate) : true,
    noIndexRoutes: Array.isArray(noIndexRoutes) ? noIndexRoutes : ['/admin', '/login', '/register'],
    updatedAt: new Date(),
  };

  try {
    if (isDbConnected()) {
      let seo = await SEO.findOne();
      if (seo) {
        Object.assign(seo, updateData);
        await seo.save();
      } else {
        seo = await SEO.create(updateData);
      }

      const store = getStore(req);
      store.seo = { ...seo.toObject() };

      return res.json({ message: 'SEO configuration updated successfully in database', seo });
    }
  } catch (err) {
    console.warn('MongoDB update notice for SEO, updating in-memory store:', err.message);
  }

  const store = getStore(req);
  store.seo = {
    _id: store.seo?._id || 'seo-global-1',
    ...updateData,
  };

  return res.json({
    message: 'SEO configuration updated successfully in store',
    seo: store.seo,
  });
});

// @desc    Serve dynamic robots.txt
// @route   GET /robots.txt or GET /api/seo/robots.txt
// @access  Public
router.get('/robots.txt', async (req, res) => {
  let content = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /register\n\nSitemap: https://scholarship-portal.vercel.app/sitemap.xml`;

  try {
    if (isDbConnected()) {
      const seo = await SEO.findOne();
      if (seo && seo.robotsTxtContent) {
        content = seo.robotsTxtContent;
      }
    } else {
      const store = getStore(req);
      if (store.seo && store.seo.robotsTxtContent) {
        content = store.seo.robotsTxtContent;
      }
    }
  } catch (e) {
    console.error('Error fetching robots.txt content:', e);
  }

  res.header('Content-Type', 'text/plain');
  res.send(content);
});

// @desc    Serve dynamic sitemap.xml
// @route   GET /sitemap.xml or GET /api/seo/sitemap.xml
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
  let baseUrl = 'https://scholarship-portal.vercel.app';
  let scholarshipItems = [];
  let blogItems = [];

  try {
    if (isDbConnected()) {
      const seo = await SEO.findOne();
      if (seo && seo.canonicalUrl) {
        baseUrl = seo.canonicalUrl.replace(/\/$/, '');
      }
      scholarshipItems = await Scholarship.find().select('_id updatedAt title');
      blogItems = await Blog.find().select('_id updatedAt title');
    } else {
      const store = getStore(req);
      if (store.seo && store.seo.canonicalUrl) {
        baseUrl = store.seo.canonicalUrl.replace(/\/$/, '');
      }
      scholarshipItems = store.scholarships || [];
      blogItems = store.blogs || [];
    }
  } catch (e) {
    console.error('Error fetching sitemap items:', e);
  }

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/scholarships`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.6', changefreq: 'monthly' },
  ];

  const dynamicUrls = [
    ...scholarshipItems.map((item) => ({
      loc: `${baseUrl}/scholarship/${item._id}`,
      lastmod: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
      priority: '0.8',
      changefreq: 'weekly',
    })),
    ...blogItems.map((item) => ({
      loc: `${baseUrl}/blog/${item._id}`,
      lastmod: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
      priority: '0.7',
      changefreq: 'weekly',
    })),
  ];

  const allUrls = [...staticUrls, ...dynamicUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

export default router;
