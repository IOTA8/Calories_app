/**
 * Evidence-based nutrition science calculations for:
 * - Weight Loss (Mild Cut, Moderate Cut, Aggressive Cut)
 * - Muscle Gain (Lean Bulk, Growth Surplus)
 * - Maintenance & Body Recomposition
 */

export const GOAL_TYPES = {
  WEIGHT_LOSS_MILD: {
    id: 'loss_mild',
    label: 'Mild Fat Loss',
    category: 'loss',
    deficitKcal: -300,
    weeklyKgChange: -0.3,
    proteinPerKg: 1.8, // g/kg of bodyweight to preserve muscle
    fatPercent: 0.25,
    description: 'Gentle, highly sustainable calorie deficit. Ideal for gradual fat loss without energy dips.'
  },
  WEIGHT_LOSS_MODERATE: {
    id: 'loss_moderate',
    label: 'Moderate Fat Loss (Recommended)',
    category: 'loss',
    deficitKcal: -500,
    weeklyKgChange: -0.5,
    proteinPerKg: 2.0, // higher protein to preserve lean mass
    fatPercent: 0.25,
    description: 'Gold standard fat loss pace (~0.5 kg / 1.1 lbs per week) maximizing fat oxidation.'
  },
  WEIGHT_LOSS_AGGRESSIVE: {
    id: 'loss_aggressive',
    label: 'Aggressive Cut',
    category: 'loss',
    deficitKcal: -750,
    weeklyKgChange: -0.75,
    proteinPerKg: 2.3, // maximum protein to prevent muscle breakdown
    fatPercent: 0.22,
    description: 'Rapid cut for experienced athletes. Requires strict high-protein focus.'
  },
  MAINTENANCE: {
    id: 'maintenance',
    label: 'Maintain Weight & Health',
    category: 'maintain',
    deficitKcal: 0,
    weeklyKgChange: 0,
    proteinPerKg: 1.6,
    fatPercent: 0.28,
    description: 'Isocaloric energy balance for weight stability, metabolic health, and performance.'
  },
  BODY_RECOMP: {
    id: 'recomp',
    label: 'Body Recomposition',
    category: 'recomp',
    deficitKcal: -100,
    weeklyKgChange: -0.1,
    proteinPerKg: 2.2, // high protein to build muscle while losing fat simultaneously
    fatPercent: 0.25,
    description: 'Build muscle and drop body fat simultaneously at near-maintenance calories.'
  },
  WEIGHT_GAIN_LEAN: {
    id: 'gain_lean',
    label: 'Lean Muscle Bulk (Clean Bulk)',
    category: 'gain',
    deficitKcal: 250,
    weeklyKgChange: 0.25,
    proteinPerKg: 2.0, // optimal for Muscle Protein Synthesis (MPS)
    fatPercent: 0.25,
    description: 'Slight surplus designed to maximize hypertrophy while keeping fat gain negligible.'
  },
  WEIGHT_GAIN_GROWTH: {
    id: 'gain_growth',
    label: 'Growth Surplus (Fast Mass)',
    category: 'gain',
    deficitKcal: 500,
    weeklyKgChange: 0.5,
    proteinPerKg: 1.8,
    fatPercent: 0.28,
    description: 'Higher calorie intake for high-activity athletes or hardgainers struggling to gain.'
  }
};

export const ACTIVITY_MULTIPLIERS = {
  sedentary: { label: 'Sedentary (Desk job, minimal exercise)', multiplier: 1.2 },
  light: { label: 'Lightly Active (1-3 days exercise/week)', multiplier: 1.375 },
  moderate: { label: 'Moderately Active (3-5 days exercise/week)', multiplier: 1.55 },
  very_active: { label: 'Very Active (6-7 days heavy workout/week)', multiplier: 1.725 },
  extra_active: { label: 'Extra Active (Physical job + daily training)', multiplier: 1.9 }
};

/**
 * Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export function calculateBMR({ gender, weightKg, heightCm, ageYears }) {
  const w = parseFloat(weightKg) || 70;
  const h = parseFloat(heightCm) || 175;
  const a = parseFloat(ageYears) || 28;

  if (gender === 'female') {
    return Math.round(10 * w + 6.25 * h - 5 * a - 161);
  }
  // Default to male
  return Math.round(10 * w + 6.25 * h - 5 * a + 5);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) and Target Calories & Macros
 */
export function calculateTargets(profile) {
  const bmr = calculateBMR(profile);
  const activityKey = profile.activityLevel || 'moderate';
  const activity = ACTIVITY_MULTIPLIERS[activityKey] || ACTIVITY_MULTIPLIERS.moderate;
  const tdee = Math.round(bmr * activity.multiplier);

  const goalKey = profile.goal || 'loss_moderate';
  const goalConfig = Object.values(GOAL_TYPES).find(g => g.id === goalKey) || GOAL_TYPES.WEIGHT_LOSS_MODERATE;

  // Calorie target with safe floor (min 1200 kcal for female, 1500 for male)
  const rawTargetCalories = tdee + goalConfig.deficitKcal;
  const minSafeCalories = profile.gender === 'female' ? 1200 : 1500;
  const targetCalories = Math.max(minSafeCalories, rawTargetCalories);

  // Macro calculation:
  // 1. Protein based on bodyweight (g/kg)
  const weightKg = parseFloat(profile.weightKg) || 70;
  const proteinGrams = Math.round(weightKg * goalConfig.proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // 2. Fat based on percentage of total calories
  const fatCalories = targetCalories * goalConfig.fatPercent;
  const fatGrams = Math.round(fatCalories / 9);

  // 3. Remaining calories allocated to Carbohydrates
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbGrams = Math.round(remainingCalories / 4);

  // 4. Fiber goal (typically 14g per 1000 kcal)
  const fiberGrams = Math.round((targetCalories / 1000) * 14);

  return {
    bmr,
    tdee,
    targetCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    fiberGrams,
    goalConfig
  };
}

/**
 * Calculates Exponential Moving Average (EMA) for weight logs to filter water fluctuations
 */
export function calculateWeightEMA(weightLogs, alpha = 0.3) {
  if (!weightLogs || weightLogs.length === 0) return [];
  
  // Sort by date ascending
  const sorted = [...weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
  let ema = sorted[0].weight;
  
  return sorted.map((entry, index) => {
    if (index === 0) {
      ema = entry.weight;
    } else {
      ema = alpha * entry.weight + (1 - alpha) * ema;
    }
    return {
      ...entry,
      trendWeight: parseFloat(ema.toFixed(2))
    };
  });
}

/**
 * Calculates estimated target date based on current weight, goal weight, and weekly delta
 */
export function calculateGoalETA(currentWeight, targetWeight, weeklyDeltaKg) {
  const diff = Math.abs(currentWeight - targetWeight);
  if (diff < 0.2 || Math.abs(weeklyDeltaKg) < 0.05) return 'Goal Reached!';
  
  const weeksNeeded = diff / Math.abs(weeklyDeltaKg);
  const daysNeeded = Math.round(weeksNeeded * 7);
  
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysNeeded);
  
  return {
    daysNeeded,
    weeksNeeded: parseFloat(weeksNeeded.toFixed(1)),
    estimatedDate: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}
