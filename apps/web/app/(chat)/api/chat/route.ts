import { uuid } from '@demo-chatbot/core';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

import { chatModel } from '@/lib/ai/ollama';

import { postRequestBodySchema } from './schema';

export const maxDuration = 30;

export async function POST(request: Request) {
  let messages: UIMessage[];
  try {
    const json = await request.json();
    postRequestBodySchema.parse(json);
    // Use the original payload, not the parsed output, so provider-specific part
    // fields (e.g. text) are preserved instead of being stripped by the schema.
    messages = json.messages as UIMessage[];
  } catch {
    return new Response('Invalid request body', { status: 400 });
  }

  const result = streamText({
    model: chatModel,
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
  });

  // Surface the real error to the client; the default masks it as "An error occurred".
  return result.toUIMessageStreamResponse({
    // UUID assistant ids so every persisted message id matches the uuid column.
    generateMessageId: uuid,
    onError: (error) => (error instanceof Error ? error.message : 'Unknown error'),
  });
}
