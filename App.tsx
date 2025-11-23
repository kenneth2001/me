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