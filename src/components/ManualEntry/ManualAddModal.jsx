import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Flame, Dumbbell, Wheat, Droplet, Check, Heart, Trash2 } from 'lucide-react';
import { FOOD_DATABASE, searchFoods } from '../../services/nutritionDb';
import { useNutrition } from '../../context/NutritionContext';

export function ManualAddModal({ isOpen, onClose, onAddFood, defaultMealType = 'lunch' }) {
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'custom', 'saved'
  const { savedFoods, removeSavedFood, getRecentMeals } = useNutrition();
  const recentMeals = useMemo(() => getRecentMeals(), [getRecentMeals]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealType, setMealType] = useState(defaultMealType);

  // Custom food fields
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customFiber, setCustomFiber] = useState('');

  if (!isOpen) return null;

  const filteredFoods = searchFoods(searchQuery);

  const handleSelectDbFood = (food) => {
    onAddFood({
      name: food.name,
      mealType,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber || 0,
      timestamp: Date.now(),
      tags: [food.category],
      items: [{ name: food.name, portionGrams: 100, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat }]
    });
    onClose();
  };

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const cal = parseInt(customCalories) || 0;
    const p = parseFloat(customProtein) || 0;
    const c = parseFloat(customCarbs) || 0;
    const f = parseFloat(customFat) || 0;
    const fib = parseFloat(customFiber) || 0;

    onAddFood({
      name: customName,
      mealType,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      fiber: fib,
      timestamp: Date.now(),
      tags: ['Custom Entry'],
      items: [{ name: customName, portionGrams: 100, calories: cal, protein: p, carbs: c, fat: f }]
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '85vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Add Food Entry</span>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Meal Type Selector */}
        <div style={{ padding: '12px 20px 0 20px' }}>
          <div className="segmented-control" style={{ marginBottom: '10px' }}>
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

          <div className="segmented-control">
            <button
              className={`segmented-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              🔍 Food Database
            </button>
            <button
              className={`segmented-btn ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              ✍️ Custom Quick Add
            </button>
            <button
              className={`segmented-btn ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <Heart size={14} style={{ display: 'inline', marginBottom: '-2px' }}/> My Foods
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'search' && (
            <>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input
                  type="text"
                  className="app-input"
                  placeholder="Search chicken, rice, eggs, oats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                />
              </div>

              {/* Food List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredFoods.map(food => (
                  <div
                    key={food.id}
                    onClick={() => handleSelectDbFood(food)}
                    className="glass-card-interactive"
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>
                        {food.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {food.serving} • P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>
                        {food.calories} kcal
                      </span>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Plus size={15} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'custom' && (
            <form onSubmit={handleCreateCustom} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Food / Dish Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Protein Smoothie Bowl"
                  className="app-input"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 450"
                  className="app-input"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', color: '#38bdf8', fontWeight: 600 }}>
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="30"
                    className="app-input"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', color: '#fbbf24', fontWeight: 600 }}>
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="40"
                    className="app-input"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', color: '#fb7185', fontWeight: 600 }}>
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12"
                    className="app-input"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', color: '#c084fc', fontWeight: 600 }}>
                  Dietary Fiber (g) - Optional
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="6"
                  className="app-input"
                  value={customFiber}
                  onChange={(e) => setCustomFiber(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                <Check size={16} /> Add to Diary
              </button>
            </form>
          )}

          {activeTab === 'saved' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', paddingBottom: '20px' }}>
              {/* Recent Meals */}
              <div>
                <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '10px' }}>Recent Meals</h4>
                {recentMeals.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '10px' }}>No recent meals found.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recentMeals.map(food => (
                      <div key={food.id} className="glass-card-interactive" style={{
                        background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '12px 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-subtle)'
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>{food.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {food.calories} kcal
                          </div>
                        </div>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }} onClick={() => {
                          onAddFood({
                            name: food.name,
                            mealType,
                            calories: food.calories || 0,
                            protein: food.protein || 0,
                            carbs: food.carbs || 0,
                            fat: food.fat || 0,
                            fiber: food.fiber || 0,
                            timestamp: Date.now(),
                            tags: food.tags || [],
                            items: food.items || []
                          });
                          onClose();
                        }}>
                          <Plus size={15} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Foods */}
              <div>
                <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '10px' }}>Saved Foods</h4>
                {savedFoods.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '10px' }}>No saved foods yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {savedFoods.map(food => (
                      <div key={food.id} className="glass-card-interactive" style={{
                        background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', padding: '12px 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-subtle)'
                      }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>{food.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {food.calories} kcal • P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => removeSavedFood(food.id)} className="btn-icon" style={{
                            width: '28px', height: '28px', color: 'var(--text-muted)'
                          }}>
                            <Trash2 size={15} />
                          </button>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                          }} onClick={() => {
                            onAddFood({
                              name: food.name,
                              mealType,
                              calories: food.calories || 0,
                              protein: food.protein || 0,
                              carbs: food.carbs || 0,
                              fat: food.fat || 0,
                              fiber: food.fiber || 0,
                              timestamp: Date.now(),
                              tags: food.tags || [],
                              items: food.items || []
                            });
                            onClose();
                          }}>
                            <Plus size={15} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
