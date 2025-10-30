import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Medication from './components/Medication';
import Exams from './components/Exams';
import Follow from './components/Follow';
import History from './components/History';
import Auth from './components/Auth';
import { BottomNav } from './components/common/BottomNav';
import { NavItem } from './types';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItem>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for logged-in status in local storage to persist session
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn) {
      setIsLoggedIn(true);
    }

    // Request permission for notifications on app load
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []); // Empty dependency array ensures this runs only once

  const handleLoginSuccess = () => {
    localStorage.setItem('userLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'medication':
        return <Medication />;
      case 'exams':
        return <Exams />;
      case 'follow':
        return <Follow />;
      case 'history':
        return <History />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="container mx-auto max-w-lg pb-24">
        <header className="bg-primary text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center capitalize flex-grow">
            Cuidar+ {activeView !== 'dashboard' && `: ${activeView}`}
          </h1>
          <button onClick={handleLogout} title="Sair" className="text-white hover:text-warning transition-colors">
            {ICONS.logout}
          </button>
        </header>
        <main className="p-4">
          {renderView()}
        </main>
      </div>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;