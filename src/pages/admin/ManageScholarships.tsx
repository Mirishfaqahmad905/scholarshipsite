import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Scholarship } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { AdBanner } from '../../components/AdBanner';
import { WORLD_COUNTRIES } from '../../data/countries';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  GraduationCap,
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

export const ManageScholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Custom Delete Modal State (replaces native window.confirm)
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
  const [opportunityType, setOpportunityType] = useState<'scholarship' | 'internship' | 'fellowship' | 'seminar'>('scholarship');
  const [title, setTitle] = useState('');
  const [hostUniversity, setHostUniversity] = useState('');
  const [description, setDescription] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<string>('MS');
  const [country, setCountry] = useState('China');
  const [category, setCategory] = useState('Government');
  const [fundingType, setFundingType] = useState<'Full' | 'Partial'>('Full');
  const [financialCoverage, setFinancialCoverage] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState('');
  const [applicationFee, setApplicationFee] = useState('');
  const [deadline, setDeadline] = useState('');
  const [officialLink, setOfficialLink] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [image, setImage] = useState('/uploads/default-scholarship.jpg');
  const [status, setStatus] = useState<'open' | 'closed'>('open');

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/scholarships');
      setScholarships(data);
    } catch (err) {
      console.error('Failed to fetch scholarships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setOpportunityType('scholarship');
    setTitle('');
    setHostUniversity('Tsinghua University / Host Institution');
    setDescription('Full scholarship for international students with high academic standing.');
    setDegreeLevel('MS');
    setCountry('China');
    setCategory('Government');
    setFundingType('Full');
    setFinancialCoverage('Full Tuition Waiver + RMB 3,000/month Stipend + Free Campus Dormitory + Comprehensive Medical Insurance');
    setEligibilityCriteria('1. Non-Chinese national\n2. Bachelor degree or higher\n3. Under 35 years old\n4. HSK 4 or English Proficiency IELTS 6.0+');
    setRequiredDocuments('1. CSC Application Form\n2. Passport Copy\n3. Notarized Diplomas & Transcripts\n4. Study Plan / Research Proposal\n5. Two Recommendation Letters\n6. Physical Examination Form\n7. Non-Criminal Record Certificate');
    setApplicationFee('Free / No Application Fee');
    setDeadline(new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    setOfficialLink('https://www.campuschina.org');
    setApplyLink('https://studyinchina.csc.edu.cn');
    setImage('/uploads/default-scholarship.jpg');
    setStatus('open');
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (sch: Scholarship) => {
    setEditingId(sch._id);
    setOpportunityType(sch.opportunityType || 'scholarship');
    setTitle(sch.title);
    setHostUniversity(sch.hostUniversity || 'Top Universities & Institutes');
    setDescription(sch.description);
    setDegreeLevel(sch.degreeLevel);
    setCountry(sch.country);
    setCategory(sch.category);
    setFundingType(sch.fundingType);
    setFinancialCoverage(sch.financialCoverage || 'Full Tuition + Monthly Living Stipend');
    setEligibilityCriteria(sch.eligibilityCriteria || 'Standard international student criteria.');
    setRequiredDocuments(sch.requiredDocuments || 'Passport, Transcripts, Study Plan, Recommendation Letters.');
    setApplicationFee(sch.applicationFee || 'Free / No Application Fee');
    setDeadline(sch.deadline ? new Date(sch.deadline).toISOString().slice(0, 10) : '');
    setOfficialLink(sch.officialLink);
    setApplyLink(sch.applyLink || sch.officialLink);
    setImage(sch.image || '/uploads/default-scholarship.jpg');
    setStatus(sch.status);
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !country || !deadline || !officialLink) {
      setFormError('Please fill in all required fields');
      return;
    }

    const payload = {
      opportunityType,
      title,
      hostUniversity,
      description,
      degreeLevel,
      country,
      category,
      fundingType,
      financialCoverage,
      eligibilityCriteria,
      requiredDocuments,
      applicationFee,
      deadline,
      officialLink,
      applyLink: applyLink || officialLink,
      image,
      status,
    };

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingId) {
        await axios.put(`/api/scholarships/${editingId}`, payload);
        showToast(`Opportunity "${title}" updated successfully!`, 'success');
      } else {
        await axios.post('/api/scholarships', payload);
        showToast(`New opportunity "${title}" added successfully!`, 'success');
      }

      setShowModal(false);
      fetchScholarships();
    } catch (err: any) {
      console.error('Save error', err);
      setFormError(err.response?.data?.message || 'Failed to save opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (sch: Scholarship) => {
    setDeletingItem({ id: sch._id, title: sch.title });
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setDeleting(true);
      // Optimistic filter
      setScholarships((prev) => prev.filter((s) => s._id !== deletingItem.id));
      await axios.delete(`/api/scholarships/${deletingItem.id}`);
      showToast(`Scholarship "${deletingItem.title}" permanently deleted from database!`, 'success');
      setDeletingItem(null);
      fetchScholarships();
    } catch (err: any) {
      console.error('Delete error', err);
      showToast('Failed to delete scholarship from database.', 'error');
      fetchScholarships();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification Pop-up */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-slate-900/90 border-[#D4AF37]/50 text-amber-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
            )}
            <p className="text-xs font-semibold">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Manage Scholarships <span className="text-[#D4AF37] italic font-normal">({scholarships.length})</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Add, update, or remove funding listings in MongoDB database</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scholarship</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="h-64 bg-slate-900/60 animate-pulse rounded-3xl border border-slate-800/80" />
      ) : scholarships.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 p-8 text-center rounded-3xl">
          <p className="text-slate-400 text-xs">No scholarships found in database.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-[0.2em] font-bold text-[10px] border-b border-slate-800/80">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Degree</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Funding</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {scholarships.map((sch) => (
                  <tr key={sch._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <img
                        src={sch.image}
                        alt={sch.title}
                        className="w-12 h-10 object-cover rounded-xl border border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/uploads/default-scholarship.jpg';
                        }}
                      />
                    </td>
                    <td className="p-4 font-extrabold uppercase text-[10px]">
                      <span className={`px-2 py-0.5 rounded-lg border ${
                        sch.opportunityType === 'internship'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : sch.opportunityType === 'fellowship'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : sch.opportunityType === 'seminar'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                      }`}>
                        {sch.opportunityType || 'scholarship'}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white max-w-xs truncate">
                      {sch.title}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold rounded-lg text-[10px]">
                        {sch.degreeLevel}
                      </span>
                    </td>
                    <td className="p-4">{sch.country}</td>
                    <td className="p-4 text-slate-400">
                      {sch.deadline ? new Date(sch.deadline).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg font-bold text-[10px] ${sch.fundingType === 'Full' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 bg-slate-800'}`}>
                        {sch.fundingType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${sch.status === 'open' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {sch.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(sch)}
                        className="p-1.5 text-slate-300 hover:text-[#D4AF37] hover:bg-slate-800/80 rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(sch)}
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

      {/* Delete Confirmation Modal (Replaces iframe-blocked window.confirm) */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-white">Delete Scholarship Listing?</h3>
                <p className="text-[11px] text-slate-400">Confirm permanent deletion from database</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              Are you sure you want to delete <strong className="text-white">"{deletingItem.title}"</strong>? This will permanently remove the scholarship record from the MongoDB database.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Scholarship Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xl font-serif font-semibold text-white">
                {editingId ? 'Edit Scholarship' : 'Add New Scholarship'}
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

              {/* Ad Banner inside scholarship form view */}
              <div className="my-2">
                <AdBanner placement="in-feed" className="my-1" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-1">Opportunity Type</label>
                <select
                  required
                  value={opportunityType}
                  onChange={(e) => setOpportunityType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-amber-500/50 rounded-2xl text-xs text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="scholarship">🎓 Scholarship (Degree / Grant Program)</option>
                  <option value="internship">💼 Internship (Paid / Lab Placement)</option>
                  <option value="fellowship">🌟 Fellowship (Research / Leadership)</option>
                  <option value="seminar">🌍 International Seminar (Summit / Forum)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CERN Openlab Summer Student Program 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Host University / Institute / Host Org</label>
                  <input
                    type="text"
                    value={hostUniversity}
                    onChange={(e) => setHostUniversity(e.target.value)}
                    placeholder="e.g. CERN / Max Planck / United Nations"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Target Academic Level</label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="BS">BS (Bachelors)</option>
                    <option value="MS">MS (Masters)</option>
                    <option value="PhD">PhD (Doctorate)</option>
                    <option value="PostDoc">PostDoc / Research</option>
                    <option value="High School">High School / Youth</option>
                    <option value="All Levels">All Academic Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Country</label>
                  <select
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="" disabled>Select Host Country</option>
                    {Array.from(new Set([country, ...WORLD_COUNTRIES])).filter(Boolean).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Government, Merit-based..."
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Funding Type</label>
                  <select
                    value={fundingType}
                    onChange={(e) => setFundingType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Full">Full Funding</option>
                    <option value="Partial">Partial Funding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Financial Coverage / Benefits</label>
                <textarea
                  rows={2}
                  value={financialCoverage}
                  onChange={(e) => setFinancialCoverage(e.target.value)}
                  placeholder="e.g. Full Tuition Waiver + RMB 3,000/month Stipend + Accommodation + Health Insurance"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Eligibility Criteria / Requirements</label>
                <textarea
                  rows={3}
                  value={eligibilityCriteria}
                  onChange={(e) => setEligibilityCriteria(e.target.value)}
                  placeholder="Academic GPA, Age limits, Language certificate (IELTS/HSK), Nationality rules..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Required Documents List</label>
                <textarea
                  rows={3}
                  value={requiredDocuments}
                  onChange={(e) => setRequiredDocuments(e.target.value)}
                  placeholder="1. Passport Copy&#10;2. Diplomas & Transcripts&#10;3. Study Plan&#10;4. Recommendation Letters"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Application Fee Status</label>
                  <input
                    type="text"
                    value={applicationFee}
                    onChange={(e) => setApplicationFee(e.target.value)}
                    placeholder="e.g. Free / No Application Fee or USD $50"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Official Website URL</label>
                  <input
                    type="url"
                    required
                    value={officialLink}
                    onChange={(e) => setOfficialLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Direct Apply Link URL</label>
                <input
                  type="url"
                  required
                  value={applyLink}
                  onChange={(e) => setApplyLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">Overview & Notes</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="General scholarship overview..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Multer Image Uploader */}
              <ImageUploader value={image} onChange={(path) => setImage(path)} label="Scholarship Banner Image (Server Upload)" />

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
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Listing' : 'Add Scholarship'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
