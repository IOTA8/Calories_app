import React, { useState } from 'react';
import { User, X, Check, Save, Download, Upload, Flame, Sparkles, Activity, Shield } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { GOAL_TYPES, ACTIVITY_MULTIPLIERS } from '../../utils/nutritionCalculations';

export function ProfileModal({ isOpen, onClose }) {
  const { profile, updateProfile, targets, exportDataJSON, importDataJSON } = useNutrition();

  const [formData, setFormData] = useState({ ...profile });
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    onClose();
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrivision_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importDataJSON(reader.result);
      if (res.success) {
        setImportStatus('Data successfully restored!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Failed to import: ' + res.error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '90vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="#10b981" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Profile & Goal Engine</span>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Live Metabolic Summary Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>BMR</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                {targets.bmr} <span style={{ fontSize: '10px' }}>kcal</span>
              </div>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Base Metabolism</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TDEE</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8' }}>
                {targets.tdee} <span style={{ fontSize: '10px' }}>kcal</span>
              </div>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Maintenance</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Daily Target</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>
                {targets.targetCalories} <span style={{ fontSize: '10px' }}>kcal</span>
              </div>
              <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>With Goal Delta</div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Goal Selector */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                Transformation Strategy / Goal
              </label>
              <select
                className="app-select"
                value={formData.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
              >
                <optgroup label="Fat Loss / Cutting">
                  <option value="loss_mild">Mild Fat Loss (-300 kcal / -0.3 kg/wk)</option>
                  <option value="loss_moderate">Moderate Fat Loss (-500 kcal / -0.5 kg/wk) [Recommended]</option>
                  <option value="loss_aggressive">Aggressive Cut (-750 kcal / -0.75 kg/wk)</option>
                </optgroup>
                <optgroup label="Muscle Hypertrophy / Bulking">
                  <option value="gain_lean">Lean Muscle Bulk (+250 kcal / +0.25 kg/wk)</option>
                  <option value="gain_growth">Growth Surplus (+500 kcal / +0.5 kg/wk)</option>
                </optgroup>
                <optgroup label="Recomposition & Maintenance">
                  <option value="recomp">Body Recomposition (-100 kcal, High Protein)</option>
                  <option value="maintenance">Weight & Health Maintenance (0 kcal)</option>
                </optgroup>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                Daily Activity & Training
              </label>
              <select
                className="app-select"
                value={formData.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
              >
                {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
            </div>

            {/* Gender & Age */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Gender</label>
                <select
                  className="app-select"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Age (years)</label>
                <input
                  type="number"
                  className="app-input"
                  value={formData.ageYears}
                  onChange={(e) => handleChange('ageYears', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Weight, Target Weight & Height */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Current (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="app-input"
                  value={formData.weightKg}
                  onChange={(e) => handleChange('weightKg', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Goal (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="app-input"
                  value={formData.targetWeightKg}
                  onChange={(e) => handleChange('targetWeightKg', parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Height (cm)</label>
                <input
                  type="number"
                  className="app-input"
                  value={formData.heightCm}
                  onChange={(e) => handleChange('heightCm', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Water Goal */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Daily Water Target (ml)
              </label>
              <input
                type="number"
                step="100"
                className="app-input"
                value={formData.waterGoalMl || 2500}
                onChange={(e) => handleChange('waterGoalMl', Number(e.target.value))}
              />
            </div>

            {/* Custom Targets Override */}
            <div style={{
              marginTop: '4px',
              padding: '14px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Flame size={14} color="#f59e0b" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#fbbf24' }}>Custom Daily Targets (Override)</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
                Leave blank to use auto-calculated values from your profile & goal. Set a value to override.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    className="app-input"
                    placeholder={`Auto: ${targets.targetCalories}`}
                    value={formData.customCalories || ''}
                    onChange={(e) => handleChange('customCalories', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    className="app-input"
                    placeholder={`Auto: ${targets.proteinGrams}g`}
                    value={formData.customProtein || ''}
                    onChange={(e) => handleChange('customProtein', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    className="app-input"
                    placeholder={`Auto: ${targets.carbGrams}g`}
                    value={formData.customCarbs || ''}
                    onChange={(e) => handleChange('customCarbs', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    className="app-input"
                    placeholder={`Auto: ${targets.fatGrams}g`}
                    value={formData.customFat || ''}
                    onChange={(e) => handleChange('customFat', e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
              </div>

              {(formData.customCalories || formData.customProtein || formData.customCarbs || formData.customFat) && (
                <button
                  type="button"
                  onClick={() => {
                    handleChange('customCalories', null);
                    handleChange('customProtein', null);
                    handleChange('customCarbs', null);
                    handleChange('customFat', null);
                    setFormData(prev => ({ ...prev, customCalories: null, customProtein: null, customCarbs: null, customFat: null }));
                  }}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#f59e0b',
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Reset to Auto-Calculated Values
                </button>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
              <Save size={16} /> Save Profile & Targets
            </button>
          </form>

          {/* Backup & Restore Data */}
          <div style={{
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
              Data Backup & Privacy (Local Device)
            </div>

            {importStatus && (
              <div style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '6px 10px', borderRadius: '8px' }}>
                {importStatus}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleExport}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px' }}
              >
                <Download size={14} /> Export Backup
              </button>

              <label
                className="btn-secondary"
                style={{ flex: 1, padding: '8px 12px', fontSize: '12.5px', cursor: 'pointer', textAlign: 'center' }}
              >
                <Upload size={14} /> Restore Backup
                <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
