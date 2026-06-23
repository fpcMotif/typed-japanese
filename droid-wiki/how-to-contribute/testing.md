# Testing

Active contributors: Yifeng Wang

Typed Japanese has no unit tests in the traditional sense. The "tests" are the TypeScript compiler itself and a small set of lint rules. The playground adds verification scripts that check the integrity of the course content.

## Root test suite

`package.json` defines the test script as:

```bash
pnpm test  # runs pnpm typecheck && pnpm lint
```

### Typecheck

`pnpm typecheck` runs `tsc --noEmit` with the strict `tsconfig.json` in the root. Because the library is type-level, this is the primary correctness check. Every example in `src/examples/` is included in the compilation, so `@ts-expect-error` directives in those files are validated by the compiler.

### Lint

`pnpm lint` runs ESLint over `**/*.ts` and `**/*.tsx`, excluding `node_modules`, `dist/`, and the `playground/` directory. The config is `eslint.config.js`. It enforces `import type` and sorted imports but does not flag unused variables, since type-level code often keeps declarations for teaching or testing purposes.

## Playground verification

Inside `playground/`, there are two content verification scripts:

### `pnpm verify:snippets`

`playground/scripts/verify-snippets.mjs` checks every example in the grammar course. It loads the library `.d.ts` files, the chapter content, and a small in-memory TypeScript compiler. It asserts that:

- The snippet type-checks.
- The last declared type alias resolves to exactly the Japanese sentence shown in the course.

If a sentence and its type diverge, the script fails.

### `pnpm verify:vocab`

`playground/scripts/verify-vocab.mjs` checks that every word used in the course examples is present in the merged vocabulary table. It tokenizes the example sentences using the same longest-match logic as the analyzer and reports any missing words.

## Example files as tests

The `src/examples/` directory is the closest thing to a test suite. Each file contains a set of type declarations and a series of `const` assertions with `@ts-expect-error` comments for incorrect forms. For example, `src/examples/example-verb.ts` asserts that `話すます形` resolves to `話し` and that `話す` does not.

## When to add tests

- Add a new example file in `src/examples/` when you add a new grammar constructor or verb class.
- Add a new example to an existing file when you extend an existing rule.
- Run the verification scripts when you modify the course or glossary.
