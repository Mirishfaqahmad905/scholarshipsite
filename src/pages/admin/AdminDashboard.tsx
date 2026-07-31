import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { DashboardStats } from '../../types';
import { Logo } from '../../components/Logo';
import { ChangeCredentialsModal } from '../../components/admin/ChangeCredentialsModal';
import { AdminAnalyticsView } from '../../components/admin/AdminAnalyticsView';
import { SystemLogsView } from '../../components/admin/SystemLogsView';
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Megaphone,
  Users,
  PlusCircle,
  TrendingUp,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Share2,
  Mail,
  Search,
  Database,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  BarChart3,
  Terminal,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  User as UserIcon,
  X,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Active view tab state for non-router subviews (Overview vs Analytics vs Logs vs Credentials)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'logs'>('overview');

  // Security credentials modal
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState<boolean>(false);

  // Top bar notifications popover state
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // User profile menu dropdown
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  // Global search input
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  // Light / Dark Theme toggle state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check path state
  const currentPath = location.pathname;
  const isSubRoute = currentPath !== '/admin';

  // Navigation Items Config
  const sidebarNavGroups = [
    {
      group: 'CORE WORKSPACE',
      items: [
        { label: 'Overview', path: '/admin', icon: LayoutDashboard, tab: 'overview' },
        { label: 'Analytics', path: '/admin?tab=analytics', icon: BarChart3, tab: 'analytics' },
        { label: 'Subscribers & Alerts', path: '/admin/subscribers', icon: Mail },
      ],
    },
    {
      group: 'CONTENT & OPPORTUNITIES',
      items: [
        { label: 'Scholarships', path: '/admin/scholarships', icon: GraduationCap, count: stats?.totalScholarships },
        { label: 'Internships', path: '/admin/internships', icon: Briefcase },
        { label: 'Fellowships', path: '/admin/fellowships', icon: Award },
        { label: 'Blog Articles', path: '/admin/blogs', icon: BookOpen, count: stats?.totalBlogs },
        { label: 'Ad Banners', path: '/admin/ads', icon: Megaphone },
      ],
    },
    {
      group: 'MARKETING & CONFIG',
      items: [
        { label: 'SEO Optimization', path: '/admin/seo', icon: Search },
        { label: 'Social & Brand Logo', path: '/admin/settings', icon: Share2 },
      ],
    },
    {
      group: 'SYSTEM & SECURITY',
      items: [
        { label: 'Users & Roles', path: '/admin/users', icon: Users, count: stats?.totalUsers },
        { label: 'Admin Credentials', action: () => setIsCredentialsModalOpen(true), icon: ShieldCheck, badge: 'Verified' },
        { label: 'System Logs', path: '/admin?tab=logs', icon: Terminal, tab: 'logs' },
      ],
    },
  ];

  // Derive breadcrumbs text
  const getBreadcrumbTitle = () => {
    if (currentPath === '/admin/scholarships') return 'Scholarships Management';
    if (currentPath === '/admin/internships') return 'Internships Management';
    if (currentPath === '/admin/fellowships') return 'Fellowships Management';
    if (currentPath === '/admin/blogs') return 'Blog Articles & News';
    if (currentPath === '/admin/ads') return 'Ad Banners & Monetization';
    if (currentPath === '/admin/subscribers') return 'Subscribers & Newsletter';
    if (currentPath === '/admin/seo') return 'SEO Optimization';
    if (currentPath === '/admin/settings') return 'Social & Brand Settings';
    if (currentPath === '/admin/users') return 'Users & Access Control';
    if (activeTab === 'analytics') return 'Analytics & Portal Telemetry';
    if (activeTab === 'logs') return 'System Audit Logs & Health';
    return 'Dashboard Overview';
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-200 font-sans`}>
      {/* ========================================================= */}
      {/* 1. FIXED COLLAPSIBLE LEFT SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen ${
          isDarkMode ? 'bg-[#0f172a]/95 border-slate-800/80' : 'bg-white border-slate-200 shadow-xl'
        } border-r transition-all duration-300 flex flex-col ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <Logo size="sm" variant="compact" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 uppercase tracking-widest shrink-0">
                PRO v2.4
              </span>
            </div>
          ) : (
            <div className="mx-auto">
              <Logo size="sm" variant="icon" />
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all shrink-0"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {sidebarNavGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {group.group}
                </div>
              )}
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isItemActive =
                  item.path === currentPath ||
                  (item.tab && activeTab === item.tab && !isSubRoute);

                const handleClick = (e: React.MouseEvent) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  } else if (item.tab) {
                    setActiveTab(item.tab as any);
                  }
                };

                return (
                  <Link
                    key={itemIdx}
                    to={item.path || '#'}
                    onClick={handleClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isItemActive
                        ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-md shadow-amber-950/20'
                        : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isItemActive ? 'text-slate-950' : 'text-[#D4AF37]'}`} />
                    {!isSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between overflow-hidden">
                        <span className="truncate">{item.label}</span>
                        {item.count !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isItemActive
                                ? 'bg-slate-950 text-[#D4AF37]'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 border-t border-slate-800/60 shrink-0">
          {!isSidebarCollapsed ? (
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-200 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{user?.name || 'Admin User'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@scholarship.org'}</div>
                </div>
              </div>
              <button
                onClick={() => setIsCredentialsModalOpen(true)}
                className="p-1.5 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800 rounded-lg transition-all"
                title="Change Admin Password / Username"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCredentialsModalOpen(true)}
              className="w-10 h-10 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-[#D4AF37] hover:bg-slate-700 transition-all"
              title="Change Admin Username & Password"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA (Offset by Sidebar Width) */}
      {/* ========================================================= */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* STICKY TOP NAVIGATION BAR */}
        <header
          className={`sticky top-0 z-30 h-16 px-4 sm:px-8 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
            isDarkMode
              ? 'bg-[#0f172a]/80 border-slate-800/80 text-white'
              : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          {/* Left: Mobile Drawer Trigger & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Admin Workspace</span>
              <span className="text-slate-600">/</span>
              <span className="font-serif font-bold text-[#D4AF37] tracking-wide">
                {getBreadcrumbTitle()}
              </span>
            </div>
          </div>

          {/* Center: Search Command Bar */}
          <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search scholarships, articles, users... (Cmd + K)"
              className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border focus:outline-none focus:border-[#D4AF37] transition-all ${
                isDarkMode
                  ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Right Controls: Status, Theme, Notifications, Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* System Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API & DB Online
            </div>

            {/* Dark / Light Mode Switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-all relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-100 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                      Portal Notifications
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Logo Upload Sync
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Brand logo updated in global settings and header.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        CSC Scholarship 2026
                      </div>
                      <p className="text-[11px] text-slate-400">
                        14 new student applications received today.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* View Website External Link Button */}
            <Link
              to="/"
              className="hidden sm:flex px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Portal</span>
            </Link>

            {/* Action Button: + New Scholarship */}
            <Link
              to="/admin/scholarships"
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Listing</span>
            </Link>

            {/* Admin User Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-all border border-slate-700/60"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#D4AF37] to-amber-200 text-slate-950 font-bold flex items-center justify-center text-xs">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-slate-100 space-y-2 animate-fadeIn">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-bold text-white">{user?.name || 'Admin User'}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@scholarship.org'}</div>
                    <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] uppercase">
                      Administrator
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setIsCredentialsModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-2 transition-all font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Change Username / Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-950/80 hover:text-white flex items-center gap-2 transition-all font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Render nested Sub-routes (Scholarships, Internships, Blogs, etc.) if active */}
          {isSubRoute ? (
            <Outlet />
          ) : (
            <div className="space-y-8">
              {/* If on home /admin, render either Overview, Analytics or System Logs tab */}
              {activeTab === 'analytics' ? (
                <AdminAnalyticsView />
              ) : activeTab === 'logs' ? (
                <SystemLogsView />
              ) : (
                /* Overview Tab Content */
                <div className="space-y-8 animate-fadeIn">
                  {/* Top Welcome Banner */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-900 to-[#1e1b12] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-2 z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>SaaS Executive Panel</span>
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                        Global Scholarship <span className="italic font-normal text-[#D4AF37]">Management</span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-sans">
                        Control your scholarship database, active grants, internships, advertising campaigns, and site identity effortlessly.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 z-10">
                      <button
                        onClick={() => setIsCredentialsModalOpen(true)}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider border border-slate-700 shadow-md flex items-center gap-2 transition-all"
                      >
                        <Lock className="w-4 h-4 text-[#D4AF37]" />
                        <span>Security Credentials</span>
                      </button>

                      <Link
                        to="/admin/scholarships"
                        className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Publish Opportunity</span>
                      </Link>
                    </div>
                  </div>

                  {/* High-Impact Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-[#D4AF37]/40 transition-all shadow-md">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Grants</div>
                      <div className="text-3xl font-serif font-bold text-[#D4AF37] mt-1">
                        {loading ? '...' : stats?.totalScholarships || 0}
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {stats?.openScholarships || 0} Open Now
                      </div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-md">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Blog Articles</div>
                      <div className="text-3xl font-serif font-bold text-white mt-1">
                        {loading ? '...' : stats?.totalBlogs || 0}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Published News</div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-md">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Ads</div>
                      <div className="text-3xl font-serif font-bold text-purple-400 mt-1">
                        {loading ? '...' : stats?.activeAds || 0}
                      </div>
                      <div className="text-[10px] text-purple-300 mt-1">Header & Sidebar</div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-md">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Users</div>
                      <div className="text-3xl font-serif font-bold text-white mt-1">
                        {loading ? '...' : stats?.totalUsers || 0}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Registered Accounts</div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-md">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Destinations</div>
                      <div className="text-3xl font-serif font-bold text-cyan-400 mt-1">
                        {loading ? '...' : stats?.totalCountries || 0}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Countries Supported</div>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-emerald-500/40 transition-all shadow-md flex flex-col justify-between">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Server Status</div>
                      <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        100% Operational
                      </div>
                      <div className="text-[10px] text-slate-500">JWT Protected</div>
                    </div>
                  </div>

                  {/* Interactive Quick Management Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link
                      to="/admin/scholarships"
                      className="bg-slate-900/80 border border-slate-800 hover:border-[#D4AF37] p-6 rounded-3xl transition-all group shadow-xl hover:-translate-y-1 duration-200"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition-colors">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        Scholarships Portal
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Add & edit Bachelors, Masters, PhD programs, set deadlines, upload logos, and manage application links.
                      </p>
                    </Link>

                    <Link
                      to="/admin/blogs"
                      className="bg-slate-900/80 border border-slate-800 hover:border-[#D4AF37] p-6 rounded-3xl transition-all group shadow-xl hover:-translate-y-1 duration-200"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        Blog & News Portal
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Publish CSC application guides, study abroad tips, visa rules, and manage news categories.
                      </p>
                    </Link>

                    <Link
                      to="/admin/ads"
                      className="bg-slate-900/80 border border-slate-800 hover:border-[#D4AF37] p-6 rounded-3xl transition-all group shadow-xl hover:-translate-y-1 duration-200"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
                        <Megaphone className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        Ad Banners & Monetization
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Configure top header, sidebar, and in-feed ad banners with click tracking and expiry schedules.
                      </p>
                    </Link>

                    <Link
                      to="/admin/settings"
                      className="bg-slate-900/80 border border-slate-800 hover:border-[#D4AF37] p-6 rounded-3xl transition-all group shadow-xl hover:-translate-y-1 duration-200"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                        <Share2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        Social & Brand Logo Settings
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Upload custom portal logo image, update site title, WhatsApp assistance message, and social media handles.
                      </p>
                    </Link>
                  </div>

                  {/* Integrated Analytics Summary Chart */}
                  <AdminAnalyticsView />
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. CHANGE ADMIN CREDENTIALS SECURITY MODAL */}
      {/* ========================================================= */}
      <ChangeCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
      />
    </div>
  );
};
