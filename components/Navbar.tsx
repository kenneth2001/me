import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Skills', href: '#skills' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {PERSONAL_INFO.name}
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
             {/* Social Icons for Desktop */}
             <div className="flex items-center space-x-4 pl-6 border-l border-slate-800">
               <a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-400 hover:text-violet-400 transition-colors transform hover:scale-110" aria-label="Email">
                 <Mail size={20} />
               </a>
               <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-violet-400 transition-colors transform hover:scale-110" aria-label="Github">
                 <Github size={20} />
               </a>
               <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-violet-400 transition-colors transform hover:scale-110" aria-label="LinkedIn">
                 <Linkedin size={20} />
               </a>
             </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-slate-800 block px-4 py-3 rounded-md text-base font-medium"
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile Social Links */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-center space-x-8">
               <a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-300 hover:text-violet-400">
                 <Mail size={24} />
               </a>
               <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-violet-400">
                 <Github size={24} />
               </a>
               <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-violet-400">
                 <Linkedin size={24} />
               </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;