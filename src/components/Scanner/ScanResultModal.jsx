import React, { useState, useEffect } from 'react';
import { Sparkles, Check, X, Plus, Minus, Flame, Dumbbell, Wheat, Droplet, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ScanResultModal({ isOpen, result, onClose, onConfirmLog, onSaveFood, defaultMealType = 'lunch' }) {
  if (!isOpen || !result) return null;

  const [mealName, setMealName] = useState(result.mealName || 'Scanned Meal');
  const [mealType, setMealType] = useState(defaultMealType);
  const [items, setItems] = useState(result.items ? result.items.map(i => ({ ...i })) : []);
  
  const [manualOverrides, setManualOverrides] = useState({ calories: null, protein: null, carbs: null, fat: null });
  const [editingMacro, setEditingMacro] = useState(null); // 'calories', 'protein', 'carbs', 'fat'
  const [editMacroValue, setEditMacroValue] = useState('');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (result) {
      setMealName(result.mealName || 'Scanned Meal');
      setItems(result.items ? result.items.map(i => ({ ...i })) : []);
      setManualOverrides({ calories: null, protein: null, carbs: null, fat: null });
      setEditingMacro(null);
    }
  }, [result]);

  const handlePortionChange = (index, deltaGrams) => {
    setItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      const currentGrams = parseInt(item.portionGrams) || 100;
      const newGrams = Math.max(1, currentGrams + deltaGrams);
      const ratio = newGrams / currentGrams;

      item.portionGrams = newGrams;
      item.calories = Math.round((item.calories || 0) * ratio);
      item.protein = parseFloat(((item.protein || 0) * ratio).toFixed(1));
      item.carbs = parseFloat(((item.carbs || 0) * ratio).toFixed(1));
      item.fat = parseFloat(((item.fat || 0) * ratio).toFixed(1));
      if (item.fiber !== undefined) {
        item.fiber = parseFloat((item.fiber * ratio).toFixed(1));
      }

      updated[index] = item;
      return updated;
    });
  };

  const handleDirectPortionChange = (index, val) => {
    setItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      
      if (val === '') {
        item.portionGrams = '';
        updated[index] = item;
        return updated;
      }
      
      const newGrams = parseInt(val, 10);
      if (isNaN(newGrams) || newGrams < 0) return updated;

      const currentGrams = parseInt(item.portionGrams, 10) || 100;
      const ratio = newGrams / (currentGrams === 0 ? 1 : currentGrams);

      item.portionGrams = newGrams;
      item.calories = Math.round((item.calories || 0) * ratio);
      item.protein = parseFloat(((item.protein || 0) * ratio).toFixed(1));
      item.carbs = parseFloat(((item.carbs || 0) * ratio).toFixed(1));
      item.fat = parseFloat(((item.fat || 0) * ratio).toFixed(1));
      
      updated[index] = item;
      return updated;
    });
  };

  const updateItemField = (index, field, val) => {
    setItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };
      item[field] = field === 'name' ? val : (val === '' ? '' : parseFloat(val) || 0);
      updated[index] = item;
      return updated;
    });
  };

  const handleDeleteItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems(prev => [...prev, { name: 'New Item', portionGrams: 100, calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }]);
  };

  const calculatedTotals = items.reduce((acc, item) => {
    acc.calories += (parseFloat(item.calories) || 0);
    acc.protein += (parseFloat(item.protein) || 0);
    acc.carbs += (parseFloat(item.carbs) || 0);
    acc.fat += (parseFloat(item.fat) || 0);
    acc.fiber += (parseFloat(item.fiber) || 0);
    return acc;
  }, {
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0
  });

  const totalCalories = Math.round(calculatedTotals.calories);
  const totalProtein = Math.round(calculatedTotals.protein);
  const totalCarbs = Math.round(calculatedTotals.carbs);
  const totalFat = Math.round(calculatedTotals.fat);
  const totalFiber = Math.round(calculatedTotals.fiber);

  const displayCalories = manualOverrides.calories ?? totalCalories;
  const displayProtein = manualOverrides.protein ?? totalProtein;
  const displayCarbs = manualOverrides.carbs ?? totalCarbs;
  const displayFat = manualOverrides.fat ?? totalFat;

  const handleConfirm = () => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    onConfirmLog({
      name: mealName,
      mealType,
      calories: displayCalories,
      protein: displayProtein,
      carbs: displayCarbs,
      fat: displayFat,
      fiber: totalFiber,
      sugar: result.totalNutrition?.sugar || 3,
      sodiumMg: result.totalNutrition?.sodiumMg || 400,
      imageUrl: result.imageUrl || null,
      tags: result.tags || ['AI Verified'],
      coachInsight: result.coachInsight || '',
      items: items
    });
  };

  const handleSaveFood = () => {
    if (onSaveFood) {
      onSaveFood({
        name: mealName,
        mealType,
        calories: displayCalories,
        protein: displayProtein,
        carbs: displayCarbs,
        fat: displayFat,
        fiber: totalFiber,
        items: items
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1000);
    }
  };

  const handleMacroCardClick = (macro, currentValue) => {
    setEditingMacro(macro);
    setEditMacroValue(currentValue);
  };

  const handleMacroBlur = (macro) => {
    setManualOverrides(prev => ({
      ...prev,
      [macro]: editMacroValue === '' ? null : parseFloat(editMacroValue)
    }));
    setEditingMacro(null);
  };

  const renderMacroCard = (macro, label, Icon, color, currentValue, displayValue, unit = '') => (
    <div 
      onClick={() => handleMacroCardClick(macro, displayValue)}
      style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 6px',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <Icon size={15} color={color} style={{ margin: '0 auto 2px auto' }} />
      {editingMacro === macro ? (
        <input
          type="number"
          autoFocus
          value={editMacroValue}
          onChange={e => setEditMacroValue(e.target.value)}
          onBlur={() => handleMacroBlur(macro)}
          onKeyDown={e => e.key === 'Enter' && handleMacroBlur(macro)}
          style={{ 
            width: '100%', 
            background: 'transparent', 
            border: 'none', 
            color, 
            fontSize: '17px', 
            fontWeight: 800, 
            textAlign: 'center', 
            outline: 'none',
            padding: 0
          }}
          className="font-mono"
        />
      ) : (
        <div className="font-mono" style={{ fontSize: '17px', fontWeight: 800, color }}>
          {displayValue}{unit}
        </div>
      )}
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '92vh' }}>
        <div className="sheet-handle-bar" />

        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#10b981" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>AI Nutrition Breakdown</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handleSaveFood} className="btn-icon" style={{ width: '32px', height: '32px' }} title="Save to My Foods">
              <Bookmark size={16} fill={saveSuccess ? '#fbbf24' : 'none'} color={saveSuccess ? '#fbbf24' : 'currentColor'} />
            </button>
            <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

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
            {renderMacroCard('calories', 'Calories', Flame, '#10b981', totalCalories, displayCalories)}
            {renderMacroCard('protein', 'Protein', Dumbbell, '#38bdf8', totalProtein, displayProtein, 'g')}
            {renderMacroCard('carbs', 'Carbs', Wheat, '#fbbf24', totalCarbs, displayCarbs, 'g')}
            {renderMacroCard('fat', 'Fats', Droplet, '#fb7185', totalFat, displayFat, 'g')}
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
                Detected Ingredients
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Edit or tap ±</span>
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <input 
                      value={item.name} 
                      onChange={(e) => updateItemField(idx, 'name', e.target.value)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#fff', 
                        fontWeight: 600, 
                        fontSize: '13px', 
                        width: '100%', 
                        outline: 'none',
                        padding: 0
                      }} 
                    />
                    <div style={{ 
                      display: 'flex', 
                      gap: '4px', 
                      fontSize: '11px', 
                      color: 'var(--text-muted)', 
                      marginTop: '2px', 
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}>
                      <input 
                        type="number" 
                        value={item.calories} 
                        onChange={e => updateItemField(idx, 'calories', e.target.value)} 
                        style={{ width: '32px', background: 'transparent', border: 'none', color: 'inherit', outline: 'none', padding: 0 }} 
                      /> kcal • 
                      P: <input 
                        type="number" 
                        value={item.protein} 
                        onChange={e => updateItemField(idx, 'protein', e.target.value)} 
                        style={{ width: '25px', background: 'transparent', border: 'none', color: 'inherit', outline: 'none', padding: 0 }} 
                      />g • 
                      C: <input 
                        type="number" 
                        value={item.carbs} 
                        onChange={e => updateItemField(idx, 'carbs', e.target.value)} 
                        style={{ width: '25px', background: 'transparent', border: 'none', color: 'inherit', outline: 'none', padding: 0 }} 
                      />g • 
                      F: <input 
                        type="number" 
                        value={item.fat} 
                        onChange={e => updateItemField(idx, 'fat', e.target.value)} 
                        style={{ width: '25px', background: 'transparent', border: 'none', color: 'inherit', outline: 'none', padding: 0 }} 
                      />g
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => handlePortionChange(idx, -10)}
                      className="btn-icon"
                      style={{ width: '24px', height: '24px' }}
                    >
                      <Minus size={13} />
                    </button>
                    
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={item.portionGrams}
                        onChange={e => handleDirectPortionChange(idx, e.target.value)}
                        style={{ 
                          width: '40px', 
                          background: 'var(--bg-body)', 
                          border: '1px solid var(--border-subtle)', 
                          color: '#fff', 
                          fontWeight: 700, 
                          fontSize: '12px', 
                          textAlign: 'center', 
                          outline: 'none',
                          borderRadius: '4px',
                          padding: '2px 10px 2px 2px'
                        }}
                      />
                      <span style={{ position: 'absolute', right: '4px', fontSize: '10px', color: 'var(--text-muted)', pointerEvents: 'none' }}>g</span>
                    </div>

                    <button
                      onClick={() => handlePortionChange(idx, 10)}
                      className="btn-icon"
                      style={{ width: '24px', height: '24px' }}
                    >
                      <Plus size={13} />
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteItem(idx)} 
                      className="btn-icon" 
                      style={{ width: '24px', height: '24px', marginLeft: '2px' }}
                    >
                      <X size={14} color="#ef4444" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleAddItem} 
                style={{ 
                  background: 'transparent', 
                  border: '1px dashed var(--border-subtle)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '10px', 
                  color: '#10b981', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '6px', 
                  fontSize: '13px', 
                  fontWeight: 600,
                  marginTop: '4px'
                }}
              >
                <Plus size={14} /> Add Item
              </button>
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
