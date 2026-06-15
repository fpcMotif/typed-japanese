# Mission: Typed Japanese — TypeScript types ⨯ Japanese grammar

## Why
Grow TypeScript and Japanese **together**, using this repository as the vehicle.
The concrete payoff: turn `tsc` into a study partner — read and write Typed
Japanese type definitions where the compiler itself confirms whether a Japanese
sentence is grammatically correct. Learning one side reinforces the other.

## Success looks like
- Read any line in `src/` (e.g. `ConjugateVerb<話す, "ます形">`) and explain *both*
  what the TypeScript does and what the Japanese means.
- Define a new verb as a type and conjugate it through the type system, with
  `tsc` confirming the result.
- Classify a Japanese verb as godan / ichidan / irregular and split it into
  stem + ending.
- Compose a small new sentence type and have the compiler verify it.

## Constraints
- Lessons in **simple English**.
- Background: **a bit of both** TS/JS and Japanese — don't re-explain variables
  or kana; *do* build up advanced type-level programming and conjugation logic.
- Lessons stay short and tied to this repo.

## Out of scope (for now)
- Speaking / listening / handwriting Japanese.
- Building the React playground UI itself.
- TypeScript unrelated to type-level programming (app frameworks, runtime code).
