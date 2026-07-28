import React from 'react';
import { useSocial } from '../context/SocialContext';
import { AdBanner } from '../components/AdBanner';
import {
  GraduationCap,
  BookOpen,
  Code,
  Server,
  Award,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  MapPin,
  CheckCircle2,
  Briefcase,
  UserCheck,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  Terminal,
} from 'lucide-react';

export const About: React.FC = () => {
  const { settings } = useSocial();

  const contactEmail = settings?.contactEmail || 'techhub905@gmail.com';
  const whatsapp = settings?.whatsapp || '+92-346-3079238';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Hello Mir Ishfaq Ahmad! I am reaching out from the Scholarship Portal.'
  )}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Banner Ad */}
      <AdBanner placement="header" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b1120] via-slate-900 to-slate-950 border-b border-slate-800/80 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Avatar / Profile Graphic */}
            <div className="relative shrink-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-1 bg-gradient-to-tr from-[#D4AF37] via-amber-200 to-slate-800 shadow-2xl relative group">
                <div className="w-full h-full rounded-[22px] bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-6 text-center border border-slate-800">
                  <div className="w-20 h-20 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] mb-3 shadow-inner">
                    <GraduationCap className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight">MIR ISHFAQ AHMAD</h3>
                  <p className="text-[11px] font-semibold text-[#D4AF37] mt-1 uppercase tracking-wider">
                    CS Lecturer & Developer
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border-2 border-slate-950 shadow-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Faculty</span>
              </div>
            </div>

            {/* Title & Profile Summary */}
            <div className="space-y-4 text-center lg:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scholarship Portal Founder & Lead Director</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                MIR ISHFAQ AHMAD
              </h1>

              <p className="text-sm sm:text-base font-semibold text-slate-300 tracking-wide">
                Computer Science Lecturer <span className="text-[#D4AF37]">●</span> MERN Stack Developer <span className="text-[#D4AF37]">●</span> IT Support Specialist
              </p>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                Computer Science graduate and technically skilled educator with hands-on teaching experience at the college level, combined with 4+ years of professional technical experience spanning full-stack (MERN) development, IT support, networking, and system administration. Skilled at breaking down complex programming, database, and networking concepts into clear, practical lessons for students while remaining an active software developer. Certified in Google Cybersecurity and IT Support.
              </p>

              {/* Direct Quick Contact Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: {whatsapp}</span>
                </a>

                <a
                  href={`mailto:${contactEmail}`}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-700/80 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>{contactEmail}</span>
                </a>

                <a
                  href="https://geekyskill.netlify.app"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://github.com/Mirishfaqahmad905"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Education & Certifications Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-white">Education & Degrees</h2>
                <p className="text-xs text-slate-400">Academic qualifications and certifications</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-[#D4AF37] space-y-1">
                <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">BS Computer Science</div>
                <h3 className="text-base font-bold text-white">University of Malakand</h3>
                <p className="text-xs text-slate-400">CGPA: 3.40 / 4.00</p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-700 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Diploma in Information Technology (DIT)</div>
                <h3 className="text-base font-bold text-white">Board of Technical & Commerce Education, Peshawar</h3>
                <p className="text-xs text-slate-400">Grade: A+ (EQF Level 4 Distinction)</p>
              </div>
            </div>
          </div>

          {/* Certifications Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-white">Professional Certifications</h2>
                <p className="text-xs text-slate-400">Industry verified credentials</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Google Cybersecurity Professional Certificate</h4>
                  <p className="text-[11px] text-slate-400">Google Career Certificates Authorized</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
                <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">IT Support Professional Certificate</h4>
                  <p className="text-[11px] text-slate-400">Hardware, Software & Networking Fundamentals</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Diploma in IT (DIT) — Grade A+</h4>
                  <p className="text-[11px] text-slate-400">KPK Technical Board Peshawar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Experience Section */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold text-white">Teaching & Academic Experience</h2>
              <p className="text-xs text-slate-400">College-level lecturing and student project supervision</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Institution 1 */}
            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2.5 py-1 rounded-md border border-[#D4AF37]/30">
                  July 2023 – 2024 (1 Year)
                </span>
                <span className="text-xs text-slate-400 font-semibold">CS Lecturer</span>
              </div>
              <h3 className="text-base font-bold text-white">Jamal College of Science (JMC)</h3>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Taught Programming Fundamentals, Database Systems (DBMS), Networking, and Web Development.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Conducted practical computer lab sessions and mentored final-year projects.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>Designed examinations, graded assignments, and provided one-on-one student advising.</span>
                </li>
              </ul>
            </div>

            {/* Institution 2 */}
            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30">
                  2024 – 2025 (1 Year)
                </span>
                <span className="text-xs text-slate-400 font-semibold">Lecturer</span>
              </div>
              <h3 className="text-base font-bold text-white">Khyber College of Munda</h3>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Delivered Computer Science lectures and practical programming exercises.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Prepared course curriculum, conducted assessments, and evaluated student performance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Integrated real-world software engineering practices into classroom instruction.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Subjects Can Teach Grid */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 rounded-3xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold text-white">Academic Subjects & Competencies</h2>
              <p className="text-xs text-slate-400">Course instruction domains</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-semibold">
            {[
              'Programming (C, C++, Java, JS)',
              'OOP & Data Structures',
              'DBMS (MongoDB, MySQL, Postgres)',
              'Networking (LAN, DNS, DHCP)',
              'Web Dev (React, Node, Express)',
              'Computer Architecture & OS',
              'Software Engineering',
              'Introductory Cybersecurity',
              'MS Office & Excel VBA',
              'Lab Mentorship & Projects',
            ].map((subj, idx) => (
              <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span>{subj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MERN Development & IT Support Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Code className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">MERN Stack Developer (4+ Years)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed & deployed full-stack web platforms using React.js, Node.js, Express.js, and MongoDB. Built admin dashboards, e-commerce stores, college management systems, and RESTful APIs deployed on Netlify, Vercel, and Cloud Run.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Server className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">IT Support & Systems Administration</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Experienced in hardware troubleshooting, network configuration, LAN setup, backup recovery, and Windows OS administration. Completed IT Support Internship at Faisal Town, Islamabad.
            </p>
          </div>
        </div>

        {/* Ad Placement for About Page */}
        <AdBanner placement="about-page" />
      </div>
    </div>
  );
};
