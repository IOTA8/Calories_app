import React, { useState } from 'react';
import { Droplet, Droplets, Plus, Minus, RotateCcw } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';

export function WaterTracker({ summary }) {
  const { logWater, resetWater, selectedDate, targets } = useNutrition();
  const { water, waterPercent } = summary;
  const targetWater = targets.waterGoalMl || 2500;
  const [customAmount, setCustomAmount] = useState('');

  const handleReset = () => {
    if (window.confirm("Reset today's water intake to 0?")) {
      resetWater(selectedDate);
    }
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      logWater(selectedDate, amount);
      setCustomAmount('');
    }
  };

  return (
    <div className="glass-card water-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Droplet size={16} color="#06b6d4" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={14} color="#06b6d4" /> Hydration
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {water} ml / {targetWater} ml ({waterPercent}%)
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="btn-icon"
          style={{ width: '28px', height: '28px' }}
          title="Reset Water for today"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Water Fill Bar */}
      <div style={{
        width: '100%',
        height: '12px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '99px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, waterPercent)}%`,
            background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 100%)',
            borderRadius: '99px',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.5)',
            transition: 'width 0.5s ease'
          }}
        />
      </div>

      {/* Quick Add Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={() => logWater(selectedDate, -250)}
          className="btn-secondary"
          style={{ padding: '8px 10px', fontSize: '13px' }}
          title="Remove 250ml"
        >
          <Minus size={14} color="#ef4444" />
        </button>
        <button
          onClick={() => logWater(selectedDate, 250)}
          className="btn-secondary"
          style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
        >
          <Plus size={14} color="#06b6d4" /> 250ml
        </button>
        <button
          onClick={() => logWater(selectedDate, 500)}
          className="btn-secondary"
          style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
        >
          <Plus size={14} color="#06b6d4" /> 500ml
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <input
          type="number"
          placeholder="Custom ml..."
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          style={{
            flex: 1,
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            color: '#fff',
            fontSize: '13px'
          }}
        />
        <button
          onClick={handleCustomAdd}
          className="btn-secondary"
          style={{ padding: '6px 16px', fontSize: '13px' }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
