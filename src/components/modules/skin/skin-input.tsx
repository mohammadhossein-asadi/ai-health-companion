'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { SkinRecord, SkinType, SkinConcern } from '@/types';

const SKIN_TYPES: { value: SkinType; label: string; icon: string }[] = [
  { value: 'oily', label: 'Oily', icon: '💧' },
  { value: 'dry', label: 'Dry', icon: '🏜️' },
  { value: 'combination', label: 'Combination', icon: '🔄' },
  { value: 'normal', label: 'Normal', icon: '✨' },
  { value: 'sensitive', label: 'Sensitive', icon: '🩹' },
];

const SKIN_CONCERNS: { value: SkinConcern; label: string }[] = [
  { value: 'acne', label: 'Acne' },
  { value: 'redness', label: 'Redness' },
  { value: 'wrinkles', label: 'Wrinkles' },
  { value: 'dark_spots', label: 'Dark Spots' },
  { value: 'dryness', label: 'Dryness' },
  { value: 'oiliness', label: 'Oiliness' },
  { value: 'sensitivity', label: 'Sensitivity' },
  { value: 'pores', label: 'Pores' },
];

const CLIMATE_OPTIONS = [
  { value: 'humid', label: 'Humid', icon: '💦' },
  { value: 'dry', label: 'Dry', icon: '🌵' },
  { value: 'cold', label: 'Cold', icon: '❄️' },
  { value: 'hot', label: 'Hot', icon: '🔥' },
  { value: 'temperate', label: 'Temperate', icon: '🌤️' },
];

export function SkinInput() {
  const addSkinRecord = useHealthStore((s) => s.addSkinRecord);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    skinType: 'combination' as SkinType,
    activeConcerns: [] as SkinConcern[],
    routineFollowed: true,
    productsUsed: '',
    climateCondition: 'temperate' as SkinRecord['climateCondition'],
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleConcern = (concern: SkinConcern) => {
    setFormData((prev) => ({
      ...prev,
      activeConcerns: prev.activeConcerns.includes(concern)
        ? prev.activeConcerns.filter((c) => c !== concern)
        : [...prev.activeConcerns, concern],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: SkinRecord = {
      id: 'skin_' + Date.now(),
      date: formData.date,
      skinType: formData.skinType,
      activeConcerns: formData.activeConcerns,
      routineFollowed: formData.routineFollowed,
      productsUsed: formData.productsUsed
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      climateCondition: formData.climateCondition,
      notes: formData.notes,
    };

    addSkinRecord(record);
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
        <span>🧴</span> Skin Health Log
      </h3>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500"
          required
        />
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Skin Type</label>
        <div className="grid grid-cols-5 gap-2">
          {SKIN_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, skinType: type.value })}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                formData.skinType === type.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Active Concerns (select all that apply)</label>
        <div className="grid grid-cols-4 gap-2">
          {SKIN_CONCERNS.map((concern) => (
            <button
              key={concern.value}
              type="button"
              onClick={() => toggleConcern(concern.value)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                formData.activeConcerns.includes(concern.value)
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {concern.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Climate Condition</label>
        <div className="flex gap-2">
          {CLIMATE_OPTIONS.map((climate) => (
            <button
              key={climate.value}
              type="button"
              onClick={() => setFormData({ ...formData, climateCondition: climate.value as SkinRecord['climateCondition'] })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                formData.climateCondition === climate.value
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {climate.icon} {climate.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Products Used (comma separated)</label>
        <input
          type="text"
          value={formData.productsUsed}
          onChange={(e) => setFormData({ ...formData, productsUsed: e.target.value })}
          placeholder="e.g., Cleanser, Moisturizer, SPF 50, Retinol"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-slate-400 text-xs">Did you follow your routine today?</label>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, routineFollowed: !formData.routineFollowed })}
          className={`w-12 h-6 rounded-full transition-all relative ${
            formData.routineFollowed ? 'bg-emerald-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              formData.routineFollowed ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className="text-slate-400 text-xs">{formData.routineFollowed ? 'Yes' : 'No'}</span>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Notes</label>
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any observations..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save Skin Log'}
      </button>
    </motion.form>
  );
}
