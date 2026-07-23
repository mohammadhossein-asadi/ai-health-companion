'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { SleepRecord } from '@/types';

export function SleepInput() {
  const addSleepRecord = useHealthStore((s) => s.addSleepRecord);
  const [formData, setFormData] = useState({
    sleepTime: '',
    wakeTime: '',
    quality: 3 as 1 | 2 | 3 | 4 | 5,
    daytimeFatigue: 3 as 1 | 2 | 3 | 4 | 5,
    awakenings: 0,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sleepDate = new Date(formData.sleepTime);
    const wakeDate = new Date(formData.wakeTime);
    const durationMinutes = Math.round((wakeDate.getTime() - sleepDate.getTime()) / 60000);

    const record: SleepRecord = {
      id: 'sleep_' + Date.now(),
      date: sleepDate.toISOString().split('T')[0],
      sleepTime: formData.sleepTime,
      wakeTime: formData.wakeTime,
      durationMinutes,
      quality: formData.quality,
      remEstimateMinutes: Math.round(durationMinutes * 0.2),
      deepEstimateMinutes: Math.round(durationMinutes * 0.25),
      awakenings: formData.awakenings,
      daytimeFatigue: formData.daytimeFatigue,
      notes: formData.notes,
    };

    addSleepRecord(record);
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
        <span>🛏️</span> Sleep Log
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Sleep Time</label>
          <input
            type="datetime-local"
            value={formData.sleepTime}
            onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Wake Time</label>
          <input
            type="datetime-local"
            value={formData.wakeTime}
            onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Sleep Quality (1-5)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setFormData({ ...formData, quality: q as 1 | 2 | 3 | 4 | 5 })}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                formData.quality === q
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Daytime Fatigue (1=None, 5=Extreme)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormData({ ...formData, daytimeFatigue: f as 1 | 2 | 3 | 4 | 5 })}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                formData.daytimeFatigue === f
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Awakenings</label>
          <input
            type="number"
            min="0"
            max="10"
            value={formData.awakenings}
            onChange={(e) => setFormData({ ...formData, awakenings: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Notes</label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional notes..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save Sleep Log'}
      </button>
    </motion.form>
  );
}
