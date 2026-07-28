import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, GraduationCap, ArrowRight, Shield, Award, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [degreeLevel, setDegreeLevel] = useState('All');
  const [country, setCountry] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (degreeLevel !== 'All') params.set('degreeLevel', degreeLevel);
    if (country !== 'All') params.set('country', country);
    navigate(`/scholarships?${params.toString()}`);
  };

  return (
    <div className="relative bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#090d16] text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800/80">
      {/* Background subtle radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-[#D4AF37]/12 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Verified 2026 Academic Grants Directory</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-semibold tracking-tight text-white leading-[1.15]">
            Discover Fully Funded <br className="hidden sm:inline" />
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FACC15] to-[#D4AF37]">
              International Scholarships
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            Browse verified Bachelors, Masters, and PhD funding opportunities across China, USA, UK, Finland, Germany, and top worldwide universities.
          </p>
        </div>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-700/80 p-3 sm:p-4 rounded-3xl shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <input
                type="text"
                placeholder="Search scholarship, university, tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Degree Select */}
            <div className="sm:col-span-3 relative">
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="All">All Degrees (BS, MS, PhD)</option>
                <option value="BS">BS / Undergraduate</option>
                <option value="MS">MS / Masters</option>
                <option value="PhD">PhD / Doctorate</option>
              </select>
            </div>

            {/* Country Select */}
            <div className="sm:col-span-2 relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="All">All Countries</option>
                <option value="China">China (CSC)</option>
                <option value="USA">USA</option>
                <option value="Finland">Finland</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
                <option value="Australia">Australia</option>
                <option value="Japan">Japan</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold uppercase tracking-wider text-xs rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Stats Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-serif font-bold text-[#D4AF37]">500+</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Verified Grants</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-serif font-bold text-white">45+</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Countries Supported</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-serif font-bold text-[#D4AF37]">100%</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Official Direct Links</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="text-2xl font-serif font-bold text-white">$150M+</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Combined Funding</div>
          </div>
        </div>
      </div>
    </div>
  );
};
