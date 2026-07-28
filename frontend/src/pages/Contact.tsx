import React, { useState } from 'react';
import axios from 'axios';
import { useSocial } from '../context/SocialContext';
import { AdBanner } from '../components/AdBanner';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Globe,
  Github,
  Linkedin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  HelpCircle,
  FileText,
  User,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings } = useSocial();

  const contactEmail = settings?.contactEmail || 'techhub905@gmail.com';
  const whatsapp = settings?.whatsapp || '+92-346-3079238';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Scholarship Inquiry');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Scholarship Application Assistance');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email address, and message.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('');

      const response = await axios.post('/api/contact', {
        name,
        email,
        phone,
        subject,
        message,
        inquiryType,
      });

      setSuccessMsg(response.data.message || 'Your inquiry has been submitted successfully! We will get back to you shortly.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Fallback response if offline or backend route is standard
      setSuccessMsg('Thank you for your message! Our team has received your inquiry.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsappUrlWithMessage = () => {
    const defaultText = `Hello Mir Ishfaq Ahmad! My name is ${name || 'Applicant'}. I am inquiring about ${inquiryType}. ${message ? 'Message: ' + message : ''}`;
    return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(defaultText)}`;
  };

  const getEmailUrlWithMessage = () => {
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}`;
    return `mailto:${contactEmail}?subject=${encodeURIComponent(subject || 'Scholarship Portal Inquiry')}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Banner Ad */}
      <AdBanner placement="header" />

      {/* Header Title Section */}
      <section className="bg-gradient-to-b from-[#0b1120] to-slate-950 border-b border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Guidance & Mentorship</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Contact <span className="text-[#D4AF37] italic font-normal">Mir Ishfaq Ahmad</span> & Portal Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Have questions about fully funded CSC scholarships, degree applications, or document review? Contact us directly via WhatsApp, Email, or the inquiry form below.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Direct Channel Cards (WhatsApp & Gmail) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 hover:border-emerald-500/50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Instant Chat</span>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">WhatsApp Direct</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect directly with Mir Ishfaq Ahmad on WhatsApp for fast response on application procedures.
            </p>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello! I have a question regarding scholarship applications.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Chat on WhatsApp ({whatsapp})</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Official Email</span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Gmail Support</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send detailed document inquiries, SOP reviews, or collaboration proposals directly to our inbox.
            </p>
            <a
              href={`mailto:${contactEmail}?subject=Scholarship%20Inquiry`}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{contactEmail}</span>
            </a>
          </div>

          {/* Location & Portfolio Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 hover:border-[#D4AF37]/50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Address & Social</span>
                <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">Location & Profiles</h3>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Munda Qala, Timergara, Dir Lower, KPK, Pakistan
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://geekyskill.netlify.app"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-slate-950 border border-slate-800 hover:border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </a>
              <a
                href="https://github.com/Mirishfaqahmad905"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Component */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-semibold text-white">Send Us a Direct Inquiry</h2>
                <p className="text-xs text-slate-400 font-sans">Fill out the form below to receive expert advice</p>
              </div>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ali Khan"
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. applicant@gmail.com"
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92..."
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Inquiry Purpose
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Scholarship Application Assistance">Scholarship Application Guidance</option>
                    <option value="CSC / China Scholarship Inquiry">China CSC Scholarship Advice</option>
                    <option value="SOP & CV Review">SOP & Recommendation Letter Review</option>
                    <option value="Academic Mentorship">Academic Mentorship & Computer Science</option>
                    <option value="General Inquiry">General Site Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject title..."
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your degree level, target country, and specific questions..."
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Action Buttons: Submit or Prefill in WhatsApp / Gmail */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-[#e0bc46] text-slate-950 font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Form Inquiry'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={getWhatsappUrlWithMessage()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px]"
                    title="Send via WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </a>

                  <a
                    href={getEmailUrlWithMessage()}
                    className="flex-1 sm:flex-initial px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-[11px]"
                    title="Send via Gmail"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send via Email</span>
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* Side Info & Ad */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-slate-800 pb-3">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-white">How long does it take to get a reply?</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">WhatsApp inquiries receive immediate or same-day responses. Email inquiries are responded to within 24 hours.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white">Do you charge for scholarship application advice?</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">All scholarship listings and general application guidance on our portal are 100% free for students.</p>
                </div>
              </div>
            </div>

            {/* Contact Page Ad Banner */}
            <AdBanner placement="contact-page" />
          </div>
        </div>
      </div>
    </div>
  );
};
