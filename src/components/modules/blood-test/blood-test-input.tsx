'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '@/store';
import { BloodTestRecord, Biomarker } from '@/types';

const COMMON_BIOMARKERS = [
  { name: 'Vitamin D', unit: 'ng/mL', min: 30, max: 100 },
  { name: 'Vitamin B12', unit: 'pg/mL', min: 200, max: 900 },
  { name: 'Iron', unit: 'μg/dL', min: 60, max: 170 },
  { name: 'Ferritin', unit: 'ng/mL', min: 30, max: 400 },
  { name: 'TSH', unit: 'mIU/L', min: 0.4, max: 4.0 },
  { name: 'T3', unit: 'ng/dL', min: 80, max: 200 },
  { name: 'T4', unit: 'μg/dL', min: 4.5, max: 12.0 },
  { name: 'Cholesterol', unit: 'mg/dL', min: 0, max: 200 },
  { name: 'HDL', unit: 'mg/dL', min: 40, max: 100 },
  { name: 'LDL', unit: 'mg/dL', min: 0, max: 100 },
  { name: 'Triglycerides', unit: 'mg/dL', min: 0, max: 150 },
  { name: 'Glucose', unit: 'mg/dL', min: 70, max: 100 },
  { name: 'HbA1c', unit: '%', min: 4.0, max: 5.7 },
  { name: 'Calcium', unit: 'mg/dL', min: 8.5, max: 10.5 },
  { name: 'Sodium', unit: 'mEq/L', min: 136, max: 145 },
  { name: 'Potassium', unit: 'mEq/L', min: 3.5, max: 5.0 },
  { name: 'Creatinine', unit: 'mg/dL', min: 0.6, max: 1.2 },
  { name: 'ALT', unit: 'U/L', min: 7, max: 56 },
  { name: 'AST', unit: 'U/L', min: 10, max: 40 },
  { name: 'CRP', unit: 'mg/L', min: 0, max: 3.0 },
  { name: 'Hemoglobin', unit: 'g/dL', min: 12.0, max: 17.5 },
  { name: 'WBC', unit: 'K/μL', min: 4.5, max: 11.0 },
  { name: 'Platelets', unit: 'K/μL', min: 150, max: 400 },
];

function BiomarkerRow({
  biomarker,
  onUpdate,
  onRemove,
}: {
  biomarker: Biomarker;
  onUpdate: (b: Biomarker) => void;
  onRemove: () => void;
}) {
  const getStatus = (value: number, min: number, max: number): Biomarker['status'] => {
    if (value < min * 0.7) return 'critical_low';
    if (value < min) return 'low';
    if (value > max * 1.3) return 'critical_high';
    if (value > max) return 'high';
    return 'normal';
  };

  const status = getStatus(biomarker.value, biomarker.normalRangeMin, biomarker.normalRangeMax);

  const statusColors = {
    normal: 'text-emerald-400 bg-emerald-500/10',
    low: 'text-amber-400 bg-amber-500/10',
    high: 'text-amber-400 bg-amber-500/10',
    critical_low: 'text-red-400 bg-red-500/10',
    critical_high: 'text-red-400 bg-red-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg"
    >
      <div className="flex-1 grid grid-cols-4 gap-2 items-center">
        <input
          type="text"
          value={biomarker.name}
          onChange={(e) => onUpdate({ ...biomarker, name: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-red-500"
          placeholder="Name"
        />
        <input
          type="number"
          step="0.1"
          value={biomarker.value}
          onChange={(e) => onUpdate({ ...biomarker, value: parseFloat(e.target.value) || 0 })}
          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-red-500"
          placeholder="Value"
        />
        <span className="text-slate-500 text-xs">{biomarker.unit}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[status]}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <span>{biomarker.normalRangeMin}</span>
        <span>-</span>
        <span>{biomarker.normalRangeMax}</span>
      </div>
      <button
        onClick={onRemove}
        className="text-slate-500 hover:text-red-400 text-lg transition-colors"
      >
        &times;
      </button>
    </motion.div>
  );
}

export function BloodTestInput() {
  const addBloodTestRecord = useHealthStore((s) => s.addBloodTestRecord);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    testType: 'Complete Blood Panel',
    notes: '',
  });
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([
    { name: 'Vitamin D', value: 25, unit: 'ng/mL', normalRangeMin: 30, normalRangeMax: 100, status: 'low' },
    { name: 'Ferritin', value: 20, unit: 'ng/mL', normalRangeMin: 30, normalRangeMax: 400, status: 'low' },
  ]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addBiomarker = (template?: typeof COMMON_BIOMARKERS[0]) => {
    setBiomarkers((prev) => [
      ...prev,
      {
        name: template?.name || '',
        value: 0,
        unit: template?.unit || '',
        normalRangeMin: template?.min || 0,
        normalRangeMax: template?.max || 100,
        status: 'normal',
      },
    ]);
    setShowQuickAdd(false);
  };

  const updateBiomarker = (index: number, updated: Biomarker) => {
    setBiomarkers((prev) => prev.map((b, i) => (i === index ? updated : b)));
  };

  const removeBiomarker = (index: number) => {
    setBiomarkers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: BloodTestRecord = {
      id: 'bt_' + Date.now(),
      date: formData.date,
      testType: formData.testType,
      biomarkers: biomarkers.map((b) => ({
        ...b,
        status: (() => {
          if (b.value < b.normalRangeMin * 0.7) return 'critical_low' as const;
          if (b.value < b.normalRangeMin) return 'low' as const;
          if (b.value > b.normalRangeMax * 1.3) return 'critical_high' as const;
          if (b.value > b.normalRangeMax) return 'high' as const;
          return 'normal' as const;
        })(),
      })),
      notes: formData.notes,
    };

    addBloodTestRecord(record);
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
        <span>🩸</span> Blood Test Log
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Test Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
            required
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Test Type</label>
          <select
            value={formData.testType}
            onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
          >
            <option>Complete Blood Panel</option>
            <option>Lipid Panel</option>
            <option>Thyroid Panel</option>
            <option>Vitamin Panel</option>
            <option>Metabolic Panel</option>
            <option>CBC</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {/* Biomarkers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-slate-400 text-xs">Biomarkers ({biomarkers.length})</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
            >
              {showQuickAdd ? 'Hide' : '+ Quick Add'}
            </button>
            <button
              type="button"
              onClick={() => addBiomarker()}
              className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs rounded transition-colors"
            >
              + Custom
            </button>
          </div>
        </div>

        {/* Quick Add Panel */}
        <AnimatePresence>
          {showQuickAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg"
            >
              <p className="text-slate-400 text-xs mb-2">Select biomarkers to add:</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_BIOMARKERS.filter(
                  (cb) => !biomarkers.some((b) => b.name === cb.name)
                ).map((cb) => (
                  <button
                    key={cb.name}
                    type="button"
                    onClick={() => addBiomarker(cb)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
                  >
                    {cb.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Biomarker List */}
        <div className="space-y-2">
          <AnimatePresence>
            {biomarkers.map((bm, index) => (
              <BiomarkerRow
                key={index}
                biomarker={bm}
                onUpdate={(updated) => updateBiomarker(index, updated)}
                onRemove={() => removeBiomarker(index)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Notes</label>
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g., Fasting test, 12 hours..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        {submitted ? '✓ Saved!' : 'Save Blood Test'}
      </button>
    </motion.form>
  );
}
