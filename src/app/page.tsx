'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useHealthStore, setAuthAvailable } from '@/store';
import { ModuleGrid } from '@/components/dashboard/ModuleGrid';
import { AIInsightsPanel } from '@/components/ai-insights/AIInsightsPanel';
import { ChartsPanel } from '@/components/charts/ChartsPanel';
import { LOCALIZATION, MODULE_METADATA } from '@/constants';

// ─── Floating Particles Background ──────────────────────────
// Seeded deterministic particles (no Math.random — avoids hydration mismatch)
const PARTICLES = [
  { id: 0, x: 5, y: 12, size: 3, dur: 14, delay: 0.5, op: 0.08 },
  { id: 1, x: 15, y: 45, size: 4, dur: 18, delay: 1.2, op: 0.12 },
  { id: 2, x: 25, y: 80, size: 2, dur: 12, delay: 2.8, op: 0.06 },
  { id: 3, x: 35, y: 20, size: 5, dur: 16, delay: 0.3, op: 0.10 },
  { id: 4, x: 42, y: 65, size: 3, dur: 20, delay: 3.5, op: 0.07 },
  { id: 5, x: 55, y: 10, size: 4, dur: 15, delay: 1.8, op: 0.09 },
  { id: 6, x: 62, y: 50, size: 2, dur: 13, delay: 4.0, op: 0.11 },
  { id: 7, x: 70, y: 75, size: 5, dur: 17, delay: 0.8, op: 0.05 },
  { id: 8, x: 78, y: 30, size: 3, dur: 19, delay: 2.0, op: 0.13 },
  { id: 9, x: 85, y: 55, size: 4, dur: 14, delay: 3.0, op: 0.08 },
  { id: 10, x: 92, y: 15, size: 2, dur: 16, delay: 1.5, op: 0.10 },
  { id: 11, x: 8, y: 70, size: 3, dur: 22, delay: 0.2, op: 0.06 },
  { id: 12, x: 18, y: 35, size: 5, dur: 15, delay: 2.5, op: 0.09 },
  { id: 13, x: 30, y: 90, size: 2, dur: 18, delay: 4.5, op: 0.07 },
  { id: 14, x: 48, y: 5, size: 4, dur: 13, delay: 1.0, op: 0.11 },
  { id: 15, x: 58, y: 40, size: 3, dur: 20, delay: 3.2, op: 0.08 },
  { id: 16, x: 68, y: 85, size: 5, dur: 16, delay: 0.6, op: 0.05 },
  { id: 17, x: 75, y: 60, size: 2, dur: 14, delay: 2.2, op: 0.12 },
  { id: 18, x: 88, y: 25, size: 4, dur: 19, delay: 3.8, op: 0.06 },
  { id: 19, x: 95, y: 70, size: 3, dur: 17, delay: 1.3, op: 0.10 },
];

function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] animate-float" />
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px] animate-float-delay" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/[0.02] rounded-full blur-[120px] animate-float-slow" />

      {/* Floating dots — all values are static, animation is CSS-driven */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.op,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Hero Section ───────────────────────────────────────────
function HeroSection({ onGenerate, loading, t }: { onGenerate: () => void; loading: boolean; t: any }) {
  return (
    <section className="relative pt-12 pb-16 text-center">
      {/* Animated badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full glass-card mb-5 sm:mb-6"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-slate-300 text-xs font-medium">AI-Powered Health Intelligence | هوش سلامت مبتنی بر هوش مصنوعی</span>
        <span className="text-slate-500 text-xs">•</span>
        <span className="text-slate-500 text-xs">z-ai/glm-5.2</span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
      >
        <span className="text-white">{t.heroTitle1}</span>
        <br />
        <span className="gradient-text">{t.heroTitle2}</span>
        <span className="text-white"> {t.heroTitle3}</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2"
      >
        {t.heroSubtitle}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={onGenerate}
          disabled={loading}
          className="relative group px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2.5">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                {t.loading}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {t.generateInsights}
              </>
            )}
          </span>
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/10 to-emerald-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          )}
        </motion.button>

        <a
          href="/log"
          className="px-6 py-3.5 glass-card hover:bg-slate-700/30 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t.heroCtaSecondary}
        </a>
      </motion.div>
    </section>
  );
}

// ─── Quick Stats Bar ────────────────────────────────────────
function QuickStats({ t }: { t: any }) {
  const state = useHealthStore();

  const sleepAvg = state.sleep?.averageDuration ?? 0;
  const exCount = state.exercise?.records?.length ?? 0;
  const waterMl = state.water?.todayTotalMl ?? 0;
  const bmiVal = state.bmi?.currentBMI ?? 0;
  const calNet = state.calories?.todayNetBalance ?? 0;

  const stats = [
    { label: t.statSleep, value: `${Math.round(sleepAvg / 60)}h`, icon: '🛏️', color: '#6366f1' },
    { label: t.statExercise, value: `${exCount}`, icon: '🏋️', color: '#f43f5e' },
    { label: t.statWater, value: `${waterMl}ml`, icon: '💧', color: '#06b6d4' },
    { label: t.statBMI, value: `${bmiVal}`, icon: '⚖️', color: '#14b8a6' },
    { label: t.statCalories, value: `${calNet > 0 ? '+' : ''}${calNet}`, icon: '🔥', color: '#f59e0b' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-10"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.05 }}
          className="glass-card rounded-xl p-3 text-center hover:bg-slate-700/20 transition-colors group"
        >
          <span className="text-lg block mb-1 group-hover:scale-110 transition-transform">{s.icon}</span>
          <span className="text-white text-sm font-bold block">{s.value}</span>
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Section Header ─────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <h2 className="text-white font-semibold text-lg">{title}</h2>
        {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Header ─────────────────────────────────────────────────
function Header({ session, language, t }: { session: any; language: string; t: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-sm leading-tight">Health Companion</h1>
              <p className="text-slate-500 text-[10px]">AI-Powered Intelligence</p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '/', label: t.home, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { href: '/log', label: t.addEntry, icon: 'M12 4v16m8-8H4' },
              { href: '/profile', label: t.settings, icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-800/50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => useHealthStore.getState().setLanguage(language === 'en' ? 'fa' : 'en')}
              className="px-2 py-1.5 text-slate-400 hover:text-white text-xs rounded-lg hover:bg-slate-800/50 transition-all font-medium"
            >
              {language === 'en' ? 'فارسی' : 'English'}
            </button>

            {session?.user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-500/20">
                  {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="hidden sm:block px-2.5 py-1.5 text-slate-400 hover:text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-all"
                >
                  {t.signOut}
                </button>
              </div>
            ) : (
              <a
                href="/auth/signin"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
              >
                {t.signIn}
              </a>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-slate-800/50"
            >
              <div className="py-3 space-y-1">
                {[
                  { href: '/', label: t.home },
                  { href: '/log', label: t.addEntry },
                  { href: '/profile', label: t.settings },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 text-slate-400 hover:text-white text-sm rounded-lg hover:bg-slate-800/50"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ─── Footer ─────────────────────────────────────────────────
function Footer({ t, language }: { t: any; language: string }) {
  return (
    <footer className="relative border-t border-slate-800/50 mt-20">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-emerald-500/[0.02] rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm">Health Companion</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              {t.footerBrand}
            </p>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{t.footerModules}</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {MODULE_METADATA.slice(0, 8).map((m) => (
                <span key={m.key} className="text-slate-500 text-xs hover:text-slate-300 cursor-default transition-colors">
                  {m.icon} {language === 'fa' ? m.nameFa : m.nameEn}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{t.footerQuickLinks}</h4>
            <div className="space-y-1.5">
              {[
                { href: '/log', label: t.footerAddHealthEntry },
                { href: '/profile', label: t.footerProfileSettings },
                { href: '/auth/signin', label: t.signIn },
              ].map((link) => (
                <a key={link.href} href={link.href} className="block text-slate-500 text-xs hover:text-emerald-400 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{t.footerPoweredBy}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs">🤖</div>
                <span className="text-slate-500 text-xs">z-ai/glm-5.2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs">⚡</div>
                <span className="text-slate-500 text-xs">Next.js 16</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs">🗄️</div>
                <span className="text-slate-500 text-xs">Prisma + SQLite</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs">🎨</div>
                <span className="text-slate-500 text-xs">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © 2026 AI Health Companion. {t.footerBuiltWith}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {t.footerApiConnected}
            </span>
            <span className="text-slate-700 text-xs">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ──────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const { language, lastAIInsight, setLastAIInsight, loadSampleData, loadFromDB } = useHealthStore();
  const t = LOCALIZATION[language];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setAuthAvailable(true);
      loadFromDB();
    } else {
      setAuthAvailable(false);
    }
  }, [session?.user, loadFromDB]);

  const generateInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const state = useHealthStore.getState();
      const response = await fetch('/api/analyze-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: state }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to analyze health data');
      setLastAIInsight({
        id: 'insight_' + Date.now(),
        generatedAt: new Date().toISOString(),
        healthScore: data.healthScore,
        criticalAlerts: data.criticalAlerts,
        moduleInsights: data.moduleInsights,
        weeklyActionPlan: data.weeklyActionPlan,
        crossModuleCorrelations: data.crossModuleCorrelations,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [setLastAIInsight]);

  return (
    <div className="min-h-screen relative">
      <FloatingParticles />

      <div className="relative z-10">
        <Header session={session} language={language} t={t} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <HeroSection onGenerate={generateInsights} loading={loading} t={t} />

          {/* Quick Stats */}
          <QuickStats t={t} />

          {/* Module Grid */}
          <section className="mb-12">
            <SectionHeader icon="📊" title={t.dashboard} subtitle={t.dashboardSubtitle} />
            <ModuleGrid />
          </section>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Charts */}
          <section className="mb-12">
            <SectionHeader icon="📈" title={t.healthTrends} subtitle={t.healthTrendsSubtitle} />
            <ChartsPanel />
          </section>

          {/* AI Insights */}
          <section className="mb-12">
            <SectionHeader icon="🤖" title={t.aiInsights} subtitle={t.aiInsightsSubtitle} />
            <AIInsightsPanel insight={lastAIInsight ?? null} loading={loading} />
          </section>
        </main>

        <Footer t={t} language={language} />
      </div>
    </div>
  );
}
