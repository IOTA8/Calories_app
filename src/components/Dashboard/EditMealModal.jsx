import React, { useState, useEffect } from 'react';
import { X, Save, Bookmark, Plus, Trash2 } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';

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

export function EditMealModal({ isOpen, onClose, meal, onSave, onDelete }) {
  const { isFoodSaved, toggleSaveFood } = useNutrition();
  const [editedMeal, setEditedMeal] = useState(null);
  const [editingMacro, setEditingMacro] = useState(null);

  useEffect(() => {
    if (meal && isOpen) {
      setEditedMeal(JSON.parse(JSON.stringify(meal)));
      setEditingMacro(null);
    }
  }, [meal, isOpen]);

  if (!isOpen || !editedMeal) return null;

  const isSaved = isFoodSaved(editedMeal.name);

  const handleSave = () => {
    onSave(editedMeal);
  };

  const handleToggleSave = () => {
    toggleSaveFood({
      name: editedMeal.name,
      calories: editedMeal.calories || 0,
      protein: editedMeal.protein || 0,
      carbs: editedMeal.carbs || 0,
      fat: editedMeal.fat || 0,
      servingSize: '1 serving',
      mealType: editedMeal.mealType,
      items: editedMeal.items || []
    });
  };

  const handleDelete = () => {
    if (onDelete && editedMeal.id) {
      onDelete(editedMeal.id);
      onClose();
    }
  };

  const updateMacro = (macro, value) => {
    const numValue = parseInt(value, 10);
    setEditedMeal({ ...editedMeal, [macro]: isNaN(numValue) ? 0 : numValue });
  };

  const updateItemPortion = (index, value) => {
    const newItems = [...(editedMeal.items || [])];
    const newPortion = parseInt(value, 10) || 0;
    
    if (newItems[index].portionGrams > 0) {
      const ratio = newPortion / newItems[index].portionGrams;
      newItems[index].calories = Math.round(newItems[index].calories * ratio);
    }
    
    newItems[index].portionGrams = newPortion;
    setEditedMeal({ ...editedMeal, items: newItems });
  };

  const deleteItem = (index) => {
    const newItems = (editedMeal.items || []).filter((_, i) => i !== index);
    setEditedMeal({ ...editedMeal, items: newItems });
  };

  const addItem = () => {
    const newItems = [...(editedMeal.items || []), { name: 'New Item', portionGrams: 100, calories: 100 }];
    setEditedMeal({ ...editedMeal, items: newItems });
  };

  const renderMacroCard = (macro, label, color) => {
    const isEditing = editingMacro === macro;
    const value = editedMeal[macro] || 0;

    return (
      <div 
        className="glass-card" 
        style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'text', flex: 1, minWidth: '42%' }}
        onClick={() => setEditingMacro(macro)}
      >
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
          {label}
        </div>
        {isEditing ? (
          <input
            type="number"
            className="app-input"
            style={{ color, fontWeight: 800, fontSize: '17px', padding: '2px 6px', height: '28px' }}
            value={value}
            onChange={(e) => updateMacro(macro, e.target.value)}
            onBlur={() => setEditingMacro(null)}
            autoFocus
          />
        ) : (
          <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color }}>
            {value} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{macro === 'calories' ? 'kcal' : 'g'}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '90vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Edit Meal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleToggleSave}
              className="btn-icon"
              style={{
                width: '32px',
                height: '32px',
                background: isSaved ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                borderColor: isSaved ? 'rgba(251, 191, 36, 0.4)' : 'var(--border-subtle)'
              }}
              title={isSaved ? "Saved in My Foods (Click to remove)" : "Save to My Foods"}
            >
              <Bookmark size={16} fill={isSaved ? '#fbbf24' : 'none'} color={isSaved ? '#fbbf24' : 'var(--text-secondary)'} />
            </button>
            <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '110px' }}>
          {/* Meal Photo (if exists) */}
          {editedMeal.imageUrl && (
            <div style={{ width: '100%', height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img src={editedMeal.imageUrl} alt={editedMeal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Dish Name */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px', display: 'block' }}>
              Meal / Dish Name
            </label>
            <input
              type="text"
              className="app-input"
              value={editedMeal.name}
              onChange={(e) => setEditedMeal({ ...editedMeal, name: e.target.value })}
              placeholder="Dish Name"
            />
          </div>

          {/* Meal Slot Selector */}
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
              Meal Time Slot
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {MEAL_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setEditedMeal({ ...editedMeal, mealType: type.id })}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-sm)',
                    border: editedMeal.mealType === type.id ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                    background: editedMeal.mealType === type.id ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-surface)',
                    color: editedMeal.mealType === type.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Macros 2x2 Grid */}
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
              Nutritional Breakdown (Tap number to edit)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {renderMacroCard('calories', 'Calories', MACRO_COLORS.calories)}
              {renderMacroCard('protein', 'Protein', MACRO_COLORS.protein)}
              {renderMacroCard('carbs', 'Carbs', MACRO_COLORS.carbs)}
              {renderMacroCard('fat', 'Fats', MACRO_COLORS.fat)}
            </div>
          </div>

          {/* Ingredients List (if any) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Itemized Ingredients</div>
            
            {editedMeal.items && editedMeal.items.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {editedMeal.items.map((item, index) => (
                  <div key={index} className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      className="app-input"
                      style={{ flex: 1, padding: '4px 6px', fontSize: '13px', border: 'none', background: 'transparent' }}
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...editedMeal.items];
                        newItems[index].name = e.target.value;
                        setEditedMeal({ ...editedMeal, items: newItems });
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        className="app-input"
                        style={{ width: '50px', padding: '2px 4px', textAlign: 'center', fontSize: '12px' }}
                        value={item.portionGrams || 0}
                        onChange={(e) => updateItemPortion(index, e.target.value)}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>g</span>
                    </div>
                    <div className="font-mono" style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                      {item.calories} kcal
                    </div>
                    <button onClick={() => deleteItem(index)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer', padding: '2px' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>No itemized breakdown for this meal.</div>
            )}
            
            <button onClick={addItem} className="btn-secondary" style={{ padding: '8px', fontSize: '12px', alignSelf: 'flex-start' }}>
              <Plus size={14} /> Add Ingredient
            </button>
          </div>
        </div>

        {/* Fixed Bottom Action Buttons */}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          padding: '14px 18px calc(var(--safe-bottom) + 8px) 18px', 
          background: 'rgba(15, 20, 34, 0.95)', 
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          <button onClick={handleDelete} style={{
            flex: 1,
            padding: '12px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fb7185',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Trash2 size={16} /> Delete
          </button>

          <button onClick={handleSave} className="btn-primary" style={{ flex: 2 }}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
