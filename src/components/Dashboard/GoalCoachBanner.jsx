import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, CheckCircle } from 'lucide-react';

export function GoalCoachBanner({ summary, targets }) {
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
      return {
        icon: CheckCircle,
        color: '#34d399',
        title: 'Fat Loss On Track',
        text: `Optimal calorie pacing! Fiber is at ${totals.fiber}g. Staying in this ~${Math.abs(targets.goalConfig?.deficitKcal || 500)} kcal deficit keeps you on pace for weekly fat loss.`
      };
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
      return {
        icon: CheckCircle,
        color: '#10b981',
        title: 'Anabolic Growth Window',
        text: `Great surplus adherence! You have hit ${totals.protein}g protein, maximizing muscle protein synthesis and recovery.`
      };
    }

    return {
      icon: Sparkles,
      color: '#c084fc',
      title: 'Balanced Nutrition',
      text: `Energy intake is well distributed. Focus on whole grains, healthy fats, and adequate hydration throughout the day.`
    };
  };

  const coach = getCoachMessage();
  const Icon = coach.icon;

  return (
    <div
      className="glass-card"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 34, 52, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
        border: `1px solid ${coach.color}40`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
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
