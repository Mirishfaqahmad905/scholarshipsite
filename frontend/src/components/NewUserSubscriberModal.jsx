import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Bell, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { AdBanner } from './AdBanner';

export const NewUserSubscriberModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const isRegistered = localStorage.getItem('scholarship_visitor_registered');
    if (!isRegistered) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('scholarship_visitor_registered', 'true');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid Gmail / Email address');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const { data } = await axios.post('/api/subscribers', { email });
      setSuccess(true);
      setMessage(data.message || 'Subscription successful! You will receive email notifications when new scholarships are posted.');
      localStorage.setItem('scholarship_subscribed_email', email);
      localStorage.setItem('scholarship_visitor_registered', 'true');

      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err) {
      console.error('Subscription error', err);
      setError(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Close notification banner"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Visitor Identity Detected</span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <span>Instant Scholarship Alerts</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Subscribe with your Gmail address to receive automated email notifications whenever new CSC, Chevening, DAAD, and fully-funded university grants are posted.
          </p>
        </div>

        <div className="bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
          <AdBanner placement="popup" className="my-0" />
        </div>

        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-center animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Successfully Subscribed!</h4>
            <p className="text-xs text-emerald-200">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 mb-1.5">
                Your Primary Gmail / Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 focus:border-[#D4AF37] rounded-2xl text-xs text-white focus:outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Bell className="w-4 h-4" />
              <span>{submitting ? 'Registering Email...' : 'Subscribe For Email Notifications'}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero spam. Unsubscribe anytime.</span>
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-200 underline font-medium"
              >
                No thanks
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
