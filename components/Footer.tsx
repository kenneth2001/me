import React from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Get In Touch</h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-10">
          I'm currently looking for new opportunities in Data Science and AI Engineering. 
          Feel free to reach out if you'd like to collaborate or chat about the latest in LLMs.
        </p>

        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          <a href={`mailto:${PERSONAL_INFO.email}`} className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-600 transition-colors">
              <Mail size={24} className="text-white" />
            </div>
            <span className="text-slate-400 group-hover:text-white text-sm">Email Me</span>
          </a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
              <Linkedin size={24} className="text-white" />
            </div>
            <span className="text-slate-400 group-hover:text-white text-sm">LinkedIn</span>
          </a>
          <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="flex flex-col items-center group">
             <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-700 transition-colors">
              <Github size={24} className="text-white" />
            </div>
            <span className="text-slate-400 group-hover:text-white text-sm">GitHub</span>
          </a>
        </div>

        <div className="flex items-center justify-center text-slate-500 text-sm mb-4">
            <MapPin size={16} className="mr-2" />
            {PERSONAL_INFO.location}
        </div>

        <div className="text-slate-600 text-xs pt-8 border-t border-slate-800">
          © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved. Built with React & Tailwind.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
