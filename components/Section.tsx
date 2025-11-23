import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = "" }) => {
  return (
    <section id={id} className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-2/3 h-1 bg-gradient-to-r from-neon-purple to-neon-blue rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
          </h2>
        </motion.div>
      )}
      {children}
    </section>
  );
};

export default Section;