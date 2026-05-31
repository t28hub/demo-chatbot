import { devToolsMiddleware } from '@ai-sdk/devtools';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { wrapLanguageModel } from 'ai';

import { env } from '@/lib/env';

const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: env.OLLAMA_BASE_URL,
  apiKey: 'ollama',
});

const model = ollama(env.OLLAMA_MODEL);

// AI SDK DevTools is local-dev only and must never run in production, so the
// middleware is applied only outside production builds.
export const chatModel =
  env.NODE_ENV === 'production' ? model : wrapLanguageModel({ model, middleware: devToolsMiddleware() });
