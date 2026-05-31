import type { Brand } from './brand';

// A UUID is a string, branded so an arbitrary string cannot be used where a UUID
// is expected without going through uuid() (or an explicit assertion).
export type UUID = Brand<string, 'UUID'>;

// Centralized UUID generation so the implementation can be swapped in one place.
// crypto.randomUUID is available in both the browser and the Node.js runtime.
export function uuid(): UUID {
  return crypto.randomUUID() as UUID;
}
