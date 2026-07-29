import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSEO } from '../../context/SEOContext';
import { ImageUploader } from '../../components/ImageUploader';
import {
  Search,
  Globe,
  Share2,
  FileCode,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bot,
  RefreshCw,
  Sparkles,
  Code,
  Eye,
} from 'lucide-react';

export const ManageSEO: React.FC = () => {
  const { seo, loading, refreshSEO, updateSEOConfig } = useSEO();

  const [activeTab, setActiveTab] = useState<'meta' | 'social' | 'verification' | 'schema' | 'robots'>('meta');

  // Form states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterSite, setTwitterSite] = useState('');

  const [googleSiteVerification, setGoogleSiteVerification] = useState('');
  const [bingSiteVerification, setBingSiteVerification] = useState('');

  const [structuredDataJson, setStructuredDataJson] = useState('');
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const [robotsTxtContent, setRobotsTxtContent] = useState('');
  const [sitemapAutoGenerate, setSitemapAutoGenerate] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (seo) {
      setMetaTitle(seo.metaTitle || '');
      setMetaDescription(seo.metaDescription || '');
      setMetaKeywords(seo.metaKeywords || '');
      setAuthor(seo.author || '');
      setCanonicalUrl(seo.canonicalUrl || '');

      setOgTitle(seo.ogTitle || '');
      setOgDescription(seo.ogDescription || '');
      setOgImage(seo.ogImage || '/uploads/default-scholarship.jpg');
      setTwitterCard(seo.twitterCard || 'summary_large_image');
      setTwitterSite(seo.twitterSite || '');

      setGoogleSiteVerification(seo.googleSiteVerification || '');
      setBingSiteVerification(seo.bingSiteVerification || '');

      setStructuredDataJson(seo.structuredDataJson || '');
      setRobotsTxtContent(seo.robotsTxtContent || '');
      setSitemapAutoGenerate(seo.sitemapAutoGenerate !== false);
    }
  }, [seo]);

  const handleValidateJson = (jsonStr: string) => {
    try {
      if (!jsonStr.trim()) {
        setSchemaError(null);
        return true;
      }
      JSON.parse(jsonStr);
      setSchemaError(null);
      return true;
    } catch (e: any) {
      setSchemaError(`Invalid JSON Syntax: ${e.message}`);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidateJson(structuredDataJson)) {
      setActiveTab('schema');
      setMessage({ type: 'error', text: 'Please fix JSON schema errors before saving.' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      await updateSEOConfig({
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
      });

      setMessage({ type: 'success', text: 'SEO Optimization settings saved to Backend Database!' });
      refreshSEO();
    } catch (err: any) {
      console.error('Failed to save SEO config:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save SEO configuration.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 bg-slate-900/60 animate-pulse rounded-3xl border border-slate-800/80 p-8 flex items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Backend Sync Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[#D4AF37]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-white flex items-center gap-2">
                SEO & Meta Optimization Engine
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Database Synced
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Manage search engine metadata, Open Graph cards, Google Search Console tags, robots.txt, and sitemap.xml.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Health Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Google Verification</span>
            {googleSiteVerification ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
            ) : (
              <span className="text-amber-400 font-bold">Missing</span>
            )}
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Open Graph Image</span>
            {ogImage ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Set</span>
            ) : (
              <span className="text-amber-400 font-bold">Missing</span>
            )}
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Structured Schema</span>
            {structuredDataJson ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>
            ) : (
              <span className="text-amber-400 font-bold">Empty</span>
            )}
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Dynamic Sitemap</span>
            {sitemapAutoGenerate ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Auto</span>
            ) : (
              <span className="text-slate-500 font-bold">Disabled</span>
            )}
          </div>
        </div>
      </div>

      {/* Save Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('meta')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'meta'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>1. Global Meta & Title</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'social'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>2. Open Graph & Social Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'verification'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>3. Search Console Verification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'schema'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>4. JSON-LD Schema</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('robots')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'robots'
                ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>5. Robots & Sitemap</span>
          </button>
        </div>

        {/* TAB 1: Global Meta & Title */}
        {activeTab === 'meta' && (
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                Global Meta Title (Page Title Suffix)
              </label>
              <input
                type="text"
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Global Scholarship Portal | Fully Funded Overseas Grants 2026"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Appears on Google Search results and browser tabs. Recommended length: 50–60 characters.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                  Global Meta Description
                </label>
                <span className={`text-[10px] font-bold ${metaDescription.length > 160 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {metaDescription.length} / 160 characters
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Find and apply for fully funded international scholarships, CSC China, Fulbright USA, Chevening UK, DAAD Germany, and higher education grants worldwide."
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                  Meta Keywords (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="scholarships, fully funded, CSC, Fulbright, Chevening, DAAD"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                  Author / Publisher Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Global Scholarship Portal Team"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                Canonical Base URL
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://scholarship-portal.vercel.app"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Google Search Result Mock Preview */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-2 mt-4 font-sans">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> Live Google Search Result Preview
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 truncate">{canonicalUrl || 'https://scholarship-portal.vercel.app'}</div>
                <div className="text-base text-blue-400 font-semibold hover:underline cursor-pointer truncate">
                  {metaTitle || 'Global Scholarship Portal | Fully Funded Overseas Grants'}
                </div>
                <div className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {metaDescription || 'Find and apply for fully funded international scholarships across universities.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Open Graph & Social Cards */}
        {activeTab === 'social' && (
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                  Open Graph Title (Facebook / WhatsApp / LinkedIn)
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="Global Scholarship Portal - Verified International Grants"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                  Twitter Card Type
                </label>
                <select
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="summary_large_image">summary_large_image (Large Hero Banner)</option>
                  <option value="summary">summary (Small Thumbnail)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                Open Graph Description
              </label>
              <textarea
                rows={2}
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                placeholder="Explore thousands of verified international scholarships with step-by-step application guidance."
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <ImageUploader value={ogImage} onChange={(path) => setOgImage(path)} label="Social Share Cover Graphic (OG:Image)" />

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                Twitter Site Handle
              </label>
              <input
                type="text"
                value={twitterSite}
                onChange={(e) => setTwitterSite(e.target.value)}
                placeholder="@scholarshipportal"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Social Share Card Mock Preview */}
            <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-3 font-sans">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Live Social Card Preview (Facebook / WhatsApp / Twitter)
              </div>
              <div className="max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <img src={ogImage || '/uploads/default-scholarship.jpg'} alt="OG Preview" className="w-full h-44 object-cover" />
                <div className="p-4 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {canonicalUrl ? canonicalUrl.replace('https://', '') : 'scholarship-portal.vercel.app'}
                  </div>
                  <div className="text-sm font-semibold text-white">{ogTitle || metaTitle}</div>
                  <div className="text-xs text-slate-400 line-clamp-2">{ogDescription || metaDescription}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Search Console Verification */}
        {activeTab === 'verification' && (
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                Google Search Console Verification Token
              </label>
              <input
                type="text"
                value={googleSiteVerification}
                onChange={(e) => setGoogleSiteVerification(e.target.value)}
                placeholder="e.g. google-site-verification-code-xyz"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Injects: <code className="text-emerald-400">&lt;meta name="google-site-verification" content="..." /&gt;</code> into HTML header.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                Bing Webmaster Tools Verification Token
              </label>
              <input
                type="text"
                value={bingSiteVerification}
                onChange={(e) => setBingSiteVerification(e.target.value)}
                placeholder="e.g. msvalidate.01-token-code"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Injects: <code className="text-cyan-400">&lt;meta name="msvalidate.01" content="..." /&gt;</code> into HTML header.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: JSON-LD Schema */}
        {activeTab === 'schema' && (
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                  JSON-LD Structured Data Schema
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Helps Google understand your portal as an Educational Organization for rich search cards.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const defaultObj = {
                    '@context': 'https://schema.org',
                    '@type': 'EducationalOrganization',
                    name: metaTitle || 'Global Scholarship Portal',
                    url: canonicalUrl || 'https://scholarship-portal.vercel.app',
                    logo: 'https://scholarship-portal.vercel.app/uploads/default-scholarship.jpg',
                    description: metaDescription,
                  };
                  setStructuredDataJson(JSON.stringify(defaultObj, null, 2));
                  setSchemaError(null);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Template</span>
              </button>
            </div>

            {schemaError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{schemaError}</span>
              </div>
            )}

            <textarea
              rows={10}
              value={structuredDataJson}
              onChange={(e) => {
                setStructuredDataJson(e.target.value);
                handleValidateJson(e.target.value);
              }}
              className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-xs text-emerald-300 font-mono focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        )}

        {/* TAB 5: Robots & Sitemap */}
        {activeTab === 'robots' && (
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                Robots.txt Directives Editor
              </label>
              <textarea
                rows={6}
                value={robotsTxtContent}
                onChange={(e) => setRobotsTxtContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700/80 rounded-2xl text-xs text-cyan-300 font-mono focus:outline-none focus:border-[#D4AF37]"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Served automatically at <code className="text-white">/robots.txt</code> for web crawlers.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="sitemapAutoFrontend"
                checked={sitemapAutoGenerate}
                onChange={(e) => setSitemapAutoGenerate(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] rounded"
              />
              <div>
                <label htmlFor="sitemapAutoFrontend" className="text-xs font-bold text-white cursor-pointer">
                  Auto-generate dynamic sitemap.xml
                </label>
                <p className="text-[11px] text-slate-400">
                  Automatically includes all active scholarships and published blog articles dynamically.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {seo?.updatedAt ? `Last updated: ${new Date(seo.updatedAt).toLocaleString()}` : ''}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save SEO Config</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
