import type { UUID } from '@demo-chatbot/core';
import type { UIMessage } from 'ai';

/**
 * A single persisted conversation. `messages` is the UIMessage[] source of truth
 * the AI SDK uses to render and resume the chat.
 */
export interface ChatRecord {
  readonly id: UUID;
  /** Derived from the first user message; shown in a future conversation list. */
  readonly title: string;
  readonly messages: UIMessage[];
  /** Epoch milliseconds. Owned by the store: set on insert, kept on update. */
  readonly createdAt: number;
  /** Epoch milliseconds. Owned by the store: refreshed on every save. */
  readonly updatedAt: number;
}

/** Lightweight projection for listing conversations without loading every message. */
export type ChatSummary = Pick<ChatRecord, 'id' | 'title' | 'updatedAt'>;

/** Caller-supplied fields for a save; the store stamps the timestamps itself. */
export type ChatInput = Pick<ChatRecord, 'id' | 'title' | 'messages'>;

/**
 * Storage port. The chat UI depends only on this interface, so the backing store
 * (IndexedDB today; OPFS, a server, or an encrypted store later) can be swapped
 * without touching consumers.
 */
export interface ChatStore {
  list(): Promise<ChatSummary[]>;
  load(id: UUID): Promise<ChatRecord | null>;
  save(chat: ChatInput): Promise<void>;
  delete(id: UUID): Promise<void>;
  clear(): Promise<void>;
}
