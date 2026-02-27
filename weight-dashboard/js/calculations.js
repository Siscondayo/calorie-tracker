const HEIGHT = 1.60;
const START_WEIGHT = 78;
const TARGET_WEIGHT = 60;

export function calculateBMI(weight) {
  return (weight / (HEIGHT * HEIGHT)).toFixed(1);
}

export function bmiStatus(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calculateProgress(weight) {
  return ((START_WEIGHT - weight) / (START_WEIGHT - TARGET_WEIGHT)) * 100;
}

export function averageCalories(records) {
  const last7 = records.slice(-7);

  if (last7.length === 0) return 0;

  return (
    last7.reduce((sum, r) => sum + r.calories, 0) / last7.length
  ).toFixed(0);
}

export function calorieStreak(records, target = 1550) {
  let streak = 0;

  for (let i = records.length - 1; i >= 0; i--) {
    if (records[i].calories <= target) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function weeklyTrend(records) {
  if (records.length < 7) return "Not enough data";

  const last7 = records.slice(-7);
  const first = last7[0].weight;
  const last = last7[last7.length - 1].weight;

  const diff = (first - last).toFixed(1);

  if (diff > 0) return `↓ Lost ${diff} kg this week`;
  if (diff < 0) return `↑ Gained ${Math.abs(diff)} kg`;
  return "No change";
}