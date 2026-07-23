// ============================================================
// AI Health Companion — Complete TypeScript Schema
// 10 interconnected health modules
// ============================================================

// ─── Sleep Module ───────────────────────────────────────────
export interface SleepRecord {
  id: string;
  date: string; // ISO date
  sleepTime: string; // ISO datetime
  wakeTime: string; // ISO datetime
  durationMinutes: number;
  quality: 1 | 2 | 3 | 4 | 5; // 1=very poor, 5=excellent
  remEstimateMinutes?: number;
  deepEstimateMinutes?: number;
  awakenings?: number;
  daytimeFatigue: 1 | 2 | 3 | 4 | 5; // 1=none, 5=extreme
  notes?: string;
}

export interface SleepModule {
  records: SleepRecord[];
  weeklyGoalHours: number;
  averageDuration: number;
  averageQuality: number;
  sleepScore: number; // 0-100 computed
}

// ─── Exercise Module ────────────────────────────────────────
export type ExerciseType =
  | 'running'
  | 'walking'
  | 'cycling'
  | 'swimming'
  | 'weight_training'
  | 'yoga'
  | 'hiit'
  | 'pilates'
  | 'hiking'
  | 'dancing'
  | 'other';

export type Intensity = 'low' | 'moderate' | 'vigorous' | 'extreme';

export interface ExerciseRecord {
  id: string;
  date: string;
  type: ExerciseType;
  durationMinutes: number;
  intensity: Intensity;
  caloriesBurned: number;
  steps?: number;
  heartRateAvg?: number;
  notes?: string;
}

export interface ExerciseModule {
  records: ExerciseRecord[];
  dailyStepGoal: number;
  weeklyWorkoutGoal: number; // sessions per week
  weeklyStepsTotal: number;
  exerciseScore: number; // 0-100
}

// ─── Skin Module ────────────────────────────────────────────
export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';

export type SkinConcern = 'acne' | 'redness' | 'wrinkles' | 'dark_spots' | 'dryness' | 'oiliness' | 'sensitivity' | 'pores';

export interface SkinRecord {
  id: string;
  date: string;
  skinType: SkinType;
  activeConcerns: SkinConcern[];
  routineFollowed: boolean;
  productsUsed: string[];
  notes?: string;
  climateCondition?: 'humid' | 'dry' | 'cold' | 'hot' | 'temperate';
}

export interface SkinModule {
  records: SkinRecord[];
  skinType: SkinType;
  routineAdherence: number; // percentage
  skinScore: number; // 0-100
}

// ─── Hair Module ────────────────────────────────────────────
export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';
export type ScalpType = 'oily' | 'dry' | 'normal' | 'sensitive' | 'flaky';

export interface HairRecord {
  id: string;
  date: string;
  hairType: HairType;
  scalpType: ScalpType;
  hairLossCount?: 'none' | 'mild' | 'moderate' | 'severe';
  washingFrequency: number; // times per week
  productsUsed: string[];
  notes?: string;
}

export interface HairModule {
  records: HairRecord[];
  hairType: HairType;
  scalpType: ScalpType;
  weeklyHairLossTrend: 'improving' | 'stable' | 'worsening';
  hairScore: number; // 0-100
}

// ─── Nutrition Module ───────────────────────────────────────
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MacroBreakdown {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

export interface MealRecord {
  id: string;
  date: string;
  mealType: MealType;
  mealTime: string;
  description: string;
  calories: number;
  macros: MacroBreakdown;
  rating?: 1 | 2 | 3 | 4 | 5; // healthiness rating
}

export interface NutritionModule {
  records: MealRecord[];
  dailyCalorieTarget: number;
  averageMacros: MacroBreakdown;
  mealTimingConsistency: number; // 0-100
  nutritionScore: number; // 0-100
}

// ─── Supplements Module ─────────────────────────────────────
export type SupplementFrequency = 'daily' | 'twice_daily' | 'weekly' | 'as_needed';

export interface SupplementEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: SupplementFrequency;
  timeOfDay: string;
  startDate: string;
  endDate?: string;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: string;
  taken: boolean;
  timeTaken?: string;
}

export interface SupplementsModule {
  activeSupplements: SupplementEntry[];
  logs: SupplementLog[];
  adherenceRate: number; // 0-100 percentage
  supplementScore: number; // 0-100
}

// ─── Water Module ───────────────────────────────────────────
export interface WaterLog {
  id: string;
  date: string;
  time: string;
  amountMl: number;
  type: 'water' | 'tea' | 'coffee' | 'juice' | 'other';
}

export interface WaterModule {
  logs: WaterLog[];
  dailyTargetMl: number;
  todayTotalMl: number;
  hydrationScore: number; // 0-100
}

// ─── Blood Test Module ──────────────────────────────────────
export interface Biomarker {
  name: string;
  value: number;
  unit: string;
  normalRangeMin: number;
  normalRangeMax: number;
  status: 'low' | 'normal' | 'high' | 'critical_low' | 'critical_high';
}

export interface BloodTestRecord {
  id: string;
  date: string;
  testType: string;
  biomarkers: Biomarker[];
  rawText?: string; // OCR extracted text
  notes?: string;
}

export interface BloodTestModule {
  records: BloodTestRecord[];
  latestTestDate?: string;
  criticalFlags: string[];
  bloodTestScore: number; // 0-100
}

// ─── BMI Module ─────────────────────────────────────────────
export interface BMIRecord {
  id: string;
  date: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
}

export interface BMIModule {
  records: BMIRecord[];
  currentHeight: number;
  currentWeight: number;
  currentBMI: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
  bmiTrend: 'improving' | 'stable' | 'worsening';
}

// ─── Calories Module ────────────────────────────────────────
export interface CalorieRecord {
  id: string;
  date: string;
  bmr: number;
  activeCalories: number;
  consumedCalories: number;
  netBalance: number; // consumed - (bmr + active)
}

export interface CaloriesModule {
  records: CalorieRecord[];
  bmr: number;
  tdee: number; // total daily energy expenditure
  todayNetBalance: number;
  weeklyAverageBalance: number;
  calorieScore: number; // 0-100
}

// ─── Global User State ──────────────────────────────────────
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIInsight {
  id: string;
  generatedAt: string;
  healthScore: number; // 1-100
  criticalAlerts: CriticalAlert[];
  moduleInsights: Record<string, ModuleInsight>;
  weeklyActionPlan: ActionPlanItem[];
  crossModuleCorrelations: CrossCorrelation[];
}

export interface CriticalAlert {
  id?: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  relatedModules: string[];
  recommendation: string;
}

export interface ModuleInsight {
  moduleName?: string;
  score: number;
  trend: 'improving' | 'stable' | 'worsening';
  summary: string;
  recommendations: string[];
}

export interface ActionPlanItem {
  id?: string;
  priority: 'high' | 'medium' | 'low';
  module: string;
  action: string;
  deadline?: string;
  completed?: boolean;
}

export interface CrossCorrelation {
  modules: string[];
  finding: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation: string;
}

// ─── Complete Application State ─────────────────────────────
export interface HealthAppState {
  profile: UserProfile;
  sleep: SleepModule;
  exercise: ExerciseModule;
  skin: SkinModule;
  hair: HairModule;
  nutrition: NutritionModule;
  supplements: SupplementsModule;
  water: WaterModule;
  bloodTest: BloodTestModule;
  bmi: BMIModule;
  calories: CaloriesModule;
  lastAIInsight?: AIInsight;
  language: 'en' | 'fa';
  theme: 'light' | 'dark';
}

// ─── API Response Types ─────────────────────────────────────
export interface AnalyzeHealthResponse {
  success: boolean;
  healthScore: number;
  criticalAlerts: CriticalAlert[];
  moduleInsights: Record<string, ModuleInsight>;
  weeklyActionPlan: ActionPlanItem[];
  crossModuleCorrelations: CrossCorrelation[];
  rawAIResponse?: string;
  error?: string;
}

// ─── Module Metadata ────────────────────────────────────────
export interface ModuleMeta {
  key: string;
  nameEn: string;
  nameFa: string;
  icon: string;
  color: string;
  description: string;
}
