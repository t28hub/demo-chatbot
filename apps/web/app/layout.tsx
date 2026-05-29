import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './index.css';

export const metadata: Metadata = {
  title: 'demo chatbot',
  description: 'Demo chatbot application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
