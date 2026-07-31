import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import { LayoutDashboard, LogOut, Menu, X, User as UserIcon, BookOpen, Compass, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-800/80 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <Logo variant="full" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/') ? 'bg-slate-800/80 text-[#D4AF37] font-bold border border-slate-700/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Home
            </Link>
            <Link
              to="/scholarships"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/scholarships') ? 'bg-slate-800/80 text-[#D4AF37] font-bold border border-slate-700/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Scholarships
            </Link>
            <Link
              to="/internships"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/internships') ? 'bg-slate-800/80 text-[#D4AF37] font-bold border border-slate-700/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Internships
            </Link>
            <Link
              to="/fellowships"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/fellowships') ? 'bg-slate-800/80 text-[#D4AF37] font-bold border border-slate-700/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Fellowships
            </Link>
            <Link
              to="/seminars"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/seminars') ? 'bg-slate-800/80 text-[#D4AF37] font-bold border border-slate-700/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Seminars
            </Link>
            <Link
              to="/blog"
              className={`px-3 py-2 rounded-lg transition-all ${
                isActive('/blog') ? 'bg-slate-800/80 text-[#D4AF37] font-bold border border-slate-700/60' : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              Blog
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`ml-1 px-3 py-1.5 rounded-lg border border-[#D4AF37]/50 text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-slate-950 font-bold transition-all duration-200 flex items-center gap-1 text-[11px] uppercase tracking-widest`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/80 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-bold text-xs flex items-center justify-center uppercase shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-200 font-medium max-w-[120px] truncate">{user.name}</span>
                  {isAdmin && (
                    <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-xs uppercase tracking-wider font-bold bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/scholarships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Scholarships
          </Link>
          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Internships
          </Link>
          <Link
            to="/fellowships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Fellowships
          </Link>
          <Link
            to="/seminars"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Seminars
          </Link>
          <Link
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Blog & Articles
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Contact
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300 font-medium">Logged in as {user.name}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 text-xs text-rose-400 bg-rose-500/10 rounded-md font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2.5 text-sm font-bold text-slate-950 bg-[#D4AF37] rounded-xl shadow"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
