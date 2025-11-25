import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, Star } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      onNavigate('home');
      // If we are already on home, scroll to it
      // If we are on ratings, onNavigate will switch view, and we need to wait for render to scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else if (href === '/ratings') {
      onNavigate('ratings');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Skills', href: '#skills' },
  ];

  const socialLinks = [
    { icon: <Mail size={20} />, href: `mailto:${PERSONAL_INFO.email}`, label: 'Email', color: 'hover:text-neon-blue' },
    { icon: <Github size={20} />, href: PERSONAL_INFO.github, label: 'Github', color: 'hover:text-neon-pink' },
    { icon: <Linkedin size={20} />, href: PERSONAL_INFO.linkedin, label: 'LinkedIn', color: 'hover:text-neon-blue' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled || currentView === 'ratings'
            ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 shadow-lg shadow-neon-purple/5' 
            : 'bg-transparent py-2 md:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer group" 
              onClick={() => handleLinkClick('#about')}
            >
              <div className="relative">
                <span className="text-xl md:text-2xl font-bold text-white tracking-tight relative z-10 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-blue group-hover:to-neon-purple">
                  {PERSONAL_INFO.name}
                  <span className="text-neon-blue group-hover:text-neon-pink transition-colors">.</span>
                </span>
                <span className="absolute -inset-2 rounded-lg bg-neon-blue/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              {/* Changed items-baseline to items-center to align mixed content (text vs icon buttons) properly */}
              <div className="ml-10 flex items-center space-x-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleLinkClick(link.href)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors group overflow-hidden rounded-md ${currentView === 'home' ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute inset-0 bg-slate-800/0 group-hover:bg-slate-800/50 transition-colors duration-300 rounded-md"></span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                ))}
                
                {/* Ratings Link */}
                <button
                    onClick={() => handleLinkClick('/ratings')}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors group overflow-hidden rounded-md ${currentView === 'ratings' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                        <Star size={14} className={currentView === 'ratings' ? 'text-neon-green fill-neon-green' : 'text-slate-400'} />
                        Ratings
                    </span>
                    <span className={`absolute inset-0 transition-colors duration-300 rounded-md ${currentView === 'ratings' ? 'bg-slate-800/80' : 'bg-slate-800/0 group-hover:bg-slate-800/50'}`}></span>
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-green to-neon-blue transform transition-transform duration-300 origin-left ${currentView === 'ratings' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </button>
              </div>
            </div>

            {/* Desktop Social Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-5 pl-6 border-l border-slate-800/50">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-slate-400 transition-all transform hover:scale-110 hover:-translate-y-0.5 ${social.color} hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white focus:outline-none z-50"
              >
                <span className="sr-only">Open main menu</span>
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Menu size={28} />
                        </motion.div>
                    )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ type: "spring", stiffness: 30, damping: 15 }}
            className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-xl md:hidden flex flex-col items-center justify-center"
          >
            {/* Background elements for mobile menu */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px]"></div>

            <nav className="flex flex-col items-center space-y-6 z-10 w-full px-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="w-full text-center"
                >
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="block w-full text-3xl font-bold text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-neon-blue hover:to-neon-pink transition-all duration-300">
                        {link.name}
                    </span>
                  </button>
                </motion.div>
              ))}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full text-center"
                >
                  <button
                    onClick={() => handleLinkClick('/ratings')}
                    className="block w-full text-3xl font-bold text-neon-green hover:text-white transition-all hover:scale-105 active:scale-95"
                  >
                    Ratings
                  </button>
                </motion.div>
            </nav>

            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="absolute bottom-20 flex justify-center space-x-10 w-full z-10"
              >
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-slate-400 hover:text-white transform hover:scale-125 transition-all duration-300 ${social.color}`}
                  >
                    {/* Increase size for mobile */}
                    {React.cloneElement(social.icon as React.ReactElement<any>, { size: 32 })}
                  </a>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;