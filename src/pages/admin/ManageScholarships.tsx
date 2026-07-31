import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
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
  Zap,
} from 'lucide-react';

export const ManageScholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Table category filter
  const [tableFilter, setTableFilter] = useState<'all' | 'scholarship' | 'internship' | 'fellowship' | 'seminar'>('all');

  // Custom Delete Modal State
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
      const [schRes, intRes, felRes, semRes] = await Promise.allSettled([
        axios.get('/api/scholarships'),
        axios.get('/api/internships'),
        axios.get('/api/fellowships'),
        axios.get('/api/seminars'),
      ]);

      const schList = schRes.status === 'fulfilled' ? schRes.value.data : [];
      const intList = intRes.status === 'fulfilled' ? intRes.value.data : [];
      const felList = felRes.status === 'fulfilled' ? felRes.value.data : [];
      const semList = semRes.status === 'fulfilled' ? semRes.value.data : [];

      setScholarships([...schList, ...intList, ...felList, ...semList]);
    } catch (err) {
      console.error('Failed to fetch opportunities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // Helper to load example template if requested
  const loadExamplePreset = (type: 'scholarship' | 'internship' | 'fellowship' | 'seminar') => {
    setOpportunityType(type);
    if (type === 'internship') {
      setTitle('CERN Summer Student Paid Internship 2026');
      setHostUniversity('CERN - European Organization for Nuclear Research');
      setCountry('Switzerland');
      setDegreeLevel('BS');
      setCategory('Research Internship');
      setFundingType('Full');
      setFinancialCoverage('CHF 90/day stipend + Travel allowance + Accommodation support + Medical insurance');
      setEligibilityCriteria('1. Enrolled in Bachelor or Master degree program\n2. Completed at least 3 years of full-time university studies\n3. English or French proficiency');
      setRequiredDocuments('1. Official Transcripts\n2. CV / Resume\n3. Two Reference Letters\n4. Motivation Statement');
      setOfficialLink('https://home.cern');
      setApplyLink('https://careers.cern/summer-students');
      setImage('/uploads/cern-switzerland.svg');
      setDescription('Fully funded research internship for physics, engineering, and computing students.');
      setApplicationFee('Free / No Application Fee');
      setDeadline(new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    } else if (type === 'fellowship') {
      setTitle('Rotary Peace Fellowship Program 2026');
      setHostUniversity('Rotary International & Partner Universities');
      setCountry('Australia');
      setDegreeLevel('MS');
      setCategory('Leadership Fellowship');
      setFundingType('Full');
      setFinancialCoverage('Full tuition & fees + Room and board + Roundtrip flight transportation + Fieldwork expenses');
      setEligibilityCriteria('1. Bachelor degree holder with strong academic record\n2. At least 3 years of work experience in peace/development\n3. Leadership capability and English fluency');
      setRequiredDocuments('1. Online Application Form\n2. Professional Resume\n3. Two Recommendation Letters\n4. Peace & Leadership Essays');
      setOfficialLink('https://www.rotary.org');
      setApplyLink('https://www.rotary.org/en/our-programs/peace-fellowships');
      setImage('/uploads/rotary-peace.svg');
      setDescription('Fully funded master degree and certificate fellowships in peace and international development.');
      setApplicationFee('Free / No Application Fee');
      setDeadline(new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    } else if (type === 'seminar') {
      setTitle('World Youth Summit & Leadership Forum 2026');
      setHostUniversity('World Youth Forum Organization');
      setCountry('Egypt');
      setDegreeLevel('All Levels');
      setCategory('Youth Forum');
      setFundingType('Full');
      setFinancialCoverage('100% Free Flight Tickets + 5-Star Hotel Stay + All Meals & Local Transport + Summit Pass');
      setEligibilityCriteria('1. Open to delegates aged 18 to 35 from all countries\n2. Passion for international affairs and technology\n3. English communication skills');
      setRequiredDocuments('1. Delegate Application Form\n2. Passport Copy\n3. Passport Headshot Photo\n4. Short Essay Response');
      setOfficialLink('https://wyfegypt.com');
      setApplyLink('https://wyfegypt.com/apply');
      setImage('/uploads/wyf-egypt.svg');
      setDescription('Fully funded international youth summit and conference opportunity.');
      setApplicationFee('Free / No Application Fee');
      setDeadline(new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    } else {
      setTitle('Chinese Government Scholarship (CSC) Silk Road Program');
      setHostUniversity('Tsinghua University / Host Institutions in China');
      setCountry('China');
      setDegreeLevel('MS');
      setCategory('Government');
      setFundingType('Full');
      setFinancialCoverage('Full Tuition Waiver + RMB 3,000/month Stipend + Free Campus Dormitory + Comprehensive Medical Insurance');
      setEligibilityCriteria('1. Non-Chinese national\n2. Bachelor degree or higher\n3. Under 35 years old\n4. HSK 4 or English Proficiency IELTS 6.0+');
      setRequiredDocuments('1. CSC Application Form\n2. Passport Copy\n3. Notarized Diplomas & Transcripts\n4. Study Plan / Research Proposal\n5. Two Recommendation Letters\n6. Physical Examination Form\n7. Non-Criminal Record Certificate');
      setOfficialLink('https://www.campuschina.org');
      setApplyLink('https://studyinchina.csc.edu.cn');
      setImage('/uploads/default-scholarship.jpg');
      setDescription('Full funding scholarship opportunity open for international applicants meeting academic eligibility standards.');
      setApplicationFee('Free / No Application Fee');
      setDeadline(new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    }
  };

  const openCreateModal = (type: 'scholarship' | 'internship' | 'fellowship' | 'seminar' = 'scholarship') => {
    setEditingId(null);
    setOpportunityType(type);
    // Completely clear all fields so form is fresh
    setTitle('');
    setHostUniversity('');
    setDescription('');
    setDegreeLevel(type === 'internship' ? 'BS' : type === 'fellowship' ? 'MS' : type === 'seminar' ? 'All Levels' : 'MS');
    setCountry('China');
    setCategory(type === 'internship' ? 'Research Internship' : type === 'fellowship' ? 'Leadership Fellowship' : type === 'seminar' ? 'Youth Forum' : 'Government');
    setFundingType('Full');
    setFinancialCoverage('');
    setEligibilityCriteria('');
    setRequiredDocuments('');
    setApplicationFee('');
    setDeadline('');
    setOfficialLink('');
    setApplyLink('');
    setImage(
      type === 'internship'
        ? '/uploads/cern-switzerland.svg'
        : type === 'fellowship'
        ? '/uploads/rotary-peace.svg'
        : type === 'seminar'
        ? '/uploads/wyf-egypt.svg'
        : '/uploads/default-scholarship.jpg'
    );
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

  const getEndpointForType = (type: string) => {
    switch (type) {
      case 'internship':
        return '/api/internships';
      case 'fellowship':
        return '/api/fellowships';
      case 'seminar':
        return '/api/seminars';
      default:
        return '/api/scholarships';
    }
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
      companyOrOrg: hostUniversity,
      foundationOrInst: hostUniversity,
      eventOrganizer: hostUniversity,
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

    const targetEndpoint = getEndpointForType(opportunityType);

    try {
      setSubmitting(true);
      setFormError(null);

      if (editingId) {
        try {
          await axios.put(`${targetEndpoint}/${editingId}`, payload);
        } catch (e1) {
          await axios.put(`/api/scholarships/${editingId}`, payload);
        }
        showToast(`${opportunityType.toUpperCase()} "${title}" updated successfully!`, 'success');
      } else {
        await axios.post(targetEndpoint, payload);
        showToast(`New ${opportunityType} "${title}" added successfully!`, 'success');
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
      
      try {
        await axios.delete(`/api/scholarships/${deletingItem.id}`);
      } catch (e1) {
        try {
          await axios.delete(`/api/internships/${deletingItem.id}`);
        } catch (e2) {
          try {
            await axios.delete(`/api/fellowships/${deletingItem.id}`);
          } catch (e3) {
            await axios.delete(`/api/seminars/${deletingItem.id}`);
          }
        }
      }

      showToast(`Item "${deletingItem.title}" permanently deleted from MongoDB database!`, 'success');
      setDeletingItem(null);
      fetchScholarships();
    } catch (err: any) {
      console.error('Delete error', err);
      showToast('Failed to delete item from database.', 'error');
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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-white">
            Manage Opportunities & Listings <span className="text-[#D4AF37] italic font-normal">({scholarships.length})</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Add, update, or remove scholarships, internships, fellowships, and seminars in MongoDB backend database</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openCreateModal('scholarship')}
            className="px-3.5 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Scholarship</span>
          </button>
          <button
            onClick={() => openCreateModal('internship')}
            className="px-3.5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Internship</span>
          </button>
          <button
            onClick={() => openCreateModal('fellowship')}
            className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Fellowship</span>
          </button>
          <button
            onClick={() => openCreateModal('seminar')}
            className="px-3.5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Seminar</span>
          </button>
        </div>
      </div>

      {/* Backend Database Status Notice */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Backend Database Integration Active (MongoDB API)
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            All records (Scholarships, Internships, Fellowships, Seminars) are persisted directly in the backend database. Every action (Create, Read, Update, Delete) interacts with Express backend controller routes (<code className="text-[#D4AF37] bg-slate-950 px-1.5 py-0.5 rounded">/api/scholarships</code>, <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded">/api/internships</code>, <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded">/api/fellowships</code>, <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded">/api/seminars</code>). No listings are stored hardcoded in frontend code.
          </p>
        </div>
      </div>

      {/* Category Marklist Filter Bar for Table */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Filter Database:</span>
        <button
          onClick={() => setTableFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            tableFilter === 'all'
              ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All ({scholarships.length})
        </button>
        <button
          onClick={() => setTableFilter('scholarship')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            tableFilter === 'scholarship'
              ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🎓 Scholarships ({scholarships.filter(s => (s.opportunityType || 'scholarship') === 'scholarship').length})
        </button>
        <button
          onClick={() => setTableFilter('internship')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            tableFilter === 'internship'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          💼 Internships ({scholarships.filter(s => s.opportunityType === 'internship').length})
        </button>
        <button
          onClick={() => setTableFilter('fellowship')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            tableFilter === 'fellowship'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🌟 Fellowships ({scholarships.filter(s => s.opportunityType === 'fellowship').length})
        </button>
        <button
          onClick={() => setTableFilter('seminar')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            tableFilter === 'seminar'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🌍 Seminars ({scholarships.filter(s => s.opportunityType === 'seminar').length})
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
                {scholarships
                  .filter((sch) => tableFilter === 'all' || (sch.opportunityType || 'scholarship') === tableFilter)
                  .map((sch) => (
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
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full flex flex-col max-h-[92vh] shadow-2xl overflow-hidden text-left"
            >
              {/* Fixed Header */}
              <div className="px-5 py-4 border-b border-slate-800 shrink-0 flex items-center justify-between bg-slate-900/90">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-white capitalize">
                    {editingId
                      ? `Edit ${opportunityType}`
                      : `Add New ${opportunityType === 'scholarship' ? 'Scholarship' : opportunityType === 'internship' ? 'Internship' : opportunityType === 'fellowship' ? 'Fellowship' : 'Seminar / Summit'}`}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {editingId ? 'Modify opportunity details in the database' : 'Enter clean details to add a new listing to the portal'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!editingId && (
                    <button
                      type="button"
                      onClick={() => loadExamplePreset(opportunityType)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                      title="Quick fill with sample data"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Auto-Fill Demo</span>
                      <span className="sm:hidden">Demo</span>
                    </button>
                  )}
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form with Scrollable Content Body and Sticky Footer */}
              <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 font-sans">
                  {formError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Ad Banner inside scholarship form view */}
                  <div className="my-1">
                    <AdBanner placement="in-feed" className="my-1" />
                  </div>

                  {/* Category Marklist Radio Group */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">
                      Select Opportunity Category / Type Checklist <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setOpportunityType('scholarship')}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          opportunityType === 'scholarship'
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-2 ring-[#D4AF37]/40 text-white'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-base">🎓</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            opportunityType === 'scholarship' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-slate-700'
                          }`}>
                            {opportunityType === 'scholarship' && <Check className="w-2.5 h-2.5 text-slate-950 font-bold" />}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Scholarship</h4>
                          <p className="text-[9px] text-slate-400">Tuition & Degree Grant</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpportunityType('internship')}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          opportunityType === 'internship'
                            ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-500/40 text-white'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-base">💼</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            opportunityType === 'internship' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                          }`}>
                            {opportunityType === 'internship' && <Check className="w-2.5 h-2.5 text-slate-950 font-bold" />}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Internship</h4>
                          <p className="text-[9px] text-slate-400">Paid / Lab Placement</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpportunityType('fellowship')}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          opportunityType === 'fellowship'
                            ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-500/40 text-white'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-base">🌟</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            opportunityType === 'fellowship' ? 'border-amber-400 bg-amber-400' : 'border-slate-700'
                          }`}>
                            {opportunityType === 'fellowship' && <Check className="w-2.5 h-2.5 text-slate-950 font-bold" />}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Fellowship</h4>
                          <p className="text-[9px] text-slate-400">Research & PostDoc</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpportunityType('seminar')}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          opportunityType === 'seminar'
                            ? 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-500/40 text-white'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-base">🌍</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            opportunityType === 'seminar' ? 'border-emerald-400 bg-emerald-400' : 'border-slate-700'
                          }`}>
                            {opportunityType === 'seminar' && <Check className="w-2.5 h-2.5 text-slate-950 font-bold" />}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">Seminar</h4>
                          <p className="text-[9px] text-slate-400">Summit & Conference</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                        {opportunityType === 'internship' ? 'Internship Title' : opportunityType === 'fellowship' ? 'Fellowship Title' : opportunityType === 'seminar' ? 'Seminar / Summit Title' : 'Scholarship Title'}
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={
                          opportunityType === 'internship'
                            ? 'e.g. CERN Summer Student Paid Internship 2026'
                            : opportunityType === 'fellowship'
                            ? 'e.g. Humboldt Research Fellowship Germany'
                            : opportunityType === 'seminar'
                            ? 'e.g. World Youth Forum & Leadership Summit'
                            : 'e.g. Chinese Government Scholarship (CSC)'
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">
                        {opportunityType === 'internship' ? 'Host Company / Lab / Org' : opportunityType === 'fellowship' ? 'Host Institute / Foundation' : opportunityType === 'seminar' ? 'Host Summit / Organization' : 'Host University / Institute'}
                      </label>
                      <input
                        type="text"
                        value={hostUniversity}
                        onChange={(e) => setHostUniversity(e.target.value)}
                        placeholder="e.g. CERN / Max Planck / World Bank / Tsinghua"
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
                </div>

                {/* Sticky Footer */}
                <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/95 shrink-0 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{submitting ? 'Saving...' : editingId ? 'Update Listing' : 'Publish Opportunity'}</span>
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
