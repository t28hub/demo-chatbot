import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';

import './index.css';

export const metadata: Metadata = {
  title: 'demo chatbot',
  description: 'Demo chatbot application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='flex h-dvh flex-col overflow-hidden'>
        <ThemeProvider attribute='class' defaultTheme='system' disableTransitionOnChange enableSystem>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
