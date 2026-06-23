# Typed Japanese overview

Active contributors: Yifeng Wang

Typed Japanese is a TypeScript type-level library that expresses Japanese grammar rules entirely inside the type system. You write Japanese words and sentence patterns as types; the TypeScript compiler resolves them to string literals and rejects grammatically incorrect combinations at compile time.

The repository has two main parts: a small core library in `src/` (pure `.d.ts` type definitions) and an interactive React playground in `playground/` that hosts a bilingual grammar course, a live sentence analyzer, and a vocabulary glossary. The playground is deployed automatically to GitHub Pages on every push to `main`.

This project is intentionally educational. It is a bridge between programming language theory and natural language learning, and it also experiments with a typed intermediate format that LLMs could use to return verifiable grammar analysis.

## Quick links

- Core library entry point: `src/index.d.ts`
- Verb conjugation rules: `src/verb-types.d.ts`
- Phrase composition: `src/phrase-types.d.ts`
- Playground app shell: `playground/src/App.tsx`
- Sentence analyzer: `playground/src/analysis/parse.ts`
- Design system: `playground/DESIGN.md`
- Long-form article: `blog.md`
