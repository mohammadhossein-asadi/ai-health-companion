'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { BMIRecord } from '@/types';

function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

function getBMICategory(bmi: number): { label: string; color: string; bg: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-500/10' };
  if (bmi < 25) return { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400', bg: 'bg-amber-500/10' };
  return { label: 'Obese', color: 'text-red-400', bg: 'bg-red-500/10' };
}

function BMIGauge({ bmi }: { bmi: number }) {
  const circumference = 2 * Math.PI * 70;
  const normalized = Math.min(Math.max((bmi - 15) / 25, 0), 1);
  const offset = circumference - normalized * circumference;
  const category = getBMICategory(bmi);
  const strokeColor = bmi < 18.5 ? '#3b82f6' : bmi < 25 ? '#10b981' : bmi < 30 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="180" height="140" viewBox="0 0 180 140">
      {/* Background arc */}
      <circle cx="90" cy="90" r="70" fill="none" stroke="#1e293b" strokeWidth="10" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeDashoffset={circumference * 0.125} strokeLinecap="round" />
      {/* Progress arc */}
      <circle cx="90" cy="90" r="70" fill="none" stroke={strokeColor} strokeWidth="10" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeDashoffset={offset * 0.75} strokeLinecap="round" transform="rotate(135 90 90)" className="transition-all duration-700" />
      <text x="90" y="80" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold">{bmi || '—'}</text>
      <text x="90" y="105" textAnchor="middle" fill="#94a3b8" fontSize="13">{bmi > 0 ? category.label : 'Enter data'}</text>
    </svg>
  );
}

export function BMIInput() {
  const { addBMIRecord, bmi: bmiModule } = useHealthStore();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heightCm: bmiModule.currentHeight || 170,
    weightKg: bmiModule.currentWeight || 70,
  });
  const [submitted, setSubmitted] = useState(false);

  const calculatedBMI = useMemo(() => calculateBMI(formData.heightCm, formData.weightKg), [formData.heightCm, formData.weightKg]);
  const category = useMemo(() => getBMICategory(calculatedBMI), [calculatedBMI]);

  const idealWeightRange = useMemo(() => {
    const heightM = formData.heightCm / 100;
    return {
      min: Math.round(18.5 * heightM * heightM * 10) / 10,
      max: Math.round(24.9 * heightM * heightM * 10) / 10,
    };
  }, [formData.heightCm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedBMI <= 0) return;

    const record: BMIRecord = {
      id: 'bmi_' + Date.now(),
      date: formData.date,
      heightCm: formData.heightCm,
      weightKg: formData.weightKg,
      bmi: calculatedBMI,
      category: calculatedBMI < 18.5 ? 'underweight' : calculatedBMI < 25 ? 'normal' : calculatedBMI < 30 ? 'overweight' : 'obese',
    };

    addBMIRecord(record);
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
        <span>⚖️</span> BMI Calculator
      </h3>

      {/* BMI Gauge */}
      <div className="flex justify-center">
        <BMIGauge bmi={calculatedBMI} />
      </div>

      {/* Category Badge */}
      {calculatedBMI > 0 && (
        <div className={`text-center py-2 rounded-lg ${category.bg}`}>
          <span className={`text-sm font-medium ${category.color}`}>
            BMI: {calculatedBMI} — {category.label}
          </span>
        </div>
      )}

      <div>
        <label className="text-slate-400 text-xs block mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Height (cm)</label>
          <input
            type="number"
            step="0.1"
            min="50"
            max="250"
            value={formData.heightCm}
            onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
            required
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            value={formData.weightKg}
            onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0 })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500"
            required
          />
        </div>
      </div>

      {/* Weight slider */}
      <div>
        <label className="text-slate-400 text-xs block mb-1">Weight Quick Adjust</label>
        <input
          type="range"
          min="30"
          max="200"
          step="0.5"
          value={formData.weightKg}
          onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) })}
          className="w-full accent-teal-500"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>30 kg</span>
          <span>{formData.weightKg} kg</span>
          <span>200 kg</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-slate-900/50 rounded-lg p-3 space-y-1.5">
        <p className="text-slate-400 text-xs font-medium">BMI Categories:</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span className="text-blue-400">Underweight: &lt; 18.5</span>
          <span className="text-emerald-400">Normal: 18.5 – 24.9</span>
          <span className="text-amber-400">Overweight: 25 – 29.9</span>
          <span className="text-red-400">Obese: ≥ 30</span>
        </div>
        {idealWeightRange.min > 0 && (
          <p className="text-teal-400 text-xs pt-1">
            Ideal weight range for your height: {idealWeightRange.min} – {idealWeightRange.max} kg
          </p>
        )}
      </div>

      {/* History */}
      {bmiModule.records.length > 0 && (
        <div>
          <label className="text-slate-400 text-xs block mb-1">Recent History</label>
          <div className="space-y-1">
            {bmiModule.records.slice(-3).reverse().map((rec) => {
              const cat = getBMICategory(rec.bmi);
              return (
                <div key={rec.id} className="flex items-center justify-between bg-slate-900/50 rounded px-3 py-1.5 text-xs">
                  <span className="text-slate-400">{rec.date}</span>
                  <span className="text-white">{rec.weightKg}kg / {rec.heightCm}cm</span>
                  <span className="text-white font-medium">BMI {rec.bmi}</span>
                  <span className={cat.color}>{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save BMI Record'}
      </button>
    </motion.form>
  );
}
