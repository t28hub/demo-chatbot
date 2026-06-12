import type { UUID } from '@demo-chatbot/core';
import type { InferSelectModel } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';

export const chat = pgTable('chat', {
  id: uuid('id').$type<UUID>().primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable(
  'message',
  {
    id: uuid('id').$type<UUID>().primaryKey(),
    chatId: uuid('chat_id')
      .$type<UUID>()
      .notNull()
      .references(() => chat.id, { onDelete: 'cascade' }),
    ordinal: integer('ordinal').notNull(),
    role: varchar('role').notNull(),
    parts: jsonb('parts').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [unique().on(table.chatId, table.ordinal)],
);

export type Message = InferSelectModel<typeof message>;
