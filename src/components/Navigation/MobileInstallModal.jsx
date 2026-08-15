import React from 'react';
import { Smartphone, Apple, X, Share2, PlusSquare, MoreVertical, Download, Wifi, Sparkles, CheckCircle2 } from 'lucide-react';

export function MobileInstallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '88vh' }}>
        <div className="sheet-handle-bar" />

        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} color="#10b981" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Run on iOS & Android</span>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Summary Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Native-App Experience (PWA)
            </div>
            NutriVision is configured as a standalone Progressive Web App. You can install it on your iPhone or Android phone in 10 seconds with <strong>zero app store downloads</strong>. All data stays 100% locally on your phone!
          </div>

          {/* iOS Setup Guide */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Apple size={18} color="#ffffff" />
              <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>iPhone / iPad (iOS Safari)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-sky font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>1</span>
                <span>Open this URL in <strong>Safari</strong> on your iPhone.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-sky font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>2</span>
                <span>Tap the <strong>Share</strong> button (the square icon with an upward arrow <Share2 size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> at the bottom).</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-sky font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>3</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-sky font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>4</span>
                <span>Tap <strong>Add</strong>. It will now launch full-screen like an official App Store app with native camera access!</span>
              </div>
            </div>
          </div>

          {/* Android Setup Guide */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="#10b981" />
              <span style={{ fontWeight: 700, fontSize: '14.5px', color: '#fff' }}>Android (Google Chrome)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-emerald font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>1</span>
                <span>Open this URL in <strong>Chrome</strong> on your Android device.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-emerald font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>2</span>
                <span>Tap the <strong>3 dots menu</strong> <MoreVertical size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> in the top right.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-emerald font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>3</span>
                <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> <Download size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="badge badge-emerald font-mono" style={{ padding: '2px 7px', fontSize: '11px' }}>4</span>
                <span>Tap <strong>Install</strong>. NutriVision is installed directly on your launcher!</span>
              </div>
            </div>
          </div>

          {/* Local Wi-Fi Network Access */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wifi size={16} color="#38bdf8" />
              <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#fff' }}>Testing on Your Phone Right Now</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Ensure your phone is connected to the same Wi-Fi as your Mac. Open your phone's browser and go to your network address (e.g. <code>http://&lt;your-computer-ip&gt;:3000</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
