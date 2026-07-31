import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Users,
  GraduationCap,
  Award,
  Calendar,
  Filter,
  ArrowUpRight,
  Sparkles,
  Download,
} from 'lucide-react';

const trafficData = [
  { month: 'Jan', applications: 1200, visitors: 4500, pageViews: 9200 },
  { month: 'Feb', applications: 1900, visitors: 5600, pageViews: 11400 },
  { month: 'Mar', applications: 2400, visitors: 7800, pageViews: 15600 },
  { month: 'Apr', applications: 3100, visitors: 9200, pageViews: 18900 },
  { month: 'May', applications: 2800, visitors: 8900, pageViews: 17500 },
  { month: 'Jun', applications: 4200, visitors: 12400, pageViews: 24800 },
  { month: 'Jul', applications: 4900, visitors: 15100, pageViews: 31200 },
];

const programDegreeData = [
  { degree: 'Bachelors', count: 48, growth: '+14%' },
  { degree: 'Masters', count: 85, growth: '+22%' },
  { degree: 'PhD', count: 62, growth: '+18%' },
  { degree: 'PostDoc', count: 24, growth: '+8%' },
  { degree: 'Diploma', count: 18, growth: '+5%' },
];

const fundingTypeData = [
  { name: 'Fully Funded', value: 55, color: '#D4AF37' },
  { name: 'Partial Funded', value: 30, color: '#3B82F6' },
  { name: 'Stipend Only', value: 15, color: '#10B981' },
];

export const AdminAnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '12m'>('12m');

  const exportAnalyticsReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Applications,Visitors,PageViews\n' +
      trafficData.map((e) => `${e.month},${e.applications},${e.visitors},${e.pageViews}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analytics_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filter & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            Executive Analytics & Portal Growth
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry tracking visitor engagements, scholarship applications, and degree distributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['7d', '30d', '12m'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                  timeRange === range
                    ? 'bg-[#D4AF37] text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={exportAnalyticsReport}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Traffic & Applications Area Chart */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
              Application & Visitor Engagement Volume
            </div>
            <div className="text-2xl font-serif font-bold text-white mt-1 flex items-center gap-3">
              152,400 Total Visitors
              <span className="text-xs font-sans font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +28.4% YoY
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
              <span className="text-slate-300">Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Unique Visitors</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#38BDF8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisitors)"
                name="Visitors"
              />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#D4AF37"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorApps)"
                name="Applications"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Degrees Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
              Opportunities by Degree Level
            </h3>
            <span className="text-xs text-slate-400">Total Listings: 237</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programDegreeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="degree" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#D4AF37" radius={[8, 8, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funding Pie Chart */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Funding Type Distribution
            </h3>
            <span className="text-xs text-slate-400">2026 Listings</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fundingTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => <span className="text-slate-300 text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
