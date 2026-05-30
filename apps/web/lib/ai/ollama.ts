import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

import { env } from '@/lib/env';

const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: env.OLLAMA_BASE_URL,
  apiKey: 'ollama',
});

export const chatModel = ollama(env.OLLAMA_MODEL);
