'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { MealRecord, MealType } from '@/types';

const MEAL_TYPES: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: '☀️' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'snack', label: 'Snack', icon: '🍿' },
];

export function NutritionInput() {
  const addMealRecord = useHealthStore((s) => s.addMealRecord);
  const [formData, setFormData] = useState({
    mealType: 'breakfast' as MealType,
    date: new Date().toISOString().split('T')[0],
    mealTime: new Date().toTimeString().slice(0, 5),
    description: '',
    calories: 300,
    proteinGrams: 20,
    carbsGrams: 40,
    fatGrams: 10,
    fiberGrams: 5,
    rating: 3 as 1 | 2 | 3 | 4 | 5,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: MealRecord = {
      id: 'meal_' + Date.now(),
      date: formData.date,
      mealType: formData.mealType,
      mealTime: formData.mealTime,
      description: formData.description,
      calories: formData.calories,
      macros: {
        proteinGrams: formData.proteinGrams,
        carbsGrams: formData.carbsGrams,
        fatGrams: formData.fatGrams,
        fiberGrams: formData.fiberGrams,
      },
      rating: formData.rating,
    };

    addMealRecord(record);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4"
    >
      <h3 className="text-white font-semibold flex items-center gap-2">
        <span>🍎</span> Nutrition Log
      </h3>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Meal Type</label>
        <div className="grid grid-cols-4 gap-2">
          {MEAL_TYPES.map((meal) => (
            <button
              key={meal.value}
              type="button"
              onClick={() => setFormData({ ...formData, mealType: meal.value })}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                formData.mealType === meal.value
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {meal.icon} {meal.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            required
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Time</label>
          <input
            type="time"
            value={formData.mealTime}
            onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">What did you eat?</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g., Grilled chicken with rice and vegetables"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Calories (kcal)</label>
          <input
            type="number"
            min="0"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Protein (g)</label>
          <input
            type="number"
            min="0"
            value={formData.proteinGrams}
            onChange={(e) => setFormData({ ...formData, proteinGrams: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Carbs (g)</label>
          <input
            type="number"
            min="0"
            value={formData.carbsGrams}
            onChange={(e) => setFormData({ ...formData, carbsGrams: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Fat (g)</label>
          <input
            type="number"
            min="0"
            value={formData.fatGrams}
            onChange={(e) => setFormData({ ...formData, fatGrams: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Healthiness Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFormData({ ...formData, rating: r as 1 | 2 | 3 | 4 | 5 })}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                formData.rating === r
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save Meal'}
      </button>
    </motion.form>
  );
}
