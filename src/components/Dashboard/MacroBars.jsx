import React from 'react';
import { Activity, Beef, Wheat, Droplet, Leaf } from 'lucide-react';

export function MacroBars({ summary, targets }) {
  const { totals } = summary;

  const macros = [
    {
      label: 'Protein',
      icon: Beef,
      consumed: totals.protein,
      target: targets.proteinGrams,
      unit: 'g',
      color: '#38bdf8',
      gradient: 'linear-gradient(90deg, #38bdf8, #0ea5e9)',
      glow: 'var(--color-protein-glow)',
      badge: 'badge-sky',
      subtext: targets.goalConfig?.category === 'loss' ? 'Muscle Preservation' : 'MPS Hypertrophy'
    },
    {
      label: 'Carbs',
      icon: Wheat,
      consumed: totals.carbs,
      target: targets.carbGrams,
      unit: 'g',
      color: '#fbbf24',
      gradient: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
      glow: 'var(--color-carbs-glow)',
      badge: 'badge-amber',
      subtext: 'Glycogen & Energy'
    },
    {
      label: 'Fats',
      icon: Droplet,
      consumed: totals.fat,
      target: targets.fatGrams,
      unit: 'g',
      color: '#fb7185',
      gradient: 'linear-gradient(90deg, #fb7185, #f43f5e)',
      glow: 'var(--color-fat-glow)',
      badge: 'badge-rose',
      subtext: 'Hormone Health'
    },
    {
      label: 'Fiber',
      icon: Leaf,
      consumed: totals.fiber,
      target: targets.fiberGrams || 28,
      unit: 'g',
      color: '#c084fc',
      gradient: 'linear-gradient(90deg, #c084fc, #a855f7)',
      glow: 'rgba(192, 132, 252, 0.3)',
      badge: 'badge-purple',
      subtext: 'Satiety & Gut'
    }
  ];

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={18} color="#38bdf8" />
          <span style={{ fontWeight: 700, fontSize: '15px' }}>Macronutrients</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target vs Consumed</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {macros.map((m) => {
          const Icon = m.icon;
          const pct = Math.min(100, Math.round((m.consumed / (m.target || 1)) * 100)) || 0;
          const isCompleted = m.consumed >= m.target;

          return (
            <div
              key={m.label}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={15} color={m.color} />
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{m.label}</span>
                </div>
                <span className="font-mono" style={{ fontSize: '11px', color: m.color, fontWeight: 700 }}>
                  {pct}%
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="macro-progress-track" style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
                  <div
                    className={`macro-progress-fill ${isCompleted ? 'complete' : ''}`}
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: m.gradient,
                      borderRadius: '4px',
                      boxShadow: `0 0 10px ${m.color}66`
                    }}
                  />
                </div>
                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{m.consumed}{m.unit}</span> / {m.target}{m.unit}
                </div>
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {m.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
