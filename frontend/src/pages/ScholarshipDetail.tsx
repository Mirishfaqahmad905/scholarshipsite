import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Scholarship } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { AdBanner } from '../components/AdBanner';
import { SEO } from '../components/SEO';
import {
  Calendar,
  Globe,
  Award,
  ExternalLink,
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Share2,
  Sparkles,
} from 'lucide-react';

export const ScholarshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [related, setRelated] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/scholarships/${id}`);
        setScholarship(data);

        // Fetch related scholarships by degreeLevel
        if (data.degreeLevel) {
          const relRes = await axios.get(`/api/scholarships?degreeLevel=${data.degreeLevel}`);
          setRelated(relRes.data.filter((s: Scholarship) => s._id !== data._id).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load scholarship details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const scholarshipSchema = scholarship
    ? {
        '@context': 'https://schema.org',
        '@type': 'EducationalOccupationalCredential',
        name: scholarship.title,
        description: scholarship.description,
        educationalLevel: scholarship.degreeLevel,
        credentialCategory: scholarship.category,
        recognizedBy: {
          '@type': 'AdministrativeArea',
          name: scholarship.country,
        },
      }
    : undefined;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading Scholarship Details...</p>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Scholarship Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">The opportunity you are looking for may have been removed or updated.</p>
        <Link to="/scholarships" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isExpired = new Date(scholarship.deadline) < new Date();
  const daysLeft = Math.ceil((new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 3600 * 24));

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <SEO
        title={`${scholarship.title} (${scholarship.degreeLevel}) — ${scholarship.country}`}
        description={scholarship.description.slice(0, 160)}
        keywords={`${scholarship.title}, ${scholarship.degreeLevel} scholarship, ${scholarship.country} scholarship, CSC grant`}
        image={scholarship.image}
        schema={scholarshipSchema}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Scholarship Detail Ad */}
        <AdBanner placement="scholarship-detail-top" />

        {/* Back navigation */}
        <Link
          to="/scholarships"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Back to Directory</span>
        </Link>

        {/* Hero Image Header */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          <img
            src={scholarship.image || '/uploads/default-scholarship.jpg'}
            alt={scholarship.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/uploads/default-scholarship.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/50 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 bg-[#D4AF37] text-slate-950 font-bold text-[11px] uppercase tracking-wider rounded-xl shadow-sm">
              {scholarship.fundingType} Coverage
            </span>
            <span className="px-3.5 py-1 bg-slate-900/90 border border-slate-700 text-[#D4AF37] font-bold text-[11px] uppercase tracking-wider rounded-xl backdrop-blur-md">
              {scholarship.degreeLevel} Program
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{scholarship.country}</span>
                <span className="text-slate-500">•</span>
                <span>{scholarship.category}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white leading-tight">
                {scholarship.title}
              </h1>
            </div>

            <button
              onClick={handleShare}
              className="self-start sm:self-auto px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-700 flex items-center gap-2 shrink-0 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Content & Action Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-md">
              <div>
                <h2 className="text-xl font-serif font-semibold text-white mb-4 border-b border-slate-800/80 pb-3">About This Opportunity</h2>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {scholarship.description}
                </div>
              </div>

              {/* Host University & Application Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">Host Institution / University</span>
                  <p className="text-sm font-semibold text-white">{scholarship.hostUniversity || 'Top Partner Universities & Institutes'}</p>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">Application Fee</span>
                  <p className="text-sm font-semibold text-emerald-400">{scholarship.applicationFee || 'Free / No Application Fee'}</p>
                </div>
              </div>

              {/* Financial Coverage */}
              {scholarship.financialCoverage && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Financial Coverage & Benefits</span>
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {scholarship.financialCoverage}
                  </p>
                </div>
              )}

              {/* Eligibility Criteria */}
              {scholarship.eligibilityCriteria && (
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    Eligibility Criteria & Requirements
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {scholarship.eligibilityCriteria}
                  </p>
                </div>
              )}

              {/* Required Documents */}
              {scholarship.requiredDocuments && (
                <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Required Documents Checklist
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                    {scholarship.requiredDocuments}
                  </p>
                </div>
              )}

              {/* Requirement highlights */}
              <div className="pt-6 border-t border-slate-800/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Key Information Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Host Country</span>
                    <span className="text-white font-semibold text-sm">{scholarship.country}</span>
                  </div>
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Degree Level</span>
                    <span className="text-white font-semibold text-sm">{scholarship.degreeLevel} Program</span>
                  </div>
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Funding Type</span>
                    <span className="text-[#D4AF37] font-semibold text-sm">{scholarship.fundingType} Coverage</span>
                  </div>
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Application Status</span>
                    <span className={`font-semibold text-sm ${scholarship.status === 'open' && !isExpired ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {scholarship.status === 'open' && !isExpired ? 'Open for Applications' : 'Closed / Past Deadline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* In-Feed Ad Banner */}
            <AdBanner placement="in-feed" />
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl shadow-2xl space-y-5 backdrop-blur-md">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Application Deadline</span>
                <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>{new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-md border border-[#D4AF37]/30">
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <a
                  href={scholarship.applyLink || scholarship.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl text-center transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Apply via Official Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href={scholarship.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-xs rounded-2xl text-center transition-colors flex items-center justify-center gap-2 border border-slate-700/60"
                >
                  <span>Visit Official Source Page</span>
                  <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                </a>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Direct Application Portal</span>
              </div>
            </div>

            {/* Sidebar Ad Banner */}
            <AdBanner placement="sidebar" />
          </div>
        </div>

        {/* Bottom Scholarship Detail Ad */}
        <AdBanner placement="scholarship-detail-bottom" />

        {/* Related Opportunities */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-slate-800/80 space-y-6">
            <h3 className="text-2xl font-serif font-semibold text-white">Related <span className="italic font-normal text-[#D4AF37]">{scholarship.degreeLevel} Scholarships</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <ScholarshipCard key={item._id} scholarship={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
