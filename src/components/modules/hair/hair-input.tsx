'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { HairRecord, HairType, ScalpType } from '@/types';

const HAIR_TYPES: { value: HairType; label: string; icon: string }[] = [
  { value: 'straight', label: 'Straight', icon: '➡️' },
  { value: 'wavy', label: 'Wavy', icon: '〰️' },
  { value: 'curly', label: 'Curly', icon: '🌀' },
  { value: 'coily', label: 'Coily', icon: '🪢' },
];

const SCALP_TYPES: { value: ScalpType; label: string; icon: string }[] = [
  { value: 'oily', label: 'Oily', icon: '💧' },
  { value: 'dry', label: 'Dry', icon: '🏜️' },
  { value: 'normal', label: 'Normal', icon: '✨' },
  { value: 'sensitive', label: 'Sensitive', icon: '🩹' },
  { value: 'flaky', label: 'Flaky', icon: '❄️' },
];

const HAIR_LOSS_OPTIONS = [
  { value: 'none', label: 'None', color: 'bg-emerald-500' },
  { value: 'mild', label: 'Mild', color: 'bg-amber-500' },
  { value: 'moderate', label: 'Moderate', color: 'bg-orange-500' },
  { value: 'severe', label: 'Severe', color: 'bg-red-500' },
] as const;

export function HairInput() {
  const addHairRecord = useHealthStore((s) => s.addHairRecord);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hairType: 'straight' as HairType,
    scalpType: 'normal' as ScalpType,
    hairLossCount: 'none' as HairRecord['hairLossCount'],
    washingFrequency: 3,
    productsUsed: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: HairRecord = {
      id: 'hair_' + Date.now(),
      date: formData.date,
      hairType: formData.hairType,
      scalpType: formData.scalpType,
      hairLossCount: formData.hairLossCount,
      washingFrequency: formData.washingFrequency,
      productsUsed: formData.productsUsed
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      notes: formData.notes,
    };

    addHairRecord(record);
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
        <span>💇</span> Hair & Scalp Health Log
      </h3>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
          required
        />
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Hair Type</label>
        <div className="grid grid-cols-4 gap-2">
          {HAIR_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, hairType: type.value })}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                formData.hairType === type.value
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Scalp Type</label>
        <div className="grid grid-cols-5 gap-2">
          {SCALP_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, scalpType: type.value })}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                formData.scalpType === type.value
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Hair Loss Today</label>
        <div className="flex gap-2">
          {HAIR_LOSS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, hairLossCount: option.value })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                formData.hairLossCount === option.value
                  ? `${option.color} text-white`
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Washing Frequency (times per week)</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, washingFrequency: Math.max(0, formData.washingFrequency - 1) })}
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold transition-colors"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <span className="text-white text-2xl font-bold">{formData.washingFrequency}</span>
            <span className="text-slate-400 text-xs block">times/week</span>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, washingFrequency: Math.min(14, formData.washingFrequency + 1) })}
            className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Products Used (comma separated)</label>
        <input
          type="text"
          value={formData.productsUsed}
          onChange={(e) => setFormData({ ...formData, productsUsed: e.target.value })}
          placeholder="e.g., Shampoo, Conditioner, Hair Oil, Serum"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
        />
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Notes</label>
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g., Itchy scalp, new product tried..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save Hair Log'}
      </button>
    </motion.form>
  );
}
