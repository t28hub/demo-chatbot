import 'server-only';

import { z } from 'zod';

// Centralized, validated access to environment variables. Parsed once at import
// so misconfiguration fails fast; defaults keep local development zero-config.
const envSchema = z.object({
  OLLAMA_BASE_URL: z.url().default('http://localhost:11434/v1'),
  OLLAMA_MODEL: z.string().min(1).default('llama3.3'),
});

export const env = envSchema.parse(process.env);
