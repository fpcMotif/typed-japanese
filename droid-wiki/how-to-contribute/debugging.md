# Debugging

Active contributors: Yifeng Wang

This page lists common errors and how to diagnose them in the core library and the playground.

## Type-level errors in the library

### "Type ... is not assignable to type ..."

This is the main signal that a grammar rule is wrong. For example, if `ConjugateVerb<話す, "て形">` resolves to `話して` but you expected `話して`, the difference will surface as a type error in an example file.

Use the TypeScript language service in VS Code or the playground to hover over the type and read the resolved literal. If the resolved string is unexpected, trace the conditional branches in the relevant map:

- Godan verbs: `GodanConjugationMap` in `src/verb-types.d.ts`.
- Ichidan verbs: the `IchidanVerb` branch of `ConjugateVerb` in `src/verb-types.d.ts`.
- Irregular verbs: `IrregularConjugationMap` in `src/verb-types.d.ts`.
- Adjectives: `IAdjectiveConjugationMap` and `IrregularAdjectiveMap` in `src/adjective-types.d.ts`.

### `@ts-expect-error` not producing an error

If a line marked with `@ts-expect-error` compiles without error, the test is no longer testing what you think. Either the rule became too permissive or the example is now valid. Remove the directive or update the assertion.

### `never` results

A type that resolves to `never` usually means a conditional type did not match any branch. Check that the input type satisfies the generic constraint and that the lookup map has an entry for the combination of keys.

## Playground errors

### Analyzer shows "Loading" or no tree

The analyzer needs Monaco and the TypeScript worker to be fully initialized. If the tree never appears, check the browser console for worker errors. The most common cause is a failed Monaco worker load, which should not happen with the self-hosted setup in `playground/src/monaco-setup.ts`.

### Tree nodes are not resolved

If a node shows no Japanese value, `playground/src/analysis/resolve.ts` failed to extract a string literal from Monaco's quick info. Possible causes:

- The type fragment is not a plain string literal (for example, a verb object type).
- The hidden analysis model was not updated after an edit.
- A type error in the editor prevents the type from resolving.

### Course snippet verification fails

Run `pnpm verify:snippets` and look at the failing chapter. The error message usually contains the expected sentence and the resolved sentence. Check whether:

- The chapter code is self-contained (imports the right types and defines all words).
- The last alias matches the displayed Japanese sentence.
- A recent grammar change affected the conjugation output.

### Vocab verification fails

Run `pnpm verify:vocab`. If it reports a missing word, either add the word to `playground/src/vocab/entries/` or `playground/src/vocab/function-words.ts`, or check that the word is tokenized correctly. Long kanji compounds are kept together if they are not in the vocabulary table, so unknown compounds will be reported as missing.

## Build and CI errors

### Root `pnpm test` fails

Run `pnpm typecheck` and `pnpm lint` separately to see which one is failing. Lint errors often involve import ordering or missing `import type`.

### Playground build fails

Run `pnpm typecheck` inside `playground/` first. The playground has its own `tsconfig.json` with a stricter `module` setting. Errors there are independent of the root test suite.

### GitHub Pages deployment fails

Check the `deploy-playground.yml` workflow. Common causes are pnpm version mismatches, Node 22 not being available, or a build failure inside `playground/`.
