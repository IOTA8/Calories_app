import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, User, Key, Flame, Smartphone } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { formatDisplayDate, formatDateKey } from '../../utils/formatters';

export function TopHeader({ onOpenProfile, onOpenApiKey, onOpenInstall }) {
  const { selectedDate, setSelectedDate, profile, targets, apiKey } = useNutrition();

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

  const getGoalBadge = () => {
    const goal = targets.goalConfig;
    if (!goal) return { text: 'Tracker', class: 'badge-emerald' };
    if (goal.category === 'loss') return { text: `${goal.label} (${goal.deficitKcal} kcal)`, class: 'badge-emerald' };
    if (goal.category === 'gain') return { text: `${goal.label} (+${goal.deficitKcal} kcal)`, class: 'badge-amber' };
    if (goal.category === 'recomp') return { text: 'Recomposition', class: 'badge-sky' };
    return { text: 'Maintenance', class: 'badge-purple' };
  };

  const goalBadge = getGoalBadge();

  return (
    <header style={{
      padding: '16px 16px 12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      background: 'rgba(9, 13, 22, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(12px)'
    }}>
      {/* Top row: App Name & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)'
          }}>
            <Flame size={18} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '17px', letterSpacing: '-0.3px' }}>NutriVision</span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Sparkles size={10} /> AI
              </span>
            </div>
          </div>
        </div>

        {/* Right buttons: Install App + API Key + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onOpenInstall}
            title="Install app to iOS / Android"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 9px',
              borderRadius: '99px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Smartphone size={13} />
            <span>Mobile</span>
          </button>

          <button
            onClick={onOpenApiKey}
            title={apiKey ? 'Gemini API Connected' : 'Configure Gemini API Key'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 9px',
              borderRadius: '99px',
              border: `1px solid ${apiKey ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
              background: apiKey ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              color: apiKey ? '#34d399' : 'var(--text-secondary)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Key size={13} />
            <span>{apiKey ? 'API Live' : 'AI Key'}</span>
          </button>

          <button
            onClick={onOpenProfile}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="User Profile & Goals"
          >
            <User size={16} />
          </button>
        </div>
      </div>

      {/* Date Navigation & Goal Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handlePrevDay}
            className="btn-icon"
            style={{ width: '30px', height: '30px' }}
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            onClick={() => {
              const today = formatDateKey(new Date());
              setSelectedDate(today);
            }}
            style={{
              fontWeight: 700,
              fontSize: '14px',
              padding: '4px 8px',
              cursor: 'pointer',
              color: isToday ? '#10b981' : 'var(--text-primary)'
            }}
          >
            {formatDisplayDate(selectedDate)}
          </div>

          <button
            onClick={handleNextDay}
            className="btn-icon"
            style={{ width: '30px', height: '30px' }}
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className={`badge ${goalBadge.class}`} style={{ fontSize: '11px' }}>
          {goalBadge.text}
        </div>
      </div>
    </header>
  );
}
