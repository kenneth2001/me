import React from 'react';
import Section from './Section';
import { SKILLS } from '../constants';
import { motion } from 'framer-motion';

const Skills: React.FC = () => {
  return (
    <Section id="skills" title="Technical Skills">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILLS.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60 transition-all group"
          >
            <h3 className="text-lg font-semibold text-white mb-4 border-l-4 border-primary-500 pl-3">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, sIndex) => (
                <span
                  key={sIndex}
                  className="px-3 py-1 bg-slate-900 text-slate-300 rounded-md text-sm border border-slate-800 group-hover:border-primary-900/50 group-hover:text-primary-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
