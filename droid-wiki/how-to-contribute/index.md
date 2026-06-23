# How to contribute

Active contributors: Yifeng Wang

This section explains how to work in the Typed Japanese repository. The project is small, but it has a clear boundary between the type library (compile-time grammar) and the playground (browser learning surface).

## Picking up work

Issues are tracked in GitHub Issues via the `gh` CLI. The repository uses a canonical triage vocabulary defined in `docs/agents/triage-labels.md`: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. Look for issues labeled `ready-for-agent` if you are an AI agent, or `ready-for-human` if you are a regular contributor.

## Domain context

The project maintains a single-context domain model. See `CLAUDE.md` and `docs/agents/domain.md`. The core idea is that Japanese grammar and TypeScript's type system share the same declarative nature: rules are constraints, and sentences are type expressions that the compiler verifies.

## Pull request process

1. Branch from `main`.
2. Make your change. If you add a new grammar feature, include an example in `src/examples/` and update the playground if it is user-facing.
3. Run `pnpm test` at the root and `pnpm typecheck` inside `playground/`.
4. Run `pnpm verify:snippets` and `pnpm verify:vocab` inside `playground/` if you touched the course or glossary.
5. Open a PR against `main`.

## Definition of done

- The root test suite passes (`pnpm test`).
- The playground type-checks (`pnpm typecheck`).
- New grammar examples use `@ts-expect-error` to demonstrate that incorrect forms are rejected.
- New user-facing text is bilingual (English + 简体中文) unless it is a proper noun or code.
- Design changes use tokens from `playground/src/theme.css`.

## Where to start

- **Grammar bug or new conjugation:** edit `src/verb-types.d.ts` or `src/adjective-types.d.ts`, then add an example in `src/examples/`.
- **New course chapter:** add a chapter module under `playground/src/tutorial/chapters/` and update the barrel import.
- **Analyzer improvement:** look at `playground/src/analysis/parse.ts` and `playground/src/analysis/resolve.ts`.
- **UI change:** check `playground/src/theme.css` and the relevant component CSS module.
