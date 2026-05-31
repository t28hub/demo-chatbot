# @demo-chatbot/core

Shared framework-agnostic primitives for the demo chatbot monorepo.

## Installation

From a workspace package directory:

```sh
pnpm add @demo-chatbot/core --workspace
```

## API

All primitives are re-exported from the package root.

### `Brand<T, B>`

Nominal typing helper. A branded type is not interchangeable with its base type or with other brands, yet adds no runtime overhead.

```ts
import type { Brand } from "@demo-chatbot/core";

type Email = Brand<string, "Email">;

const a: Email = "me@example.com"; // Error: string is not assignable to Email
```

### `UUID` / `uuid()`

`UUID` is `Brand<string, "UUID">`. `uuid()` returns a fresh one via `crypto.randomUUID()`, which is available in both the browser and the Node.js runtime.

```ts
import { uuid, type UUID } from "@demo-chatbot/core";

const id: UUID = uuid();
```