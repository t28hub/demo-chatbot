import type { ReactNode } from 'react';

import { ChatStoreProvider } from '@/components/chat/chat-store-provider';

export default function Layout({ children }: { children: ReactNode }) {
  return <ChatStoreProvider>{children}</ChatStoreProvider>;
}
