import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Plus, Minus, Flame, Dumbbell, Wheat, Droplet, Award, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ScanResultModal({ isOpen, result, onClose, onConfirmLog, defaultMealType = 'lunch' }) {
  if (!isOpen || !result) return null;

  const [mealName, setMealName] = useState(result.mealName || 'Scanned Meal');
  const [mealType, setMealType] = useState(defaultMealType);
  const [items, setItems] = useState(result.items ? result.items.map(i => ({ ...i })) : []);

  // Update when result changes
  useEffect(() => {
    if (result) {
      setMealName(result.mealName || 'Scanned Meal');
      setItems(result.items ? result.items.map(i => ({ ...i })) : []);
    }
  }, [result]);

  // Adjust portion size of an ingredient
  const handlePortionChange = (index, deltaGrams) => {
    setItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      const currentGrams = item.portionGrams || 100;
      const newGrams = Math.max(10, currentGrams + deltaGrams);
      const ratio = newGrams / currentGrams;

      item.portionGrams = newGrams;
      item.calories = Math.round(item.calories * ratio);
      item.protein = parseFloat((item.protein * ratio).toFixed(1));
      item.carbs = parseFloat((item.carbs * ratio).toFixed(1));
      item.fat = parseFloat((item.fat * ratio).toFixed(1));
      if (item.fiber !== undefined) {
        item.fiber = parseFloat((item.fiber * ratio).toFixed(1));
      }

      updated[index] = item;
      return updated;
    });
  };

  // Recalculate totals dynamically
  const calculatedTotals = items.reduce((acc, item) => {
    acc.calories += item.calories || 0;
    acc.protein += item.protein || 0;
    acc.carbs += item.carbs || 0;
    acc.fat += item.fat || 0;
    acc.fiber += item.fiber || 0;
    return acc;
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });

  // Round numbers
  const totalCalories = Math.round(calculatedTotals.calories);
  const totalProtein = Math.round(calculatedTotals.protein);
  const totalCarbs = Math.round(calculatedTotals.carbs);
  const totalFat = Math.round(calculatedTotals.fat);
  const totalFiber = Math.round(calculatedTotals.fiber);

  const handleConfirm = () => {
    // Trigger celebration confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    onConfirmLog({
      name: mealName,
      mealType,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      sugar: result.totalNutrition?.sugar || 3,
      sodiumMg: result.totalNutrition?.sodiumMg || 400,
      imageUrl: result.imageUrl || null,
      tags: result.tags || ['AI Verified'],
      coachInsight: result.coachInsight || '',
      items: items
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '92vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#10b981" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>AI Nutrition Breakdown</span>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Dish Card */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '14px',
            alignItems: 'center'
          }}>
            {result.imageUrl && (
              <img
                src={result.imageUrl}
                alt={mealName}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '1px solid var(--border-subtle)',
                  flexShrink: 0
                }}
              />
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                type="text"
                className="app-input"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                style={{ fontWeight: 700, fontSize: '15px', padding: '6px 10px' }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                {result.tags?.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="badge badge-emerald" style={{ fontSize: '10.5px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Macro Summary Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 6px',
              textAlign: 'center'
            }}>
              <Flame size={15} color="#10b981" style={{ margin: '0 auto 2px auto' }} />
              <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#10b981' }}>
                {totalCalories}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Calories</div>
            </div>

            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 6px',
              textAlign: 'center'
            }}>
              <Dumbbell size={15} color="#38bdf8" style={{ margin: '0 auto 2px auto' }} />
              <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#38bdf8' }}>
                {totalProtein}g
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Protein</div>
            </div>

            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 6px',
              textAlign: 'center'
            }}>
              <Wheat size={15} color="#fbbf24" style={{ margin: '0 auto 2px auto' }} />
              <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#fbbf24' }}>
                {totalCarbs}g
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Carbs</div>
            </div>

            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 6px',
              textAlign: 'center'
            }}>
              <Droplet size={15} color="#fb7185" style={{ margin: '0 auto 2px auto' }} />
              <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color: '#fb7185' }}>
                {totalFat}g
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Fats</div>
            </div>
          </div>

          {/* AI Coach Feedback Note */}
          {result.coachInsight && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <Sparkles size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#34d399', marginBottom: '2px' }}>
                  AI Coach Insight
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {result.coachInsight}
                </p>
              </div>
            </div>
          )}

          {/* Itemized Detected Ingredients */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                Detected Ingredients & Portion Scaling
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tap ± to adjust</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.calories} kcal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                    </div>
                  </div>

                  {/* Portion stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handlePortionChange(idx, -10)}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, minWidth: '42px', textAlign: 'center' }}>
                      {item.portionGrams}g
                    </span>
                    <button
                      onClick={() => handlePortionChange(idx, 10)}
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Section Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Log To Meal Time
            </label>
            <div className="segmented-control">
              <button
                className={`segmented-btn ${mealType === 'breakfast' ? 'active' : ''}`}
                onClick={() => setMealType('breakfast')}
              >
                🌅 Breakfast
              </button>
              <button
                className={`segmented-btn ${mealType === 'lunch' ? 'active' : ''}`}
                onClick={() => setMealType('lunch')}
              >
                ☀️ Lunch
              </button>
              <button
                className={`segmented-btn ${mealType === 'dinner' ? 'active' : ''}`}
                onClick={() => setMealType('dinner')}
              >
                🌙 Dinner
              </button>
              <button
                className={`segmented-btn ${mealType === 'snack' ? 'active' : ''}`}
                onClick={() => setMealType('snack')}
              >
                🥑 Snack
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              onClick={handleConfirm}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <Check size={18} /> Confirm & Log Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
