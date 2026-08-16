import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Home, LineChart, Camera, Timer, UserCheck } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange, onOpenScanner }) {
  const navRef = useRef(null);
  const tabRefs = {
    today: useRef(null),
    trends: useRef(null),
    coach: useRef(null),
    profile: useRef(null)
  };

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: '0px',
    width: '0px',
    opacity: 0
  });

  const updateIndicator = useCallback(() => {
    const currentTabEl = tabRefs[activeTab]?.current;
    const containerEl = navRef.current;

    if (currentTabEl && containerEl) {
      const tabRect = currentTabEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const pillWidth = 24;
      const left = tabRect.left - containerRect.left + (tabRect.width - pillWidth) / 2;

      setIndicatorStyle({
        left: `${left}px`,
        width: `${pillWidth}px`,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    const raf = requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  return (
    <>
      <style>{`
        @keyframes navIconPop {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.22);
          }
          100% {
            transform: scale(1);
          }
        }

        .bottom-nav-container {
          position: relative;
        }

        .nav-item {
          transition: transform 0.15s ease, color 0.15s ease;
          position: relative;
        }

        .nav-item:active {
          transform: scale(0.9) !important;
        }

        .nav-item.active .nav-icon {
          animation: navIconPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          color: #10b981;
        }

        .nav-active-pill {
          position: absolute;
          bottom: calc(var(--safe-bottom, 0px) + 2px);
          height: 4px;
          border-radius: 999px;
          background: #10b981;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.7), 0 1px 3px rgba(16, 185, 129, 0.4);
          transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>

      <nav className="bottom-nav-container" ref={navRef}>
        <button
          ref={tabRefs.today}
          className={`nav-item ${activeTab === 'today' ? 'active' : ''}`}
          onClick={() => onTabChange('today')}
        >
          <Home size={20} className="nav-icon" key={activeTab === 'today' ? 'today-active' : 'today-inactive'} />
          <span>Today</span>
        </button>

        <button
          ref={tabRefs.trends}
          className={`nav-item ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => onTabChange('trends')}
        >
          <LineChart size={20} className="nav-icon" key={activeTab === 'trends' ? 'trends-active' : 'trends-inactive'} />
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
          ref={tabRefs.coach}
          className={`nav-item ${activeTab === 'coach' ? 'active' : ''}`}
          onClick={() => onTabChange('coach')}
        >
          <Timer size={20} className="nav-icon" key={activeTab === 'coach' ? 'coach-active' : 'coach-inactive'} />
          <span>Coach</span>
        </button>

        <button
          ref={tabRefs.profile}
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <UserCheck size={20} className="nav-icon" key={activeTab === 'profile' ? 'profile-active' : 'profile-inactive'} />
          <span>Goals</span>
        </button>

        {/* Animated sliding indicator pill */}
        <div
          className="nav-active-pill"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            opacity: indicatorStyle.opacity
          }}
        />
      </nav>
    </>
  );
}
