import React, { useState } from 'react';
import { Sparkles, Flame, Key, ArrowRight, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';
import { GOAL_TYPES } from '../../utils/nutritionCalculations';

export function WelcomeOnboardingModal({ isOpen, onClose }) {
  const { profile, updateProfile, setApiKey, apiKey } = useNutrition();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(profile.goal || 'loss_moderate');
  const [inputKey, setInputKey] = useState('');

  if (!isOpen) return null;

  const handleFinish = () => {
    updateProfile({ goal: selectedGoal });
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
    localStorage.setItem('nutrivision_onboarded', 'true');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="bottom-sheet" style={{ height: 'auto', maxHeight: '90vh' }}>
        <div className="sheet-handle-bar" />

        <div className="sheet-content" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {step === 1 && (
            <>
              {/* Logo & Welcome Header */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
                }}>
                  <Flame size={32} color="#fff" />
                </div>

                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                  Welcome to NutriVision AI
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Snap pictures of your food to track calories & macros. All your personal data stays 100% locally on your phone.
                </p>
              </div>

              {/* Goal Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Select Your Main Fitness Goal:
                </label>

                {[
                  { id: 'loss_moderate', label: '🔥 Fat Loss / Cut (-500 kcal/day)', desc: 'Lose ~0.5 kg fat/week with high protein muscle preservation' },
                  { id: 'gain_lean', label: '💪 Muscle Growth / Lean Bulk (+250 kcal/day)', desc: 'Maximize hypertrophy and strength with clean surplus' },
                  { id: 'recomp', label: '⚡ Body Recomposition (-100 kcal)', desc: 'Build lean muscle while dropping fat at near maintenance' },
                  { id: 'maintenance', label: '⚖️ Maintain Weight & Performance', desc: 'Isocaloric energy balance for health and wellness' }
                ].map(g => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    style={{
                      background: selectedGoal === g.id ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-elevated)',
                      border: `1.5px solid ${selectedGoal === g.id ? '#10b981' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>
                      {g.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {g.desc}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ marginTop: '8px' }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <Key size={24} />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                  Connect Gemini Vision AI
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Use your own free Google Gemini API key to recognize photos, or continue in demo simulator mode.
                </p>
              </div>

              {/* Free API key helper */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '12px'
              }}>
                <div style={{ fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Free Google API Key</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
                  >
                    Get Key <ExternalLink size={12} />
                  </a>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Takes 30 seconds at Google AI Studio with any Google account.
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Gemini API Key (Optional - Can add later in Settings)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  className="app-input"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  style={{ marginTop: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ flex: 0.8 }}
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="btn-primary"
                  style={{ flex: 1.2 }}
                >
                  <Check size={16} /> Start Tracking
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
