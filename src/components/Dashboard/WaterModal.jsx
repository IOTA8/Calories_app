import React, { useState } from 'react';
import { X, Droplets, Plus, Minus, RotateCcw, Check } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { formatDisplayDate } from '../../utils/formatters';

export function WaterModal({ isOpen, onClose }) {
  const { selectedDate, getDaySummary, targets, logWater, setWaterAmount, resetWater } = useNutrition();
  const summary = getDaySummary(selectedDate);
  const currentWaterMl = summary.water || 0;
  const targetWaterMl = targets.waterGoalMl || 2500;
  const progressPct = Math.min(100, Math.round((currentWaterMl / targetWaterMl) * 100)) || 0;

  const [customMl, setCustomMl] = useState('');

  if (!isOpen) return null;

  const handleCustomSet = (e) => {
    e.preventDefault();
    if (customMl !== '') {
      setWaterAmount(selectedDate, parseInt(customMl, 10));
      setCustomMl('');
    }
  };

  const handleCustomAdd = () => {
    if (customMl !== '') {
      logWater(selectedDate, parseInt(customMl, 10));
      setCustomMl('');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset water intake to 0 ml for today?')) {
      resetWater(selectedDate);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '80vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4'
            }}>
              <Droplets size={16} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Hydration Tracker</span>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDisplayDate(selectedDate)}</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Hydration Progress Hero Card */}
          <div className="glass-card" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Water Drunk</div>
                <div className="font-mono" style={{ fontSize: '30px', fontWeight: 900, color: '#06b6d4', marginTop: '2px' }}>
                  {(currentWaterMl / 1000).toFixed(2)} <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>L</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Daily Goal</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  {(targetWaterMl / 1000).toFixed(1)} L <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({targetWaterMl}ml)</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#06b6d4', marginTop: '2px' }}>
                  {progressPct}% of goal
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #38bdf8)', borderRadius: '999px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Quick Presets Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>
              Quick Add / Subtract
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <button
                onClick={() => logWater(selectedDate, 250)}
                className="btn-secondary"
                style={{ padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={16} color="#06b6d4" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>+250ml</span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>1 Glass</span>
              </button>

              <button
                onClick={() => logWater(selectedDate, 500)}
                className="btn-secondary"
                style={{ padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={16} color="#06b6d4" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>+500ml</span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>1 Bottle</span>
              </button>

              <button
                onClick={() => logWater(selectedDate, 750)}
                className="btn-secondary"
                style={{ padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={16} color="#06b6d4" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>+750ml</span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Large Flask</span>
              </button>

              <button
                onClick={() => logWater(selectedDate, -250)}
                className="btn-secondary"
                style={{ padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
              >
                <Minus size={16} color="#fb7185" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fb7185' }}>-250ml</span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Undo</span>
              </button>
            </div>
          </div>

          {/* Custom Exact Amount Form */}
          <form onSubmit={handleCustomSet} className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff' }}>
              Custom Water Amount (ml)
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                step="50"
                placeholder="e.g. 400"
                className="app-input"
                value={customMl}
                onChange={e => setCustomMl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleCustomAdd}
                className="btn-secondary"
                style={{ padding: '0 14px', fontSize: '12.5px', color: '#06b6d4' }}
              >
                + Add
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: '0 14px',
                  width: 'auto',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  boxShadow: '0 2px 10px rgba(6, 182, 212, 0.4)'
                }}
              >
                <Check size={16} /> Set
              </button>
            </div>
          </form>

          {/* Reset Action */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            <button
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px'
              }}
            >
              <RotateCcw size={13} /> Reset today's water to 0 ml
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
