import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Scholarship } from '../types';
import { FilterDropdowns } from '../components/FilterDropdowns';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { AdBanner } from '../components/AdBanner';
import { GraduationCap, Sparkles, AlertCircle, Briefcase, Award, Globe } from 'lucide-react';

interface ScholarshipsPageProps {
  presetType?: 'scholarship' | 'internship' | 'fellowship' | 'seminar';
}

export const Scholarships: React.FC<ScholarshipsPageProps> = ({ presetType }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [degreeLevel, setDegreeLevel] = useState<string>(searchParams.get('degreeLevel') || 'All');
  const [country, setCountry] = useState<string>(searchParams.get('country') || 'All');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'All');
  const [fundingType, setFundingType] = useState<string>(searchParams.get('fundingType') || 'All');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'All');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state with searchParams on mount or param change
  useEffect(() => {
    if (searchParams.has('search')) setSearch(searchParams.get('search')!);
    if (searchParams.has('degreeLevel')) setDegreeLevel(searchParams.get('degreeLevel')!);
    if (searchParams.has('country')) setCountry(searchParams.get('country')!);
    if (searchParams.has('category')) setCategory(searchParams.get('category')!);
    if (searchParams.has('fundingType')) setFundingType(searchParams.get('fundingType')!);
    if (searchParams.has('status')) setStatus(searchParams.get('status')!);
  }, [searchParams]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (degreeLevel !== 'All') params.append('degreeLevel', degreeLevel);
      if (country !== 'All') params.append('country', country);
      if (category !== 'All') params.append('category', category);
      if (fundingType !== 'All') params.append('fundingType', fundingType);
      if (status !== 'All') params.append('status', status);

      let allResults: Scholarship[] = [];
      const queryStr = params.toString() ? `?${params.toString()}` : '';

      if (presetType === 'scholarship') {
        const { data } = await axios.get(`/api/scholarships${queryStr}`);
        allResults = data;
      } else if (presetType === 'internship') {
        const { data } = await axios.get(`/api/internships${queryStr}`);
        allResults = data;
      } else if (presetType === 'fellowship') {
        const { data } = await axios.get(`/api/fellowships${queryStr}`);
        allResults = data;
      } else if (presetType === 'seminar') {
        const { data } = await axios.get(`/api/seminars${queryStr}`);
        allResults = data;
      } else {
        // Aggregate from all endpoints
        const [schRes, intRes, felRes, semRes] = await Promise.allSettled([
          axios.get(`/api/scholarships${queryStr}`),
          axios.get(`/api/internships${queryStr}`),
          axios.get(`/api/fellowships${queryStr}`),
          axios.get(`/api/seminars${queryStr}`),
        ]);
        const schList = schRes.status === 'fulfilled' ? schRes.value.data : [];
        const intList = intRes.status === 'fulfilled' ? intRes.value.data : [];
        const felList = felRes.status === 'fulfilled' ? felRes.value.data : [];
        const semList = semRes.status === 'fulfilled' ? semRes.value.data : [];
        allResults = [...schList, ...intList, ...felList, ...semList];
      }

      setScholarships(allResults);
    } catch (err) {
      console.error('Failed to load opportunities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [presetType, search, degreeLevel, country, category, fundingType, status]);

  const handleReset = () => {
    setSearch('');
    setDegreeLevel('All');
    setCountry('All');
    setCategory('All');
    setFundingType('All');
    setStatus('All');
    setSearchParams({});
  };

  // Header customization by type
  const getHeaderInfo = () => {
    switch (presetType) {
      case 'internship':
        return {
          icon: <Briefcase className="w-3.5 h-3.5 text-cyan-400" />,
          badge: 'Global Internship Directory',
          titlePrefix: 'Paid & Funded ',
          titleHighlight: 'Internships',
          subtitle: 'Discover verified international summer internships, lab placements, and industry training programs worldwide.',
          emptyText: 'No Internships Found',
        };
      case 'fellowship':
        return {
          icon: <Award className="w-3.5 h-3.5 text-amber-400" />,
          badge: 'International Fellowships',
          titlePrefix: 'Prestigious Global ',
          titleHighlight: 'Fellowships',
          subtitle: 'Explore elite leadership, research, and post-doctoral fellowship opportunities funded by global foundations.',
          emptyText: 'No Fellowships Found',
        };
      case 'seminar':
        return {
          icon: <Globe className="w-3.5 h-3.5 text-emerald-400" />,
          badge: 'International Seminars & Summits',
          titlePrefix: 'Fully Funded ',
          titleHighlight: 'Seminars & Summits',
          subtitle: 'Attend top international youth forums, academic seminars, and cultural exchange summits across different countries.',
          emptyText: 'No Seminars Found',
        };
      default:
        return {
          icon: <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />,
          badge: 'Scholarship Directory',
          titlePrefix: 'Find Grants & ',
          titleHighlight: 'Scholarships',
          subtitle: 'Browse through fully and partially funded scholarships sorted by degree level, destination country, and funding category.',
          emptyText: 'No Scholarships Found',
        };
    }
  };

  const header = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            {header.icon}
            <span>{header.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-white">
            {header.titlePrefix}<span className="italic font-normal text-[#D4AF37]">{header.titleHighlight}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-sans">
            {header.subtitle}
          </p>
        </div>

        {/* Header Ad Placement */}
        <AdBanner placement="header" />

        {/* Filter Controls */}
        <FilterDropdowns
          search={search}
          setSearch={setSearch}
          degreeLevel={degreeLevel}
          setDegreeLevel={setDegreeLevel}
          country={country}
          setCountry={setCountry}
          category={category}
          setCategory={setCategory}
          fundingType={fundingType}
          setFundingType={setFundingType}
          status={status}
          setStatus={setStatus}
          onReset={handleReset}
        />

        {/* Main Grid + Sidebar Ad Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Scholarships Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Showing <strong className="text-[#D4AF37]">{scholarships.length}</strong> opportunities</span>
              {(search || degreeLevel !== 'All' || country !== 'All' || category !== 'All') && (
                <button onClick={handleReset} className="text-[#D4AF37] hover:underline font-semibold">
                  Clear all active filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 bg-slate-900/40 rounded-3xl animate-pulse border border-slate-800/80" />
                ))}
              </div>
            ) : scholarships.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h3 className="text-xl font-serif font-semibold text-white">{header.emptyText}</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try clearing search filters or selecting a different target country or category.
                </p>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scholarships.map((s) => (
                  <ScholarshipCard key={s._id} scholarship={s} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Ad & Info */}
          <div className="space-y-6">
            <AdBanner placement="sidebar" />

            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-3 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em]">
                <Sparkles className="w-4 h-4" />
                <span>Application Tip</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Always double check official guidelines, eligibility criteria, and visa requirements on the official provider link before submitting your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Internships: React.FC = () => <Scholarships presetType="internship" />;
export const Fellowships: React.FC = () => <Scholarships presetType="fellowship" />;
export const Seminars: React.FC = () => <Scholarships presetType="seminar" />;

