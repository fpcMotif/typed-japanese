# Systems

Active contributors: Yifeng Wang

The systems section covers the internal building blocks of Typed Japanese. These are not deployable apps; they are the type-level modules and design language that the playground builds on top of.

| Page | What it covers |
| --- | --- |
| [Verb conjugation](verb-conjugation.md) | `GodanVerb`, `IchidanVerb`, `IrregularVerb`, and `ConjugateVerb<V, Form>` |
| [Adjective conjugation](adjective-conjugation.md) | `IAdjective`, `NaAdjective`, and `ConjugateAdjective<A, Form>` |
| [Phrase composition](phrase-composition.md) | Particles, conditional phrases, interrogative phrases, and the `PhrasePart` builder |
| [Design system](design-system.md) | The "Washi & Sumi" sakura theme and CSS tokens |

All grammar systems live under `src/` as `.d.ts` declaration files. The playground imports them as raw text and registers them as Monaco extra libs so the in-browser editor can resolve them. See the [architecture overview](../overview/architecture.md) for the full system diagram.
