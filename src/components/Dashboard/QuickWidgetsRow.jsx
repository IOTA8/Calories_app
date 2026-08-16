import React, { useState } from 'react';
import { Flame, Droplets, Plus } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { WorkoutModal } from './WorkoutModal';
import { WaterModal } from './WaterModal';

export function QuickWidgetsRow({ summary }) {
  const { selectedDate, targets, logWater } = useNutrition();
  const [isWorkoutOpen, setIsWorkoutOpen] = useState(false);
  const [isWaterOpen, setIsWaterOpen] = useState(false);

  const burnedCalories = summary.burnedCalories || 0;
  const waterLiters = ((summary.water || 0) / 1000).toFixed(1);
  const waterGoalLiters = ((targets.waterGoalMl || 2500) / 1000).toFixed(1);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Workout / Active Burn Widget */}
        <div
          onClick={() => setIsWorkoutOpen(true)}
          className="glass-card glass-card-interactive"
          style={{
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f97316'
            }}>
              <Flame size={16} />
            </div>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#f97316', textTransform: 'uppercase' }}>
              {burnedCalories > 0 ? `${burnedCalories} kcal` : '+ Log'}
            </span>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Workout
            </div>
            <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {burnedCalories} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kcal</span>
            </div>
          </div>
        </div>

        {/* Water Hydration Widget */}
        <div
          onClick={() => setIsWaterOpen(true)}
          className="glass-card glass-card-interactive"
          style={{
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4'
            }}>
              <Droplets size={16} />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                logWater(selectedDate, 250);
              }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Quick Add 250ml Water"
            >
              <Plus size={14} />
            </button>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Water
            </div>
            <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#06b6d4', marginTop: '2px' }}>
              {waterLiters} L <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ {waterGoalLiters} L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Log & Edit Modal */}
      <WorkoutModal
        isOpen={isWorkoutOpen}
        onClose={() => setIsWorkoutOpen(false)}
      />

      {/* Water Log & Edit Modal */}
      <WaterModal
        isOpen={isWaterOpen}
        onClose={() => setIsWaterOpen(false)}
      />
    </>
  );
}
