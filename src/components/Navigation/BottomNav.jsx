import React from 'react';
import { Home, BookOpen, Plus, LineChart, User } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange, onOpenScanner }) {
  return (
    <nav className="bottom-nav-container">
      {/* Home / Today */}
      <button
        className={`nav-item ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => onTabChange('today')}
      >
        <Home size={19} />
        <span>Home</span>
      </button>

      {/* Diary / Coach */}
      <button
        className={`nav-item ${activeTab === 'coach' ? 'active' : ''}`}
        onClick={() => onTabChange('coach')}
      >
        <BookOpen size={19} />
        <span>Coach</span>
      </button>

      {/* Floating Center Action Button for AI Camera Food Scanner */}
      <button
        className="fab-scan-button"
        onClick={onOpenScanner}
        title="Snap & AI Scan Food"
        aria-label="Scan Food"
      >
        <Plus size={28} strokeWidth={2.8} />
      </button>

      {/* Progress / Stats */}
      <button
        className={`nav-item ${activeTab === 'trends' ? 'active' : ''}`}
        onClick={() => onTabChange('trends')}
      >
        <LineChart size={19} />
        <span>Stats</span>
      </button>

      {/* Profile / Goals */}
      <button
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <User size={19} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
