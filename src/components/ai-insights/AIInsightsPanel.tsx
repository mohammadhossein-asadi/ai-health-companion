'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIInsight, CriticalAlert, ModuleInsight, CrossCorrelation, ActionPlanItem } from '@/types';

// ─── Utility ────────────────────────────────────────────────
const MODULE_ICONS: Record<string, string> = {
  sleep: '🛏️', exercise: '🏋️', skin: '🧴', hair: '💇', nutrition: '🍎',
  supplements: '💊', water: '💧', bloodtest: '🩸', bloodTest: '🩸',
  bmi: '⚖️', calories: '🔥',
};

function getModuleIcon(name: string): string {
  return MODULE_ICONS[name.toLowerCase()] || MODULE_ICONS[name] || '📊';
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function scoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function scoreStroke(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}

// ─── Collapsible Section ────────────────────────────────────
function Section({ title, icon, count, children, defaultOpen = true, accent }: {
  title: string; icon: string; count?: number; children: React.ReactNode;
  defaultOpen?: boolean; accent?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-700/40 rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h3 className="text-white font-semibold text-base">{title}</h3>
          {count !== undefined && (
            <span className={`${accent || 'bg-slate-700 text-slate-300'} text-xs font-bold px-2 py-0.5 rounded-full`}>
              {count}
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 text-lg"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Health Score Gauge ─────────────────────────────────────
function HealthScoreGauge({ score }: { score: number }) {
  const r = 72;
  const circumference = 2 * Math.PI * r;
  const stroke = scoreStroke(score);
  const arcLength = circumference * 0.75;
  const offset = arcLength - (score / 100) * arcLength;

  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="160" viewBox="0 0 200 160">
        {/* Background arc */}
        <circle cx="100" cy="100" r={r} fill="none" stroke="#1e293b" strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={circumference * 0.125}
          strokeLinecap="round" transform="rotate(135 100 100)" />
        {/* Colored arc */}
        <circle cx="100" cy="100" r={r} fill="none" stroke={stroke} strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(135 100 100)"
          className="transition-all duration-1000 ease-out" />
        {/* Score text */}
        <text x="100" y="90" textAnchor="middle" fill="white" fontSize="42" fontWeight="bold">
          {score}
        </text>
        <text x="100" y="115" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="500">
          {scoreLabel(score)}
        </text>
      </svg>
      {/* Gradient bar beneath */}
      <div className="w-48 h-1.5 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 mt-1" />
      <div className="relative w-48 mt-1">
        <div
          className="absolute top-0 w-2.5 h-2.5 bg-white rounded-full shadow-lg -translate-x-1/2 transition-all duration-1000"
          style={{ left: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ─── Summary Stats Bar ──────────────────────────────────────
function SummaryBar({ insight }: { insight: AIInsight }) {
  const critical = insight.criticalAlerts.filter(a => a.severity === 'critical').length;
  const warnings = insight.criticalAlerts.filter(a => a.severity === 'warning').length;
  const infos = insight.criticalAlerts.filter(a => a.severity === 'info').length;
  const improving = Object.values(insight.moduleInsights).filter(i => i.trend === 'improving').length;
  const worsening = Object.values(insight.moduleInsights).filter(i => i.trend === 'worsening').length;
  const avgModuleScore = Math.round(
    Object.values(insight.moduleInsights).reduce((sum, i) => sum + i.score, 0) /
    Math.max(Object.keys(insight.moduleInsights).length, 1)
  );

  const stats = [
    { label: 'Critical', value: critical, color: 'text-red-400', bg: 'bg-red-500/10', icon: '🔴' },
    { label: 'Warnings', value: warnings, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: '🟡' },
    { label: 'Info', value: infos, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '🔵' },
    { label: 'Avg Module', value: avgModuleScore, color: scoreColor(avgModuleScore), bg: 'bg-slate-700/30', icon: '📊' },
    { label: 'Improving', value: improving, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: '📈' },
    { label: 'Worsening', value: worsening, color: 'text-red-400', bg: 'bg-red-500/10', icon: '📉' },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${s.bg} rounded-xl p-3 text-center`}
        >
          <span className="text-lg block">{s.icon}</span>
          <span className={`${s.color} text-xl font-bold block`}>{s.value}</span>
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Alert Card ─────────────────────────────────────────────
function AlertCard({ alert, index }: { alert: CriticalAlert; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const severityConfig = {
    critical: { bg: 'bg-red-500/8', border: 'border-red-500/30', badge: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/10' },
    warning: { bg: 'bg-amber-500/8', border: 'border-amber-500/30', badge: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/10' },
    info: { bg: 'bg-blue-500/8', border: 'border-blue-500/30', badge: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/10' },
  };
  const c = severityConfig[alert.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${c.bg} border ${c.border} rounded-xl overflow-hidden shadow-lg ${c.glow}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className={`${c.badge} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <span className="text-white text-xs font-bold">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-white font-semibold text-sm truncate">{alert.title}</h4>
            <span className={`${c.text} text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.badge}/20`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-slate-400 text-xs line-clamp-2">{alert.description}</p>
        </div>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="text-slate-500 text-sm mt-1">▼</motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              <p className="text-slate-300 text-sm leading-relaxed">{alert.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {alert.relatedModules.map((mod) => (
                  <span key={mod} className="inline-flex items-center gap-1 bg-slate-800/80 text-slate-300 text-xs px-2.5 py-1 rounded-full">
                    <span className="text-xs">{getModuleIcon(mod)}</span>
                    {mod}
                  </span>
                ))}
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-emerald-400 text-xs font-semibold mb-1 flex items-center gap-1.5">
                  <span>💡</span> Recommendation
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">{alert.recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Module Insight Card ────────────────────────────────────
function ModuleInsightCard({ name, insight, index }: { name: string; insight: ModuleInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const trendConfig = {
    improving: { icon: '📈', color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Improving' },
    worsening: { icon: '📉', color: 'text-red-400', bg: 'bg-red-500/10', label: 'Worsening' },
    stable: { icon: '➡️', color: 'text-slate-400', bg: 'bg-slate-700/30', label: 'Stable' },
  };
  const trend = trendConfig[insight.trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-slate-800/30 border border-slate-700/30 rounded-xl overflow-hidden hover:border-slate-600/50 transition-colors"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{getModuleIcon(name)}</span>
            <h4 className="text-white font-semibold text-sm capitalize">{name}</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${trend.bg} ${trend.color} text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1`}>
              {trend.icon} {trend.label}
            </span>
            <span className={`${scoreColor(insight.score)} text-sm font-bold`}>{insight.score}</span>
          </div>
        </div>
        {/* Score bar */}
        <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-2">
          <div className={`h-full rounded-full ${scoreBg(insight.score)} transition-all duration-700`}
            style={{ width: `${insight.score}%` }} />
        </div>
        <p className="text-slate-400 text-xs line-clamp-2">{insight.summary}</p>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
              <p className="text-slate-300 text-sm leading-relaxed">{insight.summary}</p>
              {insight.recommendations.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Recommendations</p>
                  {insight.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-900/50 rounded-lg p-2.5">
                      <span className="text-emerald-500 mt-0.5 text-xs">→</span>
                      <span className="text-slate-300 text-xs leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Correlation Card ───────────────────────────────────────
function CorrelationCard({ correlation, index }: { correlation: CrossCorrelation; index: number }) {
  const impactConfig = {
    positive: { bg: 'bg-emerald-500/8', border: 'border-emerald-500/30', badge: 'bg-emerald-500', icon: '✅', label: 'Positive' },
    negative: { bg: 'bg-red-500/8', border: 'border-red-500/30', badge: 'bg-red-500', icon: '⚠️', label: 'Negative' },
    neutral: { bg: 'bg-slate-500/8', border: 'border-slate-500/30', badge: 'bg-slate-500', icon: 'ℹ️', label: 'Neutral' },
  };
  const c = impactConfig[correlation.impact];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`${c.bg} border ${c.border} rounded-xl p-4`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {correlation.modules.map((mod, i) => (
            <React.Fragment key={mod}>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 text-slate-200 text-xs px-2 py-1 rounded-md font-medium">
                <span>{getModuleIcon(mod)}</span> {mod}
              </span>
              {i < correlation.modules.length - 1 && (
                <span className="text-slate-600 text-xs">↔</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <span className={`${c.badge}/20 ${c.icon === '✅' ? 'text-emerald-400' : c.icon === '⚠️' ? 'text-red-400' : 'text-slate-400'} text-[10px] font-bold uppercase px-2 py-0.5 rounded-full`}>
          {c.label}
        </span>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-2">{correlation.finding}</p>
      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-2.5">
        <p className="text-emerald-400 text-xs leading-relaxed">💡 {correlation.recommendation}</p>
      </div>
    </motion.div>
  );
}

// ─── Action Plan Card ───────────────────────────────────────
function ActionPlanCard({ item, index }: { item: ActionPlanItem; index: number }) {
  const [done, setDone] = useState(false);
  const priorityConfig = {
    high: { dot: 'bg-red-500', ring: 'ring-red-500/30', text: 'text-red-400', bg: 'bg-red-500/10', label: 'HIGH' },
    medium: { dot: 'bg-amber-500', ring: 'ring-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10', label: 'MED' },
    low: { dot: 'bg-blue-500', ring: 'ring-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10', label: 'LOW' },
  };
  const c = priorityConfig[item.priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
        done
          ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60'
          : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
      }`}
    >
      <button
        onClick={() => setDone(!done)}
        className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ring-2 ${c.ring} ${
          done ? 'bg-emerald-500 ring-emerald-500' : 'bg-slate-800 hover:bg-slate-700'
        }`}
      >
        {done && <span className="text-white text-xs">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`${c.bg} ${c.text} text-[10px] font-bold px-1.5 py-0.5 rounded`}>{c.label}</span>
          <span className="text-white text-sm font-medium leading-snug">{item.action}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="inline-flex items-center gap-1 text-slate-500 text-xs">
            <span>{getModuleIcon(item.module)}</span> {item.module}
          </span>
          {item.deadline && (
            <span className="text-slate-600 text-xs flex items-center gap-1">
              <span>📅</span> {item.deadline}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────
interface AIInsightsPanelProps {
  insight: AIInsight | null;
  loading: boolean;
}

export function AIInsightsPanel({ insight, loading }: AIInsightsPanelProps) {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 border-slate-700 border-t-emerald-500 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 border-4 border-slate-800 border-t-teal-400 rounded-full"
          />
          <span className="absolute inset-0 flex items-center justify-center text-2xl">🩺</span>
        </div>
        <p className="text-white font-medium mb-1">Analyzing your health data...</p>
        <p className="text-slate-500 text-sm">Cross-module correlations in progress</p>
        <div className="flex gap-4 mt-4">
          {['Sleep', 'Blood', 'Nutrition', 'Exercise'].map((mod, i) => (
            <motion.span
              key={mod}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              className="text-slate-500 text-xs"
            >
              {mod}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!insight) {
    return (
      <div className="text-center py-24">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block"
        >
          <span className="text-6xl mb-6 block">🩺</span>
        </motion.div>
        <p className="text-white font-medium mb-2">Ready for your health analysis</p>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Click &quot;Generate AI Health Insights&quot; to analyze your data across all 10 modules with cross-module correlation intelligence.
        </p>
      </div>
    );
  }

  // Results
  const criticalCount = insight.criticalAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = insight.criticalAlerts.filter(a => a.severity === 'warning').length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-5"
      >
        {/* Generation timestamp */}
        <div className="text-center">
          <span className="text-slate-600 text-xs">
            Generated {new Date(insight.generatedAt).toLocaleString()} • Model: z-ai/glm-5.2
          </span>
        </div>

        {/* ── Health Score + Summary Row ── */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/40 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <HealthScoreGauge score={insight.healthScore} />
            <div className="flex-1 w-full">
              <SummaryBar insight={insight} />
            </div>
          </div>
        </div>

        {/* ── Critical Alerts ── */}
        {insight.criticalAlerts.length > 0 && (
          <Section
            title="Critical Alerts"
            icon="⚠️"
            count={insight.criticalAlerts.length}
            accent={criticalCount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}
            defaultOpen={criticalCount > 0}
          >
            <div className="space-y-3">
              {insight.criticalAlerts.map((alert, i) => (
                <AlertCard key={i} alert={alert} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* ── Module Insights ── */}
        {Object.keys(insight.moduleInsights).length > 0 && (
          <Section
            title="Module Insights"
            icon="📊"
            count={Object.keys(insight.moduleInsights).length}
            defaultOpen
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(insight.moduleInsights)
                .sort(([, a], [, b]) => a.score - b.score)
                .map(([name, data], i) => (
                  <ModuleInsightCard key={name} name={name} insight={data} index={i} />
                ))}
            </div>
          </Section>
        )}

        {/* ── Cross-Module Correlations ── */}
        {insight.crossModuleCorrelations.length > 0 && (
          <Section
            title="Cross-Module Correlations"
            icon="🔗"
            count={insight.crossModuleCorrelations.length}
            defaultOpen
          >
            <div className="space-y-3">
              {insight.crossModuleCorrelations.map((corr, i) => (
                <CorrelationCard key={i} correlation={corr} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* ── Weekly Action Plan ── */}
        {insight.weeklyActionPlan.length > 0 && (
          <Section
            title="Weekly Action Plan"
            icon="📋"
            count={insight.weeklyActionPlan.length}
            defaultOpen
          >
            <div className="space-y-2">
              {insight.weeklyActionPlan.map((item, i) => (
                <ActionPlanCard key={i} item={item} index={i} />
              ))}
            </div>
          </Section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
