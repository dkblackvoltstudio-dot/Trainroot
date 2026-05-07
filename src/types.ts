

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  date: string;
  notes?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  equipmentNeeded?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre-workout';
  quantity?: string;
  isIndian?: boolean;
}

export interface UserStats {
  name: string;
  email?: string;
  photoUrl?: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  targetWeight: number;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
  streak: number;
  lastWorkoutDate?: string;
}

export interface Goal {
  startWeight: number;
  targetWeight: number;
  startDate: string; // ISO date string
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO date string
}

export interface DailyLog {
  date: string;
  workouts: Exercise[];
  meals: Meal[];
  weight?: number;
  water?: number; // Representing number of droplets/glasses
}
