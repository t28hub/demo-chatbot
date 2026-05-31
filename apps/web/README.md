# @demo-chatbot/web

Web application for the demo chatbot agent project.

## Development

```sh
pnpm --filter @demo-chatbot/web dev
```

Open http://localhost:3000.

### AI SDK DevTools (optional)

Inspect model requests/responses during local development:

```sh
pnpm --filter @demo-chatbot/web dev:tools
```

Open http://localhost:4983. Local dev only — not active in production builds.

## Structure

- `app/` — App Router pages and layouts
- `next.config.ts` — Next.js config