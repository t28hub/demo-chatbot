'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';

import { type ChatStore, IndexedDBChatStore } from '@/lib/chat/storage';

const ChatStoreContext = createContext<ChatStore | null>(null);

export interface ChatStoreProviderProps {
  readonly children: ReactNode;
  /** Override the default store, e.g. a MemoryChatStore or mock in tests. */
  readonly store?: ChatStore;
}

/**
 * Provides a {@link ChatStore} to the chat subtree. Defaults to IndexedDB but
 * accepts an injected store, so consumers depend on the port rather than on a
 * global singleton.
 */
export function ChatStoreProvider({ children, store }: ChatStoreProviderProps) {
  // Created once per mount. Constructing IndexedDBChatStore is inert on the server
  // (it only touches indexedDB when its methods run, which happens client-side).
  const [value] = useState<ChatStore>(() => store ?? new IndexedDBChatStore());
  return <ChatStoreContext value={value}>{children}</ChatStoreContext>;
}

/** Reads the {@link ChatStore} from context. Must be used within a provider. */
export function useChatStore(): ChatStore {
  const store = useContext(ChatStoreContext);
  if (store === null) {
    throw new Error('useChatStore must be used within a ChatStoreProvider');
  }
  return store;
}
