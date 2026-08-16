import React, { useState, useEffect } from 'react';
import { X, Save, Bookmark, Plus, Trash2 } from 'lucide-react';

const MACRO_COLORS = {
  calories: '#10b981',
  protein: '#38bdf8',
  carbs: '#fbbf24',
  fat: '#f43f5e'
};

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { id: 'lunch', label: 'Lunch', icon: '☀️' },
  { id: 'dinner', label: 'Dinner', icon: '🌙' },
  { id: 'snack', label: 'Snacks', icon: '🥑' }
];

export function EditMealModal({ isOpen, onClose, meal, onSave, onSaveFood }) {
  const [editedMeal, setEditedMeal] = useState(null);
  const [editingMacro, setEditingMacro] = useState(null); // 'calories', 'protein', 'carbs', 'fat'

  useEffect(() => {
    if (meal && isOpen) {
      // Deep copy to allow editing items array
      setEditedMeal(JSON.parse(JSON.stringify(meal)));
      setEditingMacro(null);
    }
  }, [meal, isOpen]);

  if (!isOpen || !editedMeal) return null;

  const handleSave = () => {
    onSave(editedMeal);
  };

  const handleSaveFood = () => {
    if (onSaveFood) {
      onSaveFood({
        name: editedMeal.name,
        calories: editedMeal.calories,
        protein: editedMeal.protein,
        carbs: editedMeal.carbs,
        fat: editedMeal.fat,
        servingSize: '1 serving',
        mealType: editedMeal.mealType
      });
    }
  };

  const updateMacro = (macro, value) => {
    const numValue = parseInt(value, 10);
    setEditedMeal({ ...editedMeal, [macro]: isNaN(numValue) ? 0 : numValue });
  };

  const updateItemPortion = (index, value) => {
    const newItems = [...editedMeal.items];
    const newPortion = parseInt(value, 10) || 0;
    
    // Adjust calories based on portion change if original portion exists
    if (newItems[index].portionGrams > 0) {
      const ratio = newPortion / newItems[index].portionGrams;
      newItems[index].calories = Math.round(newItems[index].calories * ratio);
    }
    
    newItems[index].portionGrams = newPortion;
    setEditedMeal({ ...editedMeal, items: newItems });
  };

  const deleteItem = (index) => {
    const newItems = editedMeal.items.filter((_, i) => i !== index);
    setEditedMeal({ ...editedMeal, items: newItems });
  };

  const addItem = () => {
    const newItems = [...(editedMeal.items || []), { name: 'New Ingredient', portionGrams: 100, calories: 100 }];
    setEditedMeal({ ...editedMeal, items: newItems });
  };

  const renderMacroCard = (macro, label, color) => {
    const isEditing = editingMacro === macro;
    const value = editedMeal[macro] || 0;

    return (
      <div 
        className="glass-card" 
        style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'text', flex: 1, minWidth: '40%' }}
        onClick={() => setEditingMacro(macro)}
      >
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </div>
        {isEditing ? (
          <input
            type="number"
            className="app-input"
            style={{ color, fontWeight: 800, fontSize: '18px', padding: '4px 8px', height: '32px' }}
            value={value}
            onChange={(e) => updateMacro(macro, e.target.value)}
            onBlur={() => setEditingMacro(null)}
            autoFocus
          />
        ) : (
          <div className="font-mono" style={{ color, fontWeight: 800, fontSize: '18px' }}>
            {value}{macro !== 'calories' ? 'g' : ''}
          </div>
        )}
      </div>
    );
  };

  const hasImage = editedMeal.imageUrl && (editedMeal.imageUrl.startsWith('data:') || editedMeal.imageUrl.startsWith('http'));

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet" style={{ height: '90vh' }}>
        <div className="sheet-handle-bar">
          <div className="sheet-handle"></div>
        </div>

        <div className="sheet-header" style={{ paddingBottom: '12px' }}>
          <input
            type="text"
            className="app-input"
            style={{ fontSize: '18px', fontWeight: 800, flex: 1, border: 'none', background: 'transparent', padding: '0' }}
            value={editedMeal.name || ''}
            onChange={(e) => setEditedMeal({ ...editedMeal, name: e.target.value })}
          />
          <button className="btn-icon" onClick={onClose} style={{ marginLeft: '12px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
          
          {hasImage && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={editedMeal.imageUrl} 
                alt="Meal" 
                style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }} 
              />
            </div>
          )}

          {/* Macros Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Nutritional Info (Tap to edit)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {renderMacroCard('calories', 'Calories', MACRO_COLORS.calories)}
              {renderMacroCard('protein', 'Protein', MACRO_COLORS.protein)}
              {renderMacroCard('carbs', 'Carbs', MACRO_COLORS.carbs)}
              {renderMacroCard('fat', 'Fat', MACRO_COLORS.fat)}
            </div>
          </div>

          {/* Meal Type Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Meal Type</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {MEAL_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setEditedMeal({ ...editedMeal, mealType: type.id })}
                  className="glass-card"
                  style={{
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: editedMeal.mealType === type.id ? '2px solid var(--primary-color)' : '1px solid var(--border-subtle)',
                    background: editedMeal.mealType === type.id ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface)'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{type.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients List */}
          {editedMeal.items && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Ingredients</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {editedMeal.items.map((item, index) => (
                  <div key={index} className="glass-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input
                        type="text"
                        className="app-input"
                        style={{ padding: '4px', fontSize: '14px', fontWeight: 600, border: 'none', background: 'transparent' }}
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...editedMeal.items];
                          newItems[index].name = e.target.value;
                          setEditedMeal({ ...editedMeal, items: newItems });
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        className="app-input"
                        style={{ width: '60px', padding: '4px 8px', textAlign: 'center' }}
                        value={item.portionGrams || 0}
                        onChange={(e) => updateItemPortion(index, e.target.value)}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>g</span>
                    </div>
                    <div className="font-mono" style={{ width: '60px', textAlign: 'right', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                      {item.calories} kcal
                    </div>
                    <button className="btn-icon" onClick={() => deleteItem(index)} style={{ color: '#fb7185', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button onClick={addItem} className="btn-secondary" style={{ marginTop: '4px', padding: '8px' }}>
                <Plus size={16} style={{ marginRight: '6px' }} />
                Add Item
              </button>
            </div>
          )}
          
          <div style={{ height: '40px' }}></div> {/* Spacer */}
        </div>

        {/* Fixed Bottom Actions */}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          padding: '16px', 
          background: 'var(--bg-surface-elevated)', 
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 10
        }}>
          <button onClick={handleSave} className="btn-primary">
            <Save size={18} style={{ marginRight: '8px' }} />
            Save Changes
          </button>
          {onSaveFood && (
            <button onClick={handleSaveFood} className="btn-secondary">
              <Bookmark size={18} style={{ marginRight: '8px' }} />
              Save to My Foods
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
