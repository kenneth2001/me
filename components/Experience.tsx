import React from 'react';
import Section from './Section';
import { EXPERIENCES } from '../constants';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, ChevronRight, Info } from 'lucide-react';

const Experience: React.FC = () => {
  return (
    <Section id="experience" title="Work Experience">
      <div className="space-y-12">
        {EXPERIENCES.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-8 md:pl-0"
          >
            {/* Timeline connector for Desktop */}
            <div className={`hidden md:block absolute left-[28px] top-[28px] bottom-[-48px] w-0.5 bg-slate-800 ${index === EXPERIENCES.length - 1 ? 'hidden' : ''}`}></div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Icon & Date - Desktop */}
              <div className="hidden md:flex flex-col items-center min-w-[60px]">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center z-10 shadow-lg shadow-black/20">
                  <Briefcase size={24} className="text-violet-400" />
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-slate-900/40 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{job.title}</h3>
                    <h4 className="text-lg text-primary-400 font-medium">{job.company}</h4>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0 text-slate-400 bg-slate-950 px-3 py-1 rounded-full text-sm border border-slate-800">
                    <Calendar size={16} className="mr-2" />
                    {job.period}
                  </div>
                </div>

                {/* Role Highlight / Special Note */}
                {job.highlight && (
                  <div className="flex items-center p-3 mb-4 rounded-lg bg-fuchsia-900/10 border border-fuchsia-900/30 text-fuchsia-300 text-sm font-medium">
                    <Info size={16} className="mr-2 flex-shrink-0" />
                    {job.highlight}
                  </div>
                )}

                {/* Direct Description */}
                {job.description && (
                  <ul className="space-y-2 mb-6">
                    {job.description.map((desc, i) => (
                      <li key={i} className="flex items-start text-slate-300">
                        <ChevronRight size={16} className="mt-1 mr-2 text-violet-500 flex-shrink-0" />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Projects (Specific for OOCL or similar roles) */}
                {job.projects && (
                  <div className="mt-6 space-y-6">
                    <h5 className="text-sm uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800 pb-2 mb-4">Key Projects</h5>
                    {job.projects.map((project, pIndex) => (
                      <div key={pIndex} className="bg-slate-950/50 rounded-lg p-5 border border-slate-800/50">
                        <h6 className="text-lg font-semibold text-fuchsia-400 mb-3">{project.title}</h6>
                        <ul className="space-y-2">
                          {project.description.map((desc, dIndex) => (
                            <li key={dIndex} className="flex items-start text-slate-300 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 mr-3 flex-shrink-0"></div>
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Experience;