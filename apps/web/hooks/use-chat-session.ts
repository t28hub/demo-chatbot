'use client';

import { useChat } from '@ai-sdk/react';
import { type UUID, uuid } from '@demo-chatbot/core';
import { DefaultChatTransport, type UIMessage, validateUIMessages } from 'ai';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useChatStore } from '@/components/chat/chat-store-provider';

export interface UseChatSessionOptions {
  /**
   * Stable ID for the chat session, used for persistence and retrieval.
   */
  readonly id: UUID;
}

export function useChatSession({ id }: UseChatSessionOptions) {
  const store = useChatStore();
  const [hydrated, setHydrated] = useState(false);

  const persist = useCallback(
    (messages: UIMessage[]) => {
      if (messages.length === 0) {
        return;
      }
      // Timestamps are owned by the store; we only supply the content.
      void store.save({ id, title: 'New Chat', messages });
    },
    [store, id],
  );

  const chat = useChat({
    id,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    generateId: uuid,
    // onFinish fires on normal completion AND on abort/disconnect/error. We persist
    // in every case on purpose: it keeps the user's message plus any partial
    // assistant output instead of losing the whole turn when a response fails midway.
    onFinish: ({ messages }) => persist(messages),
  });

  const { messages, status, setMessages } = chat;

  // (1) Persist the user's turn as soon as it is submitted — before the assistant
  // finishes — so closing the tab mid-response does not lose the message. Gated on
  // `hydrated` so we never overwrite an existing chat's history before it loads.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  useEffect(() => {
    if (hydrated && status === 'submitted') {
      persist(messagesRef.current);
    }
  }, [hydrated, status, persist]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const stored = await store.load(id);
      if (active && stored) {
        try {
          // Drop persisted history that no longer matches the current schema
          // rather than crashing the chat.
          const validated = await validateUIMessages({ messages: stored.messages });
          if (active) {
            // (2) Guard against clobbering a message the user sent while loading.
            setMessages((prev) => (prev.length === 0 ? validated : prev));
          }
        } catch {
          await store.delete(id);
        }
      }
      if (active) {
        setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, store, setMessages]);

  return { ...chat, hydrated };
}
