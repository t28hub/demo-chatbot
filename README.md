# demo-agent

Demo chatbot application with Next.js and the AI SDK.

## Structure

- `apps/` — runnable applications
- `packages/` — shared libraries

## Development

Requires Node 24+ and pnpm 11+. The pre-commit hook also runs
[gitleaks](https://github.com/gitleaks/gitleaks) — install it
separately (`brew install gitleaks` on macOS).

```sh
pnpm install
pnpm dev
```