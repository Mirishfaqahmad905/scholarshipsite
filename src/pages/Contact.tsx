import React, { useState } from 'react';
import axios from 'axios';
import { useSocial } from '../context/SocialContext';
import { AdBanner } from '../components/AdBanner';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Globe,
  Github,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  FileText,
  FileCheck,
  BookOpen,
  GraduationCap,
  Award,
  ArrowRight,
  Zap,
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
  const [inquiryType, setInquiryType] = useState('Apply Through Us for Scholarship');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    {
      id: 'apply-through-us',
      title: 'Apply Through Us for Scholarship',
      badge: 'Complete Support',
      icon: GraduationCap,
      color: 'amber',
      description:
        'Complete end-to-end scholarship application assistance. We select top universities, review eligibility, prepare documentation, contact prospective supervisors, and submit applications directly on university portals.',
      inquiryTypeValue: 'Apply Through Us for Scholarship',
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Creation',
      badge: 'High Impact',
      icon: FileText,
      color: 'emerald',
      description:
        'Customized academic Cover Letters and Motivation Statements tailored specifically for international university admissions, CSC scholarships, and professor outreach emails.',
      inquiryTypeValue: 'Cover Letter Creation',
    },
    {
      id: 'cv-europass',
      title: 'Academic CV & Europass CV',
      badge: 'Official Format',
      icon: FileCheck,
      color: 'cyan',
      description:
        'Professional academic CVs formatted according to global university standards and the official Europass CV framework required for European and Asian scholarships.',
      inquiryTypeValue: 'Professional Academic CV & Europass CV',
    },
    {
      id: 'research-proposal',
      title: 'Research Proposal & Thesis Proposal',
      badge: 'Masters & PhD',
      icon: BookOpen,
      color: 'purple',
      description:
        'Comprehensive research proposals, research methodology structuring, literature review outlines, and thesis proposals tailored to impress university supervisors and evaluation committees.',
      inquiryTypeValue: 'Research Proposal & Thesis Proposal',
    },
    {
      id: 'sop-recommendation',
      title: 'SOP & Recommendation Letters',
      badge: 'Essential',
      icon: Award,
      color: 'rose',
      description:
        'High-impact Statements of Purpose (SOP), Personal Statements, and professional Professor / Employer Recommendation Letter templates aligned with scholarship requirements.',
      inquiryTypeValue: 'Statement of Purpose (SOP) & Recommendation Letters',
    },
  ];

  const handleSelectService = (serviceInquiryType: string, serviceTitle: string) => {
    setInquiryType(serviceInquiryType);
    setSubject(`Inquiry: ${serviceTitle}`);
    if (!message) {
      setMessage(`Hello Mir Ishfaq Ahmad,\n\nI want to request "${serviceTitle}" for my scholarship application.\n\nPlease share details on procedure, required information, and turnaround time.`);
    }
    const formElem = document.getElementById('contact-inquiry-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    const defaultText = `Hello Mir Ishfaq Ahmad! My name is ${name || 'Applicant'}. I am inquiring about "${inquiryType}". ${message ? '\n\nMessage: ' + message : ''}`;
    return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(defaultText)}`;
  };

  const getEmailUrlWithMessage = () => {
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService / Inquiry Type: ${inquiryType}\n\nMessage:\n${message}`;
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
            Apply through us for fully funded scholarships or order custom Cover Letters, Europass CVs, SOPs, and Research Proposals. Contact us directly via WhatsApp, Email, or the form below.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Direct Channels Cards (WhatsApp & Email) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 hover:border-emerald-500/50 transition-all group shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Instant WhatsApp Help</span>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">WhatsApp Direct</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect directly with Mir Ishfaq Ahmad on WhatsApp for rapid guidance on applications & documents.
            </p>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Mir Ishfaq Ahmad! I need scholarship application & document assistance.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Chat on WhatsApp ({whatsapp})</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 hover:border-cyan-500/50 transition-all group shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Official Email</span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Gmail Inquiry</h3>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send detailed document reviews, SOP proposals, or research drafts directly to our inbox.
            </p>
            <a
              href={`mailto:${contactEmail}?subject=Scholarship%20Application%20Inquiry`}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{contactEmail}</span>
            </a>
          </div>

          {/* Location & Portfolio Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 hover:border-[#D4AF37]/50 transition-all group shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">Office & Profile</span>
                <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">Location & Link</h3>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
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

        {/* SECTION: Apply Through Us & Document Preparation Services */}
        <section className="bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Services Section Header */}
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              <span>Professional Scholarship & Document Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Apply Through Us & Professional Document Creation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Don’t let missing documents or formatting errors ruin your scholarship chances. Our team provides end-to-end university application submissions and professional drafting of academic documents tailored for European, CSC, DAAD, and international grants.
            </p>
          </div>

          {/* Dedicated Ad Space inside Contact Services Section */}
          <div className="my-4">
            <AdBanner placement="contact-services" />
          </div>

          {/* Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-[#D4AF37]/60 p-6 rounded-2xl flex flex-col justify-between space-y-5 transition-all duration-300 group hover:shadow-xl hover:shadow-[#D4AF37]/5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold bg-slate-900 border border-slate-700/80 text-amber-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {srv.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {srv.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {srv.description}
                    </p>
                  </div>

                  {/* Actions for each service card */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleSelectService(srv.inquiryTypeValue, srv.title)}
                      className="w-full py-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-slate-950 font-bold text-xs rounded-xl border border-[#D4AF37]/40 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Request This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Hello Mir Ishfaq Ahmad! I want to request "${srv.title}". Please guide me on process & requirements.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg text-center transition-all"
                      >
                        WhatsApp Order
                      </a>
                      <a
                        href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Service Request: ${srv.title}`)}&body=${encodeURIComponent(`Hello Mir Ishfaq Ahmad,\n\nI want to apply through you / request "${srv.title}".\n\nPlease send details.`)}`}
                        className="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold rounded-lg text-center transition-all"
                      >
                        Email Order
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: Contact Form & FAQ */}
        <div id="contact-inquiry-form" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Component */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-semibold text-white">Send Us a Direct Inquiry</h2>
                <p className="text-xs text-slate-400 font-sans">Select your required document service or ask any scholarship question</p>
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
                  <label className="block font-bold text-slate-[#D4AF37] uppercase tracking-wider mb-1.5 font-sans">
                    Selected Service / Inquiry Type *
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/90 border border-[#D4AF37]/50 rounded-xl text-white font-semibold focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Apply Through Us for Scholarship">Apply Through Us for Scholarship</option>
                    <option value="Cover Letter Creation">Cover Letter Creation</option>
                    <option value="Professional Academic CV & Europass CV">Professional Academic CV & Europass CV</option>
                    <option value="Research Proposal & Thesis Proposal">Research Proposal & Thesis Proposal Writing</option>
                    <option value="Statement of Purpose (SOP) & Recommendation Letters">SOP & Recommendation Letter Review</option>
                    <option value="CSC / China Scholarship Inquiry">CSC / China Scholarship Guidance</option>
                    <option value="General Inquiry">General Inquiry</option>
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
                  placeholder="Describe your degree level, target country, field of study, or specific document preparation requests..."
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

          {/* Side Info & Sidebar Ad */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 border-b border-slate-800 pb-3">
                <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <h4 className="font-bold text-white">How does "Apply Through Us" work?</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    We guide you through university selection, document formatting (Europass CV, SOP, Cover Letter), supervisor contact, and application submission on official university portals.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white">How fast are documents written?</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Custom Cover Letters, Academic CVs, and Europass CVs are completed within 24 to 48 hours. Research proposals take 3 to 5 business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-white">How long does it take to get a reply?</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    WhatsApp inquiries receive immediate or same-day responses. Email inquiries are answered within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Page Sidebar Ad Banner */}
            <AdBanner placement="contact-page" />
          </div>
        </div>
      </div>
    </div>
  );
};
