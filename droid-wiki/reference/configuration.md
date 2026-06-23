# Configuration

Active contributors: Yifeng Wang

This page lists the key configuration files and what they control.

## Root package

### `package.json`

- **Name:** `@typedgrammar/typed-japanese`
- **Version:** `0.1.0`
- **Type:** `module`
- **Entry:** `dist/index.js` (with types at `dist/index.d.ts`)
- **Scripts:**
  - `typecheck`: `tsc --noEmit`
  - `build`: `tsc`
  - `lint`: `eslint . --ext .ts,.tsx`
  - `test`: `pnpm typecheck && pnpm lint`

The package has no runtime dependencies. All listed dependencies are dev dependencies.

### `tsconfig.json`

Targets ES2020, emits CommonJS, and enables a strict set of flags:

- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `forceConsistentCasingInFileNames: true`

It includes `src/**/*.ts` and excludes `node_modules` and `dist`. The output directory is `./dist` and `declaration` is enabled.

### `eslint.config.js`

Uses the new ESLint flat config. It applies `@typescript-eslint/recommended` rules to `**/*.ts` and `**/*.tsx`, with a custom parser project pointing to `tsconfig.json`. It excludes `playground/` from the root project. Special rules include:

- `@typescript-eslint/consistent-type-imports` (error, separate-type-imports fix style)
- `sort-imports` (error, except in `src/examples/`)
- `no-unused-vars` and `@typescript-eslint/no-unused-vars` turned off

## Playground package

### `playground/package.json`

- **Name:** `@typedgrammar/typed-japanese-playground`
- **Private:** `true`
- **Scripts:**
  - `dev`: `vite`
  - `build`: `tsc -b && vite build`
  - `preview`: `vite preview`
  - `typecheck`: `tsc --noEmit`
  - `verify:snippets`: `node scripts/verify-snippets.mjs`
  - `verify:vocab`: `node scripts/verify-vocab.mjs`

### `playground/tsconfig.json`

A separate TypeScript project for the Vite app. It uses React and JSX, and it points to the playground's own source files. It is not included in the root `tsconfig.json`.

### `playground/vite.config.ts`

Configures the Vite React plugin. It handles the `?raw` and `?worker` imports used by `monaco-setup.ts` and `libSources.ts`.

## GitHub Actions

### `.github/workflows/ci.yml`

Runs on push and pull request to `main`. Uses pnpm 9 and Node 22. Executes `pnpm install` and `pnpm run test` at the root.

### `.github/workflows/deploy-playground.yml`

Runs on push to `main` and via `workflow_dispatch`. Builds the playground and deploys it to GitHub Pages. Uses `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`.

## Agent configuration

### `CLAUDE.md`

Guidance for AI agents working in the repository. It defines the issue tracker (`gh` CLI), triage labels, and single-context domain docs (`CONTEXT.md` + `docs/adr/`).

### `docs/agents/`

Contains agent-specific documentation: `issue-tracker.md`, `triage-labels.md`, and `domain.md`.

### `skills-lock.json`

Tracks installed Factory agent skills for this repository.
