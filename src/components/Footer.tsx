import React from 'react';
import { Link } from 'react-router-dom';
import { useSocial } from '../context/SocialContext';
import { Logo } from './Logo';
import {
  Mail,
  Phone,
  ShieldCheck,
  Globe,
  Github,
  Instagram,
  Send,
  Sparkles,
  Twitter,
  Linkedin,
  Youtube,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSocial();

  const siteName = settings?.siteName || 'Scholarship Opportunity';
  const siteLink = settings?.siteLink || 'https://scholarship-opportunity.com';
  const contactEmail = settings?.contactEmail;
  const whatsapp = settings?.whatsapp;
  const whatsappMessage = settings?.whatsappMessage;
  const github = settings?.github;
  const snapchat = settings?.snapchat;
  const instagram = settings?.instagram;
  const telegram = settings?.telegram;
  const facebook = settings?.facebook;
  const twitter = settings?.twitter;
  const linkedin = settings?.linkedin;
  const youtube = settings?.youtube;
  const customLinks = settings?.customLinks || [];

  const cleanWhatsapp = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        whatsappMessage || 'Hello! I need scholarship application assistance.'
      )}`
    : '';

  return (
    <footer className="bg-[#090d16] border-t border-slate-800/80 text-slate-400 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <Logo variant="full" size="md" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Your premier portal for fully funded international scholarships, Chinese Government CSC grants, master fellowships, and PhD assistantships worldwide.
            </p>

            {/* Social Icons Bar */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Official Channels
              </div>
              <div className="flex flex-wrap gap-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    title="WhatsApp"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    title="Email Support"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {snapchat && (
                  <a
                    href={snapchat}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-all"
                    title="Snapchat"
                  >
                    <Sparkles className="w-4 h-4" />
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition-all"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {telegram && (
                  <a
                    href={telegram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all"
                    title="Telegram"
                  >
                    <Send className="w-4 h-4" />
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-blue-600/10 border border-blue-600/30 text-blue-500 hover:bg-blue-600/20 transition-all"
                    title="Facebook"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-300 hover:bg-sky-400/20 transition-all"
                    title="X / Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {youtube && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Custom Links list if any */}
              {customLinks.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {customLinks.map((cl, idx) => (
                    <a
                      key={idx}
                      href={cl.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 flex items-center gap-1 transition-all"
                    >
                      <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                      <span>{cl.platformName}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-200 mb-4">Popular Destinations</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><Link to="/scholarships?country=China" className="hover:text-[#D4AF37] transition-colors">China (CSC Scholarship)</Link></li>
              <li><Link to="/scholarships?country=USA" className="hover:text-[#D4AF37] transition-colors">USA (Fulbright & Fellowships)</Link></li>
              <li><Link to="/scholarships?country=Finland" className="hover:text-[#D4AF37] transition-colors">Finland (Government Grant)</Link></li>
              <li><Link to="/scholarships?country=UK" className="hover:text-[#D4AF37] transition-colors">UK (Chevening Masters)</Link></li>
              <li><Link to="/scholarships?country=Germany" className="hover:text-[#D4AF37] transition-colors">Germany (DAAD Research)</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-200 mb-4 font-sans">Degree Programs</h4>
            <ul className="space-y-2 text-xs font-sans">
              <li><Link to="/scholarships?degreeLevel=BS" className="hover:text-[#D4AF37] transition-colors">Bachelors (BS / Undergraduate)</Link></li>
              <li><Link to="/scholarships?degreeLevel=MS" className="hover:text-[#D4AF37] transition-colors">Masters (MS / Postgraduate)</Link></li>
              <li><Link to="/scholarships?degreeLevel=PhD" className="hover:text-[#D4AF37] transition-colors">Doctorate (PhD / Postdoc)</Link></li>
              <li><Link to="/blog" className="hover:text-[#D4AF37] transition-colors font-semibold text-[#D4AF37]">Scholarship Application Guides</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-200 mb-4">Direct Help & Verification</h4>
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl space-y-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                <span>Verified Direct Portals</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All scholarship entries direct applicants to official university and ministry portals.
              </p>
              {contactEmail && (
                <div className="pt-2 border-t border-slate-800/80">
                  <a href={`mailto:${contactEmail}`} className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>{contactEmail}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {siteLink && (
              <a href={siteLink} target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Site Link</span>
              </a>
            )}
            <Link to="/scholarships" className="hover:text-[#D4AF37] transition-colors">Directory</Link>
            <Link to="/blog" className="hover:text-[#D4AF37] transition-colors">Articles</Link>
            <Link to="/about" className="hover:text-[#D4AF37] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link>
            <Link to="/login" className="text-slate-700 hover:text-slate-400 transition-colors text-[10px] ml-4 cursor-pointer select-none" title="Portal Sign In">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
