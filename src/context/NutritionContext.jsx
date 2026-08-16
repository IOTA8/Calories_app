import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateTargets, GOAL_TYPES } from '../utils/nutritionCalculations';
import { formatDateKey } from '../utils/formatters';

const NutritionContext = createContext(null);

const DEFAULT_PROFILE = {
  name: 'Alex Hunter',
  gender: 'male',
  ageYears: 27,
  weightKg: 78.5,
  targetWeightKg: 73.0,
  heightCm: 178,
  activityLevel: 'moderate',
  goal: 'loss_moderate', // 'loss_mild', 'loss_moderate', 'loss_aggressive', 'gain_lean', 'gain_growth', 'recomp', 'maintenance'
  waterGoalMl: 2500,
  customCalories: null,
  customProtein: null,
  customCarbs: null,
  customFat: null,
  unitSystem: 'metric' // 'metric' (kg/cm) or 'imperial' (lbs/in)
};

// Seed realistic sample day meal data
const getInitialMeals = () => {
  const today = formatDateKey(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatDateKey(yesterdayDate);

  return {
    [today]: [
      {
        id: 'meal_sample_1',
        name: 'Avocado Toast with Poached Eggs & Chia',
        mealType: 'breakfast',
        calories: 460,
        protein: 22,
        carbs: 38,
        fat: 24,
        fiber: 8,
        sugar: 2,
        sodiumMg: 490,
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
        tags: ['High Fiber', 'Healthy Fats', 'Whole Foods'],
        coachInsight: 'Great nutrient density. The healthy fats slow gastric emptying to keep you full for 4+ hours on your cut.',
        items: [
          { name: 'Sourdough Bread (Toasted)', portionGrams: 80, calories: 180, protein: 6, carbs: 34, fat: 1.5, fiber: 2 },
          { name: 'Poached Eggs (2 large)', portionGrams: 100, calories: 140, protein: 12, carbs: 1, fat: 10, fiber: 0 },
          { name: 'Fresh Hass Avocado', portionGrams: 70, calories: 115, protein: 1.5, carbs: 6, fat: 10.5, fiber: 5 },
          { name: 'Chia Seeds & Microgreens', portionGrams: 15, calories: 25, protein: 1, carbs: 1, fat: 2, fiber: 1 }
        ]
      },
      {
        id: 'meal_sample_2',
        name: 'Herb Grilled Chicken Breast, Brown Rice & Broccoli',
        mealType: 'lunch',
        calories: 510,
        protein: 52,
        carbs: 54,
        fat: 9,
        fiber: 7,
        sugar: 3,
        sodiumMg: 410,
        timestamp: Date.now() - 1000 * 60 * 60 * 1,
        imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
        tags: ['Ultra High Protein', 'Lean Fuel', 'Bodybuilder Classic'],
        coachInsight: 'Phenomenal cutting plate! Over 50g of lean protein with minimal fats gives you maximum satiety per calorie.',
        items: [
          { name: 'Marinated Grilled Chicken Breast', portionGrams: 200, calories: 280, protein: 44, carbs: 0, fat: 5.5, fiber: 0 },
          { name: 'Steamed Long-Grain Brown Rice', portionGrams: 140, calories: 160, protein: 3.5, carbs: 34, fat: 1.5, fiber: 2.5 },
          { name: 'Garlic Steamed Broccoli Florets', portionGrams: 120, calories: 45, protein: 3.5, carbs: 8, fat: 0.5, fiber: 4 },
          { name: 'Extra Virgin Olive Oil (Drizzle)', portionGrams: 5, calories: 45, protein: 0, carbs: 0, fat: 5, fiber: 0 }
        ]
      }
    ],
    [yesterday]: [
      {
        id: 'meal_sample_y1',
        name: 'Greek Yogurt & Mixed Berries Power Bowl',
        mealType: 'breakfast',
        calories: 380,
        protein: 32,
        carbs: 42,
        fat: 7,
        fiber: 9,
        timestamp: Date.now() - 1000 * 60 * 60 * 28,
        imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
        tags: ['High Protein', 'Antioxidant Superfood'],
        coachInsight: 'Great high-protein start with prebiotic fiber.',
        items: [
          { name: 'Greek Yogurt (0% Fat)', portionGrams: 200, calories: 120, protein: 22, carbs: 7, fat: 0, fiber: 0 },
          { name: 'Whey Protein Scoop', portionGrams: 15, calories: 60, protein: 10, carbs: 1, fat: 0.5, fiber: 0 },
          { name: 'Fresh Berries & Granola', portionGrams: 100, calories: 200, protein: 4, carbs: 34, fat: 6.5, fiber: 9 }
        ]
      },
      {
        id: 'meal_sample_y2',
        name: 'Wild Salmon, Quinoa & Avocado Greens',
        mealType: 'dinner',
        calories: 590,
        protein: 45,
        carbs: 46,
        fat: 23,
        fiber: 9,
        timestamp: Date.now() - 1000 * 60 * 60 * 20,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        tags: ['Omega-3 Rich', 'High Protein'],
        coachInsight: 'Exceptional recovery meal packed with anti-inflammatory omega-3 fats.',
        items: [
          { name: 'Grilled Wild Salmon', portionGrams: 170, calories: 300, protein: 36, carbs: 0, fat: 17, fiber: 0 },
          { name: 'Steamed Quinoa', portionGrams: 120, calories: 150, protein: 5, carbs: 28, fat: 2.5, fiber: 3 },
          { name: 'Avocado & Greens Salad', portionGrams: 120, calories: 140, protein: 4, carbs: 18, fat: 3.5, fiber: 6 }
        ]
      }
    ]
  };
};

const getInitialWeightLogs = () => [];

export function NutritionProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('nutrivision_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()));

  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('nutrivision_meals');
    if (!saved) return {};
    try {
      const parsed = JSON.parse(saved);
      Object.keys(parsed).forEach(dateKey => {
        if (Array.isArray(parsed[dateKey])) {
          parsed[dateKey] = parsed[dateKey].map((m, i) => ({
            ...m,
            id: m.id ? String(m.id) : `meal_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`
          }));
        }
      });
      return parsed;
    } catch {
      return {};
    }
  });

  const [waterLogs, setWaterLogs] = useState(() => {
    const saved = localStorage.getItem('nutrivision_water');
    return saved ? JSON.parse(saved) : {};
  });

  const [weightLogs, setWeightLogs] = useState(() => {
    const saved = localStorage.getItem('nutrivision_weights');
    return saved ? JSON.parse(saved) : [];
  });

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem('nutrivision_workouts');
    return saved ? JSON.parse(saved) : {};
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('nutrivision_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  const [fastingState, setFastingState] = useState(() => {
    const saved = localStorage.getItem('nutrivision_fasting');
    return saved ? JSON.parse(saved) : { isFasting: false, startTime: Date.now(), targetHours: 16 };
  });

  const [savedFoods, setSavedFoods] = useState(() => {
    const saved = localStorage.getItem('nutrivision_saved_foods');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nutrivision_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nutrivision_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('nutrivision_water', JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem('nutrivision_weights', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('nutrivision_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('nutrivision_gemini_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('nutrivision_fasting', JSON.stringify(fastingState));
  }, [fastingState]);

  useEffect(() => {
    localStorage.setItem('nutrivision_saved_foods', JSON.stringify(savedFoods));
  }, [savedFoods]);

  // Derived Daily Targets based on Profile & Goals
  const targets = React.useMemo(() => {
    const calculated = calculateTargets(profile);
    return {
      ...calculated,
      targetCalories: profile.customCalories || calculated.targetCalories,
      proteinGrams: profile.customProtein || calculated.proteinGrams,
      carbGrams: profile.customCarbs || calculated.carbGrams,
      fatGrams: profile.customFat || calculated.fatGrams,
      waterGoalMl: profile.waterGoalMl || 2500
    };
  }, [profile]);

  // Day calculations
  const getDaySummary = (dateKey = selectedDate) => {
    const dayMeals = meals[dateKey] || [];
    const totals = dayMeals.reduce((acc, meal) => {
      acc.calories += meal.calories || 0;
      acc.protein += meal.protein || 0;
      acc.carbs += meal.carbs || 0;
      acc.fat += meal.fat || 0;
      acc.fiber += meal.fiber || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    const dayWorkouts = workouts[dateKey] || [];
    const burnedCalories = dayWorkouts.reduce((sum, w) => sum + (parseInt(w.caloriesBurned, 10) || 0), 0);

    const remainingCalories = targets.targetCalories - totals.calories + burnedCalories;
    const remainingProtein = Math.max(0, targets.proteinGrams - totals.protein);
    const remainingCarbs = Math.max(0, targets.carbGrams - totals.carbs);
    const remainingFat = Math.max(0, targets.fatGrams - totals.fat);

    const water = waterLogs[dateKey] || 0;

    return {
      dateKey,
      meals: dayMeals,
      workouts: dayWorkouts,
      burnedCalories,
      totals,
      remainingCalories,
      remainingProtein,
      remainingCarbs,
      remainingFat,
      water,
      caloriesPercent: Math.min(100, Math.round((totals.calories / targets.targetCalories) * 100)) || 0,
      proteinPercent: Math.min(100, Math.round((totals.protein / targets.proteinGrams) * 100)) || 0,
      carbsPercent: Math.min(100, Math.round((totals.carbs / targets.carbGrams) * 100)) || 0,
      fatPercent: Math.min(100, Math.round((totals.fat / targets.fatGrams) * 100)) || 0,
      waterPercent: Math.min(100, Math.round((water / targets.waterGoalMl) * 100)) || 0
    };
  };

  // Actions
  const addMeal = (dateKey, mealData) => {
    const newMeal = {
      ...mealData,
      id: 'meal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: mealData.timestamp || Date.now()
    };

    setMeals(prev => {
      const currentList = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: [...currentList, newMeal]
      };
    });
    return newMeal;
  };

  const updateMeal = (dateKey, mealId, updatedData) => {
    if (!mealId) return;
    setMeals(prev => {
      const currentList = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: currentList.map(m => String(m.id) === String(mealId) ? { ...m, ...updatedData } : m)
      };
    });
  };

  const deleteMeal = (dateKey, mealId, itemRef) => {
    setMeals(prev => {
      const nextState = { ...prev };
      const targetDate = dateKey || selectedDate;

      // Search target date first, then fallback to any other date in case of timezone/dateKey mismatch
      const datesToSearch = nextState[targetDate]
        ? [targetDate, ...Object.keys(nextState).filter(k => k !== targetDate)]
        : Object.keys(nextState);

      for (const d of datesToSearch) {
        const list = nextState[d];
        if (!Array.isArray(list) || list.length === 0) continue;

        const initialCount = list.length;

        // Strategy 1: Match by unique ID
        let filtered = list.filter(m => {
          if (mealId && m.id && String(m.id) === String(mealId)) return false;
          if (itemRef?.id && m.id && String(m.id) === String(itemRef.id)) return false;
          return true;
        });

        // Strategy 2: Match by exact object reference
        if (filtered.length === initialCount && itemRef) {
          filtered = list.filter(m => m !== itemRef);
        }

        // Strategy 3: Match by name + calories + mealType
        if (filtered.length === initialCount) {
          const targetName = itemRef?.name || (typeof mealId === 'string' ? mealId : null);
          const targetCalories = itemRef?.calories;
          const targetMealType = itemRef?.mealType;

          if (targetName) {
            let removedOne = false;
            filtered = list.filter(m => {
              if (removedOne) return true;

              const nameMatches = (m.name || '').trim().toLowerCase() === targetName.trim().toLowerCase();
              const caloriesMatch = targetCalories !== undefined ? m.calories === targetCalories : true;
              const typeMatch = targetMealType ? m.mealType === targetMealType : true;

              if (nameMatches && caloriesMatch && typeMatch) {
                removedOne = true;
                return false;
              }
              return true;
            });
          }
        }

        if (filtered.length < initialCount) {
          nextState[d] = filtered;
          break; // successfully deleted!
        }
      }

      return nextState;
    });
  };

  const logWater = (dateKey, amountDelta) => {
    setWaterLogs(prev => {
      const current = prev[dateKey] || 0;
      const updated = Math.max(0, current + amountDelta);
      return {
        ...prev,
        [dateKey]: updated
      };
    });
  };

  const setWaterAmount = (dateKey, exactAmount) => {
    setWaterLogs(prev => ({
      ...prev,
      [dateKey]: Math.max(0, parseInt(exactAmount, 10) || 0)
    }));
  };

  const resetWater = (dateKey) => {
    setWaterLogs(prev => ({
      ...prev,
      [dateKey]: 0
    }));
  };

  const addWorkout = (dateKey, workoutData) => {
    const newWorkout = {
      ...workoutData,
      id: 'wo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now()
    };

    setWorkouts(prev => {
      const currentList = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: [...currentList, newWorkout]
      };
    });
    return newWorkout;
  };

  const deleteWorkout = (dateKey, workoutId, workoutRef) => {
    setWorkouts(prev => {
      const nextWorkouts = { ...prev };
      const targetDate = dateKey || selectedDate;
      const datesToSearch = nextWorkouts[targetDate]
        ? [targetDate, ...Object.keys(nextWorkouts).filter(k => k !== targetDate)]
        : Object.keys(nextWorkouts);

      for (const d of datesToSearch) {
        const list = nextWorkouts[d];
        if (!Array.isArray(list) || list.length === 0) continue;

        const initialCount = list.length;
        let filtered = list.filter(w => {
          if (workoutId && String(w.id) === String(workoutId)) return false;
          if (workoutRef?.id && String(w.id) === String(workoutRef.id)) return false;
          if (workoutRef && w === workoutRef) return false;
          return true;
        });

        if (filtered.length === initialCount && workoutRef) {
          let removedOne = false;
          filtered = list.filter(w => {
            if (removedOne) return true;
            if (w.title === workoutRef.title && w.caloriesBurned === workoutRef.caloriesBurned) {
              removedOne = true;
              return false;
            }
            return true;
          });
        }

        if (filtered.length < initialCount) {
          nextWorkouts[d] = filtered;
          break;
        }
      }

      return nextWorkouts;
    });
  };

  const updateWorkout = (dateKey, workoutId, updatedData) => {
    setWorkouts(prev => {
      const currentList = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: currentList.map(w => String(w.id) === String(workoutId) ? { ...w, ...updatedData } : w)
      };
    });
  };

  const logWeight = (weightKg, dateKey = selectedDate, note = '') => {
    setWeightLogs(prev => {
      const filtered = prev.filter(entry => entry.date !== dateKey);
      const newLogs = [...filtered, { date: dateKey, weight: parseFloat(weightKg), note }];
      return newLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    });
  };

  const deleteWeight = (dateKeyOrEntry) => {
    const targetDate = typeof dateKeyOrEntry === 'object' ? dateKeyOrEntry?.date : dateKeyOrEntry;
    setWeightLogs(prev => prev.filter(entry => {
      if (targetDate && entry.date === targetDate) return false;
      if (typeof dateKeyOrEntry === 'object' && entry === dateKeyOrEntry) return false;
      return true;
    }));
  };

  const updateProfile = (newProfile) => {
    setProfile(prev => ({
      ...prev,
      ...newProfile
    }));
  };

  const toggleFasting = (targetHours = 16) => {
    setFastingState(prev => {
      if (prev.isFasting) {
        return { isFasting: false, startTime: null, targetHours };
      } else {
        return { isFasting: true, startTime: Date.now(), targetHours };
      }
    });
  };

  const saveFoodItem = (foodData) => {
    setSavedFoods(prev => {
      const exists = prev.some(f => f.name.toLowerCase() === foodData.name.toLowerCase());
      if (exists) return prev;

      const newItem = {
        id: 'saved_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: foodData.name,
        calories: foodData.calories || 0,
        protein: foodData.protein || 0,
        carbs: foodData.carbs || 0,
        fat: foodData.fat || 0,
        fiber: foodData.fiber || 0,
        items: foodData.items || [],
        imageUrl: foodData.imageUrl || null,
        savedAt: Date.now()
      };
      return [...prev, newItem];
    });
  };

  const removeSavedFood = (idOrName) => {
    if (!idOrName) return;
    const targetStr = String(idOrName).toLowerCase();
    setSavedFoods(prev => prev.filter(f => {
      if (f.id && String(f.id).toLowerCase() === targetStr) return false;
      if (f.name && f.name.toLowerCase() === targetStr) return false;
      return true;
    }));
  };

  const toggleSaveFood = (foodData) => {
    if (!foodData || !foodData.name) return false;
    const nameLower = foodData.name.toLowerCase();
    const alreadySaved = savedFoods.some(f => (f.name || '').toLowerCase() === nameLower);
    
    if (alreadySaved) {
      removeSavedFood(foodData.id || foodData.name);
      return false;
    } else {
      saveFoodItem(foodData);
      return true;
    }
  };

  const isFoodSaved = (name) => {
    if (!name) return false;
    return savedFoods.some(f => (f.name || '').toLowerCase() === name.toLowerCase());
  };

  const getRecentMeals = (days = 3) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const flatMeals = Object.values(meals).flat().filter(m => m.timestamp >= cutoff);
    const unique = [];
    const seen = new Set();
    flatMeals.sort((a, b) => b.timestamp - a.timestamp);
    
    for (const m of flatMeals) {
      const nameKey = (m.name || '').toLowerCase();
      if (!seen.has(nameKey)) {
        seen.add(nameKey);
        unique.push(m);
      }
    }
    return unique;
  };

  const exportDataJSON = () => {
    const data = {
      profile,
      meals,
      waterLogs,
      weightLogs,
      savedFoods,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.meals) setMeals(parsed.meals);
      if (parsed.waterLogs) setWaterLogs(parsed.waterLogs);
      if (parsed.weightLogs) setWeightLogs(parsed.weightLogs);
      if (parsed.savedFoods) setSavedFoods(parsed.savedFoods);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  return (
    <NutritionContext.Provider
      value={{
        profile,
        targets,
        selectedDate,
        setSelectedDate,
        meals,
        waterLogs,
        weightLogs,
        apiKey,
        setApiKey,
        fastingState,
        setFastingState,
        toggleFasting,
        getDaySummary,
        addMeal,
        updateMeal,
        workouts,
        addWorkout,
        deleteWorkout,
        updateWorkout,
        logWater,
        setWaterAmount,
        resetWater,
        logWeight,
        deleteWeight,
        updateProfile,
        exportDataJSON,
        importDataJSON,
        savedFoods,
        saveFoodItem,
        removeSavedFood,
        toggleSaveFood,
        isFoodSaved,
        getRecentMeals
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}
