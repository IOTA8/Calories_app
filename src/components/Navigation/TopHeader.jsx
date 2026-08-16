import React from 'react';
import { ChevronLeft, ChevronRight, User, Key, Flame, Smartphone, Sparkles } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { formatDisplayDate, formatDateKey } from '../../utils/formatters';

export function TopHeader({ onOpenProfile, onOpenApiKey, onOpenInstall }) {
  const { selectedDate, setSelectedDate, targets, apiKey } = useNutrition();

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const prev = new Date(y, m - 1, d - 1);
    setSelectedDate(formatDateKey(prev));
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const next = new Date(y, m - 1, d + 1);
    setSelectedDate(formatDateKey(next));
  };

  const isToday = selectedDate === formatDateKey(new Date());

  return (
    <header style={{
      padding: '12px 18px 10px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      background: 'rgba(8, 11, 17, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      flexShrink: 0,
      zIndex: 40,
      backdropFilter: 'blur(20px)'
    }}>
      {/* Top Row: App Brand & Quick Settings */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.45)'
          }}>
            <Flame size={16} color="#fff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffffff', letterSpacing: '-0.3px' }}>
              NutriVision
            </span>
          </div>
        </div>

        {/* Right buttons: Mobile + AI Key + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onOpenInstall}
            title="Install app to iOS / Android"
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <Smartphone size={15} color="var(--text-secondary)" />
          </button>

          <button
            onClick={onOpenApiKey}
            title={apiKey ? 'Gemini AI Live' : 'Configure AI Key'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '999px',
              border: `1px solid ${apiKey ? 'rgba(99, 102, 241, 0.4)' : 'var(--border-subtle)'}`,
              background: apiKey ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              color: apiKey ? '#a5b4fc' : 'var(--text-muted)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Key size={12} />
            <span>{apiKey ? 'AI Active' : 'AI Key'}</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            title="User Profile & Goals"
          >
            <User size={15} color="var(--text-secondary)" />
          </button>
        </div>
      </div>

      {/* Date Switcher Center Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-md)',
        padding: '3px 6px',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={handlePrevDay}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <div
          onClick={() => {
            const today = formatDateKey(new Date());
            setSelectedDate(today);
          }}
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: isToday ? '#a5b4fc' : '#ffffff',
            cursor: 'pointer'
          }}
        >
          {formatDisplayDate(selectedDate)}
        </div>

        <button
          onClick={handleNextDay}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </header>
  );
}
