'use client';

import React from 'react';
import { MODULE_METADATA } from '@/constants';
import { useHealthStore } from '@/store';
import { motion } from 'framer-motion';
import Link from 'next/link';

function scoreColor(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function scoreText(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Attention';
}

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="4" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        className="transition-all duration-1000 ease-out"
        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
      />
      <text x={size/2} y={size/2 - 2} textAnchor="middle" fill="white" fontSize={size > 50 ? "16" : "12"} fontWeight="bold">
        {score}
      </text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" fill="#94a3b8" fontSize="8">
        /100
      </text>
    </svg>
  );
}

function ModuleCard({ moduleKey, index }: { moduleKey: string; index: number }) {
  const meta = MODULE_METADATA.find((m) => m.key === moduleKey);
  const state = useHealthStore();
  const lang = state.language;
  if (!meta) return null;

  const getModuleScore = (): number => {
    switch (moduleKey) {
      case 'sleep': return state.sleep?.sleepScore ?? 50;
      case 'exercise': return state.exercise?.exerciseScore ?? 50;
      case 'skin': return state.skin?.skinScore ?? 50;
      case 'hair': return state.hair?.hairScore ?? 50;
      case 'nutrition': return state.nutrition?.nutritionScore ?? 50;
      case 'supplements': return state.supplements?.supplementScore ?? 50;
      case 'water': return state.water?.hydrationScore ?? 50;
      case 'bloodTest': return state.bloodTest?.bloodTestScore ?? 50;
      case 'bmi': {
        const cat = state.bmi?.bmiCategory;
        return cat === 'normal' ? 85 : cat === 'overweight' ? 60 : 50;
      }
      case 'calories': return state.calories?.calorieScore ?? 50;
      default: return 50;
    }
  };

  const getModuleStatus = (): string => {
    switch (moduleKey) {
      case 'sleep': return `${Math.round((state.sleep?.averageDuration ?? 0) / 60)}h avg`;
      case 'exercise': return `${state.exercise?.records?.length ?? 0} sessions`;
      case 'water': return `${state.water?.todayTotalMl ?? 0}/${state.water?.dailyTargetMl ?? 2500}ml`;
      case 'bmi': return `${state.bmi?.currentBMI ?? 0} BMI`;
      case 'calories': {
        const net = state.calories?.todayNetBalance ?? 0;
        return `${net > 0 ? '+' : ''}${net} kcal`;
      }
      case 'bloodTest': return `${state.bloodTest?.criticalFlags?.length ?? 0} flags`;
      case 'skin': return `${state.skin?.routineAdherence ?? 0}% adherence`;
      case 'hair': return state.hair?.weeklyHairLossTrend ?? 'stable';
      case 'nutrition': return `${state.nutrition?.records?.length ?? 0} meals`;
      case 'supplements': return `${state.supplements?.adherenceRate ?? 0}% adherence`;
      default: return 'Active';
    }
  };

  const getRecordCount = (): number => {
    switch (moduleKey) {
      case 'sleep': return state.sleep?.records?.length ?? 0;
      case 'exercise': return state.exercise?.records?.length ?? 0;
      case 'skin': return state.skin?.records?.length ?? 0;
      case 'hair': return state.hair?.records?.length ?? 0;
      case 'nutrition': return state.nutrition?.records?.length ?? 0;
      case 'supplements': return state.supplements?.activeSupplements?.length ?? 0;
      case 'water': return state.water?.logs?.length ?? 0;
      case 'bloodTest': return state.bloodTest?.records?.length ?? 0;
      case 'bmi': return state.bmi?.records?.length ?? 0;
      case 'calories': return state.calories?.records?.length ?? 0;
      default: return 0;
    }
  };

  const score = getModuleScore();
  const color = scoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative"
    >
      <Link href="/log">
        <div className="glass-card rounded-2xl p-4 hover:border-slate-600/30 transition-all duration-300 cursor-pointer relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl"
            style={{ background: color }}
          />

          {/* Top row: icon + score */}
          <div className="flex items-start justify-between mb-3 relative">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: `${color}15` }}
              >
                {meta.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm leading-tight">{lang === 'fa' ? meta.nameFa : meta.nameEn}</h3>
                <p className="text-slate-500 text-[10px]">{lang === 'fa' ? meta.nameEn : meta.nameFa}</p>
              </div>
            </div>
            <ScoreRing score={score} size={52} />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              <span className="text-slate-400 text-xs">{getModuleStatus()}</span>
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${scoreText(score)}`}>
              {scoreLabel(score)}
            </span>
          </div>

          {/* Record count */}
          {getRecordCount() > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-700/30 flex items-center justify-between">
              <span className="text-slate-600 text-[10px]">{getRecordCount()} records</span>
              <span className="text-slate-600 text-[10px] group-hover:text-slate-400 transition-colors">View →</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export function ModuleGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 stagger-children">
      {MODULE_METADATA.map((meta, i) => (
        <ModuleCard key={meta.key} moduleKey={meta.key} index={i} />
      ))}
    </div>
  );
}
