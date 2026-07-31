import React from 'react';
import { useSocial } from '../context/SocialContext';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const { settings } = useSocial();
  const customLogoUrl = settings?.siteLogoUrl;

  // Dimension calculations for icon
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[8px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', badge: 'text-[9px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-[10px]' },
  };

  const currentSize = sizeClasses[size];

  // Derive site name display words if available
  const siteName = settings?.siteName || 'Scholarship Opportunity';
  const nameParts = siteName.split(' ');
  const mainTitle = nameParts[0] || 'Scholarship';
  const subTitle = nameParts.slice(1).join(' ') || 'Opportunity';

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Brand Logo Emblem SVG or Custom Uploaded Logo */}
      <div
        className={`${currentSize.icon} relative flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#1e1b12] border border-[#D4AF37]/50 p-1.5 shadow-md shadow-amber-950/20 group-hover:border-[#D4AF37] group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden`}
      >
        {/* Glowing backdrop aura */}
        <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-xl blur-xs group-hover:bg-[#D4AF37]/25 transition-all" />

        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt={siteName}
            className="w-full h-full object-contain relative z-10 rounded-lg"
          />
        ) : (
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10"
          >
            {/* Graduation Cap & Soaring Star Motif */}
            <path
              d="M20 7L35 15L20 23L5 15L20 7Z"
              fill="url(#goldGradient)"
              stroke="#FEF08A"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M10 18.5V26.5C10 26.5 14.5 30 20 30C25.5 30 30 26.5 30 26.5V18.5"
              stroke="url(#goldGradient)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M32 17.5V27.5M32 27.5L30 26M32 27.5L34 26"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sparkle Star */}
            <circle cx="20" cy="15" r="1.5" fill="#FFFFFF" />
            <path
              d="M20 11.5V18.5M16.5 15H23.5"
              stroke="#FFFFFF"
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.8"
            />

            <defs>
              <linearGradient
                id="goldGradient"
                x1="5"
                y1="7"
                x2="35"
                y2="30"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F59E0B" />
                <stop offset="0.5" stopColor="#D4AF37" />
                <stop offset="1" stopColor="#FEF08A" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* Brand Typography */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className={`${currentSize.text} font-serif font-bold tracking-tight text-white leading-none flex items-center gap-1`}>
            <span>{mainTitle}</span>
            {subTitle && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-300 to-amber-500 font-semibold italic">
                {subTitle}
              </span>
            )}
          </div>
          {variant === 'full' && (
            <span className={`${currentSize.badge} block text-slate-400 font-sans tracking-[0.2em] uppercase font-semibold mt-1`}>
              Verified Global Grants & Study
            </span>
          )}
        </div>
      )}
    </div>
  );
};
