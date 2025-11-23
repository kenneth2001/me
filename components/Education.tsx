import React from 'react';
import Section from './Section';
import { EDUCATIONS } from '../constants';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <Section id="education" title="Education">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EDUCATIONS.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary-900/20 rounded-lg text-primary-400">
                <GraduationCap size={28} />
              </div>
              <span className="text-sm font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                {edu.period}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{edu.school}</h3>
            <h4 className="text-lg text-fuchsia-400 mb-4">{edu.degree}</h4>
            
            {edu.honors && (
              <div className="mb-4">
                {edu.honors.map((honor, hIndex) => (
                  <div key={hIndex} className="flex items-center text-amber-400 text-sm font-medium mb-1">
                    <Award size={16} className="mr-2" />
                    {honor}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-auto pt-4 border-t border-slate-800/50">
                {edu.details?.map((detail, dIndex) => (
                    <p key={dIndex} className="text-slate-400 text-sm mb-1">• {detail}</p>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Education;