import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Header } from '@/components/header';

import './index.css';

export const metadata: Metadata = {
  title: 'demo chatbot',
  description: 'Demo chatbot application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='flex min-h-dvh flex-col'>
        <Header />
        {children}
      </body>
    </html>
  );
}
