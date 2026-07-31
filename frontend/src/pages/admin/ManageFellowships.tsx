import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Scholarship as Fellowship } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { WORLD_COUNTRIES } from '../../data/countries';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Award,
  Calendar,
  ExternalLink,
  Building2,
  FileText,
  CheckCircle2,
  ListOrdered,
  Coins,
  AlertTriangle,
  Loader2,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ManageFellowships: React.FC = () => {
  const [fellowships, setFellowships] = useState<Fellowship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Table status filter
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete Modal State
  const [deletingItem, setDeletingItem] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Notification Toast Pop-up State
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Form fields
  const [title, setTitle] = useState('');
  const [foundationOrInst, setFoundationOrInst] = useState('');
  const [description, setDescription] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<string>('MS / Certificate');
  const [country, setCountry] = useState('Australia');
  const [category, setCategory] = useState('Leadership Fellowship');
  const [fundingType, setFundingType] = useState<string>('Full');
  const [financialCoverage, setFinancialCoverage] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState('');
  const [applicationFee, setApplicationFee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [officialLink, setOfficialLink] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [image, setImage] = useState('/uploads/rotary-peace.svg');
  const [status, setStatus] = useState<'open' | 'closed'>('open');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchFellowships = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/fellowships');
      setFellowships(data);
    } catch (err) {
      console.error('Failed to fetch fellowships from MongoDB backend API', err);
      showToast('Failed to load fellowships from backend database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFellowships();
  }, []);

  const loadExamplePreset = () => {
    setTitle('Rotary Peace Fellowship Program 2026');
    setFoundationOrInst('Rotary International Foundation');
    setCountry('Australia');
    setDegreeLevel('MS / Certificate');
    setCategory('Leadership Fellowship');
    setFundingType('Full');
    setFinancialCoverage('Full tuition & fees + Monthly living stipend + Roundtrip airfare + Internship expenses');
    setEligibilityCriteria('1. Bachelor degree holder\n2. At least 3 years of full-time work experience in peace or international development\n3. English proficiency & leadership record');
    setRequiredDocuments('1. Online Application Form\n2. Resume / CV\n3. Two Letters of Recommendation\n4. Essays on Peace & Leadership');
    setApplicationFee('Free / No Application Fee');
    setDeadline(new Date(Date.now() + 150 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    setOfficialLink('https://www.rotary.org');
    setApplyLink('https://www.rotary.org/en/our-programs/peace-fellowships');
    setImage('/uploads/rotary-peace.svg');
    setDescription('Fully funded master degree and certificate fellowships in peace, conflict resolution, and international development.');
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setFoundationOrInst('');
    setCountry('Australia');
    setDegreeLevel('MS / Certificate');
    setCategory('Leadership Fellowship');
    setFundingType('Full');
    setFinancialCoverage('');
    setEligibilityCriteria('');
    setRequiredDocuments('');
    setApplicationFee('');
    setDeadline('');
    setOfficialLink('');
    setApplyLink('');
    setImage('/uploads/rotary-peace.svg');
    setStatus('open');
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (item: Fellowship) => {
    setEditingId(item._id);
    setTitle(item.title);
    setFoundationOrInst((item as any).foundationOrInst || item.hostUniversity || '');
    setDescription(item.description);
    setDegreeLevel(item.degreeLevel || 'MS / Certificate');
    setCountry(typeof item.country === 'string' ? item.country : (item.country as any)?.name || 'Australia');
    setCategory(typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'Leadership Fellowship');
    setFundingType(item.fundingType || 'Full');
    setFinancialCoverage(item.financialCoverage || '');
    setEligibilityCriteria(item.eligibilityCriteria || '');
    setRequiredDocuments(item.requiredDocuments || '');
    setApplicationFee(item.applicationFee || 'Free / No Fee');
    setDeadline(item.deadline ? new Date(item.deadline).toISOString().slice(0, 10) : '');
    setOfficialLink(item.officialLink || '');
    setApplyLink(item.applyLink || item.officialLink || '');
    setImage(item.image || '/uploads/rotary-peace.svg');
    setStatus(item.status || 'open');
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !country || !deadline || !officialLink) {
      setFormError('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    const payload = {
      opportunityType: 'fellowship',
      title,
      foundationOrInst,
      hostUniversity: foundationOrInst,
      description,
      degreeLevel,
      country,
      category,
      fundingType,
      financialCoverage,
      eligibilityCriteria,
      requiredDocuments,
      applicationFee,
      deadline: new Date(deadline),
      officialLink,
      applyLink: applyLink || officialLink,
      image,
      status,
    };

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingId) {
        await axios.put(`/api/fellowships/${editingId}`, payload);
        showToast(`Fellowship "${title}" updated successfully in database!`, 'success');
      } else {
        await axios.post('/api/fellowships', payload);
        showToast(`New fellowship "${title}" created successfully!`, 'success');
      }

      setShowModal(false);
      fetchFellowships();
    } catch (err: any) {
      console.error('Save fellowship error:', err);
      setFormError(err.response?.data?.message || 'Failed to save fellowship to database server.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setDeleting(true);
      setFellowships((prev) => prev.filter((s) => s._id !== deletingItem.id));

      await axios.delete(`/api/fellowships/${deletingItem.id}`);
      showToast(`Fellowship "${deletingItem.title}" deleted from backend database!`, 'success');
      setDeletingItem(null);
      fetchFellowships();
    } catch (err: any) {
      showToast('Failed to delete fellowship from database.', 'error');
      fetchFellowships();
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = fellowships.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        ((item as any).foundationOrInst && (item as any).foundationOrInst.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-950 border-rose-500/50 text-rose-200'
              : 'bg-slate-900 border-amber-500/50 text-amber-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Fellowship Management</span>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Manage Global Fellowships <span className="text-amber-400 italic font-normal">({fellowships.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, update, and manage research and leadership fellowships stored in MongoDB backend database.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Fellowship</span>
        </button>
      </div>

      {/* Backend Database Status Notice */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            MongoDB Fellowship API Endpoint (<code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded">/api/fellowships</code>)
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            All fellowship programs in this dashboard are saved to MongoDB and served directly across the platform.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Status:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All ({fellowships.length})
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'open'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Open Now
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'closed'
                ? 'bg-rose-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Closed
          </button>
        </div>

        <input
          type="text"
          placeholder="Search fellowships by title or institute..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Fellowships Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading fellowships from MongoDB backend API...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No fellowship opportunities found</p>
            <p className="text-xs text-slate-500">Click "+ Add New Fellowship" to create your first listing in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/50 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3.5 px-4">Fellowship Title</th>
                  <th className="py-3.5 px-4">Foundation / Inst</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Funding</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                {filteredItems.map((item) => {
                  const foundation = (item as any).foundationOrInst || item.hostUniversity || 'Foundation';
                  const countryName = typeof item.country === 'string' ? item.country : item.country?.name || 'Global';
                  const formattedDeadline = item.deadline
                    ? new Date(item.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Flexible';

                  return (
                    <tr key={item._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-4 px-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || '/uploads/rotary-peace.svg'}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', '/uploads/rotary-peace.svg');
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{item.degreeLevel || 'MS / PostDoc'} • {item.category || 'Fellowship'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-medium">{foundation}</td>
                      <td className="py-4 px-4 text-slate-300">{countryName}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {item.fundingType || 'Full'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">{formattedDeadline}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'open'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                            title="Edit Fellowship"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ id: item._id, title: item.title })}
                            className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/80 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-all"
                            title="Delete Fellowship"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-900/60 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">Delete Fellowship?</h3>
                <p className="text-xs text-slate-400">This operation is permanent in MongoDB.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              Are you sure you want to delete <span className="font-bold text-white">"{deletingItem.title}"</span>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                disabled={deleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Fellowship Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-white">
                    {editingId ? 'Edit Fellowship' : 'Add New Fellowship'}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    {editingId ? 'Modify fellowship details' : 'Enter clean fellowship details to add to database'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!editingId && (
                    <button
                      type="button"
                      onClick={loadExamplePreset}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/30 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5"
                      title="Quick fill with sample data"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Auto-Fill Demo</span>
                    </button>
                  )}
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

            {formError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Program Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Fellowship Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rotary Peace Fellowship Program"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Foundation / Institute & Degree Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Foundation / Host Institute *
                  </label>
                  <input
                    type="text"
                    required
                    value={foundationOrInst}
                    onChange={(e) => setFoundationOrInst(e.target.value)}
                    placeholder="e.g. Rotary International Foundation, Humboldt Foundation"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Degree Level Target *
                  </label>
                  <input
                    type="text"
                    required
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    placeholder="e.g. MS / PhD / PostDoc"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Country & Funding Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Host Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {WORLD_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Funding Model *
                  </label>
                  <select
                    value={fundingType}
                    onChange={(e) => setFundingType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Full">Fully Funded</option>
                    <option value="Partial">Partially Funded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Deadline Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Financial Coverage */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Financial Grant & Coverage Details
                </label>
                <input
                  type="text"
                  value={financialCoverage}
                  onChange={(e) => setFinancialCoverage(e.target.value)}
                  placeholder="e.g. Full tuition + Monthly living stipend + Airfare + Research grant"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Overview Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the fellowship opportunity..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Eligibility & Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eligibility Criteria
                  </label>
                  <textarea
                    rows={3}
                    value={eligibilityCriteria}
                    onChange={(e) => setEligibilityCriteria(e.target.value)}
                    placeholder="1. Bachelor/Master degree holder..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Required Application Documents
                  </label>
                  <textarea
                    rows={3}
                    value={requiredDocuments}
                    onChange={(e) => setRequiredDocuments(e.target.value)}
                    placeholder="1. Research Proposal&#10;2. CV with publications..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Official Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={officialLink}
                    onChange={(e) => setOfficialLink(e.target.value)}
                    placeholder="https://www.rotary.org"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Direct Application Portal Link
                  </label>
                  <input
                    type="url"
                    value={applyLink}
                    onChange={(e) => setApplyLink(e.target.value)}
                    placeholder="https://www.rotary.org/apply"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <ImageUploader
                label="Fellowship Logo / Image"
                value={image}
                onChange={(newUrl) => setImage(newUrl)}
              />

              {/* Status Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Application Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      value="open"
                      checked={status === 'open'}
                      onChange={() => setStatus('open')}
                      className="accent-emerald-500"
                    />
                    <span>Open for Applications</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      value="closed"
                      checked={status === 'closed'}
                      onChange={() => setStatus('closed')}
                      className="accent-rose-500"
                    />
                    <span>Closed</span>
                  </label>
                </div>
              </div>

              {/* Submit / Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingId ? 'Save Changes' : 'Create Fellowship'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </div>
  );
};
