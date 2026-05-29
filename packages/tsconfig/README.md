# @demo-chatbot/tsconfig

Shared TypeScript config presets for the demo chatbot monorepo.
All presets extend [`@tsconfig/strictest`][strictest].

[strictest]: https://github.com/tsconfig/bases/blob/main/bases/strictest.json

## Installation

From a workspace package directory:

```sh
pnpm add -D @demo-chatbot/tsconfig --workspace
```

## Presets

| Preset  | Use case                                                     |
|:--------|:-------------------------------------------------------------|
| `base`  | Foundation; extended by other presets, not consumed directly |
| `next`  | Next.js applications                                         |
| `react` | React component libraries                                    |

## Usage

Extend the preset that matches the package. `include` / `exclude` are owned by the consumer.

```jsonc
// apps/web/tsconfig.json
{
  "extends": "@demo-chatbot/tsconfig/next",
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

```jsonc
// packages/ui/tsconfig.json
{
  "extends": "@demo-chatbot/tsconfig/react",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```
