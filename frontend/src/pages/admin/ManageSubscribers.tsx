import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Subscriber, NotificationLog } from '../../types';
import { Mail, Bell, CheckCircle2, Send, Users, Shield, Clock } from 'lucide-react';

export const ManageSubscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/subscribers');
      setSubscribers(data.subscribers || []);
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Failed to load subscribers data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-1">
            <Bell className="w-4 h-4 text-[#D4AF37]" />
            <span>Email Notification Dispatch Center</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            Subscribed Gmails & <span className="italic font-normal text-[#D4AF37]">Broadcast Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            When an admin posts a complete scholarship listing, an automated email dispatch is sent to all registered Gmail subscribers in the database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-950 border border-[#D4AF37]/30 rounded-2xl text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Active Subscribers</span>
            <span className="text-lg font-bold text-[#D4AF37]">{subscribers.length} Gmails</span>
          </div>
        </div>
      </div>

      {broadcastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{broadcastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscribers Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <span>Registered Email Subscribers</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{subscribers.length} stored</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading subscriber database...</div>
            ) : subscribers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No email subscribers in database yet. New users visiting the webapp will see the subscription popup modal.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Subscriber Gmail</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Subscribed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {subscribers.map((sub) => (
                      <tr key={sub._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono text-white flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span>{sub.email}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-[11px]">
                          {sub.subscribedAt || sub.createdAt
                            ? new Date(sub.subscribedAt || sub.createdAt!).toLocaleDateString()
                            : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Email Dispatch History / Logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-semibold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-[#D4AF37]" />
              <span>Automated Dispatch Logs</span>
            </h3>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 backdrop-blur-md">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No notification dispatches triggered yet. When you upload a new scholarship, email alerts will log here automatically.
              </p>
            ) : (
              logs.map((log) => (
                <div key={log._id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                    <span className="text-[#D4AF37] flex items-center gap-1">
                      <Send className="w-3 h-3" />
                      Sent to {log.recipientCount} Recipients
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{log.scholarshipTitle}</h4>
                  <div className="text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">Status: Delivered</span> via WebApp Email Dispatch
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscribers;
