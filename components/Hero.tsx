import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileJson } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-slate-950" id="about">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
               <span className="inline-flex items-center py-1 px-3 rounded-full bg-slate-900/80 border border-slate-800 text-violet-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-violet-400 mr-2 animate-pulse"></span>
                Available for Data Science Roles
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Hi, I'm <span className="text-violet-400">{PERSONAL_INFO.name.split(' ')[0]}</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                {PERSONAL_INFO.headline}
              </p>
              <div className="text-slate-400 mb-10 max-w-lg mx-auto lg:mx-0 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
                 <span className="flex items-center"><span className="text-violet-500 mr-2">✓</span> GenAI & LLMs</span>
                 <span className="flex items-center"><span className="text-violet-500 mr-2">✓</span> RAG Pipelines</span>
                 <span className="flex items-center"><span className="text-violet-500 mr-2">✓</span> Predictive Modeling</span>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a href="#experience" className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary-900/20 flex items-center border border-transparent hover:border-primary-500">
                  View Experience
                </a>
                <a href="#contact" className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-lg font-medium transition-all">
                  Contact Me
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Content - Simplified Python Profile */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-xl"
          >
            <div className="relative group">
                {/* Removed the background gradient glow here */}
                
                <div className="relative bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
                    {/* Window Header */}
                    <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 font-mono">
                            <FileJson size={12} className="mr-2 text-violet-400" />
                            profile.py
                        </div>
                        <div className="w-10"></div>
                    </div>

                    {/* Code Content */}
                    <div className="p-6 overflow-x-auto bg-slate-900/50">
                        <pre className="font-mono text-sm md:text-base leading-relaxed">
                            <code className="block text-slate-500 mb-4"># Personal Highlights</code>
                            
                            <code className="block mb-2">
                                <span className="text-violet-400">role</span> = <span className="text-amber-300">"Data Scientist & AI Engineer"</span>
                            </code>

                            <code className="block mb-2">
                                <span className="text-violet-400">education</span> = [
                            </code>
                            <code className="block pl-4">
                                <span className="text-amber-300">"MSc Distinction (Imperial)"</span>,
                            </code>
                            <code className="block pl-4">
                                <span className="text-amber-300">"First Class Honors (CUHK)"</span>
                            </code>
                            <code className="block mb-2">]</code>

                            <code className="block mb-2">
                                <span className="text-violet-400">key_skills</span> = [
                            </code>
                            <code className="block pl-4">
                                <span className="text-amber-300">"LLMs & GraphRAG"</span>,
                            </code>
                            <code className="block pl-4">
                                <span className="text-amber-300">"Data Engineering Pipelines"</span>
                            </code>
                            <code className="block mb-2">]</code>

                            <code className="block mt-4">
                                <span className="text-slate-500"># Ready to contribute</span>
                            </code>
                            <code className="block">
                                <span className="text-violet-400">status</span> = <span className="text-amber-300">"Open for Opportunities"</span>
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-600 cursor-pointer hover:text-violet-400 transition-colors"
        onClick={() => {
            const expSection = document.getElementById('experience');
            if(expSection) expSection.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <ArrowDown size={28} />
      </motion.div>
    </section>
  );
};

export default Hero;