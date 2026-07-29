import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Ad } from '../../types';
import { useSocial } from '../../context/SocialContext';
import { ImageUploader } from '../../components/ImageUploader';
import { Plus, Pencil, Trash2, X, AlertCircle, Megaphone, CheckCircle2, XCircle, Code, DollarSign, ExternalLink } from 'lucide-react';

export const ManageAds: React.FC = () => {
  const { settings } = useSocial();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('/uploads/ad-ielts.svg');
  const [targetLink, setTargetLink] = useState('https://www.e2language.com');
  const [placement, setPlacement] = useState<
    | 'header'
    | 'sidebar'
    | 'in-feed'
    | 'footer'
    | 'popup'
    | 'scholarship-detail-top'
    | 'scholarship-detail-bottom'
    | 'blog-sidebar'
    | 'about-page'
    | 'contact-page'
    | 'contact-services'
  >('header');
  const [active, setActive] = useState<boolean>(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/ads?placement=all&activeOnly=false');
      setAds(data);
    } catch (err) {
      console.error('Failed to fetch ads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setImage('/uploads/ad-ielts.svg');
    setTargetLink('https://example.com');
    setPlacement('header');
    setActive(true);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (ad: Ad) => {
    setEditingId(ad._id);
    setTitle(ad.title);
    setImage(ad.image);
    setTargetLink(ad.targetLink);
    setPlacement(ad.placement);
    setActive(ad.active);
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image || !targetLink) {
      setFormError('Title, image, and target link are required');
      return;
    }

    const payload = {
      title,
      image,
      targetLink,
      placement,
      active,
    };

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingId) {
        await axios.put(`/api/ads/${editingId}`, payload);
      } else {
        await axios.post('/api/ads', payload);
      }

      setShowModal(false);
      fetchAds();
    } catch (err: any) {
      console.error('Ad save error', err);
      setFormError(err.response?.data?.message || 'Failed to save ad banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this ad banner?')) return;
    try {
      setAds((prev) => prev.filter((a) => a._id !== id));
      await axios.delete(`/api/ads/${id}`);
      fetchAds();
    } catch (err) {
      console.error('Delete ad error', err);
      fetchAds();
    }
  };

  return (
    <div className="space-y-6">
      {/* Google AdSense Integration Overview Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
                Google AdSense Auto-Ads Engine
                {settings?.googleAdSensePublisherId ? (
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Configured
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase rounded-lg">
                    Not Configured
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Google automatically places responsive ads across optimal locations of your portal
              </p>
            </div>
          </div>

          <Link
            to="/admin/settings"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Configure AdSense / Scripts</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Publisher ID</span>
            <div className="font-mono text-emerald-300 truncate">
              {settings?.googleAdSensePublisherId || 'Not set (Add in Settings)'}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Auto-Ads Status</span>
            <div className="font-semibold text-slate-200">
              {settings?.googleAutoAdsEnabled !== false ? '✅ Active (Auto placement)' : '❌ Disabled'}
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Custom Header Script</span>
            <div className="font-mono text-cyan-300 truncate">
              {settings?.headerAdScript ? 'Script Loaded' : 'None specified'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Custom Graphic Banner Ads <span className="text-[#D4AF37] italic font-normal">({ads.length})</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Manage header, sidebar, footer, contact services, and in-feed sponsored banners</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Ad Banner</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-900/60 animate-pulse rounded-3xl border border-slate-800/80" />
      ) : ads.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 p-8 text-center rounded-3xl">
          <p className="text-slate-400 text-xs">No ad banners configured.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-[0.2em] font-bold text-[10px] border-b border-slate-800/80">
                <tr>
                  <th className="p-4">Preview</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Placement</th>
                  <th className="p-4">Target Link</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-16 h-8 object-cover rounded-xl border border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/uploads/ad-ielts.svg';
                        }}
                      />
                    </td>
                    <td className="p-4 font-semibold text-white max-w-xs truncate">{ad.title}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold uppercase rounded-lg text-[10px]">
                        {ad.placement}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{ad.targetLink}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 w-fit ${ad.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {ad.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {ad.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(ad)}
                        className="p-1.5 text-slate-300 hover:text-[#D4AF37] hover:bg-slate-800/80 rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-serif font-semibold text-white">
                {editingId ? 'Edit Ad Banner' : 'New Ad Banner'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-sans">
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Ad Title / Campaign</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. IELTS 30% Off Discount"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Placement Slot</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="header">Header Top Banner</option>
                  <option value="sidebar">Sidebar Widget</option>
                  <option value="in-feed">In-Feed Stream Banner</option>
                  <option value="footer">Footer Banner</option>
                  <option value="popup">New User Modal / Popup Ad</option>
                  <option value="scholarship-detail-top">Scholarship Detail Page Top</option>
                  <option value="scholarship-detail-bottom">Scholarship Detail Page Bottom</option>
                  <option value="blog-sidebar">Blog Directory & Article Sidebar</option>
                  <option value="about-page">About Page Banner</option>
                  <option value="contact-page">Contact Page Sidebar Banner</option>
                  <option value="contact-services">Contact Services Section Banner</option>
                </select>
              </div>

              <ImageUploader value={image} onChange={(path) => setImage(path)} label="Banner Image Graphic (Server Upload)" />

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Destination Target Link</label>
                <input
                  type="url"
                  required
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="ad-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37] rounded"
                />
                <label htmlFor="ad-active" className="text-xs font-semibold text-slate-200">
                  Ad Banner Active & Enabled
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Ad' : 'Publish Ad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
