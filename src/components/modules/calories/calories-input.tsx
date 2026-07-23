'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { CalorieRecord } from '@/types';

function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

function getActivityMultiplier(activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return multipliers[activityLevel] || 1.2;
}

function CalorieGauge({ consumed, target }: { consumed: number; target: number }) {
  const percentage = Math.min((consumed / target) * 100, 120);
  const color = consumed > target ? '#ef4444' : consumed > target * 0.9 ? '#f59e0b' : '#10b981';

  return (
    <div className="relative w-full h-6 bg-slate-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 0.5 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-bold drop-shadow">
          {consumed} / {target} kcal
        </span>
      </div>
    </div>
  );
}

export function CaloriesInput() {
  const { addCalorieRecord, calories: calModule, profile, bmi } = useHealthStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    consumedCalories: 0,
    activeCalories: 0,
    activityLevel: 'moderate' as string,
  });
  const [submitted, setSubmitted] = useState(false);

  const bmr = useMemo(
    () => calculateBMR(bmi.currentWeight, bmi.currentHeight, profile.age, profile.gender),
    [bmi.currentWeight, bmi.currentHeight, profile.age, profile.gender]
  );

  const tdee = useMemo(() => Math.round(bmr * getActivityMultiplier(formData.activityLevel)), [bmr, formData.activityLevel]);
  const netBalance = useMemo(() => formData.consumedCalories - tdee - formData.activeCalories, [formData.consumedCalories, tdee, formData.activeCalories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: CalorieRecord = {
      id: 'cal_' + Date.now(),
      date: formData.date,
      bmr,
      activeCalories: formData.activeCalories,
      consumedCalories: formData.consumedCalories,
      netBalance,
    };

    addCalorieRecord(record);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const getGoalAdvice = () => {
    if (netBalance < -500) return { text: 'Large deficit — may be too aggressive', color: 'text-blue-400' };
    if (netBalance < -200) return { text: 'Moderate deficit — good for gradual loss', color: 'text-emerald-400' };
    if (netBalance < 200) return { text: 'Near maintenance — good for weight stability', color: 'text-emerald-400' };
    if (netBalance < 500) return { text: 'Moderate surplus — good for muscle gain', color: 'text-amber-400' };
    return { text: 'Large surplus — may lead to fat gain', color: 'text-red-400' };
  };

  const goalAdvice = getGoalAdvice();

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4"
    >
      <h3 className="text-white font-semibold flex items-center gap-2">
        <span>🔥</span> Calorie Tracker
      </h3>

      {/* BMR / TDEE Summary */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-slate-900/50 rounded-lg p-3">
          <span className="text-amber-400 text-xl font-bold block">{bmr}</span>
          <span className="text-slate-400 text-xs">BMR (kcal)</span>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <span className="text-orange-400 text-xl font-bold block">{tdee}</span>
          <span className="text-slate-400 text-xs">TDEE (kcal)</span>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3">
          <span className={`text-xl font-bold block ${netBalance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {netBalance > 0 ? '+' : ''}{netBalance}
          </span>
          <span className="text-slate-400 text-xs">Net Balance</span>
        </div>
      </div>

      {/* Calorie Gauge */}
      <div>
        <label className="text-slate-400 text-xs block mb-1">Calorie Gauge (consumed vs TDEE)</label>
        <CalorieGauge consumed={formData.consumedCalories} target={tdee} />
      </div>

      {/* Goal Advice */}
      <div className={`text-center text-xs font-medium py-1.5 rounded ${goalAdvice.color}`}>
        {goalAdvice.text}
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Activity Level (for TDEE calculation)</label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { value: 'sedentary', label: 'Sedentary', icon: '🪑' },
            { value: 'light', label: 'Light', icon: '🚶' },
            { value: 'moderate', label: 'Moderate', icon: '🏃' },
            { value: 'active', label: 'Active', icon: '💪' },
            { value: 'very_active', label: 'Very Active', icon: '🏋️' },
          ].map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, activityLevel: level.value })}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                formData.activityLevel === level.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              <span className="block text-base">{level.icon}</span>
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Consumed (kcal)</label>
          <input
            type="number"
            min="0"
            max="10000"
            value={formData.consumedCalories}
            onChange={(e) => setFormData({ ...formData, consumedCalories: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            placeholder="Total calories eaten"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Active Burned (kcal)</label>
          <input
            type="number"
            min="0"
            max="5000"
            value={formData.activeCalories}
            onChange={(e) => setFormData({ ...formData, activeCalories: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            placeholder="Calories from exercise"
          />
        </div>
      </div>

      {/* Quick Consumed Presets */}
      <div>
        <label className="text-slate-400 text-xs block mb-1">Quick Add Consumed</label>
        <div className="flex gap-2">
          {[500, 800, 1200, 1500, 1800, 2200].map((cal) => (
            <button
              key={cal}
              type="button"
              onClick={() => setFormData({ ...formData, consumedCalories: cal })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                formData.consumedCalories === cal
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {cal}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Active Burn Presets */}
      <div>
        <label className="text-slate-400 text-xs block mb-1">Quick Add Active Burned</label>
        <div className="flex gap-2">
          {[0, 150, 300, 500, 700, 1000].map((cal) => (
            <button
              key={cal}
              type="button"
              onClick={() => setFormData({ ...formData, activeCalories: cal })}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                formData.activeCalories === cal
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {cal}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Reference */}
      <div className="bg-slate-900/50 rounded-lg p-3">
        <p className="text-slate-400 text-xs font-medium mb-1">How it&apos;s calculated:</p>
        <div className="text-xs text-slate-500 space-y-0.5">
          <p><span className="text-amber-400">BMR</span> = Mifflin-St Jeor ({profile.gender === 'male' ? 'male' : 'female'} formula)</p>
          <p><span className="text-orange-400">TDEE</span> = BMR × Activity Multiplier ({formData.activityLevel})</p>
          <p><span className="text-teal-400">Net</span> = Consumed - TDEE - Active Burned</p>
        </div>
      </div>

      {/* Recent History */}
      {calModule.records.length > 0 && (
        <div>
          <label className="text-slate-400 text-xs block mb-1">Recent History</label>
          <div className="space-y-1">
            {calModule.records.slice(-3).reverse().map((rec) => (
              <div key={rec.id} className="flex items-center justify-between bg-slate-900/50 rounded px-3 py-1.5 text-xs">
                <span className="text-slate-400">{rec.date}</span>
                <span className="text-white">{rec.consumedCalories} in</span>
                <span className="text-white">{rec.activeCalories} burn</span>
                <span className={`font-medium ${rec.netBalance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {rec.netBalance > 0 ? '+' : ''}{rec.netBalance}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save Calorie Record'}
      </button>
    </motion.form>
  );
}
