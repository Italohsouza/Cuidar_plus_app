import React from 'react';
import { NavItem } from '../../types';
import { ICONS } from '../../constants';

interface BottomNavProps {
  activeView: NavItem;
  setActiveView: (view: NavItem) => void;
}

const NavButton: React.FC<{
  label: string;
  view: NavItem;
  // Fix: Use React.ReactElement to avoid "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  isActive: boolean;
  onClick: (view: NavItem) => void;
}> = ({ label, view, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-primary' : 'text-gray-500 hover:text-primary'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around max-w-lg mx-auto">
      <NavButton
        label="Início"
        view="dashboard"
        icon={ICONS.dashboard}
        isActive={activeView === 'dashboard'}
        onClick={setActiveView}
      />
      <NavButton
        label="Medicação"
        view="medication"
        icon={ICONS.medication}
        isActive={activeView === 'medication'}
        onClick={setActiveView}
      />
       <NavButton
        label="Exames"
        view="exams"
        icon={ICONS.exams}
        isActive={activeView === 'exams'}
        onClick={setActiveView}
      />
      <NavButton
        label="Acompanhe"
        view="follow"
        icon={ICONS.follow}
        isActive={activeView === 'follow'}
        onClick={setActiveView}
      />
      <NavButton
        label="Histórico"
        view="history"
        icon={ICONS.history}
        isActive={activeView === 'history'}
        onClick={setActiveView}
      />
    </nav>
  );
};