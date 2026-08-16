import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, ShieldAlert, CheckCircle, X, Clock, Droplets, Moon, Dumbbell, Leaf } from 'lucide-react';

export function GoalCoachBanner({ summary, targets }) {
  const [isVisible, setIsVisible] = useState(true);
  const [randomTipIndex, setRandomTipIndex] = useState(0);

  useEffect(() => {
    setRandomTipIndex(Math.floor(Math.random() * 5));
  }, []);

  if (!isVisible) return null;

  const { totals, remainingCalories } = summary;
  const goalCategory = targets.goalConfig?.category || 'loss';

  // Generate dynamic contextual coaching insight
  const getCoachMessage = () => {
    const proteinShortfall = targets.proteinGrams - totals.protein;

    if (goalCategory === 'loss') {
      if (remainingCalories < -150) {
        return {
          icon: ShieldAlert,
          color: '#fb7185',
          title: 'Deficit Alert',
          text: `You are ${Math.abs(remainingCalories)} kcal above your deficit goal. Prioritize high-volume veggies and lean protein for your next meal.`
        };
      }
      if (proteinShortfall > 40 && remainingCalories > 300) {
        return {
          icon: Sparkles,
          color: '#38bdf8',
          title: 'Preserve Lean Muscle',
          text: `You have ${remainingCalories} kcal left and need ${proteinShortfall}g protein. Consider Greek yogurt, egg whites, or grilled chicken to hit your target.`
        };
      }
    }

    if (goalCategory === 'gain') {
      if (remainingCalories > 600) {
        return {
          icon: TrendingUp,
          color: '#fbbf24',
          title: 'Surplus Reminder',
          text: `You need ${remainingCalories} more kcal to reach your growth surplus. Add healthy calorie-dense foods like peanut butter, oats, or a post-workout shake.`
        };
      }
      if (proteinShortfall <= 0) {
        return {
          icon: CheckCircle,
          color: '#10b981',
          title: 'Anabolic Growth Window',
          text: `Great surplus adherence! You have hit ${totals.protein}g protein, maximizing muscle protein synthesis and recovery.`
        };
      }
    }

    // New contextual triggers
    if (totals.fiber < (targets.fiberGrams || 28) * 0.5) {
      return {
        icon: Leaf,
        color: '#84cc16',
        title: 'Fiber Intake Focus',
        text: 'Fiber helps with digestion and satiety. Consider adding beans, berries, or whole grains to your next meal to boost intake.'
      };
    }

    if (summary.water < (targets.waterGoalMl || 2500) * 0.4) {
      return {
        icon: Droplets,
        color: '#06b6d4',
        title: 'Hydration Reminder',
        text: 'You are falling behind on water today. Drink a large glass of water now to stay hydrated and support metabolism.'
      };
    }

    // Additional generic tips (sleep, meal timing, pre/post workout)
    const extraTips = [
      {
        icon: Clock,
        color: '#f472b6',
        title: 'Meal Timing',
        text: 'Space your protein intake across 3-4 meals for optimal muscle protein synthesis.'
      },
      {
        icon: Moon,
        color: '#818cf8',
        title: 'Sleep & Recovery',
        text: 'Aim for 7-9 hours of sleep tonight. Proper rest is just as important as your diet for fat loss and muscle gain.'
      },
      {
        icon: Dumbbell,
        color: '#f97316',
        title: 'Workout Nutrition',
        text: 'Having some carbs and protein 1-2 hours before lifting helps maximize performance and pump.'
      },
      {
        icon: Sparkles,
        color: '#c084fc',
        title: 'Balanced Nutrition',
        text: 'Energy intake is well distributed. Focus on whole grains, healthy fats, and adequate hydration throughout the day.'
      },
      {
        icon: CheckCircle,
        color: '#34d399',
        title: 'On Track',
        text: `Optimal calorie pacing! Staying consistent keeps you on pace for your long-term goals.`
      }
    ];

    return extraTips[randomTipIndex];
  };

  const coach = getCoachMessage();
  const Icon = coach.icon;

  return (
    <div
      className="glass-card"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 34, 52, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
        border: `1px solid ${coach.color}40`,
        borderLeft: `3px solid ${coach.color}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'var(--text-muted)'
        }}
      >
        <X size={14} />
      </button>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingRight: '20px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `${coach.color}20`,
            border: `1px solid ${coach.color}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon size={20} color={coach.color} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: coach.color }}>
              AI Coach • {coach.title}
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {coach.text}
          </p>
        </div>
      </div>
    </div>
  );
}
