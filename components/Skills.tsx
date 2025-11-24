import React from 'react';
import Section from './Section';
import { SKILLS } from '../constants';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Share2, 
  Database, 
  PieChart, 
  Terminal, 
  MessageSquare, 
  Search,
  Cpu,
  Globe,
  LineChart
} from 'lucide-react';

const getIconForCategory = (category: string) => {
  if (category.includes("Multi-Agent")) return <Share2 size={24} className="text-neon-purple" />;
  if (category.includes("Deep Learning")) return <Brain size={24} className="text-neon-pink" />;
  if (category.includes("Data Analytics")) return <Search size={24} className="text-neon-blue" />;
  if (category.includes("Big Data")) return <Database size={24} className="text-emerald-400" />;
  
  if (category.includes("BI & Data")) return <PieChart size={24} className="text-amber-400" />;
  if (category.includes("Visualization Libraries")) return <LineChart size={24} className="text-amber-300" />;
  
  if (category.includes("Programming")) return <Terminal size={24} className="text-slate-200" />;
  if (category.includes("Web Development")) return <Globe size={24} className="text-cyan-400" />;
  
  if (category.includes("Languages")) return <MessageSquare size={24} className="text-primary-400" />;
  
  return <Cpu size={24} className="text-slate-400" />;
};

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
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 hover:border-slate-600 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-neon-purple/10 transition-all duration-300 group"
          >
            <div className="flex items-center mb-5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 mr-3 group-hover:border-slate-600 transition-colors">
                {getIconForCategory(category.category)}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">
                {category.category}
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, sIndex) => (
                <span
                  key={sIndex}
                  className="px-3 py-1.5 bg-slate-950 text-slate-300 rounded-md text-sm border border-slate-800/80 group-hover:border-slate-600/50 hover:!border-neon-purple hover:!text-white hover:!bg-neon-purple/10 transition-all cursor-default"
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
