import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { HtmlLangSetter } from '@/components/HtmlLangSetter';

export const metadata: Metadata = {
  title: 'AI Health Companion',
  description: 'Your Personal Health Intelligence — 10 interconnected health modules powered by AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>
          <HtmlLangSetter />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
