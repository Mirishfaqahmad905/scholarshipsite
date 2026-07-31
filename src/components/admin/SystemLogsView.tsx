import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  CheckCircle2,
  Server,
  Database,
  RefreshCw,
  Search,
  Clock,
  Terminal,
  FileCode,
  Lock,
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: string;
  status: 'success' | 'warning' | 'error';
  ip: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-8801',
    timestamp: '2026-07-31 01:14:02',
    actor: 'Admin System',
    action: 'Scholarship Brand Logo updated',
    module: 'Settings',
    status: 'success',
    ip: '127.0.0.1',
  },
  {
    id: 'LOG-8800',
    timestamp: '2026-07-31 01:10:45',
    actor: 'admin@scholarship.org',
    action: 'Published CSC Fully Funded Scholarship 2026',
    module: 'Scholarships',
    status: 'success',
    ip: '192.168.1.45',
  },
  {
    id: 'LOG-8799',
    timestamp: '2026-07-31 00:55:12',
    actor: 'Guest User',
    action: 'Subscribed to Weekly Grant Newsletter',
    module: 'Subscribers',
    status: 'success',
    ip: '45.12.89.102',
  },
  {
    id: 'LOG-8798',
    timestamp: '2026-07-31 00:42:19',
    actor: 'System Auto Backup',
    action: 'Daily MongoDB JSON Snapshot Executed',
    module: 'Database',
    status: 'success',
    ip: 'localhost',
  },
  {
    id: 'LOG-8797',
    timestamp: '2026-07-31 00:30:00',
    actor: 'Ad Manager',
    action: 'Updated Top Banner Placement Status',
    module: 'Ads',
    status: 'success',
    ip: '192.168.1.45',
  },
  {
    id: 'LOG-8796',
    timestamp: '2026-07-30 23:18:41',
    actor: 'Unauthenticated API',
    action: 'Failed Admin JWT challenge (Rate-limited)',
    module: 'Auth',
    status: 'warning',
    ip: '185.220.101.5',
  },
];

export const SystemLogsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === 'all' || log.module.toLowerCase() === selectedModule.toLowerCase();
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* System Health Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Node Express Server</div>
            <div className="text-lg font-serif font-bold text-white mt-0.5 flex items-center gap-2">
              Port 3000 Active
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Latency: 12ms
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Engine</div>
            <div className="text-lg font-serif font-bold text-[#D4AF37] mt-0.5">
              MongoDB / Memory Store
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">Status: Connected</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">JWT Token Shield</div>
            <div className="text-lg font-serif font-bold text-white mt-0.5">
              HS256 Encrypted
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Expires in 30 Days</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Image Asset Uploads</div>
            <div className="text-lg font-serif font-bold text-white mt-0.5">
              Multer / Base64
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">Ready for Logo & Banners</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileCode className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Audit Logs Table Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#D4AF37]" />
              System Audit Trail & Security Logs
            </h3>
            <p className="text-xs text-slate-400">
              Immutable activity records for backend actions, settings changes, and login attempts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit logs..."
                className="pl-9 pr-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="all">All Modules</option>
              <option value="settings">Settings</option>
              <option value="scholarships">Scholarships</option>
              <option value="subscribers">Subscribers</option>
              <option value="auth">Auth & Security</option>
              <option value="database">Database</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Log ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action Description</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#D4AF37]">{log.id}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 text-white font-semibold">{log.actor}</td>
                  <td className="px-4 py-3 font-sans text-slate-200">{log.action}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {log.status === 'success' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-sans font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Success
                      </span>
                    )}
                    {log.status === 'warning' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/80 text-[10px] font-sans font-semibold inline-flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Warning
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
