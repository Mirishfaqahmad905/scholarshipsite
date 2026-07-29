import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DashboardStats } from '../../types';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Megaphone,
  Users,
  PlusCircle,
  TrendingUp,
  Globe,
  Settings,
  ShieldAlert,
  Share2,
  Mail,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/users/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [location.pathname]);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Scholarships', path: '/admin/scholarships', icon: GraduationCap },
    { label: 'Blog Articles', path: '/admin/blogs', icon: BookOpen },
    { label: 'Ad Banners', path: '/admin/ads', icon: Megaphone },
    { label: 'Subscribers & Alerts', path: '/admin/subscribers', icon: Mail },
    { label: 'SEO Optimization', path: '/admin/seo', icon: Search },
    { label: 'Social & Links', path: '/admin/settings', icon: Share2 },
    { label: 'Users & Roles', path: '/admin/users', icon: Users },
  ];

  const isSubRoute = location.pathname !== '/admin';

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em] mb-1">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white">
              Scholarship Portal <span className="italic font-normal text-[#D4AF37]">Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-2 font-sans">
              Create, edit, and organize scholarship listings, blog articles, ad banners, and user accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/scholarships"
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Scholarship</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-[#D4AF37] text-slate-950 shadow-md'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/80 hover:text-white border border-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* If SubRoute, render Outlet (e.g., ManageScholarships), otherwise show Overview */}
        {isSubRoute ? (
          <Outlet />
        ) : (
          <div className="space-y-8">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Grants</div>
                <div className="text-2xl font-serif font-bold text-[#D4AF37] mt-1">
                  {loading ? '...' : stats?.totalScholarships || 0}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
                  {stats?.openScholarships || 0} open now
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Blog Posts</div>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  {loading ? '...' : stats?.totalBlogs || 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Published articles</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Ads</div>
                <div className="text-2xl font-serif font-bold text-[#D4AF37] mt-1">
                  {loading ? '...' : stats?.activeAds || 0}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Header/Sidebar/Feed</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Users</div>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  {loading ? '...' : stats?.totalUsers || 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Registered</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Destinations</div>
                <div className="text-2xl font-serif font-bold text-[#D4AF37] mt-1">
                  {loading ? '...' : stats?.totalCountries || 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Countries</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between backdrop-blur-md">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">System Health</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  API Active
                </div>
                <div className="text-[10px] text-slate-500">JWT Authorized</div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                to="/admin/scholarships"
                className="bg-slate-900/60 border border-slate-800/80 hover:border-[#D4AF37]/50 p-6 rounded-3xl transition-all duration-300 group shadow-xl backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                  Manage Scholarships
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                  Add new Bachelors, Masters, and PhD listings, set deadlines, upload official images via Multer, and change program statuses.
                </p>
              </Link>

              <Link
                to="/admin/blogs"
                className="bg-slate-900/60 border border-slate-800/80 hover:border-[#D4AF37]/50 p-6 rounded-3xl transition-all duration-300 group shadow-xl backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                  Manage Blog Articles
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                  Publish essay advice, CSC application walk-throughs, visa tips, and manage cover photos.
                </p>
              </Link>

              <Link
                to="/admin/ads"
                className="bg-slate-900/60 border border-slate-800/80 hover:border-[#D4AF37]/50 p-6 rounded-3xl transition-all duration-300 group shadow-xl backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                  Manage Ad Banners
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                  Configure header, sidebar, and in-feed promotional placements with target links and scheduling dates.
                </p>
              </Link>

              <Link
                to="/admin/settings"
                className="bg-slate-900/60 border border-slate-800/80 hover:border-[#D4AF37]/50 p-6 rounded-3xl transition-all duration-300 group shadow-xl backdrop-blur-md"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                  Social & Site Links
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                  Manage site URL, email, WhatsApp, GitHub, Snapchat, Instagram, Telegram, and custom social channels in real-time.
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
