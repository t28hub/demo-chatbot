import type { UUID } from '@demo-chatbot/core';
import type { UIMessage } from 'ai';

import type { ChatInput, ChatRecord, ChatStore, ChatSummary } from './types';

const DB_NAME = 'demo-chatbot';
const DB_VERSION = 2;
const CHATS = 'chats';
const MESSAGES = 'messages';
/** Index on `messages` for looking up every message of a chat. */
const BY_CHAT = 'chatId';

/** Chat row without its messages; messages live in their own store. */
type ChatMetaRow = Omit<ChatRecord, 'messages'>;

/** One row in the `messages` store: a UIMessage plus its chat link and position. */
interface MessageRow {
  readonly id: string;
  readonly chatId: UUID;
  /** Position within the conversation, so order survives the split. */
  readonly order: number;
  readonly message: UIMessage;
}

/** Wraps an IDBRequest in a promise so the store can use async/await. */
function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Resolves once a (multi-store) transaction commits, so writes are atomic. */
function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/**
 * IndexedDB-backed {@link ChatStore}. A conversation is split across two stores —
 * `chats` (metadata) and `messages` (one row per message, linked by `chatId`) —
 * mirroring a normalized chats/messages table pair. The split is internal: the
 * {@link ChatStore} port still treats a chat and its messages as one aggregate,
 * loaded and saved together within a single transaction.
 *
 * Uses the raw IndexedDB API (promisified) to avoid a dependency.
 */
export class IndexedDBChatStore implements ChatStore {
  private dbPromise: Promise<IDBDatabase> | undefined;

  private open(): Promise<IDBDatabase> {
    // Cache the connection so repeated calls reuse a single open database.
    this.dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(CHATS)) {
          db.createObjectStore(CHATS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(MESSAGES)) {
          const messages = db.createObjectStore(MESSAGES, { keyPath: 'id' });
          messages.createIndex(BY_CHAT, 'chatId', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.dbPromise;
  }

  private async tx(stores: string | string[], mode: IDBTransactionMode): Promise<IDBTransaction> {
    const db = await this.open();
    return db.transaction(stores, mode);
  }

  async list(): Promise<ChatSummary[]> {
    const tx = await this.tx(CHATS, 'readonly');
    const chats = await promisify<ChatMetaRow[]>(tx.objectStore(CHATS).getAll());
    return chats
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }));
  }

  async load(id: UUID): Promise<ChatRecord | null> {
    const tx = await this.tx([CHATS, MESSAGES], 'readonly');
    const meta = await promisify<ChatMetaRow | undefined>(tx.objectStore(CHATS).get(id));
    if (!meta) {
      return null;
    }
    const index = tx.objectStore(MESSAGES).index(BY_CHAT);
    const rows = await promisify<MessageRow[]>(index.getAll(id));
    const messages = rows.sort((a, b) => a.order - b.order).map((row) => row.message);
    return { ...meta, messages };
  }

  async save(chat: ChatInput): Promise<void> {
    const tx = await this.tx([CHATS, MESSAGES], 'readwrite');
    const chatStore = tx.objectStore(CHATS);
    const messageStore = tx.objectStore(MESSAGES);

    // The store owns timestamps: keep createdAt on update, set it on first insert.
    const now = Date.now();
    const existing = await promisify<ChatMetaRow | undefined>(chatStore.get(chat.id));
    chatStore.put({
      id: chat.id,
      title: chat.title,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    } satisfies ChatMetaRow);

    // Replace the chat's messages wholesale: the SDK hands us the full array each
    // turn, and rewriting drops any messages removed by a regenerate/edit.
    const staleKeys = await promisify<IDBValidKey[]>(messageStore.index(BY_CHAT).getAllKeys(chat.id));
    for (const key of staleKeys) {
      messageStore.delete(key);
    }
    chat.messages.forEach((message, order) => {
      messageStore.put({ id: message.id, chatId: chat.id, order, message } satisfies MessageRow);
    });
    await txDone(tx);
  }

  async delete(id: UUID): Promise<void> {
    const tx = await this.tx([CHATS, MESSAGES], 'readwrite');
    const messageStore = tx.objectStore(MESSAGES);
    tx.objectStore(CHATS).delete(id);
    const keys = await promisify<IDBValidKey[]>(messageStore.index(BY_CHAT).getAllKeys(id));
    for (const key of keys) {
      messageStore.delete(key);
    }
    await txDone(tx);
  }

  async clear(): Promise<void> {
    const tx = await this.tx([CHATS, MESSAGES], 'readwrite');
    tx.objectStore(CHATS).clear();
    tx.objectStore(MESSAGES).clear();
    await txDone(tx);
  }
}
