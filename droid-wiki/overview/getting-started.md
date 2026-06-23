# Getting started

Active contributors: Yifeng Wang

This page explains how to install, build, test, and run the project.

## Prerequisites

- Node.js 22 or later
- pnpm 9 (the CI and lockfiles target this version)

## Install the core library

```bash
pnpm install
```

## Build and test

The root package has no runtime build. `pnpm build` runs `tsc` and produces `dist/` declarations. `pnpm test` runs both `typecheck` and `lint`.

```bash
pnpm build      # tsc
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint . --ext .ts,.tsx
pnpm test       # typecheck + lint
```

## Try the examples

The `src/examples/` directory contains self-contained TypeScript files that exercise the grammar types. Each example uses `@ts-expect-error` to document incorrect forms.

```bash
# Verify a specific example
cd src/examples
npx tsc --noEmit example-verb.ts
```

The main examples are:

- `src/examples/example-verb.ts` — godan, ichidan, and irregular verb conjugations.
- `src/examples/example-phrase.ts` — interrogative, conditional, and connected phrases.
- `src/examples/example-why-intensifier.ts` — the `WhyIntensifierPatternWithEmphasis` builder pattern.

## Run the playground locally

The playground is a separate Vite app inside `playground/`. It has its own `pnpm-lock.yaml` and `tsconfig.json`.

```bash
cd playground
pnpm install
pnpm dev
```

The dev server starts on Vite's default port (usually 5173). The playground uses a self-hosted Monaco editor, so type-checking works offline.

## Verify playground content

Two node scripts check that the tutorial content is internally consistent:

```bash
cd playground
pnpm verify:snippets  # every course snippet type-checks and resolves to its displayed sentence
pnpm verify:vocab     # every word used in the course is indexed in the glossary
```

## Deploy the playground

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy-playground.yml`, which builds the playground and deploys it to GitHub Pages. You can also trigger it manually from the Actions tab.
