# @demo-chatbot/ui

Shared UI primitives and design tokens for the demo chatbot monorepo.

## Installation

From a workspace package directory:

```sh
pnpm add @demo-chatbot/ui --workspace
```

## Theme

Design tokens are defined as Tailwind CSS v4 `@theme` variables in `src/theme.css`. Apps should import them alongside Tailwind itself:

```css
/* apps/web/app/globals.css */
@import "tailwindcss";
@import "@demo-chatbot/ui/theme.css";
```

## Components

Component exports will be added under `src/` and re-exported from `src/index.ts`.