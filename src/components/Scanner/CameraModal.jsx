import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { SAMPLE_MEAL_PRESETS } from '../../services/smartFallbackAI';

export function CameraModal({ isOpen, onClose, onAnalyze, defaultMealType = 'lunch' }) {
  const [activeMode, setActiveMode] = useState('camera'); // 'camera', 'upload', 'samples'
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
  const [cameraError, setCameraError] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [customNotes, setCustomNotes] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera stream
  useEffect(() => {
    if (isOpen && activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser. Please use file upload.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError('Camera access denied or unavailable. You can upload a photo or choose a sample meal below.');
      setActiveMode('upload');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture frame from video to canvas
  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();

    onAnalyze({
      imageBase64: base64,
      mealType: defaultMealType,
      customNotes
    });
  };

  // Handle uploaded file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      onAnalyze({
        imageBase64: base64,
        mealType: defaultMealType,
        customNotes,
        isCustomUpload: true
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle sample meal selection
  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    onAnalyze({
      imageBase64: null,
      sampleId: sample.id,
      mealType: defaultMealType,
      customNotes
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '90vh' }}>
        <div className="sheet-handle-bar" />

        {/* Header */}
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#10b981" />
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>AI Food Scanner</span>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ padding: '12px 20px 0 20px' }}>
          <div className="segmented-control">
            <button
              className={`segmented-btn ${activeMode === 'camera' ? 'active' : ''}`}
              onClick={() => setActiveMode('camera')}
            >
              📷 Live Camera
            </button>
            <button
              className={`segmented-btn ${activeMode === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveMode('upload')}
            >
              📤 Upload / Snap
            </button>
            <button
              className={`segmented-btn ${activeMode === 'samples' ? 'active' : ''}`}
              onClick={() => setActiveMode('samples')}
            >
              ✨ Sample Dishes
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="sheet-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CAMERA MODE */}
          {activeMode === 'camera' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '340px',
                height: '320px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#000',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Viewfinder overlay corners */}
                <div style={{ position: 'absolute', top: 16, left: 16, width: 24, height: 24, borderTop: '3px solid #10b981', borderLeft: '3px solid #10b981' }} />
                <div style={{ position: 'absolute', top: 16, right: 16, width: 24, height: 24, borderTop: '3px solid #10b981', borderRight: '3px solid #10b981' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 16, width: 24, height: 24, borderBottom: '3px solid #10b981', borderLeft: '3px solid #10b981' }} />
                <div style={{ position: 'absolute', bottom: 16, right: 16, width: 24, height: 24, borderBottom: '3px solid #10b981', borderRight: '3px solid #10b981' }} />

                {/* Flip camera button */}
                <button
                  onClick={switchCamera}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Switch Camera"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* Shutter Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <button
                  onClick={handleCapture}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '5px solid #10b981',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.1s ease'
                  }}
                  title="Take Photo & Analyze"
                >
                  <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#10b981' }} />
                </button>
              </div>
            </div>
          )}

          {/* UPLOAD / SNAP MODE */}
          {activeMode === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cameraError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(251, 191, 36, 0.12)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  color: '#fbbf24',
                  fontSize: '12px'
                }}>
                  {cameraError}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(16, 185, 129, 0.4)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '36px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  background: 'rgba(16, 185, 129, 0.04)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <Upload size={26} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff' }}>
                    Tap to Snap or Upload Food Photo
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Take a picture with phone camera or pick from gallery
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SAMPLES PRESET GALLERY */}
          {activeMode === 'samples' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Select any realistic culinary dish below for instant AI decomposition:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {SAMPLE_MEAL_PRESETS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="glass-card-interactive"
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <img
                      src={sample.image}
                      alt={sample.name}
                      style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#fff', lineHeight: 1.3 }}>
                        {sample.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
                          {sample.calories} kcal
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: 600 }}>
                          {sample.protein}g protein
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional context notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Additional Context / Prep Notes (Optional)
            </label>
            <input
              type="text"
              className="app-input"
              placeholder="e.g. Cooked with extra virgin olive oil, no sauce..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
