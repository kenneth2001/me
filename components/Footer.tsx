import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: <Mail size={18} />, href: `mailto:${PERSONAL_INFO.email}`, label: 'Email' },
    { icon: <Linkedin size={18} />, href: PERSONAL_INFO.linkedin, label: 'LinkedIn' },
    { icon: <Github size={18} />, href: PERSONAL_INFO.github, label: 'Github' },
  ];

  return (
    <footer id="contact" className="relative bg-slate-950 py-8 border-t border-slate-800/50 overflow-hidden">
      {/* Decorative Top Line Gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
          {/* Name & Copyright */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-slate-200 tracking-tight mb-1">
               {PERSONAL_INFO.fullName}
            </h2>
            <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} • Based in {PERSONAL_INFO.location}
            </p>
          </div>

          {/* Socials & Back to Top */}
          <div className="flex items-center gap-6">
             <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                    <a 
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-neon-blue transition-all transform hover:scale-110 p-2 hover:bg-slate-900 rounded-full"
                        aria-label={social.label}
                    >
                        {social.icon}
                    </a>
                ))}
            </div>

            <div className="w-px h-8 bg-slate-800 hidden md:block"></div>

            <button 
                onClick={scrollToTop}
                className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-neon-blue transition-colors px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 group"
            >
                TOP
                <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;