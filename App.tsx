import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-primary-500/30 selection:text-white">
      <Navbar />
      <main className="space-y-0">
        <Hero />
        <div className="relative bg-slate-950">
            {/* Subtle separator gradient */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10"></div>
            <Experience />
            <Education />
            <Skills />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
