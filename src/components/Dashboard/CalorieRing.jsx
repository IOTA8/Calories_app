import React from 'react';
import { Flame, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function CalorieRing({ summary, targets }) {
  const { totals, remainingCalories, caloriesPercent } = summary;
  const targetCalories = targets.targetCalories;

  // SVG ring math
  const size = 190;
  const strokeWidth = 13;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(totals.calories / targetCalories, 1.25);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const isOverGoal = totals.calories > targetCalories;
  const isLossGoal = targets.goalConfig?.category === 'loss';
  const isGainGoal = targets.goalConfig?.category === 'gain';

  // Ring stroke color
  const ringColor = isOverGoal
    ? (isGainGoal ? '#10b981' : '#f43f5e') // surplus is great for bulk, warning for cut
    : '#10b981';

  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-20%',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={18} color="#10b981" />
          <span style={{ fontWeight: 700, fontSize: '15px' }}>Energy & Calories</span>
        </div>
        <span className="badge badge-emerald font-mono">
          Goal: {targetCalories} kcal
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '12px', gap: '10px' }}>
        {/* SVG Circular Gauge */}
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease',
                filter: (caloriesPercent >= 85 && caloriesPercent <= 100) ? 'drop-shadow(0 0 8px rgba(16,185,129,0.6))' : 'none'
              }}
            />
          </svg>

          {/* Central Ring Labels */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              letterSpacing: '0.6px'
            }}>
              {isOverGoal ? 'Over Budget' : 'Remaining'}
            </span>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span className="font-mono" style={{
                fontSize: '40px',
                fontWeight: 900,
                color: isOverGoal && isLossGoal ? '#fb7185' : '#ffffff',
                lineHeight: 1.1
              }}>
                {Math.abs(remainingCalories)}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>kcal</span>
            </div>

            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginTop: '2px'
            }}>
              {caloriesPercent}% eaten
            </span>
          </div>
        </div>

        {/* Side Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '120px' }}>
          <div style={{
            background: 'linear-gradient(to right, rgba(16,185,129,0.06), transparent)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            border: '1px solid var(--border-subtle)',
            borderLeft: '3px solid #10b981'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Eaten Today</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
              {totals.calories} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kcal</span>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(to right, rgba(16,185,129,0.06), transparent)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            border: '1px solid var(--border-subtle)',
            borderLeft: '3px solid #10b981'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Deficit/Surplus</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              {targets.goalConfig?.deficitKcal < 0 ? (
                <>
                  <ArrowDownRight size={16} color="#34d399" />
                  <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#34d399' }}>
                    {targets.goalConfig.deficitKcal} kcal
                  </span>
                </>
              ) : targets.goalConfig?.deficitKcal > 0 ? (
                <>
                  <ArrowUpRight size={16} color="#fbbf24" />
                  <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>
                    +{targets.goalConfig.deficitKcal} kcal
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} color="#38bdf8" />
                  <span className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>
                    0 (Maintain)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
