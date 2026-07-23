'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthStore } from '@/store';
import { WaterLog } from '@/types';

export function WaterInput() {
  const { addWaterLog, water } = useHealthStore();
  const [amount, setAmount] = useState(250);
  const [type, setType] = useState<'water' | 'tea' | 'coffee' | 'juice' | 'other'>('water');
  const [submitted, setSubmitted] = useState(false);

  const quickAmounts = [150, 250, 350, 500, 750];

  const handleAddWater = (ml: number) => {
    const log: WaterLog = {
      id: 'water_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      amountMl: ml,
      type,
    };

    addWaterLog(log);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1500);
  };

  const progress = Math.min((water.todayTotalMl / water.dailyTargetMl) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 space-y-4"
    >
      <h3 className="text-white font-semibold flex items-center gap-2">
        <span>💧</span> Water Intake
      </h3>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-slate-400 text-xs">{water.todayTotalMl}ml</span>
          <span className="text-slate-400 text-xs">{water.dailyTargetMl}ml goal</span>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div>
        <label className="text-slate-400 text-xs block mb-2">Quick Add</label>
        <div className="flex gap-2">
          {quickAmounts.map((ml) => (
            <button
              key={ml}
              onClick={() => handleAddWater(ml)}
              className="flex-1 py-2 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 text-sm font-medium rounded-lg transition-all active:scale-95"
            >
              {ml}ml
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="flex gap-2">
        <input
          type="number"
          min="50"
          max="2000"
          step="50"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 250)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="water">💧 Water</option>
          <option value="tea">🍵 Tea</option>
          <option value="coffee">☕ Coffee</option>
          <option value="juice">🧃 Juice</option>
          <option value="other">🥤 Other</option>
        </select>
        <button
          onClick={() => handleAddWater(amount)}
          className="px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-cyan-400 text-sm font-medium"
        >
          ✓ Water logged!
        </motion.div>
      )}
    </motion.div>
  );
}
