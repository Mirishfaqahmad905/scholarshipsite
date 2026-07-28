import React, { useState } from 'react';
import { useSocial } from '../context/SocialContext';
import {
  MessageCircle,
  Phone,
  Mail,
  X,
  Share2,
  Github,
  Instagram,
  Send,
  Sparkles,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  ExternalLink,
} from 'lucide-react';

export const SocialFloatingWidget: React.FC = () => {
  const { settings } = useSocial();
  const [open, setOpen] = useState(false);

  if (!settings) return null;

  const {
    whatsapp,
    whatsappMessage,
    contactEmail,
    github,
    snapchat,
    instagram,
    telegram,
    facebook,
    twitter,
    linkedin,
    youtube,
    customLinks,
  } = settings;

  const cleanWhatsapp = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        whatsappMessage || 'Hello! I need scholarship application assistance.'
      )}`
    : '';

  const hasAnySocial =
    whatsapp ||
    contactEmail ||
    github ||
    snapchat ||
    instagram ||
    telegram ||
    facebook ||
    twitter ||
    linkedin ||
    youtube ||
    (customLinks && customLinks.length > 0);

  if (!hasAnySocial) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Quick Contact Drawer */}
      {open && (
        <div className="mb-4 w-72 sm:w-80 bg-[#0d1527]/95 border border-slate-800/90 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Connect With Us</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Quick Chat Action (WhatsApp) */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl flex items-center justify-between shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span>Chat on WhatsApp</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}

          {/* Contact Email */}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-2xl flex items-center gap-2.5 border border-slate-800/80 transition-all hover:border-cyan-500/40 hover:text-cyan-400"
            >
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{contactEmail}</span>
            </a>
          )}

          {/* Social Channels Icons Grid */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Official Social Profiles
            </div>

            <div className="flex flex-wrap gap-2">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
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
                  className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-all"
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
                  className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 transition-all"
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
                  className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 transition-all"
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
                  className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/30 text-blue-500 hover:bg-blue-600/20 transition-all"
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
                  className="p-2.5 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-300 hover:bg-sky-400/20 transition-all"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all"
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
                  className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Custom Links */}
            {customLinks && customLinks.length > 0 && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                {customLinks.map((cl, i) => (
                  <a
                    key={i}
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
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#11192d] hover:bg-[#18233d] text-white border border-[#D4AF37]/50 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        title="Social Links & Support"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
        </div>
        <span className="text-xs font-bold tracking-wider uppercase text-slate-100 pr-1">
          {open ? 'Close' : 'Contact Us'}
        </span>
      </button>
    </div>
  );
};
