# Patterns and conventions

Active contributors: Yifeng Wang

This page documents the coding conventions that keep the codebase consistent across the type library and the playground.

## Type-level programming style

The core library is written entirely in `.d.ts` files because it has no runtime behavior. Every grammar operation is a generic type that manipulates string literal types and conditional types. The style is intentionally declarative: you describe what a conjugated form is, not how to compute it step by step.

Key conventions in the type library:

- Use object types to model lexical entries (verbs, adjectives) so properties can be inspected by conditional types. For example, `GodanVerb` has `stem` and `ending`.
- Store conjugation tables as mapped types (`GodanConjugationMap`, `IrregularConjugationMap`) so the rules are readable as data rather than nested conditional logic.
- Use template literal types to concatenate kana. Avoid runtime string methods.
- Keep exported type names in Japanese grammatical terminology (辞書形, て形, etc.) so the code reads as a grammar textbook.

## Lint and formatting

The root ESLint config is `eslint.config.js`. It enforces:

- `@typescript-eslint/consistent-type-imports` — all type imports must use `import type` with the separate-type-imports fix style.
- `sort-imports` — declaration groups are sorted by member syntax order (`none`, `all`, `multiple`, `single`).
- `no-unused-vars` and `@typescript-eslint/no-unused-vars` are turned off, which is common in type-level code where declarations are part of the test surface.
- Files in `src/examples/` are exempt from `sort-imports` so examples can be read in teaching order.

The playground is excluded from root linting because it has its own `tsconfig.json` and typecheck. It still runs TypeScript strict mode.

## Bilingual content

The playground UI and grammar course are bilingual (English and 简体中文). The pattern is a helper function `t(en, zh)` that picks the active language. All new user-facing text should provide both strings. Chapter and example content is defined in `playground/src/tutorial/chapters/` and uses the `Chapter`, `GrammarPoint`, and `Example` interfaces from `playground/src/tutorial/types.ts`.

## File naming

- Lowercase with hyphens: `verb-types.d.ts`, `example-hinmeru.ts`.
- Chapter files are numbered by level and order: `e01.ts`, `i13.ts`, `a12.ts`.
- CSS modules live next to their components: `Analyzer.tsx` and `Analyzer.module.css`.

## Design system tokens

All UI color, spacing, and typography must use tokens from `playground/src/theme.css`. Never use raw hex values or `rgba()` in component CSS. This keeps the dark and light themes consistent. See the [design system](../systems/design-system.md) page for the full token set.
