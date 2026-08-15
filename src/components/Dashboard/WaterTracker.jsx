import React from 'react';
import { Droplet, Plus, RotateCcw } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';

export function WaterTracker({ summary }) {
  const { logWater, resetWater, selectedDate, targets } = useNutrition();
  const { water, waterPercent } = summary;
  const targetWater = targets.waterGoalMl || 2500;

  return (
    <div className="glass-card">
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
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>Hydration</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              {water} ml / {targetWater} ml ({waterPercent}%)
            </div>
          </div>
        </div>

        <button
          onClick={() => resetWater(selectedDate)}
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
          onClick={() => logWater(selectedDate, 250)}
          className="btn-secondary"
          style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
        >
          <Plus size={14} color="#06b6d4" /> +250 ml (Glass)
        </button>
        <button
          onClick={() => logWater(selectedDate, 500)}
          className="btn-secondary"
          style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
        >
          <Plus size={14} color="#06b6d4" /> +500 ml (Bottle)
        </button>
      </div>
    </div>
  );
}
