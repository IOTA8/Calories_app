import React from 'react';
import { Home, LineChart, Camera, Timer, UserCheck } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange, onOpenScanner }) {
  return (
    <nav className="bottom-nav-container">
      <button
        className={`nav-item ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => onTabChange('today')}
      >
        <Home size={20} />
        <span>Today</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'trends' ? 'active' : ''}`}
        onClick={() => onTabChange('trends')}
      >
        <LineChart size={20} />
        <span>Trends</span>
      </button>

      {/* Floating Center Action Button for AI Camera Food Scanner */}
      <button
        className="fab-scan-button"
        onClick={onOpenScanner}
        title="Snap & AI Scan Food"
        aria-label="Scan Food"
      >
        <Camera size={26} strokeWidth={2.4} />
      </button>

      <button
        className={`nav-item ${activeTab === 'coach' ? 'active' : ''}`}
        onClick={() => onTabChange('coach')}
      >
        <Timer size={20} />
        <span>Coach</span>
      </button>

      <button
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <UserCheck size={20} />
        <span>Goals</span>
      </button>
    </nav>
  );
}
