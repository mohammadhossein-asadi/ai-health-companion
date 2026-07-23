'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '@/store';
import { SupplementEntry, SupplementFrequency, SupplementLog } from '@/types';

const FREQUENCY_OPTIONS: { value: SupplementFrequency; label: string }[] = [
  { value: 'daily', label: 'Once Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'weekly', label: 'Once Weekly' },
  { value: 'as_needed', label: 'As Needed' },
];

const TIME_OPTIONS = [
  { value: 'morning', label: '🌅 Morning', icon: '🌅' },
  { value: 'afternoon', label: '☀️ Afternoon', icon: '☀️' },
  { value: 'evening', label: '🌙 Evening', icon: '🌙' },
  { value: 'bedtime', label: '😴 Bedtime', icon: '😴' },
];

const COMMON_SUPPLEMENTS = [
  'Vitamin D3', 'Vitamin C', 'Vitamin B12', 'Omega-3', 'Fish Oil',
  'Magnesium', 'Zinc', 'Iron', 'Calcium', 'Multivitamin',
  'Probiotics', 'Collagen', 'Biotin', 'CoQ10', 'Ashwagandha',
];

function AddSupplementForm({ onAdd, onClose }: { onAdd: (s: SupplementEntry) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily' as SupplementFrequency,
    timeOfDay: 'morning',
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return;

    onAdd({
      id: 'supp_' + Date.now(),
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timeOfDay: formData.timeOfDay,
      startDate: formData.startDate,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">Add New Supplement</h4>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Supplement Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Vitamin D3"
          list="supplement-names"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
          required
        />
        <datalist id="supplement-names">
          {COMMON_SUPPLEMENTS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Dosage</label>
          <input
            type="text"
            value={formData.dosage}
            onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            placeholder="e.g., 2000 IU, 500mg"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            required
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Frequency</label>
        <div className="grid grid-cols-2 gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData({ ...formData, frequency: opt.value })}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                formData.frequency === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs block mb-1">Time of Day</label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData({ ...formData, timeOfDay: opt.value })}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                formData.timeOfDay === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 rounded-lg transition-colors"
      >
        Add Supplement
      </button>
    </motion.div>
  );
}

export function SupplementsInput() {
  const { addSupplement, addSupplementLog, supplements } = useHealthStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitted, setSubmitted] = useState(false);

  const toggleSupplementTaken = (supplementId: string) => {
    const existingLog = supplements.logs.find(
      (l) => l.supplementId === supplementId && l.date === logDate
    );

    if (existingLog) {
      // Already logged for today, skip
      return;
    }

    const log: SupplementLog = {
      id: 'slog_' + Date.now(),
      supplementId,
      date: logDate,
      taken: true,
      timeTaken: new Date().toTimeString().slice(0, 5),
    };

    addSupplementLog(log);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1500);
  };

  const getTodayLogs = (supplementId: string) => {
    return supplements.logs.find(
      (l) => l.supplementId === supplementId && l.date === logDate
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span>💊</span> Supplement Tracker
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium rounded-lg transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {/* Adherence Rate */}
      <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3">
        <div className="text-center">
          <span className="text-2xl font-bold text-orange-400">{supplements.adherenceRate}%</span>
          <span className="text-slate-400 text-xs block">Adherence</span>
        </div>
        <div className="flex-1">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
              style={{ width: `${supplements.adherenceRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Date selector */}
      <div>
        <label className="text-slate-400 text-xs block mb-1">Log Date</label>
        <input
          type="date"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Add Supplement Form */}
      <AnimatePresence>
        {showAddForm && (
          <AddSupplementForm
            onAdd={addSupplement}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Active Supplements List */}
      <div className="space-y-2">
        <label className="text-slate-400 text-xs block">Active Supplements</label>
        {supplements.activeSupplements.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No supplements added yet</p>
        ) : (
          supplements.activeSupplements.map((supp) => {
            const todayLog = getTodayLogs(supp.id);
            const isTaken = !!todayLog;

            return (
              <motion.div
                key={supp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isTaken
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-900/50 border-slate-700/30'
                }`}
              >
                <button
                  onClick={() => toggleSupplementTaken(supp.id)}
                  disabled={isTaken}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                    isTaken
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {isTaken ? '✓' : '○'}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{supp.name}</span>
                    <span className="text-slate-500 text-xs">{supp.dosage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{supp.frequency.replace('_', ' ')}</span>
                    <span>•</span>
                    <span className="capitalize">{supp.timeOfDay}</span>
                  </div>
                </div>
                {isTaken && (
                  <span className="text-emerald-400 text-xs">Taken {todayLog.timeTaken}</span>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-emerald-400 text-sm font-medium"
        >
          ✓ Supplement logged!
        </motion.div>
      )}
    </motion.div>
  );
}
