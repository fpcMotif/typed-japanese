# Fun facts

Active contributors: Yifeng Wang

A handful of small details that make the project distinctive.

## Oldest surviving code

`src/verb-types.d.ts` was created in the very first commit on 2025-03-18 and still defines the core `ConjugateVerb` type today. It is the oldest continuous file in the repository and has survived every refactor, including the entire 2026 playground expansion.

## Zero TODO comments

A search of `src/`, `playground/`, `learn/`, and `learning/` finds no `TODO`, `FIXME`, `HACK`, or `XXX` comments. The codebase is either small enough or recent enough that the author has not accumulated technical-debt markers yet.

## No runtime code in the core library

The root package ships only `.d.ts` files. There is no `src/index.ts`, no runtime functions, and no JavaScript output. Every grammar operation is a compile-time type transformation. The only runtime code lives in the optional playground and the verification scripts.

## Anime references as test cases

The examples use sentences from well-known Japanese media:

- "ヒンメルならそうした" (Himmel would have done the same) — from *Frieren: Beyond Journey's End*.
- "なんで春日影やったの" (Why did you play *Kasukage*?) — associated with *BanG Dream! It's MyGO!!!!!*.
- "いいよ、来いよ" (Good times, come on!) — from *Toriko*.
- "なんでそんなに慣れてんだよ" (Why are you so used to it?!) — a popular meme line.

These are not just easter eggs; they are the primary test cases for conditional phrases, interrogative phrases, and the `WhyIntensifierPatternWithEmphasis` builder.

## The name "Washi & Sumi"

The playground design system is called *Washi & Sumi* (和紙・墨), which translates to "Japanese paper and ink." The palette is built on three concepts: washi paper for surfaces, sumi ink for text, and a single dusty-rose sakura accent. The name is documented in `playground/DESIGN.md`.

## 47 chapters and 380+ snippets

The grammar course has 47 chapters spanning elementary, intermediate, and advanced levels. Every example sentence is backed by a self-contained Typed Japanese snippet, and `pnpm verify:snippets` checks that each snippet resolves to exactly the displayed sentence. The exact number of snippets is not fixed in code; the README mentions "380+".

## The longest file

The longest source file is `playground/src/analysis/parse.ts` at 362 lines. It handles parsing the TypeScript source, tokenizing Japanese literals against the vocabulary table, and building the composition tree for the analyzer.
