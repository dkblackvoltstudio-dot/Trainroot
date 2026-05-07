

import { UserStats } from './types';

export const DEFAULT_USER_STATS: UserStats = {
  name: 'Alex',
  weight: 80,
  height: 180,
  age: 25,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'gain_muscle',
  targetWeight: 85,
  dailyCalorieGoal: 2800,
  dailyProteinGoal: 180,
  dailyCarbsGoal: 350,
  dailyFatGoal: 80,
  streak: 0,
};

export const COMMON_EXERCISES = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull Ups',
  'Dips',
  'Lateral Raise',
  'Bicep Curl',
  'Tricep Extension',
  'Leg Press',
  'Leg Curl',
  'Lat Pulldown',
];

export const MOCK_MEALS = [
  { name: 'Oatmeal with Blueberries', calories: 350, protein: 12, carbs: 60, fat: 8 },
  { name: 'Grilled Chicken Salad', calories: 450, protein: 45, carbs: 15, fat: 20 },
  { name: 'Protein Shake', calories: 200, protein: 30, carbs: 5, fat: 3 },
  { name: 'Beef and Broccoli Stir Fry', calories: 550, protein: 40, carbs: 40, fat: 25 },
];
