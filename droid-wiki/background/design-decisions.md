# Design decisions

Active contributors: Yifeng Wang

This page explains the high-level decisions that shaped Typed Japanese.

## Why model grammar in TypeScript types?

TypeScript's type system has three features that map naturally onto natural-language grammar:

1. **String literal types** let you represent individual morphemes as exact strings.
2. **Template literal types** let you concatenate morphemes into larger words and phrases.
3. **Conditional types** let you branch on a verb class or conjugation form, similar to how linguists write inflection rules.

By encoding grammar at the type level, the compiler becomes a verifier. A sentence is not a string at runtime; it is a type that the compiler checks. If you write an incorrect conjugation, the compiler rejects it before the program ever runs. This turns linguistic mistakes into compile-time errors, which is the project's central educational hook.

## Why use only `.d.ts` files for the library?

The core library has no runtime behavior. It is a vocabulary of types and constructors that other TypeScript code can use. Shipping only declaration files keeps the package small, avoids runtime dependencies, and makes the boundaries clear: everything interesting happens at compile time.

The playground loads the same `.d.ts` files into Monaco as extra libs, so the in-browser compiler and the npm package share the same source of truth.

## Why a self-hosted Monaco editor?

The original `@monaco-editor/react` setup loads Monaco workers from a CDN by default. This silently fails in many browsers because the TypeScript web worker is loaded cross-origin, leaving the editor with syntax highlighting but no type checking. The playground instead bundles the editor and workers locally via Vite, so type-checking works offline and in every browser.

## Why parse the analyzer with `ts.createSourceFile`?

The analyzer needs to turn a type alias like `ConditionalPhrase<ヒンメル, "なら", DemonstrativeAction<"そう", する, "た形">>` into a tree. The most reliable way to do this is to use the same parser the TypeScript compiler uses. `ts.createSourceFile` walks the AST and extracts the constructor names and type arguments. The values are then resolved by asking Monaco's TypeScript worker for the instantiated string literals.

## Why bilingual content?

The project targets two audiences: English-speaking learners and Chinese-speaking learners. Both languages are kept at equal depth in the UI and course. The `t(en, zh)` helper in `playground/src/context/lang.tsx` switches between them at runtime. Bilingual content also makes the project useful for cross-linguistic comparison.

## Why the "Washi & Sumi" theme?

The design system is meant to feel like a language textbook, not a generic IDE. Warm paper, dark ink, and a single sakura accent create an editorial atmosphere that matches the project's focus on grammar and learning. The same theme is mirrored on the public landing page so the product feels coherent.

## The AI-assisted learning angle

Typed Japanese is not just a programming curiosity. The `blog.md` article argues that LLMs can now annotate natural-language sentences with TypeScript types accurately enough to give learners strongly typed feedback. The project is a prototype of that workflow: a human writes a sentence as a type, and the compiler verifies the grammar. Future work could let an LLM generate the types and a learner read the results, without needing to know TypeScript themselves.

## What is out of scope

The project deliberately does not parse arbitrary Japanese strings back into grammar types. That is a much harder problem and is left to LLMs. The scope is strictly one-way: type expressions → verified string literals.
