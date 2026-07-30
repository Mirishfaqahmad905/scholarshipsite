import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Scholarship as Internship } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { WORLD_COUNTRIES } from '../../data/countries';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Briefcase,
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
} from 'lucide-react';

export const ManageInternships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
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
  const [companyOrOrg, setCompanyOrOrg] = useState('');
  const [description, setDescription] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<string>('BS / MS');
  const [country, setCountry] = useState('Switzerland');
  const [category, setCategory] = useState('Research Internship');
  const [fundingType, setFundingType] = useState<string>('Fully Funded');
  const [financialCoverage, setFinancialCoverage] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState('');
  const [applicationFee, setApplicationFee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [officialLink, setOfficialLink] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [image, setImage] = useState('/uploads/cern-switzerland.svg');
  const [status, setStatus] = useState<'open' | 'closed'>('open');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/internships');
      setInternships(data);
    } catch (err) {
      console.error('Failed to fetch internships from MongoDB backend API', err);
      showToast('Failed to load internships from backend database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('CERN Summer Student Paid Internship 2026');
    setCompanyOrOrg('CERN - European Organization for Nuclear Research');
    setCountry('Switzerland');
    setDegreeLevel('BS / MS');
    setCategory('Research Internship');
    setFundingType('Fully Funded');
    setFinancialCoverage('CHF 90/day net stipend + Roundtrip flight allowance + CERN housing support + Health insurance');
    setEligibilityCriteria('1. Enrolled in Bachelor or Master degree program in Physics, CS, Engineering, or Math\n2. Completed at least 3 years of university level studies\n3. English or French language proficiency');
    setRequiredDocuments('1. Academic Transcripts\n2. CV / Resume\n3. Two Reference Letters\n4. Motivation Letter');
    setApplicationFee('Free / No Application Fee');
    setDeadline(new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    setOfficialLink('https://home.cern');
    setApplyLink('https://careers.cern/summer-students');
    setImage('/uploads/cern-switzerland.svg');
    setDescription('Fully paid 8-to-13 week summer research internship in Geneva, Switzerland for physics, computing, engineering, and mathematics students.');
    setStatus('open');
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (item: Internship) => {
    setEditingId(item._id);
    setTitle(item.title);
    setCompanyOrOrg((item as any).companyOrOrg || item.hostUniversity || '');
    setDescription(item.description);
    setDegreeLevel(item.degreeLevel || 'BS / MS');
    setCountry(typeof item.country === 'string' ? item.country : (item.country as any)?.name || 'Switzerland');
    setCategory(typeof item.category === 'string' ? item.category : (item.category as any)?.name || 'Research Internship');
    setFundingType(item.fundingType || 'Fully Funded');
    setFinancialCoverage(item.financialCoverage || '');
    setEligibilityCriteria(item.eligibilityCriteria || '');
    setRequiredDocuments(item.requiredDocuments || '');
    setApplicationFee(item.applicationFee || 'Free / No Fee');
    setDeadline(item.deadline ? new Date(item.deadline).toISOString().slice(0, 10) : '');
    setOfficialLink(item.officialLink || '');
    setApplyLink(item.applyLink || item.officialLink || '');
    setImage(item.image || '/uploads/cern-switzerland.svg');
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
      opportunityType: 'internship',
      title,
      companyOrOrg,
      hostUniversity: companyOrOrg,
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
        await axios.put(`/api/internships/${editingId}`, payload);
        showToast(`Internship "${title}" updated successfully in database!`, 'success');
      } else {
        await axios.post('/api/internships', payload);
        showToast(`New internship "${title}" created successfully!`, 'success');
      }

      setShowModal(false);
      fetchInternships();
    } catch (err: any) {
      console.error('Save internship error:', err);
      setFormError(err.response?.data?.message || 'Failed to save internship to database server.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setDeleting(true);
      setInternships((prev) => prev.filter((s) => s._id !== deletingItem.id));

      await axios.delete(`/api/internships/${deletingItem.id}`);
      showToast(`Internship "${deletingItem.title}" deleted from backend database!`, 'success');
      setDeletingItem(null);
      fetchInternships();
    } catch (err: any) {
      showToast('Failed to delete internship from database.', 'error');
      fetchInternships();
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = internships.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        ((item as any).companyOrOrg && (item as any).companyOrOrg.toLowerCase().includes(q))
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
              : 'bg-slate-900 border-cyan-500/50 text-cyan-200'
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
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Internship Management</span>
          </div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Manage Paid & Research Internships <span className="text-cyan-400 italic font-normal">({internships.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, update, and manage corporate, laboratory, and research internship opportunities directly in MongoDB.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Internship</span>
        </button>
      </div>

      {/* Backend Database Status Notice */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            MongoDB Internship API Endpoint (<code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded">/api/internships</code>)
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            All internship opportunities created or modified in this panel are persisted in backend database controllers and served live to candidate applicants.
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
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All ({internships.length})
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
          placeholder="Search internships by title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Internships Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading internships from MongoDB backend API...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No internship opportunities found</p>
            <p className="text-xs text-slate-500">Click "+ Add New Internship" to create your first listing in the backend database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/50 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3.5 px-4">Internship Program</th>
                  <th className="py-3.5 px-4">Company / Lab</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Stipend / Funding</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs text-slate-300">
                {filteredItems.map((item) => {
                  const company = (item as any).companyOrOrg || item.hostUniversity || 'Research Lab';
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
                            src={item.image || '/uploads/cern-switzerland.svg'}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', '/uploads/cern-switzerland.svg');
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{item.degreeLevel || 'BS / MS'} • {item.category || 'Internship'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-medium">{company}</td>
                      <td className="py-4 px-4 text-slate-300">{countryName}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {item.fundingType || 'Fully Funded'}
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
                            title="Edit Internship"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ id: item._id, title: item.title })}
                            className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/80 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-all"
                            title="Delete Internship"
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
                <h3 className="text-lg font-serif font-bold text-white">Delete Internship?</h3>
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

      {/* Add / Edit Internship Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-serif font-semibold text-white">
                {editingId ? 'Edit Internship' : 'Add New Internship'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
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
                  Internship Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CERN Summer Student Paid Research Internship"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Company / Lab & Degree Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Company / Research Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyOrOrg}
                    onChange={(e) => setCompanyOrOrg(e.target.value)}
                    placeholder="e.g. CERN, RIKEN, Google Brain"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                    placeholder="e.g. BS / MS / PhD"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Fully Funded">Fully Funded / Paid</option>
                    <option value="Stipend + Flights">Stipend + Flights</option>
                    <option value="Partially Funded">Partially Funded</option>
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Financial Coverage / Stipend */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Financial Coverage & Monthly Stipend
                </label>
                <input
                  type="text"
                  value={financialCoverage}
                  onChange={(e) => setFinancialCoverage(e.target.value)}
                  placeholder="e.g. CHF 90/day stipend + roundtrip flights + housing support"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                  placeholder="Comprehensive description of the internship opportunity..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                    placeholder="1. Minimum 3 years of university studies..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                    placeholder="1. Official Transcripts&#10;2. Recommendation Letters..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                    placeholder="https://home.cern"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                    placeholder="https://careers.cern/apply"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Banner / Logo Image Upload */}
              <ImageUploader
                label="Internship Logo / Banner Image"
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
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingId ? 'Save Changes' : 'Create Internship'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
