import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-700/80 text-amber-400 hover:border-amber-400/60 hover:bg-slate-800'
          : 'bg-white border-slate-300 text-slate-800 hover:border-amber-500 hover:bg-slate-100 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wider font-sans select-none">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};
