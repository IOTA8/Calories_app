import React from 'react';
import { Coffee, Utensils, Moon, Apple } from 'lucide-react';

const MEAL_TILES = [
  { type: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  { type: 'lunch', label: 'Lunch', icon: Utensils, color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { type: 'dinner', label: 'Dinner', icon: Moon, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
  { type: 'snack', label: 'Snacks', icon: Apple, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' }
];

export function QuickMealsGrid({ onSelectMealType }) {
  return (
    <div>
      <div style={{
        fontSize: '15px',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '10px',
        letterSpacing: '-0.2px'
      }}>
        Meals
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px'
      }}>
        {MEAL_TILES.map(tile => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.type}
              onClick={() => onSelectMealType(tile.type)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              className="glass-card-interactive"
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: tile.bg,
                border: `1px solid ${tile.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tile.color
              }}>
                <Icon size={18} />
              </div>
              <span style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#ffffff',
                textAlign: 'center'
              }}>
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
