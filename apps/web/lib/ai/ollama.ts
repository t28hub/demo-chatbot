import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: process.env['OLLAMA_BASE_URL'] ?? 'http://localhost:11434/v1',
  apiKey: 'ollama',
});

export const chatModel = ollama(process.env['OLLAMA_MODEL'] ?? 'llama3.2');
