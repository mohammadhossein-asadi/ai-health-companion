'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useHealthStore } from '@/store';

export default function ProfilePage() {
  const { profile, language, theme, updateProfile, setLanguage, setTheme, loadSampleData } = useHealthStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ updatedAt: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-white font-semibold">Profile & Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-white font-semibold flex items-center gap-2">
            <span>👤</span> Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs block mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={profile.age}
                onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Gender</label>
              <div className="flex gap-2">
                {['male', 'female', 'other'].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateProfile({ gender: g as 'male' | 'female' | 'other' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      profile.gender === g
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => updateProfile({ dateOfBirth: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-white font-semibold flex items-center gap-2">
            <span>⚙️</span> Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs block mb-1">Language</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    language === 'en'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('fa')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    language === 'fa'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  فارسی
                </button>
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-1">Theme</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === 'dark'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-white font-semibold flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={loadSampleData}
              className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/30 rounded-xl text-left transition-colors"
            >
              <span className="text-xl block mb-1">📊</span>
              <span className="text-white text-sm font-medium block">Load Demo Data</span>
              <span className="text-slate-400 text-xs">Populate all modules with sample data</span>
            </button>
            <button
              onClick={handleSave}
              className="p-4 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-left transition-colors"
            >
              <span className="text-xl block mb-1">{saved ? '✅' : '💾'}</span>
              <span className="text-white text-sm font-medium block">{saved ? 'Saved!' : 'Save Profile'}</span>
              <span className="text-slate-400 text-xs">Persist your profile changes</span>
            </button>
          </div>
        </motion.div>

        {/* API Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6"
        >
          <h2 className="text-white font-semibold flex items-center gap-2 mb-3">
            <span>🔌</span> API Configuration
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Model</span>
              <span className="text-white font-mono">z-ai/glm-5.2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Provider</span>
              <span className="text-white font-mono">OpenRouter</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Streaming</span>
              <span className="text-emerald-400 font-mono">Supported</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">User ID</span>
              <span className="text-white font-mono text-xs truncate max-w-[200px]">{profile.id}</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
