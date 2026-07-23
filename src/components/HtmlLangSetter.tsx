'use client';

import { useEffect } from 'react';
import { useHealthStore } from '@/store';

export function HtmlLangSetter() {
  const language = useHealthStore((s) => s.language);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language === 'fa' ? 'fa' : 'en';
    html.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  return null;
}
