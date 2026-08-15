import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, AlertCircle, Sparkles, HelpCircle, Copy } from 'lucide-react';
import { useNutrition } from '../../context/NutritionContext';

export function ApiKeyModal({ isOpen, onClose }) {
  const { apiKey, setApiKey } = useNutrition();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(inputKey.trim());
    setTestResult({ success: true, message: '✅ API Key saved! It is stored securely in your browser and used to call Gemini Multimodal Vision directly.' });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid key first.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Test with lightweight prompt
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${inputKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Return json: {"status": "ok"}' }] }]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Failed to authenticate with Google Gemini API.');
      }

      setTestResult({ success: true, message: '✅ Gemini 1.5 Flash API connected successfully!' });
      setApiKey(inputKey.trim());
    } catch (err) {
      setTestResult({ success: false, message: `Error: ${err.message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '88vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="#10b981" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Google Gemini AI Key</span>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* How to get free key box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} /> 100% Free Gemini API Key
              </div>
              <span className="badge badge-emerald font-mono">0 Cost</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Google provides free Gemini API access for personal projects. You can generate a free key in 30 seconds with any standard Google account.
            </p>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '10px 14px', fontSize: '13px', textDecoration: 'none' }}
            >
              <ExternalLink size={14} /> Get Free Key at Google AI Studio
            </a>

            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
              <div>1. Tap the button above to open <strong>Google AI Studio</strong>.</div>
              <div>2. Click <strong>"Create API key"</strong> ➡️ Select "Create key in new project".</div>
              <div>3. Copy your key (starts with <code>AIzaSy...</code>) and paste it below!</div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Paste Your Gemini API Key
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                {testing ? 'Verifying...' : 'Test Key'}
              </button>

              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1 }}
              >
                <Check size={16} /> Save Key
              </button>
            </div>
          </form>

          {testResult && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
              color: testResult.success ? '#34d399' : '#fb7185',
              fontSize: '12.5px'
            }}>
              {testResult.message}
            </div>
          )}

          {/* Privacy & Local Storage Note */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#10b981" /> 100% Client-Side Privacy
            </div>
            <p style={{ lineHeight: 1.45 }}>
              Your meals, photos, calorie history, and weigh-in data remain completely private inside your phone's browser storage. When you scan a photo, only the image data is sent directly to Google Gemini to calculate macros.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
