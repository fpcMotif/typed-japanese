# Dependencies

Active contributors: Yifeng Wang

This page lists the runtime and development dependencies for the root package and the playground.

## Root package dev dependencies

The root package has no runtime dependencies. Everything is a dev dependency used for type checking and linting.

| Package | Version | Purpose |
| --- | --- | --- |
| `typescript` | `^5.3.3` | Type checking and `.d.ts` emission |
| `eslint` | `^9.22.0` | Linting with flat config |
| `@eslint/js` | `^9.22.0` | ESLint's own recommended rules |
| `@typescript-eslint/eslint-plugin` | `^8.26.1` | TypeScript-specific lint rules |
| `@typescript-eslint/parser` | `^8.26.1` | Parse TypeScript for ESLint |

## Playground dependencies

The playground is a private Vite + React app with its own dependency tree.

### Runtime dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| `react` | `^18.3.1` | UI framework |
| `react-dom` | `^18.3.1` | React DOM renderer |
| `typescript` | `^5.6.3` | In-browser type checking and parsing |
| `monaco-editor` | `^0.52.2` | Self-hosted code editor and TypeScript worker |
| `@monaco-editor/react` | `^4.6.0` | React wrapper for Monaco |

### Development dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| `vite` | `^5.4.11` | Dev server and bundler |
| `@vitejs/plugin-react` | `^4.3.4` | React plugin for Vite |
| `@types/react` | `^18.3.12` | React type definitions |
| `@types/react-dom` | `^18.3.1` | React DOM type definitions |

## Lockfiles

- `pnpm-lock.yaml` — root package lockfile.
- `playground/pnpm-lock.yaml` — playground lockfile.

Both target pnpm 9.

## Dependency freshness

The dependencies are recent as of the repository's last update in June 2026. TypeScript 5.3 is the oldest direct dependency, but the playground uses 5.6. There are no deprecated or flagged packages in the lockfiles that are visible at a glance.
