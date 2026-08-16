import React, { useState } from 'react';
import { X, Flame, Plus, Trash2, Dumbbell, Timer, Sparkles } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { formatDisplayDate } from '../../utils/formatters';

const WORKOUT_TYPES = [
  { id: 'Strength Training', icon: '🏋️', defaultKcal: 250 },
  { id: 'Running', icon: '🏃', defaultKcal: 350 },
  { id: 'Cycling', icon: '🚴', defaultKcal: 300 },
  { id: 'HIIT & Cardio', icon: '⚡', defaultKcal: 280 },
  { id: 'Walking', icon: '🚶', defaultKcal: 150 },
  { id: 'Swimming', icon: '🏊', defaultKcal: 320 },
  { id: 'Yoga & Stretch', icon: '🧘', defaultKcal: 120 },
  { id: 'Sports', icon: '🏀', defaultKcal: 300 }
];

export function WorkoutModal({ isOpen, onClose }) {
  const { selectedDate, getDaySummary, addWorkout, deleteWorkout } = useNutrition();
  const summary = getDaySummary(selectedDate);
  const workouts = summary.workouts || [];
  const totalBurned = summary.burnedCalories || 0;

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Strength Training');
  const [durationMin, setDurationMin] = useState('45');
  const [caloriesBurned, setCaloriesBurned] = useState('250');

  if (!isOpen) return null;

  const handleSelectType = (wType) => {
    setType(wType.id);
    if (!title || WORKOUT_TYPES.some(t => t.id === title)) {
      setTitle(wType.id);
    }
    setCaloriesBurned(String(wType.defaultKcal));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!caloriesBurned) return;

    addWorkout(selectedDate, {
      title: title || type,
      type,
      durationMin: parseInt(durationMin, 10) || 30,
      caloriesBurned: parseInt(caloriesBurned, 10) || 200
    });

    setTitle('');
    setDurationMin('45');
    setCaloriesBurned('250');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '88vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f97316'
            }}>
              <Flame size={16} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Workout & Active Burn</span>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDisplayDate(selectedDate)}</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Total Burned Hero Card */}
          <div className="glass-card" style={{
            padding: '16px',
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(244, 63, 94, 0.08) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Burned Today</div>
              <div className="font-mono" style={{ fontSize: '26px', fontWeight: 900, color: '#f97316', marginTop: '2px' }}>
                {totalBurned.toLocaleString()} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>kcal</span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right' }}>
              <div>{workouts.length} {workouts.length === 1 ? 'session' : 'sessions'}</div>
              <div style={{ color: '#34d399', fontWeight: 600, marginTop: '2px' }}>+ Added to energy budget</div>
            </div>
          </div>

          {/* Add Workout Form */}
          <form onSubmit={handleAdd} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>
              Log a Workout
            </div>

            {/* Quick Workout Type Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {WORKOUT_TYPES.map(wType => (
                <button
                  key={wType.id}
                  type="button"
                  onClick={() => handleSelectType(wType)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-sm)',
                    border: type === wType.id ? '1px solid #f97316' : '1px solid var(--border-subtle)',
                    background: type === wType.id ? 'rgba(249, 115, 22, 0.2)' : 'var(--bg-surface)',
                    color: type === wType.id ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{wType.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{wType.id.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Title */}
            <div>
              <label style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Activity / Workout Name
              </label>
              <input
                type="text"
                className="app-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={type}
              />
            </div>

            {/* Duration & Calories Burned Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Duration (mins)
                </label>
                <input
                  type="number"
                  required
                  className="app-input"
                  value={durationMin}
                  onChange={e => setDurationMin(e.target.value)}
                  placeholder="45"
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', color: '#f97316', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Calories Burned (kcal)
                </label>
                <input
                  type="number"
                  required
                  className="app-input"
                  value={caloriesBurned}
                  onChange={e => setCaloriesBurned(e.target.value)}
                  placeholder="250"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)'
            }}>
              <Plus size={16} /> Add Workout Entry
            </button>
          </form>

          {/* Today's Logged Workouts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
              Today's Workouts
            </div>

            {workouts.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '12px',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}>
                No workouts logged for today. Tap above to add one!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {workouts.map(w => (
                  <div
                    key={w.id}
                    className="glass-card"
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'rgba(249, 115, 22, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#f97316'
                      }}>
                        <Flame size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>
                          {w.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {w.durationMin} mins • {w.type}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: '#f97316' }}>
                        -{w.caloriesBurned} kcal
                      </span>
                      <button
                        onClick={() => deleteWorkout(selectedDate, w.id)}
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', color: '#fb7185', background: 'transparent', border: 'none' }}
                        title="Delete workout"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
