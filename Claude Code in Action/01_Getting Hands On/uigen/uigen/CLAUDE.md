# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Style

Use comments sparingly. Only comment complex code.

## Commands

```bash
npm run setup          # First-time setup: install deps + prisma generate + migrate
npm run dev            # Dev server with Turbopack at http://localhost:3000
npm run build          # Production build
npm run test           # Run Vitest test suite
npm run lint           # ESLint
npm run db:reset       # Reset and re-run all migrations (destructive)
```

Run a single test file:
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

**Do not run `npm audit fix`.** Dependencies are pinned to specific versions. Known CVEs are addressed by updating pinned versions directly.

## Architecture

UIGen is an AI-powered React component generator with a live preview. The user describes a component in chat; Claude generates files into a virtual (in-memory) file system; an iframe renders the result using native ES module import maps + Babel.

### AI pipeline (`src/app/api/chat/route.ts`)

The POST handler streams a `streamText` call (Vercel AI SDK) using two tools:

- **`str_replace_editor`** (`src/lib/tools/str-replace.ts`) — create/str_replace/insert operations on the VirtualFileSystem
- **`file_manager`** (`src/lib/tools/file-manager.ts`) — rename/delete on the VirtualFileSystem

`getLanguageModel()` (`src/lib/provider.ts`) returns `anthropic("claude-haiku-4-5")` when `ANTHROPIC_API_KEY` is set; otherwise returns `MockLanguageModel`, which produces canned tool-call sequences without hitting the API. The mock is triggered when the key is missing or still set to `"your-api-key-here"`.

### Virtual file system

`VirtualFileSystem` (`src/lib/file-system.ts`) is a pure in-memory tree — nothing is written to disk. It supports standard CRUD plus `serialize()`/`deserializeFromNodes()` for JSON persistence.

`FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) wraps the VFS for React, exposes `handleToolCall()` which the chat stream calls on each AI tool invocation to keep the client-side view in sync.

### Live preview (`src/components/preview/PreviewFrame.tsx`)

`createImportMap()` (`src/lib/transform/jsx-transformer.ts`) Babel-transforms every JS/JSX/TS/TSX file in the VFS into a blob URL, builds an ES importmap, and resolves third-party packages via `https://esm.sh/`. The preview HTML is injected into an `<iframe>` — no bundler, no server round-trip. The `@/` path alias maps to the VFS root.

The preview entry point is `/App.jsx` by default (Claude is instructed to always create this file).

### Persistence

Prisma + SQLite (`prisma/schema.prisma`). Two models: `User` (email/password) and `Project` (stores serialized messages + VFS data as JSON strings). Anonymous users can use the app; projects are only saved for authenticated users.

Server actions in `src/actions/` handle project CRUD.

Auth uses JWT via the `jose` library (`src/lib/auth.ts`). Passwords are bcrypt-hashed. `src/middleware.ts` protects `/api/projects` and `/api/filesystem`.

### System prompt

`src/lib/prompts/generation.tsx` contains the Claude system prompt. It is injected as the first message with Anthropic prompt caching (`cacheControl: { type: "ephemeral" }`).

### Tests

Vitest + Testing Library (`vitest.config.mts`). Tests live in `__tests__/` directories next to the code they test.
