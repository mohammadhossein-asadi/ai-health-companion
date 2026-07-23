'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Unknown error';

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password. Please try again.',
    CallbackRouteError: 'Something went wrong during sign in.',
    OAuthSignin: 'Error starting OAuth sign in.',
    OAuthCallback: 'Error handling OAuth callback.',
    Default: 'An authentication error occurred.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <span className="text-5xl block mb-4">🔒</span>
        <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-slate-400 text-sm mb-6">
          {errorMessages[error] || errorMessages.Default}
        </p>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-6">
          <p className="text-slate-500 text-xs">Error code</p>
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
        <Link
          href="/auth/signin"
          className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
        >
          Try Again
        </Link>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
