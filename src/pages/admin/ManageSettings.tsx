import React, { useState, useEffect } from 'react';
import { useSocial } from '../../context/SocialContext';
import { CustomSocialLink } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { Logo } from '../../components/Logo';
import {
  Share2,
  Mail,
  Phone,
  Globe,
  Github,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Video,
  Bookmark,
  Code,
  DollarSign,
  Zap,
} from 'lucide-react';

export const ManageSettings: React.FC = () => {
  const { settings, loading, updateSettings, refreshSettings } = useSocial();

  const [siteName, setSiteName] = useState('');
  const [siteLink, setSiteLink] = useState('');
  const [siteLogoUrl, setSiteLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [github, setGithub] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');
  const [googleAdSensePublisherId, setGoogleAdSensePublisherId] = useState('');
  const [googleAutoAdsEnabled, setGoogleAutoAdsEnabled] = useState(true);
  const [headerAdScript, setHeaderAdScript] = useState('');
  const [customLinks, setCustomLinks] = useState<CustomSocialLink[]>([]);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (settings) {
      setSiteName(settings.siteName || '');
      setSiteLink(settings.siteLink || '');
      setSiteLogoUrl(settings.siteLogoUrl || '');
      setContactEmail(settings.contactEmail || '');
      setWhatsapp(settings.whatsapp || '');
      setWhatsappMessage(settings.whatsappMessage || '');
      setGithub(settings.github || '');
      setSnapchat(settings.snapchat || '');
      setInstagram(settings.instagram || '');
      setTelegram(settings.telegram || '');
      setFacebook(settings.facebook || '');
      setTwitter(settings.twitter || '');
      setLinkedin(settings.linkedin || '');
      setYoutube(settings.youtube || '');
      setGoogleAdSensePublisherId(settings.googleAdSensePublisherId || '');
      setGoogleAutoAdsEnabled(settings.googleAutoAdsEnabled !== false);
      setHeaderAdScript(settings.headerAdScript || '');
      setCustomLinks(settings.customLinks || []);
    }
  }, [settings]);

  const handleAddCustomLink = () => {
    setCustomLinks([
      ...customLinks,
      { platformName: '', url: '', icon: 'globe' },
    ]);
  };

  const handleRemoveCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const handleCustomLinkChange = (index: number, field: keyof CustomSocialLink, value: string) => {
    const updated = [...customLinks];
    updated[index] = { ...updated[index], [field]: value };
    setCustomLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrMsg('');

    try {
      const ok = await updateSettings({
        siteName,
        siteLink,
        siteLogoUrl,
        contactEmail,
        whatsapp,
        whatsappMessage,
        github,
        snapchat,
        instagram,
        telegram,
        facebook,
        twitter,
        linkedin,
        youtube,
        googleAdSensePublisherId,
        googleAutoAdsEnabled,
        headerAdScript,
        customLinks: customLinks.filter((l) => l.platformName.trim() && l.url.trim()),
      });

      if (ok) {
        setSuccessMsg('✅ All social links and site settings updated successfully in backend database!');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setErrMsg('❌ Failed to update social links. Please check admin login status.');
      }
    } catch (err) {
      console.error(err);
      setErrMsg('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Helper for WhatsApp click URL
  const getWhatsappUrl = () => {
    if (!whatsapp) return '#';
    const cleanNum = whatsapp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(whatsappMessage || 'Hello!')}`;
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37] mr-2" />
        <span>Loading Backend Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">
            <Share2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Dynamic Backend Management</span>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Social Links & Contact <span className="text-[#D4AF37] italic font-normal">Settings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure your site URL, official support email, WhatsApp number, GitHub, Snapchat, Instagram, Telegram, and unlimited custom social channels. Updates save directly to MongoDB and instantly reflect on the frontend.
          </p>
        </div>

        <button
          onClick={refreshSettings}
          className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-700/60 flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload From DB</span>
        </button>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errMsg && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-2xl text-red-300 text-xs font-bold flex items-center gap-2">
          <span>{errMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: General Site Info */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              Site & Core Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Website Name / Title
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Scholarship Portal"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Website Link (URL)
                </label>
                <input
                  type="url"
                  value={siteLink}
                  onChange={(e) => setSiteLink(e.target.value)}
                  placeholder="https://scholarship-portal.vercel.app"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Scholarship Logo Setting & Upload */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                Scholarship Portal Brand Logo Setting
              </label>
              <p className="text-[11px] text-slate-400">
                Upload a custom logo image file (PNG, SVG, WEBP, JPG) or paste a direct image URL. The uploaded logo will automatically sync to your database and update across all portal headers, footers, and brand badges instantly.
              </p>
              
              <ImageUploader
                value={siteLogoUrl}
                onChange={(url) => setSiteLogoUrl(url)}
                label="Upload Scholarship Logo File (PNG/SVG/Base64)"
              />

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Or Direct Logo Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={siteLogoUrl}
                  onChange={(e) => setSiteLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png or data:image/png;base64,..."
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Direct Contact & Instant Messaging */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              Email & Instant Messenger Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Official Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="techhub905@gmail.com"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1234567890 or 1234567890"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Default WhatsApp Greeting Message
              </label>
              <input
                type="text"
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                placeholder="Hello! I need assistance with scholarship applications."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Section 3: Primary Social Networks */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              Major Social Media Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GitHub */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-200" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/your-username"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-slate-300"
                />
              </div>

              {/* Snapchat */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Snapchat URL
                </label>
                <input
                  type="url"
                  value={snapchat}
                  onChange={(e) => setSnapchat(e.target.value)}
                  placeholder="https://snapchat.com/add/your-handle"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/your-handle"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              {/* Telegram */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  Telegram Channel / User Link
                </label>
                <input
                  type="url"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="https://t.me/your-channel"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/your-page"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Twitter / X */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-300" />
                  X / Twitter URL
                </label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/your-handle"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-300"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn Company / Profile
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@your-channel"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Google AdSense & Auto-Ads Script Injection */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              Google AdSense Auto-Ads & Custom Head Script Code
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Google AdSense allows Google to automatically place high-revenue ads across all optimal layouts of your website. Provide your Publisher Client ID or paste your full AdSense JavaScript snippet below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Google AdSense Publisher ID (client ID)
                </label>
                <input
                  type="text"
                  value={googleAdSensePublisherId}
                  onChange={(e) => setGoogleAdSensePublisherId(e.target.value)}
                  placeholder="ca-pub-1234567890123456"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Found in Google AdSense Account &gt; Settings &gt; Account Information</span>
              </div>

              <div className="flex flex-col justify-center">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Auto-Ads Auto Placement
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <input
                    type="checkbox"
                    checked={googleAutoAdsEnabled}
                    onChange={(e) => setGoogleAutoAdsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#D4AF37] rounded"
                  />
                  <span className="text-xs text-slate-200 font-semibold">Enable Google Auto-Ads Engine</span>
                </label>
                <span className="text-[10px] text-slate-500 mt-1 block">Google automatically detects and inserts banner &amp; anchor ads on high-performing pages</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                Custom Ad Script Code / Head HTML Tag Injection
              </label>
              <textarea
                rows={4}
                value={headerAdScript}
                onChange={(e) => setHeaderAdScript(e.target.value)}
                placeholder={'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>'}
                className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Paste any custom AdSense code snippet, Google Tag Manager script, or ad verification code here.</span>
            </div>
          </div>

          {/* Section 5: Dynamic Custom Social Channels */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                Additional Custom Social Links
              </h3>
              <button
                type="button"
                onClick={handleAddCustomLink}
                className="px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Channel</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Need TikTok, Discord, Pinterest, Reddit, Threads, or Medium? Add unlimited custom platforms below:
            </p>

            {customLinks.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                No custom channels added yet. Click &quot;Add Channel&quot; to append additional links.
              </div>
            ) : (
              <div className="space-y-3">
                {customLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80"
                  >
                    <input
                      type="text"
                      value={link.platformName}
                      onChange={(e) => handleCustomLinkChange(idx, 'platformName', e.target.value)}
                      placeholder="e.g. TikTok, Discord, Pinterest"
                      className="sm:w-1/3 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleCustomLinkChange(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="sm:w-2/3 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomLink(idx)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20 shrink-0 self-end sm:self-center"
                      title="Remove Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Settings to Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Save All Social Links & Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Realtime Live Preview */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md sticky top-6 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Frontend Live Preview
            </h3>

            {/* Active Header Logo Preview */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                1. Portal Header Logo Preview
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <Logo size="md" />
              </div>
            </div>

            {/* Simulated Floating WhatsApp / Contact Card */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                2. WhatsApp Direct Chat Button
              </div>
              {whatsapp ? (
                <a
                  href={getWhatsappUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Chat on WhatsApp ({whatsapp})</span>
                </a>
              ) : (
                <div className="text-xs text-slate-500 italic">No WhatsApp number set</div>
              )}
            </div>

            {/* Simulated Email Card */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                2. Contact Email
              </div>
              {contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:underline break-all"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{contactEmail}</span>
                </a>
              ) : (
                <div className="text-xs text-slate-500 italic">No email set</div>
              )}
            </div>

            {/* Active Social Icons List */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                3. Footer & Social Bar Icons
              </div>

              <div className="flex flex-wrap gap-2">
                {github && (
                  <a href={github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-500 hover:text-white transition-colors" title="GitHub">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {snapchat && (
                  <a href={snapchat} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-colors" title="Snapchat">
                    <Sparkles className="w-4 h-4" />
                  </a>
                )}
                {instagram && (
                  <a href={instagram} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition-colors" title="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {telegram && (
                  <a href={telegram} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-colors" title="Telegram">
                    <Send className="w-4 h-4" />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/30 text-blue-500 hover:bg-blue-600/20 transition-colors" title="Facebook">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {twitter && (
                  <a href={twitter} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-300 hover:bg-sky-400/20 transition-colors" title="X / Twitter">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors" title="LinkedIn">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-colors" title="YouTube">
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>

              {customLinks.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Custom Channels:</div>
                  <div className="flex flex-wrap gap-2">
                    {customLinks.map((cl, i) => (
                      <a
                        key={i}
                        href={cl.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                        <span>{cl.platformName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl text-xs text-[#D4AF37] space-y-1">
              <div className="font-bold uppercase tracking-wider">Instant Synchronization</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Changes saved here will automatically update the Navbar, Footer, and Floating Contact Widget across the entire website for all users.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
