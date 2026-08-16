import React, { useState } from 'react';
import { Scale, Calendar, TrendingDown, TrendingUp, Sparkles, Check, Trash2, Plus, ArrowRight, LineChart } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { calculateWeightEMA, calculateGoalETA } from '../../utils/nutritionCalculations';
import { formatDisplayDate, formatDateKey, getPast7Days } from '../../utils/formatters';

export function TrendsView({ onSelectDate }) {
  const {
    weightLogs,
    logWeight,
    deleteWeight,
    profile,
    targets,
    getDaySummary,
    selectedDate
  } = useNutrition();

  const [inputWeight, setInputWeight] = useState(profile.weightKg || '70');
  const [weightNote, setWeightNote] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  // Dynamic EMA calculation on real user data
  const emaWeights = calculateWeightEMA(weightLogs);
  const latestEntry = emaWeights.length > 0 ? emaWeights[emaWeights.length - 1] : null;
  const currentWeight = latestEntry ? latestEntry.weight : (profile.weightKg || 70);
  const startWeight = emaWeights.length > 0 ? emaWeights[0].weight : (profile.weightKg || 70);
  const weightDelta = parseFloat((currentWeight - startWeight).toFixed(1));
  const targetWeight = profile.targetWeightKg || currentWeight;
  const weeklyChangeKg = targets.goalConfig?.weeklyKgChange || -0.5;

  const goalEta = calculateGoalETA(currentWeight, targetWeight, weeklyChangeKg);

  // Past 7 days real data for dynamic adherence bar chart
  const past7DaysKeys = getPast7Days();
  const past7DaysData = past7DaysKeys.map(dateKey => {
    const summary = getDaySummary(dateKey);
    return {
      dateKey,
      label: formatDisplayDate(dateKey),
      calories: summary.totals.calories,
      target: targets.targetCalories,
      protein: summary.totals.protein,
      carbs: summary.totals.carbs,
      fat: summary.totals.fat
    };
  });

  const maxCalInWeek = Math.max(...past7DaysData.map(d => Math.max(d.calories, d.target)), 2500);

  // Real 7-day average intake
  const avgCalories = Math.round(past7DaysData.reduce((sum, d) => sum + d.calories, 0) / 7);
  const avgProtein = Math.round(past7DaysData.reduce((sum, d) => sum + d.protein, 0) / 7);
  const avgCarbs = Math.round(past7DaysData.reduce((sum, d) => sum + d.carbs, 0) / 7);
  const avgFat = Math.round(past7DaysData.reduce((sum, d) => sum + d.fat, 0) / 7);

  const handleSaveWeight = (e) => {
    e.preventDefault();
    if (!inputWeight) return;
    logWeight(parseFloat(inputWeight), selectedDate, weightNote);
    setShowLogForm(false);
    setWeightNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
            Stats & Trends
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Real-time trajectory & 7-day adherence
          </p>
        </div>

        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="btn-secondary"
          style={{ padding: '7px 12px', fontSize: '12px', borderRadius: 'var(--radius-full)' }}
        >
          <Plus size={14} /> {showLogForm ? 'Close' : 'Log Weight'}
        </button>
      </div>

      {/* Weigh-In Form Dropdown */}
      {showLogForm && (
        <form onSubmit={handleSaveWeight} className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>
            Log Weigh-In for {formatDisplayDate(selectedDate)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                className="app-input"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                placeholder="70.5"
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Note (optional)</label>
              <input
                type="text"
                className="app-input"
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
                placeholder="e.g. morning fasted"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '9px', fontSize: '13px' }}>
            <Check size={15} /> Save Weigh-In
          </button>
        </form>
      )}

      {/* Body Weight Metric Summary Card */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={16} color="#6366f1" />
            <span style={{ fontWeight: 800, fontSize: '14.5px', color: '#fff' }}>Body Weight Trajectory</span>
          </div>

          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            color: weightDelta <= 0 ? '#34d399' : '#fbbf24',
            background: weightDelta <= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(251, 191, 36, 0.12)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)'
          }}>
            {weightDelta <= 0 ? `▾ ${Math.abs(weightDelta)} kg total` : `▲ +${weightDelta} kg total`}
          </span>
        </div>

        {/* 3 Metric Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Current Weight</div>
            <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {currentWeight} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Goal Target</div>
            <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              {targetWeight} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Target ETA</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
              {typeof goalEta === 'object' ? goalEta.estimatedDate : goalEta}
            </div>
          </div>
        </div>

        {/* Recent Weigh-In Pills */}
        {emaWeights.length > 0 ? (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
              Recent Trend Points (EMA Smoothed):
            </div>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {emaWeights.slice(-6).map((w, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 8px',
                    textAlign: 'center',
                    minWidth: '60px',
                    flexShrink: 0
                  }}
                >
                  <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                    {formatDisplayDate(w.date).slice(0, 3)}
                  </div>
                  <div className="font-mono" style={{ fontSize: '12.5px', fontWeight: 700, color: '#a5b4fc', marginTop: '2px' }}>
                    {w.weight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', padding: '6px 0' }}>
            No weigh-ins logged yet. Tap <strong>+ Log Weight</strong> to track your progress!
          </div>
        )}
      </div>

      {/* 7-Day Calorie Adherence Bar Chart */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#ffffff' }}>
              7-Day Calorie Adherence
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Avg: <strong style={{ color: '#a5b4fc' }}>{avgCalories} kcal/day</strong> (Goal: {targets.targetCalories})
            </div>
          </div>
        </div>

        {/* Interactive Bar Chart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '130px',
          paddingTop: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '8px',
          gap: '6px'
        }}>
          {past7DaysData.map(d => {
            const heightPct = Math.min(100, Math.round((d.calories / maxCalInWeek) * 100));
            const isCurrentSelected = d.dateKey === selectedDate;

            return (
              <div
                key={d.dateKey}
                onClick={() => onSelectDate && onSelectDate(d.dateKey)}
                title={`Click to view diary for ${d.label} (${d.calories} kcal)`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}
              >
                <span className="font-mono" style={{ fontSize: '9px', color: isCurrentSelected ? '#a5b4fc' : 'var(--text-muted)' }}>
                  {d.calories}
                </span>

                <div style={{
                  width: '100%',
                  maxWidth: '26px',
                  height: `${Math.max(6, heightPct)}%`,
                  background: isCurrentSelected
                    ? 'linear-gradient(180deg, #6366f1 0%, #a855f7 100%)'
                    : 'linear-gradient(180deg, rgba(99, 102, 241, 0.6) 0%, rgba(99, 102, 241, 0.2) 100%)',
                  borderRadius: '6px 6px 2px 2px',
                  boxShadow: isCurrentSelected ? '0 0 10px rgba(99, 102, 241, 0.7)' : 'none',
                  transition: 'height 0.4s ease'
                }} />

                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: isCurrentSelected ? '#a5b4fc' : 'var(--text-secondary)'
                }}>
                  {d.label.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Average Macro Distribution */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#ffffff' }}>
          7-Day Average Macro Intake
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px'
        }}>
          {/* Protein */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: 700 }}>Protein Avg</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {avgProtein}g
            </div>
            <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Goal: {targets.proteinGrams}g</div>
          </div>

          {/* Carbs */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10.5px', color: '#fbbf24', fontWeight: 700 }}>Carbs Avg</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {avgCarbs}g
            </div>
            <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Goal: {targets.carbGrams}g</div>
          </div>

          {/* Fat */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10.5px', color: '#fb7185', fontWeight: 700 }}>Fat Avg</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {avgFat}g
            </div>
            <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Goal: {targets.fatGrams}g</div>
          </div>
        </div>
      </div>

      {/* Detailed Weigh-In History List */}
      {weightLogs.length > 0 && (
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#ffffff' }}>
            Weigh-In History
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
            {weightLogs.slice().reverse().map(log => (
              <div
                key={log.date}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-surface)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                    {formatDisplayDate(log.date)}
                  </span>
                  {log.note && (
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      ({log.note})
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#a5b4fc' }}>
                    {log.weight} kg
                  </span>
                  <button
                    onClick={() => deleteWeight(log.date)}
                    style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '2px' }}
                    title="Delete entry"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
