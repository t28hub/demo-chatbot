import type { UUID } from '@demo-chatbot/core';
import { z } from 'zod';

const textPartSchema = z.object({
  type: z.enum(['text']),
  text: z.string().min(1).max(2000),
});

const messagePartSchema = z.union([textPartSchema]);

const userMessageSchema = z.object({
  id: z.uuid().transform((value) => value as UUID),
  role: z.enum(['user']),
  parts: z.array(messagePartSchema).min(1),
});

const historyMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['assistant', 'system']),
  parts: z.array(z.object({ type: z.string() })),
});

export const postRequestBodySchema = z.object({
  messages: z.array(z.union([userMessageSchema, historyMessageSchema])).min(1),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
