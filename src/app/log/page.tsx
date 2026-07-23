'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SleepInput } from '@/components/modules/sleep/sleep-input';
import { ExerciseInput } from '@/components/modules/exercise/exercise-input';
import { WaterInput } from '@/components/modules/water/water-input';
import { NutritionInput } from '@/components/modules/nutrition/nutrition-input';
import { SkinInput } from '@/components/modules/skin/skin-input';
import { HairInput } from '@/components/modules/hair/hair-input';
import { SupplementsInput } from '@/components/modules/supplements/supplements-input';
import { BloodTestInput } from '@/components/modules/blood-test/blood-test-input';
import { BMIInput } from '@/components/modules/bmi/bmi-input';
import { CaloriesInput } from '@/components/modules/calories/calories-input';

type ModuleTab = 'sleep' | 'exercise' | 'water' | 'nutrition' | 'skin' | 'hair' | 'supplements' | 'bloodTest' | 'bmi' | 'calories';

const TABS: { key: ModuleTab; label: string; icon: string }[] = [
  { key: 'sleep', label: 'Sleep', icon: '🛏️' },
  { key: 'exercise', label: 'Exercise', icon: '🏋️' },
  { key: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { key: 'water', label: 'Water', icon: '💧' },
  { key: 'skin', label: 'Skin', icon: '🧴' },
  { key: 'hair', label: 'Hair', icon: '💇' },
  { key: 'supplements', label: 'Supplements', icon: '💊' },
  { key: 'bloodTest', label: 'Blood Test', icon: '🩸' },
  { key: 'bmi', label: 'BMI', icon: '⚖️' },
  { key: 'calories', label: 'Calories', icon: '🔥' },
];

export default function DataEntryPage() {
  const [activeTab, setActiveTab] = useState<ModuleTab>('sleep');

  const renderModule = () => {
    switch (activeTab) {
      case 'sleep':
        return <SleepInput />;
      case 'exercise':
        return <ExerciseInput />;
      case 'water':
        return <WaterInput />;
      case 'nutrition':
        return <NutritionInput />;
      case 'skin':
        return <SkinInput />;
      case 'hair':
        return <HairInput />;
      case 'supplements':
        return <SupplementsInput />;
      case 'bloodTest':
        return <BloodTestInput />;
      case 'bmi':
        return <BMIInput />;
      case 'calories':
        return <CaloriesInput />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                ← Back to Dashboard
              </Link>
            </div>
            <h1 className="text-white font-semibold">Log Health Data</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Active Module Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
