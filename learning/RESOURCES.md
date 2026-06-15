# Typed Japanese Resources

## Knowledge

### In-repo (highest trust — this is the thing we're learning)
- [blog.md](../blog.md) — *Expressing Japanese Grammar Through TypeScript* (Yifeng Wang).
  The author's own walkthrough. **Use for:** the JS-function → type-level-function
  arc, and the sentence patterns (interrogative, conditional, compound).
- [README.md](../README.md) — the public API surface (verbs, adjectives, phrases).
  **Use for:** what types exist and what they produce.
- [src/verb-types.d.ts](../src/verb-types.d.ts) — ground-truth implementation of
  verb conjugation. **Use for:** the exact conjugation maps and rules.
- [src/examples/](../src/examples/) — runnable examples with `@ts-expect-error`
  checks. **Use for:** seeing correctness verified by the compiler.
- [playground/](../playground/) — in-browser TypeScript editor (also hosted at
  typedgrammar.github.io/typed-japanese). **Use for:** experimenting live.

### TypeScript (official handbook)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
  — building strings at the type level (`` `${A}${B}` ``). Since TS 4.1.
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
  — type-level `if/else` (`T extends U ? X : Y`) and the `infer` keyword.
- [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
  — the overview hub (generics, unions, mapped types).
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
  — how the conjugation lookup maps work.

### Japanese grammar
- [Tofugu — Verb Conjugation Groups](https://www.tofugu.com/japanese-grammar/verb-conjugation-groups/)
  — trusted, beginner-friendly. **Use for:** godan / ichidan / irregular, and the
  reliable test to tell godan from ichidan.

## Wisdom (Communities)
*User has not opted out — suggest lightly when a question needs real-world feedback.*
- [r/LearnJapanese](https://www.reddit.com/r/LearnJapanese/) — grammar questions, well moderated.
- [r/typescript](https://www.reddit.com/r/typescript/) + the TypeScript Discord — type-level help.
- [typed-japanese GitHub Issues](https://github.com/typedgrammar/typed-japanese/issues)
  — project-specific questions and contributions.

## Gaps
- No single trusted source yet that teaches *type-level programming through
  natural language* besides this repo's own blog. The blog is the bridge.
