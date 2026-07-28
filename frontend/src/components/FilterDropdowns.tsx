import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, RotateCcw, Globe, GraduationCap, Tag, DollarSign, CheckCircle2 } from 'lucide-react';
import { Category, Country } from '../types';

interface FilterDropdownsProps {
  search: string;
  setSearch: (v: string) => void;
  degreeLevel: string;
  setDegreeLevel: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  fundingType: string;
  setFundingType: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  onReset: () => void;
}

export const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  search,
  setSearch,
  degreeLevel,
  setDegreeLevel,
  country,
  setCountry,
  category,
  setCategory,
  fundingType,
  setFundingType,
  status,
  setStatus,
  onReset,
}) => {
  const [countriesList, setCountriesList] = useState<string[]>([
    'China',
    'USA',
    'Finland',
    'UK',
    'Canada',
    'Germany',
    'Australia',
    'Japan',
    'Netherlands',
    'Sweden',
    'Switzerland',
    'Italy',
    'France',
    'South Korea',
  ]);

  const [categoriesList, setCategoriesList] = useState<string[]>([
    'Merit-based',
    'Need-based',
    'Government',
    'University-specific',
    'Research Fellowship',
    'STEM Excellence',
  ]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const { data } = await axios.get('/api/scholarships/meta/options');
        if (data.countries && data.countries.length > 0) {
          const names = data.countries.map((c: Country) => c.name);
          // ensure China, USA, Finland, UK, Canada, Germany, Australia are included
          const defaultList = ['China', 'USA', 'Finland', 'UK', 'Canada', 'Germany', 'Australia'];
          const combined = Array.from(new Set([...defaultList, ...names]));
          setCountriesList(combined.sort());
        }
        if (data.categories && data.categories.length > 0) {
          const names = data.categories.map((c: Category) => c.name);
          setCategoriesList(Array.from(new Set(names)).sort());
        }
      } catch (err) {
        console.warn('Using default options list');
      }
    };
    loadMeta();
  }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-white font-serif font-semibold text-lg">
          <Filter className="w-5 h-5 text-[#D4AF37]" />
          <span>Filter & Directory Search</span>
        </div>

        {/* Degree Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'BS', 'MS', 'PhD'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setDegreeLevel(lvl)}
              className={`px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all ${
                degreeLevel === lvl
                  ? 'bg-[#D4AF37] text-slate-950 shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
              }`}
            >
              {lvl === 'All' ? 'All Degrees' : lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Keyword */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Search Keyword</label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Title, university, tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Country Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#D4AF37]" /> Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Countries ({countriesList.length})</option>
            {countriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#D4AF37]" /> Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Funding Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#D4AF37]" /> Funding Type
          </label>
          <select
            value={fundingType}
            onChange={(e) => setFundingType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="All">All Funding Types</option>
            <option value="Full">Full Funding</option>
            <option value="Partial">Partial Funding</option>
          </select>
        </div>

        {/* Status Filter & Reset */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Status & Reset</label>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All Statuses</option>
              <option value="open">Open Only</option>
              <option value="closed">Closed Only</option>
            </select>

            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-2xl text-xs font-semibold transition-colors flex items-center justify-center shrink-0 border border-slate-700/60"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
