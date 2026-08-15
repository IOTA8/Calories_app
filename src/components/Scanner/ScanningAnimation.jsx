import React, { useState, useEffect } from 'react';
import { Sparkles, Scan, Brain, CheckCircle } from 'lucide-react';

const SCAN_STEPS = [
  'Processing high-resolution food image...',
  'Detecting culinary ingredients & plate composition...',
  'Estimating portion weights & volumetric density...',
  'Calculating calories, macronutrients & fiber...',
  'Formulating personalized AI Coach advice...'
];

export function ScanningAnimation({ imagePreview }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px',
      gap: '24px',
      textAlign: 'center'
    }}>
      {/* Image Preview with Holographic Scanning Laser */}
      <div style={{
        position: 'relative',
        width: '240px',
        height: '240px',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
      }}>
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Scanning Food"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            🥗
          </div>
        )}

        {/* Laser scan line */}
        <div className="scan-laser-line" />

        {/* Holographic corner markers */}
        <div style={{ position: 'absolute', top: 12, left: 12, width: 20, height: 20, borderTop: '3px solid #10b981', borderLeft: '3px solid #10b981' }} />
        <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderTop: '3px solid #10b981', borderRight: '3px solid #10b981' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 20, height: 20, borderBottom: '3px solid #10b981', borderLeft: '3px solid #10b981' }} />
        <div style={{ position: 'absolute', bottom: 12, right: 12, width: 20, height: 20, borderBottom: '3px solid #10b981', borderRight: '3px solid #10b981' }} />
      </div>

      {/* Dynamic Status Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#10b981" style={{ animation: 'spin 3s linear infinite' }} />
          <span style={{ fontWeight: 800, fontSize: '17px', color: '#ffffff' }}>
            NutriVision AI Scanning...
          </span>
        </div>

        <p className="font-mono" style={{ fontSize: '13px', color: '#38bdf8', minHeight: '20px' }}>
          {SCAN_STEPS[stepIndex]}
        </p>

        {/* Step indicator pills */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {SCAN_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === stepIndex ? '20px' : '6px',
                height: '6px',
                borderRadius: '99px',
                background: i <= stepIndex ? '#10b981' : 'rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
