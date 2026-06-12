import type { UUID } from '@demo-chatbot/core';

import type { ChatInput, ChatRecord, ChatStore, ChatSummary } from './types';

/**
 * In-memory {@link ChatStore}. Used as a no-op fallback where IndexedDB is
 * unavailable (server render, tests). Data does not survive a reload.
 */
export class MemoryChatStore implements ChatStore {
  private readonly chats = new Map<UUID, ChatRecord>();

  async list(): Promise<ChatSummary[]> {
    return [...this.chats.values()]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }));
  }

  async load(id: UUID): Promise<ChatRecord | null> {
    return this.chats.get(id) ?? null;
  }

  async save(chat: ChatInput): Promise<void> {
    // The store owns timestamps: keep createdAt on update, set it on first insert.
    const now = Date.now();
    const existing = this.chats.get(chat.id);
    this.chats.set(chat.id, {
      ...chat,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
  }

  async delete(id: UUID): Promise<void> {
    this.chats.delete(id);
  }

  async clear(): Promise<void> {
    this.chats.clear();
  }
}
