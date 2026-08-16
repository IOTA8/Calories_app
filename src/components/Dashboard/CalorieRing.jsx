import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export function CalorieRing({ summary, targets }) {
  const { totals, remainingCalories } = summary;
  const targetCalories = targets.targetCalories || 2200;

  // SVG ring math
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(totals.calories / targetCalories, 1.25);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const proteinPct = Math.min(100, Math.round((totals.protein / (targets.proteinGrams || 150)) * 100)) || 0;
  const carbsPct = Math.min(100, Math.round((totals.carbs / (targets.carbGrams || 250)) * 100)) || 0;
  const fatPct = Math.min(100, Math.round((totals.fat / (targets.fatGrams || 70)) * 100)) || 0;

  return (
    <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Background radial neon glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontWeight: 800, fontSize: '16px', color: '#ffffff', letterSpacing: '-0.2px' }}>
          Calories
        </span>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#a5b4fc',
          background: 'rgba(99, 102, 241, 0.12)',
          padding: '3px 8px',
          borderRadius: '999px',
          border: '1px solid rgba(99, 102, 241, 0.25)'
        }}>
          Goal: {targetCalories.toLocaleString()} kcal
        </span>
      </div>

      {/* Center Circular Calorie Gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px 0' }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="calTrackRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff5c8a" />
                <stop offset="60%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Glowing Neon Gradient Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#calTrackRingGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.45))'
              }}
            />
          </svg>

          {/* Center Numbers */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <span className="font-mono" style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-0.5px'
            }}>
              {totals.calories.toLocaleString()}
            </span>
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginTop: '4px'
            }}>
              / {targetCalories.toLocaleString()} kcal
            </span>
          </div>
        </div>
      </div>

      {/* 3 Sleek Integrated Macro Progress Chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {/* Protein */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Protein</span>
            <span className="font-mono" style={{ fontSize: '11.5px', fontWeight: 800, color: '#38bdf8' }}>
              {totals.protein}g<span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/{targets.proteinGrams}g</span>
            </span>
          </div>
          <div style={{ width: '100%', height: '5px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${proteinPct}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)', borderRadius: '999px' }} />
          </div>
        </div>

        {/* Carbs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Carbs</span>
            <span className="font-mono" style={{ fontSize: '11.5px', fontWeight: 800, color: '#fbbf24' }}>
              {totals.carbs}g<span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/{targets.carbGrams}g</span>
            </span>
          </div>
          <div style={{ width: '100%', height: '5px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${carbsPct}%`, height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '999px' }} />
          </div>
        </div>

        {/* Fat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Fat</span>
            <span className="font-mono" style={{ fontSize: '11.5px', fontWeight: 800, color: '#fb7185' }}>
              {totals.fat}g<span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/{targets.fatGrams}g</span>
            </span>
          </div>
          <div style={{ width: '100%', height: '5px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <div style={{ width: `${fatPct}%`, height: '100%', background: 'linear-gradient(90deg, #fb7185, #f43f5e)', borderRadius: '999px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
