# Tooling

Active contributors: Yifeng Wang

This page lists the build, lint, and development tools used across the repository.

## Core library tooling

| Tool | Purpose | Config file |
| --- | --- | --- |
| TypeScript 5.3 | Type checking and declaration generation | `tsconfig.json` |
| ESLint 9 | Linting with flat config | `eslint.config.js` |
| `@typescript-eslint` | TypeScript-specific lint rules | `eslint.config.js` |
| pnpm 9 | Package manager | `package.json` + `pnpm-lock.yaml` |

The root `tsconfig.json` is strict: `strict`, `noImplicitAny`, `noImplicitReturns`, `noUncheckedIndexedAccess`, `noImplicitOverride`, and `noPropertyAccessFromIndexSignature` are all enabled. The output directory is `./dist` and `declaration` is enabled, although the package currently ships only `.d.ts` files.

The root `eslint.config.js` excludes `playground/` because the playground is a separate project with its own toolchain.

## Playground tooling

| Tool | Purpose | Config file |
| --- | --- | --- |
| Vite 5 | Dev server and production bundler | `playground/vite.config.ts` |
| React 18 | UI library | `playground/package.json` |
| TypeScript 5.6 | Type checking | `playground/tsconfig.json` |
| Monaco Editor | In-browser TypeScript editor | `playground/src/monaco-setup.ts` |
| `@monaco-editor/react` | React wrapper for Monaco | `playground/package.json` |

The playground uses Vite's `?raw` and `?worker` imports to bundle the library `.d.ts` files and Monaco workers as part of the build. This makes the playground self-contained and avoids CDN dependencies.

## CI/CD

Two GitHub Actions workflows live in `.github/workflows/`:

- `ci.yml` — runs `pnpm test` on every push and pull request to `main`.
- `deploy-playground.yml` — builds the playground on every push to `main` and deploys it to GitHub Pages.

Both workflows pin Node 22 and pnpm 9.

## Verification scripts

Inside `playground/scripts/`:

- `verify-snippets.mjs` — checks that every course snippet type-checks and resolves to the displayed sentence.
- `verify-vocab.mjs` — checks that every course word is present in the glossary.

These scripts use the `typescript` package directly and run inside the playground's dependency tree.

## Learning materials

The `learn/` and `learning/` directories contain HTML lessons and reference pages generated for personal study. They are tracked in git but are separate from the library and playground. They are not part of the build or test pipeline.
