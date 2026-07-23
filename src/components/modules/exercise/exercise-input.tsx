'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { ExerciseRecord, ExerciseType, Intensity } from '@/types';

const EXERCISE_TYPES: { value: ExerciseType; label: string }[] = [
  { value: 'running', label: '🏃 Running' },
  { value: 'walking', label: '🚶 Walking' },
  { value: 'cycling', label: '🚴 Cycling' },
  { value: 'swimming', label: '🏊 Swimming' },
  { value: 'weight_training', label: '🏋️ Weights' },
  { value: 'yoga', label: '🧘 Yoga' },
  { value: 'hiit', label: '⚡ HIIT' },
  { value: 'pilates', label: '🤸 Pilates' },
  { value: 'hiking', label: '🥾 Hiking' },
  { value: 'dancing', label: '💃 Dancing' },
  { value: 'other', label: '🏃 Other' },
];

const INTENSITY_LEVELS: { value: Intensity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'moderate', label: 'Moderate', color: 'bg-amber-500' },
  { value: 'vigorous', label: 'Vigorous', color: 'bg-orange-500' },
  { value: 'extreme', label: 'Extreme', color: 'bg-red-500' },
];

export function ExerciseInput() {
  const addExerciseRecord = useHealthStore((s) => s.addExerciseRecord);
  const [formData, setFormData] = useState({
    type: 'running' as ExerciseType,
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 30,
    intensity: 'moderate' as Intensity,
    caloriesBurned: 250,
    steps: 0,
    heartRateAvg: 0,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: ExerciseRecord = {
      id: 'ex_' + Date.now(),
      date: formData.date,
      type: formData.type,
      durationMinutes: formData.durationMinutes,
      intensity: formData.intensity,
      caloriesBurned: formData.caloriesBurned,
      steps: formData.steps || undefined,
      heartRateAvg: formData.heartRateAvg || undefined,
      notes: formData.notes,
    };

    addExerciseRecord(record);
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
        <span>🏋️</span> Exercise Log
      </h3>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Activity Type</label>
        <div className="grid grid-cols-4 gap-2">
          {EXERCISE_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, type: type.value })}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                formData.type === type.value
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {type.label}
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
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
            required
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Duration (min)</label>
          <input
            type="number"
            min="1"
            max="300"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 30 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Intensity</label>
        <div className="flex gap-2">
          {INTENSITY_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, intensity: level.value })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                formData.intensity === level.value
                  ? `${level.color} text-white`
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Calories Burned</label>
          <input
            type="number"
            min="0"
            value={formData.caloriesBurned}
            onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Steps</label>
          <input
            type="number"
            min="0"
            value={formData.steps}
            onChange={(e) => setFormData({ ...formData, steps: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Avg Heart Rate</label>
          <input
            type="number"
            min="0"
            max="220"
            value={formData.heartRateAvg}
            onChange={(e) => setFormData({ ...formData, heartRateAvg: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save Exercise Log'}
      </button>
    </motion.form>
  );
}
