import React, { useState } from 'react';
import { NutritionProvider, useNutrition } from './context/NutritionContext';
import { TopHeader } from './components/Navigation/TopHeader';
import { BottomNav } from './components/Navigation/BottomNav';
import { CalorieRing } from './components/Dashboard/CalorieRing';
import { MacroBars } from './components/Dashboard/MacroBars';
import { QuickWidgetsRow } from './components/Dashboard/QuickWidgetsRow';
import { QuickMealsGrid } from './components/Dashboard/QuickMealsGrid';
import { GoalCoachBanner } from './components/Dashboard/GoalCoachBanner';
import { MealSection } from './components/Dashboard/MealSection';
import { WaterTracker } from './components/Dashboard/WaterTracker';
import { CameraModal } from './components/Scanner/CameraModal';
import { ScanningAnimation } from './components/Scanner/ScanningAnimation';
import { ScanResultModal } from './components/Scanner/ScanResultModal';
import { ManualAddModal } from './components/ManualEntry/ManualAddModal';
import { TrendsView } from './components/Analytics/TrendsView';
import { CoachView } from './components/Coach/CoachView';
import { ProfileModal } from './components/Profile/ProfileModal';
import { ApiKeyModal } from './components/Profile/ApiKeyModal';
import { MobileInstallModal } from './components/Navigation/MobileInstallModal';
import { WelcomeOnboardingModal } from './components/Onboarding/WelcomeOnboardingModal';
import { EditMealModal } from './components/Dashboard/EditMealModal';
import { analyzeFoodWithGemini } from './services/geminiVision';
import { analyzeFoodOffline } from './services/smartFallbackAI';

function MainApp() {
  const {
    profile,
    targets,
    selectedDate,
    setSelectedDate,
    meals,
    getDaySummary,
    addMeal,
    deleteMeal,
    updateMeal,
    saveFoodItem,
    apiKey
  } = useNutrition();

  const [activeTab, setActiveTab] = useState('today'); // 'today', 'trends', 'coach', 'profile'
  
  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('nutrivision_onboarded');
  });
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scanPreviewImage, setScanPreviewImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [manualMealType, setManualMealType] = useState('lunch');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  const [editingMeal, setEditingMeal] = useState(null);

  const summary = getDaySummary(selectedDate);

  // Trigger AI Food Analysis (Gemini Vision or Smart Simulator)
  const handleAnalyzeFood = async ({ imageBase64, sampleId, mealType, customNotes }) => {
    setIsScannerOpen(false);
    setIsScanningActive(true);
    setScanPreviewImage(imageBase64 || (sampleId ? `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80` : null));

    try {
      let result = null;

      if (apiKey && imageBase64) {
        try {
          result = await analyzeFoodWithGemini({
            imageBase64,
            apiKey,
            userGoal: profile.goal,
            customNotes
          });
        } catch (apiErr) {
          console.warn('Gemini API failed, falling back to smart vision engine:', apiErr);
          result = await analyzeFoodOffline({ imageBase64, sampleId, userGoal: profile.goal });
        }
      } else {
        result = await analyzeFoodOffline({ imageBase64, sampleId, userGoal: profile.goal });
      }

      if (imageBase64) {
        result.imageUrl = imageBase64;
      }

      setScanResult(result);
      setManualMealType(mealType || 'lunch');
      setIsScanningActive(false);
      setIsResultOpen(true);
    } catch (err) {
      console.error('Analysis error:', err);
      setIsScanningActive(false);
      alert('Error analyzing food image: ' + err.message);
    }
  };

  // Confirm and log meal from AI scanner
  const handleConfirmLog = (mealData) => {
    addMeal(selectedDate, mealData);
    setIsResultOpen(false);
    setScanResult(null);
  };

  // Quick add manual food
  const handleOpenManualAdd = (mealType = 'lunch') => {
    setManualMealType(mealType);
    setIsManualAddOpen(true);
  };

  const handleConfirmManualAdd = (mealData) => {
    addMeal(selectedDate, mealData);
  };

  const handleEditMeal = (mealId, meal) => {
    setEditingMeal({ mealId, meal, dateKey: selectedDate });
  };

  const handleSaveEditedMeal = (updatedMeal) => {
    if (editingMeal) {
      updateMeal(editingMeal.dateKey, editingMeal.mealId, updatedMeal);
      setEditingMeal(null);
    }
  };

  return (
    <div className="app-viewport-wrapper">
      <div className="mobile-device-shell">
        {/* Top Header */}
        <TopHeader
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
          onOpenInstall={() => setIsInstallOpen(true)}
        />

        {/* Scrollable Tab Content */}
        <main className="screen-scroll-container">
          {activeTab === 'today' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Calorie Ring Hero Card with 3 Integrated Macro Progress Bars */}
              <CalorieRing summary={summary} targets={targets} />

              {/* Side-by-side Workout Burned & Water Widgets */}
              <QuickWidgetsRow summary={summary} />

              {/* Meals Quick Category Row (Breakfast, Lunch, Dinner, Snacks) */}
              <QuickMealsGrid onSelectMealType={handleOpenManualAdd} />

              {/* Contextual AI Coach Banner */}
              <GoalCoachBanner summary={summary} targets={targets} />

              {/* Today's Meals Grouped Log */}
              <MealSection
                meals={summary.meals}
                onAddMeal={handleOpenManualAdd}
                onDeleteMeal={(mealId) => deleteMeal(selectedDate, mealId)}
                onEditMeal={handleEditMeal}
              />
            </div>
          )}

          {activeTab === 'trends' && (
            <TrendsView onSelectDate={(date) => {
              setSelectedDate(date);
              setActiveTab('today');
            }} />
          )}

          {activeTab === 'coach' && (
            <CoachView />
          )}

          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick direct access to Mobile Installation */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800 }}>Run on iOS & Android</h3>
                  <span className="badge badge-sky">PWA</span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Install this app on your iPhone or Android home screen for full-screen camera logging.
                </p>
                <button onClick={() => setIsInstallOpen(true)} className="btn-secondary">
                  📱 Mobile Setup Guide
                </button>
              </div>

              {/* Quick direct access to Profile settings */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '15.5px', fontWeight: 800 }}>Profile & Transformation Strategy</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Configure your weight, height, age, activity level, and target cut/bulk macro targets.
                </p>
                <button onClick={() => setIsProfileOpen(true)} className="btn-primary">
                  Edit Profile & Targets
                </button>
              </div>

              {/* API Key settings card */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 800 }}>Gemini GenAI Vision Key</h3>
                  <span className={`badge ${apiKey ? 'badge-emerald' : 'badge-amber'}`}>
                    {apiKey ? 'Connected' : 'Smart Simulator'}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Connect your free Google Gemini API key to run live multimodal food plate decomposition.
                </p>
                <button onClick={() => setIsApiKeyOpen(true)} className="btn-secondary">
                  Configure Free Gemini Key
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* AI Camera & Photo Upload Modal */}
        <CameraModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onAnalyze={handleAnalyzeFood}
          defaultMealType="lunch"
        />

        {/* Scanning In Progress Holographic Overlay */}
        {isScanningActive && (
          <div className="modal-overlay">
            <div className="bottom-sheet" style={{ height: 'auto', minHeight: '380px' }}>
              <ScanningAnimation imagePreview={scanPreviewImage} />
            </div>
          </div>
        )}

        {/* AI Scan Result & Ingredients Review Modal */}
        <ScanResultModal
          isOpen={isResultOpen}
          result={scanResult}
          onClose={() => setIsResultOpen(false)}
          onConfirmLog={handleConfirmLog}
          defaultMealType={manualMealType}
          onSaveFood={saveFoodItem}
        />

        {/* Manual Food Add Modal */}
        <ManualAddModal
          isOpen={isManualAddOpen}
          onClose={() => setIsManualAddOpen(false)}
          onAddFood={handleConfirmManualAdd}
          defaultMealType={manualMealType}
        />

        {/* Profile & Goals Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />

        {/* Gemini API Key Modal */}
        <ApiKeyModal
          isOpen={isApiKeyOpen}
          onClose={() => setIsApiKeyOpen(false)}
        />

        {/* Mobile Install Guide Modal */}
        <MobileInstallModal
          isOpen={isInstallOpen}
          onClose={() => setIsInstallOpen(false)}
        />

        {/* Welcome Onboarding Modal for New Users */}
        <WelcomeOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />

        {/* Edit Meal Modal */}
        <EditMealModal
          isOpen={!!editingMeal}
          onClose={() => setEditingMeal(null)}
          meal={editingMeal?.meal}
          onSave={handleSaveEditedMeal}
          onDelete={(mealId) => {
            if (editingMeal) {
              deleteMeal(editingMeal.dateKey, mealId);
              setEditingMeal(null);
            }
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NutritionProvider>
      <MainApp />
    </NutritionProvider>
  );
}
