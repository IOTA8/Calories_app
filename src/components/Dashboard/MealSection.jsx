import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Clock, Sparkles } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

const MEAL_CONFIGS = [
  { type: 'breakfast', label: 'Breakfast', icon: '🌅', color: '#fbbf24', recommendedKcalPct: 0.25 },
  { type: 'lunch', label: 'Lunch', icon: '☀️', color: '#10b981', recommendedKcalPct: 0.35 },
  { type: 'dinner', label: 'Dinner', icon: '🌙', color: '#38bdf8', recommendedKcalPct: 0.30 },
  { type: 'snack', label: 'Snacks & Extras', icon: '🥑', color: '#c084fc', recommendedKcalPct: 0.10 }
];

export function MealSection({ meals, onAddMeal, onDeleteMeal, onViewMealDetail, onEditMeal }) {
  const [expandedMealIds, setExpandedMealIds] = useState({});

  const toggleMealExpand = (mealId) => {
    setExpandedMealIds(prev => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {MEAL_CONFIGS.map(config => {
        const mealItems = meals.filter(m => m.mealType === config.type);
        const mealCalories = mealItems.reduce((sum, m) => sum + (m.calories || 0), 0);
        const mealProtein = mealItems.reduce((sum, m) => sum + (m.protein || 0), 0);
        const mealCarbs = mealItems.reduce((sum, m) => sum + (m.carbs || 0), 0);
        const mealFat = mealItems.reduce((sum, m) => sum + (m.fat || 0), 0);

        return (
          <div key={config.type} className="glass-card" style={{ padding: '16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mealItems.length > 0 ? '12px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{config.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>
                    {config.label}
                  </div>
                  {mealItems.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <span>{mealCalories} kcal</span>
                      <span>•</span>
                      <span style={{ color: '#38bdf8' }}>{mealProtein}g P</span>
                      <span>•</span>
                      <span style={{ color: '#fbbf24' }}>{mealCarbs}g C</span>
                      <span>•</span>
                      <span style={{ color: '#fb7185' }}>{mealFat}g F</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Add Button */}
              <button
                onClick={() => onAddMeal(config.type)}
                className="btn-icon"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'var(--border-subtle)'
                }}
                title={`Add ${config.label}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* List of dishes in this section */}
            {mealItems.length === 0 ? (
              <div
                onClick={() => onAddMeal(config.type)}
                className="empty-state-card"
                style={{
                  padding: '16px',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginTop: '10px',
                  transition: 'background 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} />
                Tap to add your first {config.label.toLowerCase()}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mealItems.map(item => {
                  const isExpanded = !!expandedMealIds[item.id];

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div 
                        className="meal-row-interactive"
                        onClick={() => onEditMeal && onEditMeal(item.id, item)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: onEditMeal ? 'pointer' : 'default' }}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-subtle)',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: 'rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              flexShrink: 0
                            }}
                          >
                            🍽️
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontWeight: 700,
                            fontSize: '14px',
                            color: '#ffffff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.name}
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                            <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>
                              {item.calories} kcal
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              P:{item.protein}g C:{item.carbs}g F:{item.fat}g
                            </span>
                          </div>
                        </div>

                        {/* Expand / Delete actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                          {item.items && item.items.length > 0 && (
                            <button
                              onClick={() => toggleMealExpand(item.id)}
                              className="btn-icon"
                              style={{ width: '28px', height: '28px' }}
                              title="Toggle Breakdown"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable itemized ingredients list */}
                      {isExpanded && item.items && (
                        <div style={{
                          marginTop: '6px',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            Detected Ingredients & Portions
                          </div>
                          {item.items.map((subItem, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-primary)' }}>
                              <span>• {subItem.name} <span style={{ color: 'var(--text-muted)' }}>({subItem.portionGrams}g)</span></span>
                              <span className="font-mono" style={{ color: '#10b981', fontWeight: 600 }}>{subItem.calories} kcal</span>
                            </div>
                          ))}

                          {item.coachInsight && (
                            <div style={{
                              background: 'rgba(16, 185, 129, 0.08)',
                              border: '1px solid rgba(16, 185, 129, 0.2)',
                              borderRadius: '8px',
                              padding: '8px 10px',
                              fontSize: '11.5px',
                              color: '#34d399',
                              marginTop: '4px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '6px'
                            }}>
                              <Sparkles size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{item.coachInsight}</span>
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                            <button
                              onClick={() => onDeleteMeal(item.id)}
                              className="btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '12px', color: '#fb7185', borderColor: 'rgba(251, 113, 133, 0.3)' }}
                            >
                              <Trash2 size={14} style={{ marginRight: '6px' }} />
                              Delete Meal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
