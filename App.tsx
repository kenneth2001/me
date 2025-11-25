import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Ratings from './components/Ratings';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-primary-500/30 selection:text-white flex flex-col">
      <Navbar onNavigate={setCurrentView} currentView={currentView} />
      <main className="flex-grow">
        {currentView === 'home' ? <Home /> : <Ratings />}
      </main>
      <Footer />
    </div>
  );
};

export default App;