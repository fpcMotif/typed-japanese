# Lore

Active contributors: Yifeng Wang

Typed Japanese has had two distinct phases so far: a quiet 2025 spring spent building the type library, and a rapid 2026 summer that turned it into a complete learning surface.

## Eras

### The type library (March 2025)

The project started on 2025-03-18 with a single commit: `feat: init with verb conjugation support`. Over the next two weeks Yifeng Wang added the remaining grammar primitives: adjectives, phrases, adverbs, nouns, and a handful of example sentences. The March era also produced the long-form `blog.md` article that walks readers from imperative JavaScript to Japanese conditional sentences via TypeScript's type system.

Key events:

- 2025-03-18 — Godan, ichidan, and irregular verb conjugation types land.
- 2025-03-19 — Adjective, phrase, adverb, and noun types are added; the package is configured for npm; CI is wired up.
- 2025-03-24 — The blog post reaches its first complete version.
- 2025-03-29 — A commit titled "日本語はわかってたのに、なんでもっとTypeScriptを知ろうと思わなかったんだろう" ("I understood Japanese, so why didn't I think to learn more TypeScript?") signals the moment the author realized the two domains could illuminate each other.

### The interactive playground (June 2026)

After a year-long gap, development resumed in June 2026 with a shift from a static library to a browser-based learning tool. The playground went from a simple visual demo to a full course, analyzer, and glossary in about five days.

Key events:

- 2026-06-14 — `feat: add interactive visual playground` lands the first Vite + React + Monaco implementation.
- 2026-06-14 — GitHub Pages deployment is configured in `.github/workflows/deploy-playground.yml`.
- 2026-06-14 — The 47-chapter bilingual grammar course is introduced.
- 2026-06-14 — Vocabulary table with click-to-read lookup is added.
- 2026-06-15 — The "Washi & Sumi" sakura design system is unified with full dark mode support.
- 2026-06-15 — Agent config, docs, and learning materials are added to make the repo easier for AI agents to work with.

### Agent-friendly documentation (June 2026)

The final June 2026 commit added `CLAUDE.md`, `docs/agents/`, `learn/`, `learning/`, and `skills-lock.json`. This established a single-context domain model and a canonical triage vocabulary for future AI-assisted work.

## Longest-standing features

The verb conjugation system in `src/verb-types.d.ts` has survived unchanged since the first commit. It is the oldest continuous subsystem and still the foundation of every phrase type. The adjective and phrase types added on 2025-03-19 are also largely unchanged, although the phrase system was extended for the playground's grammar course.

## Major rewrites

- **Course restructuring (2026-06-14)** — The original grammar course was reorganized into a more intuitive tutorial with chapters grouped by elementary, intermediate, and advanced levels. Two consecutive commits (`docs(course): restructure 47-chapter grammar course into an intuitive tutorial`) document this.
- **Theme unification (2026-06-15)** — The playground and landing page were brought under one "Washi & Sumi" sakura theme with full dark mode support.

## Deprecated features

Nothing has been formally deprecated yet. The repository is young and has grown by accretion rather than replacement.
