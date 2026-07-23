'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useHealthStore } from '@/store';

const CHART_COLORS = {
  primary: '#10b981',
  secondary: '#06b6d4',
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}{typeof p.value === 'number' && p.name?.includes('Score') ? '/100' : ''}
        </p>
      ))}
    </div>
  );
};

// ─── Sleep Trends Chart ─────────────────────────────────────
function SleepTrendChart() {
  const records = useHealthStore((s) => s.sleep?.records) ?? [];
  const data = records.slice(-14).map((r) => ({
    date: r.date?.slice(5) ?? '',
    hours: Math.round((r.durationMinutes ?? 0) / 60 * 10) / 10,
    quality: (r.quality ?? 3) * 20,
    fatigue: (r.daytimeFatigue ?? 3) * 20,
  }));

  if (data.length === 0) return <EmptyChart label="Sleep data" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.indigo} stopOpacity={0.3} />
            <stop offset="100%" stopColor={CHART_COLORS.indigo} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="hours" stroke={CHART_COLORS.indigo} fill="url(#sleepGrad)" strokeWidth={2} name="Hours" />
        <Line type="monotone" dataKey="quality" stroke={CHART_COLORS.primary} strokeWidth={2} dot={false} name="Quality %" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Exercise Weekly Chart ──────────────────────────────────
function ExerciseWeeklyChart() {
  const records = useHealthStore((s) => s.exercise?.records) ?? [];

  const weekMap: Record<string, { calories: number; minutes: number }> = {};
  records.forEach((r) => {
    const day = r.date?.slice(5) ?? '';
    if (!weekMap[day]) weekMap[day] = { calories: 0, minutes: 0 };
    weekMap[day].calories += r.caloriesBurned ?? 0;
    weekMap[day].minutes += r.durationMinutes ?? 0;
  });

  const data = Object.entries(weekMap).map(([date, v]) => ({
    date,
    calories: v.calories,
    minutes: v.minutes,
  }));

  if (data.length === 0) return <EmptyChart label="Exercise data" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="calories" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} name="Calories Burned" />
        <Bar dataKey="minutes" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} name="Minutes" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Nutrition Macros Pie ───────────────────────────────────
function NutritionPieChart() {
  const records = useHealthStore((s) => s.nutrition?.records) ?? [];
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = records.filter((r) => r.date === today);

  const totals = todayMeals.reduce(
    (acc, m) => ({
      protein: acc.protein + (m.macros?.proteinGrams ?? 0),
      carbs: acc.carbs + (m.macros?.carbsGrams ?? 0),
      fat: acc.fat + (m.macros?.fatGrams ?? 0),
      fiber: acc.fiber + (m.macros?.fiberGrams ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const data = [
    { name: 'Protein', value: totals.protein, color: CHART_COLORS.danger },
    { name: 'Carbs', value: totals.carbs, color: CHART_COLORS.accent },
    { name: 'Fat', value: totals.fat, color: CHART_COLORS.pink },
    { name: 'Fiber', value: totals.fiber, color: CHART_COLORS.primary },
  ].filter((d) => d.value > 0);

  if (data.length === 0) return <EmptyChart label="Nutrition data" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: '#64748b' }}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Water Tracking Bar ─────────────────────────────────────
function WaterBarChart() {
  const logs = useHealthStore((s) => s.water?.logs) ?? [];
  const dailyTargetMl = useHealthStore((s) => s.water?.dailyTargetMl) ?? 2500;
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.date === today);

  const hourly: Record<string, number> = {};
  todayLogs.forEach((l) => {
    const hour = (l.time ?? '').slice(0, 2) + ':00';
    hourly[hour] = (hourly[hour] || 0) + (l.amountMl ?? 0);
  });

  const data = Object.entries(hourly).map(([hour, ml]) => ({
    hour,
    ml,
    target: Math.round(dailyTargetMl / 12),
  }));

  if (data.length === 0) return <EmptyChart label="Water intake today" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="ml" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} name="ml" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── BMI History Line ───────────────────────────────────────
function BMIHistoryChart() {
  const records = useHealthStore((s) => s.bmi?.records) ?? [];
  const data = records.slice(-12).map((r) => ({
    date: r.date?.slice(5) ?? '',
    bmi: r.bmi ?? 0,
    weight: r.weightKg ?? 0,
  }));

  if (data.length === 0) return <EmptyChart label="BMI history" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="bmi" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary, r: 3 }} name="BMI" />
        <Line type="monotone" dataKey={() => 25} stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Overweight" />
        <Line type="monotone" dataKey={() => 18.5} stroke="#3b82f6" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Underweight" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Calorie Balance Chart ──────────────────────────────────
function CalorieBalanceChart() {
  const records = useHealthStore((s) => s.calories?.records) ?? [];
  const data = records.slice(-14).map((r) => ({
    date: r.date?.slice(5) ?? '',
    consumed: r.consumedCalories ?? 0,
    burned: (r.bmr ?? 0) + (r.activeCalories ?? 0),
    net: r.netBalance ?? 0,
  }));

  if (data.length === 0) return <EmptyChart label="Calorie history" />;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="consumed" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} name="Consumed" />
        <Bar dataKey="burned" fill={CHART_COLORS.danger} radius={[4, 4, 0, 0]} name="Total Burned" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Biomarker Radar ────────────────────────────────────────
function BiomarkerRadar() {
  const records = useHealthStore((s) => s.bloodTest?.records) ?? [];
  const latest = records[0];
  if (!latest) return <EmptyChart label="Blood test data" />;

  const data = (latest.biomarkers ?? []).map((b) => {
    const range = (b.normalRangeMax ?? 100) - (b.normalRangeMin ?? 0);
    const normalized = range > 0
      ? Math.max(0, Math.min(100, ((b.value - (b.normalRangeMin ?? 0)) / range) * 100))
      : 50;
    const inRange = b.value >= (b.normalRangeMin ?? 0) && b.value <= (b.normalRangeMax ?? 100);
    return {
      name: b.name ?? 'Unknown',
      value: Math.round(normalized),
      status: inRange ? 'normal' : (b.status ?? 'normal'),
    };
  });

  return (
    <div className="space-y-2">
      {data.map((b) => (
        <div key={b.name} className="flex items-center gap-3">
          <span className="text-slate-400 text-xs w-24 truncate">{b.name}</span>
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                b.status === 'normal' ? 'bg-emerald-500' :
                b.status === 'low' || b.status === 'critical_low' ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(b.value, 100)}%` }}
            />
          </div>
          <span className="text-slate-500 text-xs w-8 text-right">{b.value}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── Empty Chart Placeholder ────────────────────────────────
function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-[220px] text-slate-600 text-sm">
      No {label} yet
    </div>
  );
}

// ─── Chart Tab Selector ─────────────────────────────────────
type ChartTab = 'sleep' | 'exercise' | 'nutrition' | 'water' | 'bmi' | 'calories' | 'bloodtest';

const CHART_TABS: { key: ChartTab; label: string; icon: string }[] = [
  { key: 'sleep', label: 'Sleep', icon: '🛏️' },
  { key: 'exercise', label: 'Exercise', icon: '🏋️' },
  { key: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { key: 'water', label: 'Water', icon: '💧' },
  { key: 'bmi', label: 'BMI', icon: '⚖️' },
  { key: 'calories', label: 'Calories', icon: '🔥' },
  { key: 'bloodtest', label: 'Blood Test', icon: '🩸' },
];

// ─── Main Charts Panel ──────────────────────────────────────
export function ChartsPanel() {
  const [activeTab, setActiveTab] = useState<ChartTab>('sleep');

  const renderChart = () => {
    switch (activeTab) {
      case 'sleep': return <SleepTrendChart />;
      case 'exercise': return <ExerciseWeeklyChart />;
      case 'nutrition': return <NutritionPieChart />;
      case 'water': return <WaterBarChart />;
      case 'bmi': return <BMIHistoryChart />;
      case 'calories': return <CalorieBalanceChart />;
      case 'bloodtest': return <BiomarkerRadar />;
    }
  };

  const chartTitles: Record<ChartTab, string> = {
    sleep: 'Sleep Duration & Quality Trend',
    exercise: 'Exercise Sessions & Calories Burned',
    nutrition: 'Today\'s Macronutrient Breakdown',
    water: 'Today\'s Hourly Water Intake',
    bmi: 'BMI History',
    calories: 'Calorie Balance (Consumed vs Burned)',
    bloodtest: 'Latest Biomarker Status',
  };

  return (
    <div className="bg-slate-900/40 border border-slate-700/40 rounded-2xl overflow-hidden">
      <div className="flex overflow-x-auto border-b border-slate-700/40 scrollbar-hide">
        {CHART_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-3 text-xs font-medium transition-all border-b-2 ${
              activeTab === tab.key
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <h4 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">
          {chartTitles[activeTab]}
        </h4>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderChart()}
        </motion.div>
      </div>
    </div>
  );
}
