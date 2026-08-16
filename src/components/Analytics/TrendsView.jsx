import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Plus, Scale, Sparkles, Flame, Dumbbell } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { calculateWeightEMA } from '../../utils/nutritionCalculations';
import { formatDisplayDate, getPast7Days } from '../../utils/formatters';

export function TrendsView({ onSelectDate }) {
  const {
    weightLogs,
    logWeight,
    profile,
    selectedDate,
    getDaySummary
  } = useNutrition();

  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview', 'weight', 'body'
  const [showLogModal, setShowLogModal] = useState(false);
  const [inputWeight, setInputWeight] = useState(profile.weightKg || '70.5');

  const emaWeights = calculateWeightEMA(weightLogs);
  const currentWeight = emaWeights.length > 0 ? emaWeights[emaWeights.length - 1].weight : (profile.weightKg || 70.5);
  const startWeight = emaWeights.length > 0 ? emaWeights[0].weight : 73.0;
  const weightDelta = parseFloat((currentWeight - startWeight).toFixed(1));

  // Past 7 days average
  const past7DaysKeys = getPast7Days();
  const past7DaysCalories = past7DaysKeys.map(k => getDaySummary(k).totals.calories);
  const avgCalories = Math.round(past7DaysCalories.reduce((a, b) => a + b, 0) / (past7DaysCalories.length || 1)) || 1650;

  const handleSaveWeight = (e) => {
    e.preventDefault();
    if (inputWeight) {
      logWeight(parseFloat(inputWeight), selectedDate);
      setShowLogModal(false);
    }
  };

  // SVG Chart points calculation for Weight Trend
  const chartData = emaWeights.slice(-10);
  const weights = chartData.map(d => d.weight);
  const minW = Math.min(...weights, currentWeight - 1);
  const maxW = Math.max(...weights, currentWeight + 1);
  const range = maxW - minW || 1;

  const svgWidth = 340;
  const svgHeight = 140;
  const padding = 20;

  const points = chartData.map((d, i) => {
    const x = padding + (i / Math.max(chartData.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((d.weight - minW) / range) * (svgHeight - padding * 2);
    return { x, y, ...d };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = points.length > 1
    ? `M ${points[0].x},${svgHeight - padding} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},${svgHeight - padding} Z`
    : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
          Progress
        </h2>
        <button
          onClick={() => setShowLogModal(true)}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-full)' }}
        >
          <Plus size={14} /> Log Weight
        </button>
      </div>

      {/* Sub-Tabs (Overview | Weight | Body) */}
      <div className="segmented-control">
        <button
          className={`segmented-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          Overview
        </button>
        <button
          className={`segmented-btn ${activeSubTab === 'weight' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('weight')}
        >
          Weight
        </button>
        <button
          className={`segmented-btn ${activeSubTab === 'body' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('body')}
        >
          Body Stats
        </button>
      </div>

      {/* 4-Card Metric Grid (Directly matching CalTrack screenshot) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
      }}>
        {/* Weight */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Weight</div>
          <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {currentWeight} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {weightDelta <= 0 ? `▾ ${Math.abs(weightDelta)} kg` : `▲ +${weightDelta} kg`}
            </span>
          </div>
        </div>

        {/* Body Fat */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Body Fat</div>
          <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            18.3 <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              ▾ -1.2%
            </span>
          </div>
        </div>

        {/* Muscle Mass */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Muscle Mass</div>
          <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            55.6 <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              ▲ +1.8 kg
            </span>
          </div>
        </div>

        {/* BMI */}
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>BMI</div>
          <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            22.5
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#a5b4fc',
              background: 'rgba(99, 102, 241, 0.12)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              Normal
            </span>
          </div>
        </div>
      </div>

      {/* Weight Trend Chart Card */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 800, fontSize: '14.5px', color: '#ffffff' }}>
            Weight Trend
          </span>
          <span className="font-mono" style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: 700 }}>
            {currentWeight} kg
          </span>
        </div>

        {/* SVG Spline Chart */}
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <linearGradient id="purpleAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area under curve */}
            {areaPath && (
              <path d={areaPath} fill="url(#purpleAreaGradient)" />
            )}

            {/* Glowing neon line */}
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylineStr}
              style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' }}
            />

            {/* Data point dots */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === points.length - 1 ? 5 : 3.5}
                fill="#ffffff"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
            ))}
          </svg>
        </div>

        {/* Date labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span>May 1</span>
          <span>May 8</span>
          <span>May 15</span>
          <span>May 22</span>
          <span>May 31</span>
        </div>
      </div>

      {/* Summary Statistics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px'
      }}>
        <div className="glass-card" style={{ padding: '12px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Avg</div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {avgCalories} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>kcal</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '12px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Workouts</div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 800, color: '#f97316', marginTop: '4px' }}>
            12
          </div>
        </div>

        <div className="glass-card" style={{ padding: '12px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Streak</div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 800, color: '#ff5c8a', marginTop: '4px' }}>
            8 Days 🔥
          </div>
        </div>
      </div>

      {/* Modal for Logging Weight */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ padding: '20px' }}>
            <div className="sheet-handle-bar" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '10px 0 14px 0' }}>Log Today's Weight</h3>
            <form onSubmit={handleSaveWeight} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="number"
                step="0.1"
                required
                className="app-input"
                value={inputWeight}
                onChange={e => setInputWeight(e.target.value)}
                placeholder="e.g. 70.5"
              />
              <button type="submit" className="btn-primary">
                Save Weight
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
