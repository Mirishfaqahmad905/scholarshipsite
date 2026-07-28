import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Ad } from '../types';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdBannerProps {
  placement:
    | 'header'
    | 'sidebar'
    | 'in-feed'
    | 'footer'
    | 'popup'
    | 'scholarship-detail-top'
    | 'scholarship-detail-bottom'
    | 'blog-sidebar';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/ads?placement=${placement}&activeOnly=true`);
        if (Array.isArray(data) && data.length > 0) {
          // pick a random active ad for this placement
          const selected = data[Math.floor(Math.random() * data.length)];
          setAd(selected);
        } else {
          setAd(null);
        }
      } catch (err) {
        console.error(`Failed to fetch ad for placement ${placement}`, err);
        setAd(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [placement]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-800/40 rounded-xl h-16 w-full ${className}`} />
    );
  }

  if (!ad) {
    // Default tasteful placeholder ads if none explicitly active in admin
    if (placement === 'header') {
      return (
        <div className={`w-full max-w-7xl mx-auto my-3 px-4 ${className}`}>
          <a
            href="https://www.e2language.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-[#090d16] via-[#111827] to-[#090d16] border border-[#D4AF37]/30 rounded-2xl p-3.5 text-slate-100 hover:border-[#D4AF37]/60 transition-all shadow-md group"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-[#D4AF37] text-slate-950 rounded">
                  Sponsor
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                  IELTS & TOEFL Academic Prep Accelerator — Exclusive 30% Off Student Discount
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37] shrink-0">
                Claim Offer <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        </div>
      );
    }

    if (placement === 'scholarship-detail-top' || placement === 'scholarship-detail-bottom') {
      return (
        <div className={`w-full my-4 ${className}`}>
          <a
            href="https://www.campuschina.org"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-900/90 border border-slate-700/80 hover:border-[#D4AF37]/60 p-4 rounded-2xl transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Official Partner Ad</span>
                <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37]">
                  Certified University Document Translation & SOP Review Service
                </h4>
              </div>
              <span className="px-3 py-1.5 bg-[#D4AF37] text-slate-950 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1">
                Explore <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </a>
        </div>
      );
    }

    if (placement === 'sidebar' || placement === 'blog-sidebar') {
      return (
        <div className={`w-full my-4 ${className}`}>
          <a
            href="https://www.topuniversities.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-slate-900/80 border border-slate-800 hover:border-[#D4AF37]/50 p-4 rounded-2xl text-center space-y-2 group transition-all"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">Featured Sponsor</span>
            <p className="text-xs font-semibold text-slate-200 group-hover:text-white">Global University Rankings & Free Admission Assessment 2026</p>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4AF37]">
              <span>Free Consultation</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </div>
      );
    }

    return null;
  }

  return (
    <div className={`w-full my-4 ${className}`}>
      <a
        href={ad.targetLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative group overflow-hidden rounded-xl border border-slate-700/60 shadow-md bg-slate-900 transition-all duration-300 hover:border-amber-400/80 hover:shadow-lg"
      >
        <div className="relative">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full h-auto max-h-[160px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sponsored
          </div>
          <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 opacity-95 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
            <span>{ad.title}</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </a>
    </div>
  );
};
