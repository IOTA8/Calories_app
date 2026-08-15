import React, { useState, useEffect } from 'react';
import { Timer, Play, Square, Sparkles, Flame, Zap, Award, CheckCircle2, Dumbbell } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';

export function FastingWidget() {
  const { fastingState, toggleFasting, setFastingState } = useNutrition();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (fastingState.isFasting && fastingState.startTime) {
      const update = () => {
        const diff = Math.floor((Date.now() - fastingState.startTime) / 1000);
        setElapsedSeconds(Math.max(0, diff));
      };
      update();
      interval = setInterval(update, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [fastingState]);

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const targetHours = fastingState.targetHours || 16;
  const progressPct = Math.min(100, Math.round((hours / targetHours) * 100));

  const getFastingStage = (hrs) => {
    if (hrs < 4) return { label: 'Digestion & Blood Sugar Balance', icon: Zap, color: '#38bdf8' };
    if (hrs < 12) return { label: 'Glycogen Depletion & Fat Burn', icon: Flame, color: '#fbbf24' };
    if (hrs < 16) return { label: 'Ketosis & Maximum Fat Oxidation', icon: Sparkles, color: '#10b981' };
    return { label: 'Autophagy & Cellular Cleansing', icon: Award, color: '#c084fc' };
  };

  const stage = getFastingStage(hours);
  const StageIcon = stage.icon;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Timer size={18} color="#c084fc" />
          <span style={{ fontWeight: 700, fontSize: '15px' }}>Intermittent Fasting (16:8)</span>
        </div>
        <select
          className="app-select"
          value={fastingState.targetHours || 16}
          onChange={(e) => setFastingState(prev => ({ ...prev, targetHours: Number(e.target.value) }))}
          style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
        >
          <option value={14}>14:10 Fast</option>
          <option value={16}>16:8 Standard</option>
          <option value={18}>18:6 Deep Fast</option>
          <option value={20}>20:4 Warrior</option>
        </select>
      </div>

      {/* Circular / Progress Display */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {fastingState.isFasting ? 'Fast In Progress' : 'Eating Window Active'}
        </div>

        <div className="font-mono" style={{ fontSize: '36px', fontWeight: 800, color: '#ffffff', letterSpacing: '1px' }}>
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div style={{ width: '100%', maxWidth: '280px' }}>
          <div className="macro-progress-track" style={{ height: '8px' }}>
            <div
              className="macro-progress-fill"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #c084fc 0%, #38bdf8 100%)',
                boxShadow: '0 0 10px rgba(192, 132, 252, 0.5)'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0h</span>
            <span style={{ color: '#c084fc', fontWeight: 700 }}>{progressPct}% ({hours}h / {targetHours}h)</span>
            <span>{targetHours}h</span>
          </div>
        </div>

        {fastingState.isFasting && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: `${stage.color}15`,
            border: `1px solid ${stage.color}40`,
            borderRadius: '99px',
            padding: '4px 12px',
            fontSize: '11.5px',
            color: stage.color,
            fontWeight: 600
          }}>
            <StageIcon size={14} />
            <span>{stage.label}</span>
          </div>
        )}

        <button
          onClick={() => toggleFasting(targetHours)}
          className={fastingState.isFasting ? 'btn-secondary' : 'btn-primary'}
          style={{ width: '100%', maxWidth: '220px', marginTop: '6px' }}
        >
          {fastingState.isFasting ? (
            <>
              <Square size={16} fill="#fb7185" color="#fb7185" /> End Fast & Eat
            </>
          ) : (
            <>
              <Play size={16} fill="#fff" /> Start Fast
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function CoachView() {
  const { profile, targets, getDaySummary } = useNutrition();
  const summary = getDaySummary();
  const goal = targets.goalConfig;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #c084fc 0%, #6366f1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>AI Nutrition Coach</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Goal-specific metabolic insights & fasting</p>
        </div>
      </div>

      {/* Intermittent Fasting Widget */}
      <FastingWidget />

      {/* Goal Strategy Breakdown Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dumbbell size={18} color="#10b981" />
          <span style={{ fontWeight: 700, fontSize: '15px' }}>Active Protocol: {goal?.label}</span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {goal?.description}
        </p>

        <div style={{
          background: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Caloric Delta</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: goal?.deficitKcal < 0 ? '#34d399' : '#fbbf24' }}>
              {goal?.deficitKcal > 0 ? `+${goal?.deficitKcal}` : goal?.deficitKcal} kcal/day
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Weekly Pace</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
              {goal?.weeklyKgChange > 0 ? `+${goal?.weeklyKgChange}` : goal?.weeklyKgChange} kg / wk
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Protein Target Multiplier</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>
              {goal?.proteinPerKg} g / kg bodyweight
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Recommended Fiber</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#c084fc' }}>
              ≥ {targets.fiberGrams || 28} g / day
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Best Practices Checklist */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontWeight: 700, fontSize: '14px' }}>Science-Backed Guidelines for {profile.goal?.includes('gain') ? 'Bulking' : 'Fat Loss'}</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          {profile.goal?.includes('gain') ? (
            <>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Muscle Protein Synthesis:</strong> Spread your {targets.proteinGrams}g protein across 4 meals (30-40g each) to keep MPS triggered all day.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Clean Calorie Density:</strong> Use nut butters, olive oil, and oats to hit your surplus without feeling sluggish.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Post-Workout Window:</strong> Eat 40-50g carbs with 30g protein within 2 hours of resistance training.</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>High Protein Satiety:</strong> 2.0g/kg protein maximizes muscle retention and elevates TEF (Thermic Effect of Food).</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Volume Eating:</strong> Fill half your plate with non-starchy leafy greens and cruciferous vegetables for zero-calorie fullness.</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Hydration:</strong> Drink a large glass of water 15 minutes before meals to naturally reduce hunger hormone ghrelin.</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
