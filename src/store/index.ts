import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  HealthAppState,
  SleepRecord,
  ExerciseRecord,
  MealRecord,
  WaterLog,
  BloodTestRecord,
  BMIRecord,
  CalorieRecord,
  SupplementEntry,
  SupplementLog,
  SkinRecord,
  HairRecord,
  AIInsight,
} from '@/types';

const STABLE_ID = 'user_local_default';
const STABLE_ISO = '2026-01-01T00:00:00.000Z';

const initialState: HealthAppState = {
  profile: {
    id: STABLE_ID,
    name: '',
    age: 30,
    gender: 'male',
    dateOfBirth: '',
    createdAt: STABLE_ISO,
    updatedAt: STABLE_ISO,
  },
  sleep: {
    records: [],
    weeklyGoalHours: 8,
    averageDuration: 0,
    averageQuality: 0,
    sleepScore: 50,
  },
  exercise: {
    records: [],
    dailyStepGoal: 10000,
    weeklyWorkoutGoal: 5,
    weeklyStepsTotal: 0,
    exerciseScore: 50,
  },
  skin: {
    records: [],
    skinType: 'normal',
    routineAdherence: 0,
    skinScore: 50,
  },
  hair: {
    records: [],
    hairType: 'straight',
    scalpType: 'normal',
    weeklyHairLossTrend: 'stable',
    hairScore: 50,
  },
  nutrition: {
    records: [],
    dailyCalorieTarget: 2000,
    averageMacros: { proteinGrams: 0, carbsGrams: 0, fatGrams: 0, fiberGrams: 0 },
    mealTimingConsistency: 0,
    nutritionScore: 50,
  },
  supplements: {
    activeSupplements: [],
    logs: [],
    adherenceRate: 0,
    supplementScore: 50,
  },
  water: {
    logs: [],
    dailyTargetMl: 2500,
    todayTotalMl: 0,
    hydrationScore: 50,
  },
  bloodTest: {
    records: [],
    criticalFlags: [],
    bloodTestScore: 50,
  },
  bmi: {
    records: [],
    currentHeight: 170,
    currentWeight: 70,
    currentBMI: 24.2,
    bmiCategory: 'normal',
    bmiTrend: 'stable',
  },
  calories: {
    records: [],
    bmr: 1600,
    tdee: 2200,
    todayNetBalance: 0,
    weeklyAverageBalance: 0,
    calorieScore: 50,
  },
  language: 'en',
  theme: 'light',
};

interface HealthStore extends HealthAppState {
  // Sleep
  addSleepRecord: (record: SleepRecord) => void;
  // Exercise
  addExerciseRecord: (record: ExerciseRecord) => void;
  // Skin
  addSkinRecord: (record: SkinRecord) => void;
  // Hair
  addHairRecord: (record: HairRecord) => void;
  // Nutrition
  addMealRecord: (record: MealRecord) => void;
  // Supplements
  addSupplement: (supplement: SupplementEntry) => void;
  addSupplementLog: (log: SupplementLog) => void;
  // Water
  addWaterLog: (log: WaterLog) => void;
  // Blood Test
  addBloodTestRecord: (record: BloodTestRecord) => void;
  // BMI
  addBMIRecord: (record: BMIRecord) => void;
  // Calories
  addCalorieRecord: (record: CalorieRecord) => void;
  // AI Insight
  setLastAIInsight: (insight: AIInsight) => void;
  // Settings
  setLanguage: (lang: 'en' | 'fa') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  updateProfile: (updates: Partial<HealthAppState['profile']>) => void;
  // Data loaders
  loadSampleData: () => void;
  // Database sync
  loadFromDB: () => Promise<void>;
  saveToDB: () => Promise<void>;
  syncPending: boolean;
}

// Debounced save to DB — only fires when authenticated
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let authAvailable = false;

export function setAuthAvailable(val: boolean) {
  authAvailable = val;
}

function debouncedSave() {
  if (!authAvailable) return; // skip save when not signed in
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const state = useHealthStore.getState();
      await fetch('/api/health-data', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sleep: state.sleep,
          exercise: state.exercise,
          skin: state.skin,
          hair: state.hair,
          nutrition: state.nutrition,
          supplements: state.supplements,
          water: state.water,
          bloodTest: state.bloodTest,
          bmi: state.bmi,
          calories: state.calories,
          lastInsight: state.lastAIInsight || {},
          profile: state.profile,
          settings: {
            language: state.language,
            theme: state.theme,
            sleepGoalHours: state.sleep.weeklyGoalHours,
            exerciseStepGoal: state.exercise.dailyStepGoal,
            exerciseWorkoutGoal: state.exercise.weeklyWorkoutGoal,
            waterDailyTargetMl: state.water.dailyTargetMl,
            nutritionCalorieTarget: state.nutrition.dailyCalorieTarget,
            dailyCalorieTarget: state.nutrition.dailyCalorieTarget,
          },
        }),
      });
    } catch (err) {
      console.error('Failed to save to DB:', err);
    }
  }, 1000);
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      syncPending: false,

      addSleepRecord: (record) => {
        set((state) => ({
          sleep: { ...state.sleep, records: [...state.sleep.records, record] },
        }));
        debouncedSave();
      },

      addExerciseRecord: (record) => {
        set((state) => ({
          exercise: {
            ...state.exercise,
            records: [...state.exercise.records, record],
            weeklyStepsTotal: state.exercise.weeklyStepsTotal + (record.steps || 0),
          },
        }));
        debouncedSave();
      },

      addSkinRecord: (record) => {
        set((state) => ({
          skin: {
            ...state.skin,
            records: [...state.skin.records, record],
            skinType: record.skinType,
          },
        }));
        debouncedSave();
      },

      addHairRecord: (record) => {
        set((state) => ({
          hair: {
            ...state.hair,
            records: [...state.hair.records, record],
            hairType: record.hairType,
            scalpType: record.scalpType,
          },
        }));
        debouncedSave();
      },

      addMealRecord: (record) => {
        set((state) => ({
          nutrition: {
            ...state.nutrition,
            records: [...state.nutrition.records, record],
          },
        }));
        debouncedSave();
      },

      addSupplement: (supplement) => {
        set((state) => ({
          supplements: {
            ...state.supplements,
            activeSupplements: [...state.supplements.activeSupplements, supplement],
          },
        }));
        debouncedSave();
      },

      addSupplementLog: (log) => {
        set((state) => ({
          supplements: {
            ...state.supplements,
            logs: [...state.supplements.logs, log],
          },
        }));
        debouncedSave();
      },

      addWaterLog: (log) => {
        set((state) => ({
          water: {
            ...state.water,
            logs: [...state.water.logs, log],
            todayTotalMl: state.water.todayTotalMl + log.amountMl,
          },
        }));
        debouncedSave();
      },

      addBloodTestRecord: (record) => {
        set((state) => ({
          bloodTest: {
            ...state.bloodTest,
            records: [...state.bloodTest.records, record],
            latestTestDate: record.date,
          },
        }));
        debouncedSave();
      },

      addBMIRecord: (record) => {
        set((state) => ({
          bmi: {
            ...state.bmi,
            records: [...state.bmi.records, record],
            currentHeight: record.heightCm,
            currentWeight: record.weightKg,
            currentBMI: record.bmi,
            bmiCategory: record.category,
          },
        }));
        debouncedSave();
      },

      addCalorieRecord: (record) => {
        set((state) => ({
          calories: {
            ...state.calories,
            records: [...state.calories.records, record],
          },
        }));
        debouncedSave();
      },

      setLastAIInsight: (insight) => {
        set({ lastAIInsight: insight });
        debouncedSave();
      },

      setLanguage: (lang) => {
        set({ language: lang });
        debouncedSave();
      },

      setTheme: (theme) => {
        set({ theme });
        debouncedSave();
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
        debouncedSave();
      },

      loadSampleData: () => {
        const today = new Date();
        const daysAgo = (n: number) => {
          const d = new Date(today);
          d.setDate(d.getDate() - n);
          return d.toISOString().split('T')[0];
        };

        set({
          profile: {
            id: 'user_sample',
            name: 'Demo User',
            age: 28,
            gender: 'male',
            dateOfBirth: '1998-05-15',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          sleep: {
            records: [
              { id: 's1', date: daysAgo(0), sleepTime: `${daysAgo(0)}T23:15:00`, wakeTime: `${daysAgo(0)}T07:00:00`, durationMinutes: 465, quality: 4, remEstimateMinutes: 90, deepEstimateMinutes: 120, awakenings: 1, daytimeFatigue: 2 },
              { id: 's2', date: daysAgo(1), sleepTime: `${daysAgo(1)}T00:30:00`, wakeTime: `${daysAgo(1)}T06:45:00`, durationMinutes: 375, quality: 2, remEstimateMinutes: 60, deepEstimateMinutes: 80, awakenings: 3, daytimeFatigue: 4 },
              { id: 's3', date: daysAgo(2), sleepTime: `${daysAgo(2)}T22:45:00`, wakeTime: `${daysAgo(2)}T06:30:00`, durationMinutes: 465, quality: 4, remEstimateMinutes: 95, deepEstimateMinutes: 130, awakenings: 0, daytimeFatigue: 1 },
            ],
            weeklyGoalHours: 8,
            averageDuration: 435,
            averageQuality: 3.3,
            sleepScore: 68,
          },
          exercise: {
            records: [
              { id: 'e1', date: daysAgo(0), type: 'running', durationMinutes: 35, intensity: 'vigorous', caloriesBurned: 420, steps: 0, heartRateAvg: 155 },
              { id: 'e2', date: daysAgo(1), type: 'weight_training', durationMinutes: 50, intensity: 'moderate', caloriesBurned: 300, steps: 0 },
            ],
            dailyStepGoal: 10000,
            weeklyWorkoutGoal: 5,
            weeklyStepsTotal: 28500,
            exerciseScore: 72,
          },
          skin: {
            records: [
              { id: 'sk1', date: daysAgo(0), skinType: 'combination', activeConcerns: ['acne', 'oiliness'], routineFollowed: true, productsUsed: ['Cleanser', 'Moisturizer', 'SPF'], climateCondition: 'humid' },
            ],
            skinType: 'combination',
            routineAdherence: 85,
            skinScore: 70,
          },
          hair: {
            records: [
              { id: 'h1', date: daysAgo(0), hairType: 'wavy', scalpType: 'oily', hairLossCount: 'mild', washingFrequency: 3, productsUsed: ['Shampoo', 'Conditioner'] },
            ],
            hairType: 'wavy',
            scalpType: 'oily',
            weeklyHairLossTrend: 'stable',
            hairScore: 65,
          },
          nutrition: {
            records: [
              { id: 'n1', date: daysAgo(0), mealType: 'breakfast', mealTime: '08:00', description: 'Oatmeal with berries', calories: 350, macros: { proteinGrams: 12, carbsGrams: 55, fatGrams: 10, fiberGrams: 8 }, rating: 4 },
              { id: 'n2', date: daysAgo(0), mealType: 'lunch', mealTime: '13:00', description: 'Grilled chicken salad', calories: 520, macros: { proteinGrams: 35, carbsGrams: 25, fatGrams: 28, fiberGrams: 6 }, rating: 5 },
            ],
            dailyCalorieTarget: 2200,
            averageMacros: { proteinGrams: 87, carbsGrams: 130, fatGrams: 60, fiberGrams: 21 },
            mealTimingConsistency: 80,
            nutritionScore: 78,
          },
          supplements: {
            activeSupplements: [
              { id: 'sup1', name: 'Vitamin D3', dosage: '2000 IU', frequency: 'daily', timeOfDay: 'morning', startDate: daysAgo(30) },
              { id: 'sup2', name: 'Omega-3', dosage: '1000mg', frequency: 'daily', timeOfDay: 'morning', startDate: daysAgo(60) },
            ],
            logs: [],
            adherenceRate: 83,
            supplementScore: 75,
          },
          water: {
            logs: [
              { id: 'w1', date: daysAgo(0), time: '07:30', amountMl: 500, type: 'water' },
              { id: 'w2', date: daysAgo(0), time: '10:00', amountMl: 350, type: 'water' },
            ],
            dailyTargetMl: 2500,
            todayTotalMl: 1650,
            hydrationScore: 66,
          },
          bloodTest: {
            records: [
              {
                id: 'bt1', date: daysAgo(14), testType: 'Complete Blood Panel',
                biomarkers: [
                  { name: 'Vitamin D', value: 22, unit: 'ng/mL', normalRangeMin: 30, normalRangeMax: 100, status: 'low' },
                  { name: 'Ferritin', value: 25, unit: 'ng/mL', normalRangeMin: 30, normalRangeMax: 400, status: 'low' },
                  { name: 'Cholesterol', value: 210, unit: 'mg/dL', normalRangeMin: 0, normalRangeMax: 200, status: 'high' },
                  { name: 'TSH', value: 2.5, unit: 'mIU/L', normalRangeMin: 0.4, normalRangeMax: 4.0, status: 'normal' },
                  { name: 'Glucose', value: 95, unit: 'mg/dL', normalRangeMin: 70, normalRangeMax: 100, status: 'normal' },
                ],
              },
            ],
            latestTestDate: daysAgo(14),
            criticalFlags: ['Vitamin D Low', 'Ferritin Low', 'Cholesterol High'],
            bloodTestScore: 55,
          },
          bmi: {
            records: [
              { id: 'bmi1', date: daysAgo(0), heightCm: 175, weightKg: 74, bmi: 24.2, category: 'normal' },
            ],
            currentHeight: 175,
            currentWeight: 74,
            currentBMI: 24.2,
            bmiCategory: 'normal',
            bmiTrend: 'improving',
          },
          calories: {
            records: [
              { id: 'c1', date: daysAgo(0), bmr: 1720, activeCalories: 420, consumedCalories: 1470, netBalance: -670 },
            ],
            bmr: 1720,
            tdee: 2350,
            todayNetBalance: -670,
            weeklyAverageBalance: -420,
            calorieScore: 72,
          },
          language: 'en',
          theme: 'light',
        });
        debouncedSave();
      },

      loadFromDB: async () => {
        set({ syncPending: true });
        try {
          const res = await fetch('/api/health-data', { credentials: 'include' });
          if (!res.ok) return;
          const data = await res.json();

          // Deep-merge each module so nested arrays/objects always exist
          const merge = <T>(partial: any, defaults: T): T =>
            partial ? { ...defaults, ...partial } : defaults;

          set({
            sleep: merge(data.sleep, initialState.sleep),
            exercise: merge(data.exercise, initialState.exercise),
            skin: merge(data.skin, initialState.skin),
            hair: merge(data.hair, initialState.hair),
            nutrition: merge(data.nutrition, initialState.nutrition),
            supplements: merge(data.supplements, initialState.supplements),
            water: merge(data.water, initialState.water),
            bloodTest: merge(data.bloodTest, initialState.bloodTest),
            bmi: merge(data.bmi, initialState.bmi),
            calories: merge(data.calories, initialState.calories),
            lastAIInsight: data.lastInsight?.id ? data.lastInsight : undefined,
            profile: {
              ...initialState.profile,
              ...(data.profile || {}),
            },
            language: data.settings?.language || 'en',
            theme: data.settings?.theme || 'light',
            syncPending: false,
          });
        } catch (err) {
          console.error('Failed to load from DB:', err);
          set({ syncPending: false });
        }
      },

      saveToDB: async () => {
        debouncedSave();
      },
    }),
    {
      name: 'ai-health-companion-storage',
    }
  )
);
