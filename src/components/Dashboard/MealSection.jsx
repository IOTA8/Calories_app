import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const MEAL_CONFIGS = [
  { type: 'breakfast', label: 'Breakfast', emoji: '🍳' },
  { type: 'lunch', label: 'Lunch', emoji: '🥗' },
  { type: 'dinner', label: 'Dinner', emoji: '🥩' },
  { type: 'snack', label: 'Snacks', emoji: '🥑' }
];

export function MealSection({ meals, onAddMeal, onDeleteMeal, onEditMeal }) {
  const [expandedMealIds, setExpandedMealIds] = useState({});

  const toggleMealExpand = (mealId) => {
    setExpandedMealIds(prev => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        fontSize: '15px',
        fontWeight: 800,
        color: '#ffffff',
        letterSpacing: '-0.2px',
        marginTop: '4px'
      }}>
        Today's Meals
      </div>

      {MEAL_CONFIGS.map(config => {
        const mealItems = meals.filter(m => m.mealType === config.type);
        const mealCalories = mealItems.reduce((sum, m) => sum + (m.calories || 0), 0);

        return (
          <div key={config.type} className="glass-card" style={{ padding: '16px' }}>
            {/* Meal Category Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: mealItems.length > 0 ? '12px' : '0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>{config.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: '15px', color: '#ffffff' }}>
                  {config.label}
                </span>
                {mealCalories > 0 && (
                  <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
                    • {mealCalories} kcal
                  </span>
                )}
              </div>

              <button
                onClick={() => onAddMeal(config.type)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 6px'
                }}
              >
                <Plus size={14} /> Add Food
              </button>
            </div>

            {/* List of logged foods */}
            {mealItems.length === 0 ? (
              <div
                onClick={() => onAddMeal(config.type)}
                style={{
                  padding: '12px',
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                No food logged yet. Tap + to add {config.label.toLowerCase()}.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mealItems.map(item => {
                  const isExpanded = !!expandedMealIds[item.id];

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}
                      >
                        {/* Left/Middle: Clickable to Edit */}
                        <div
                          onClick={() => onEditMeal && onEditMeal(item.id, item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            flex: 1,
                            minWidth: 0
                          }}
                        >
                          {/* Food Image / Icon */}
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '1px solid var(--border-subtle)',
                                flexShrink: 0
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              flexShrink: 0
                            }}>
                              {config.emoji}
                            </div>
                          )}

                          {/* Title & Macros */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontWeight: 700,
                              fontSize: '13.5px',
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {item.name}
                            </div>
                            <div style={{
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              marginTop: '2px'
                            }}>
                              P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                            </div>
                          </div>
                        </div>

                        {/* Right: Calories & Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <span className="font-mono" style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff' }}>
                            {item.calories} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>kcal</span>
                          </span>

                          {item.items && item.items.length > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleMealExpand(item.id)}
                              className="btn-icon"
                              style={{ width: '28px', height: '28px', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}
                              title="Toggle Breakdown"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDeleteMeal(item.id)}
                            className="btn-icon"
                            style={{
                              width: '28px',
                              height: '28px',
                              background: 'rgba(244, 63, 94, 0.1)',
                              border: '1px solid rgba(244, 63, 94, 0.25)',
                              color: '#fb7185'
                            }}
                            title="Delete from diary"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Expandable itemized ingredients list */}
                      {isExpanded && (
                        <div style={{
                          marginTop: '6px',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          {item.items && item.items.map((subItem, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                              <span>• {subItem.name} <span style={{ color: 'var(--text-muted)' }}>({subItem.portionGrams}g)</span></span>
                              <span className="font-mono" style={{ color: '#a5b4fc', fontWeight: 600 }}>{subItem.calories} kcal</span>
                            </div>
                          ))}

                          {item.coachInsight && (
                            <div style={{
                              background: 'rgba(99, 102, 241, 0.08)',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              borderRadius: '8px',
                              padding: '6px 8px',
                              fontSize: '11px',
                              color: '#a5b4fc',
                              marginTop: '2px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '6px'
                            }}>
                              <Sparkles size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{item.coachInsight}</span>
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMeal(item.id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#fb7185',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={13} /> Delete
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
