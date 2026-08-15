import React, { useState } from 'react';
import { LineChart as LineChartIcon, Scale, Calendar, TrendingDown, TrendingUp, Sparkles, Check, Trash2, ArrowRight } from 'lucide-react';
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
    meals,
    getDaySummary,
    selectedDate
  } = useNutrition();

  const [inputWeight, setInputWeight] = useState(profile.weightKg || '');
  const [weightNote, setWeightNote] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);

  const emaWeights = calculateWeightEMA(weightLogs);
  const latestEntry = emaWeights[emaWeights.length - 1];
  const currentWeight = latestEntry ? latestEntry.weight : profile.weightKg;
  const targetWeight = profile.targetWeightKg || profile.weightKg;
  const weeklyChangeKg = targets.goalConfig?.weeklyKgChange || -0.5;

  const goalEta = calculateGoalETA(currentWeight, targetWeight, weeklyChangeKg);

  // Past 7 days data for weekly bar chart
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

  // 7-day average intake
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LineChartIcon size={18} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Trends & Progress</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Weight trajectory & 7-day adherence</p>
        </div>
      </div>

      {/* Weight Tracker Hero Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={18} color="#10b981" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Body Weight Trend</span>
          </div>
          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {showLogForm ? 'Cancel' : '+ Log Weight'}
          </button>
        </div>

        {/* Log Weight Form Dropdown */}
        {showLogForm && (
          <form onSubmit={handleSaveWeight} style={{
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Weight (kg) - Fasted Morning
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 77.2"
                  className="app-input"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                />
              </div>
              <div style={{ flex: 1.2 }}>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Note / State
                </label>
                <input
                  type="text"
                  placeholder="e.g. After workout"
                  className="app-input"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '10px' }}>
              <Check size={16} /> Save Weigh-In for {formatDisplayDate(selectedDate)}
            </button>
          </form>
        )}

        {/* Current Weight & ETA Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Weight</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
              {currentWeight} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goal Target</div>
            <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>
              {targetWeight} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target ETA</div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
              {goalEta?.estimatedDate || 'On Track'}
            </div>
          </div>
        </div>

        {/* Weight Sparkline / Recent Points */}
        <div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>
            Recent 7 Weigh-Ins (Smoothed Trend):
          </div>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {emaWeights.slice(-7).map((w, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  textAlign: 'center',
                  minWidth: '65px'
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {formatDisplayDate(w.date).slice(0, 3)}
                </div>
                <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                  {w.weight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Calorie Adherence Bar Chart */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>7-Day Calorie Adherence</div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              Avg Intake: <strong style={{ color: '#10b981' }}>{avgCalories} kcal/day</strong> (Goal: {targets.targetCalories})
            </div>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '140px',
          paddingTop: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '8px',
          gap: '6px'
        }}>
          {past7DaysData.map(d => {
            const heightPct = Math.min(100, Math.round((d.calories / maxCalInWeek) * 100));
            const isTargetMet = Math.abs(d.calories - d.target) <= 200;
            const isCurrentSelected = d.dateKey === selectedDate;

            return (
              <div
                key={d.dateKey}
                onClick={() => onSelectDate && onSelectDate(d.dateKey)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}
              >
                <span className="font-mono" style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  {d.calories}
                </span>

                <div style={{
                  width: '100%',
                  maxWidth: '28px',
                  height: `${Math.max(8, heightPct)}%`,
                  background: isCurrentSelected
                    ? 'linear-gradient(180deg, #38bdf8 0%, #10b981 100%)'
                    : 'linear-gradient(180deg, #10b981 0%, #047857 100%)',
                  borderRadius: '6px 6px 2px 2px',
                  boxShadow: isCurrentSelected ? '0 0 10px rgba(56, 189, 248, 0.6)' : 'none',
                  transition: 'height 0.4s ease'
                }} />

                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: isCurrentSelected ? '#38bdf8' : 'var(--text-secondary)'
                }}>
                  {d.label.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Average Macro Distribution */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '15px' }}>7-Day Average Macro Intake</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}>
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>Protein Avg</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {avgProtein}g
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Goal: {targets.proteinGrams}g</div>
          </div>

          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>Carbs Avg</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {avgCarbs}g
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Goal: {targets.carbGrams}g</div>
          </div>

          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#fb7185', fontWeight: 600 }}>Fats Avg</div>
            <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {avgFat}g
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Goal: {targets.fatGrams}g</div>
          </div>
        </div>
      </div>
    </div>
  );
}
