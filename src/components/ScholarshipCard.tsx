import React from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '../types';
import { Calendar, Globe, Award, ArrowUpRight, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const isExpired = new Date(scholarship.deadline) < new Date();

  // Calculate days remaining
  const getDaysLeft = () => {
    const diff = new Date(scholarship.deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Deadline Today';
    return `${days} days left`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-2xl flex flex-col justify-between group backdrop-blur-sm">
      <div>
        {/* Top Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={scholarship.image || '/uploads/default-scholarship.jpg'}
            alt={scholarship.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/uploads/default-scholarship.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg tracking-wider uppercase backdrop-blur-md shadow-md ${
                scholarship.opportunityType === 'internship'
                  ? 'bg-cyan-500 text-slate-950 border border-cyan-400'
                  : scholarship.opportunityType === 'fellowship'
                  ? 'bg-amber-400 text-slate-950 border border-amber-300'
                  : scholarship.opportunityType === 'seminar'
                  ? 'bg-emerald-400 text-slate-950 border border-emerald-300'
                  : 'bg-[#D4AF37] text-slate-950 border border-amber-300'
              }`}
            >
              {scholarship.opportunityType ? scholarship.opportunityType.toUpperCase() : 'SCHOLARSHIP'}
            </span>

            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg tracking-wider uppercase backdrop-blur-md ${
                scholarship.degreeLevel === 'PhD'
                  ? 'bg-purple-950/80 text-purple-200 border border-purple-500/40'
                  : scholarship.degreeLevel === 'MS'
                  ? 'bg-blue-950/80 text-blue-200 border border-blue-500/40'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-700/80'
              }`}
            >
              {scholarship.degreeLevel}
            </span>

            <span
              className={`px-2 py-0.5 text-[10px] font-bold rounded-lg tracking-wider uppercase backdrop-blur-md ${
                scholarship.fundingType === 'Full' || scholarship.fundingType === 'Fully Funded'
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700'
              }`}
            >
              {scholarship.fundingType}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 backdrop-blur-md ${
                scholarship.status === 'open' && !isExpired
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${scholarship.status === 'open' && !isExpired ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              {scholarship.status === 'open' && !isExpired ? 'Open' : 'Closed'}
            </span>
          </div>

          {/* Location pill on image bottom */}
          <div className="absolute bottom-3 left-3 text-xs font-semibold text-white bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{scholarship.country}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{scholarship.category}</span>
          </div>

          <Link to={`/scholarships/${scholarship._id}`} className="block group-hover:text-[#D4AF37] transition-colors">
            <h3 className="text-xl font-serif font-semibold text-white line-clamp-2 leading-snug">
              {scholarship.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">
            {scholarship.description}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 space-y-4">
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-mono">Deadline: {new Date(scholarship.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-1 text-[#D4AF37] font-semibold text-[10px] uppercase tracking-wider bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
            <Clock className="w-3 h-3" />
            <span>{getDaysLeft()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Link
            to={`/scholarships/${scholarship._id}`}
            className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-[11px] uppercase tracking-wider font-semibold rounded-xl text-center transition-colors flex items-center justify-center gap-1 border border-slate-700/60"
          >
            View Details
          </Link>
          <a
            href={scholarship.applyLink || scholarship.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-[11px] uppercase tracking-wider rounded-xl text-center transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
