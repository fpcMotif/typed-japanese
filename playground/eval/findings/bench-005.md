# Eval round 005 — findings (2026-06-21 05:17 UTC)

Conformance **97.5%** over 12/12 items.

## Per-item

- `b5-0` (benchmark e01) **conforms** 12/12 · 0 issue(s) — 私は学生です
- `b5-1` (benchmark i05) **conforms** 11.67/12 · 2 issue(s) — すぐ参ります
- `b5-2` (benchmark i14) **conforms** 11.67/12 · 4 issue(s) — 行きますが遅れます
- `b5-3` (benchmark e08) **conforms** 12/12 · 1 issue(s) — 昨日は寒かった
- `b5-4` (benchmark a12) **conforms** 12/12 · 0 issue(s) — 言語は文化である
- `b5-5` (benchmark e19) **conforms** 12/12 · 0 issue(s) — コーヒーを飲もう
- `b5-6` (benchmark i08) **conforms** 11.33/12 · 2 issue(s) — 早く寝るようにしてください
- `b5-7` (benchmark i06) **conforms** 11/12 · 2 issue(s) — 読めば読むほど面白い
- `b5-8` (benchmark a03) **conforms** 10.67/12 · 5 issue(s) — 今日は休むわけにはいきません
- `b5-9` (benchmark e17) **conforms** 12/12 · 0 issue(s) — 今日は来なくてもいいです
- `b5-10` (benchmark a12) **conforms** 12/12 · 6 issue(s) — 知らぬ人に声をかけられた
- `b5-11` (benchmark i10) **conforms** 12/12 · 0 issue(s) — 本当のことを言うべきだ

## Proposed fixes (routed)

### [ts-def] Label が as both 格助詞 (subject) and 接続助詞 (contrastive "but")  _(confidence: medium, 4 items)_
- dimensions: D3, D6
- rationale: All four b5-2 issues stem from one gap: the Particle union comments が solely as 'Subject marker' and there is no clause-connective particle category. In 行きますが遅れます the が is the 接続助詞 'but' joining two predicates, so attaching it via PhraseWithParticle/ParticlePart is semantically mislabeled even though it is the only honest encoding. Fixing the union comment is a one-line, value-preserving ts-def change that addresses the most-repeated cluster.
- change: In src/phrase-types.d.ts, change the が entry comment from `// Subject marker` to note both roles, e.g. `// 格助詞 subject marker; also 接続助詞 contrastive 'but' joining clauses`, and add a doc comment above ParticlePart that a clause-medial が/けど after a predicate is the 接続助詞 reading. No value-type change, so snippets keep resolving.

### [content] Re-annotate the legacy template-literal benchmark chapters into Sentence<[...]> form  _(confidence: high, 5 items)_
- dimensions: D2, D3, D6
- rationale: Every D6 'legacy shape' issue (b5-1 すぐ参ります, the raw-literal particles in b5-7 ほど and b5-8 stranded は) traces to tutorial chapters (a03, a12, i05, i06, i14) written in the old template-literal+raw-literal style. The current annotate prompt already MANDATES Sentence<[...parts]> with every particle as its own ParticlePart and rejects template-literal glue, so these snippets predate the prompt and just need regenerating. This single change lifts the most sampled items.
- change: Run scripts/annotate.ts over the affected final aliases in chapters a03.ts (道理で…, 彼は来ない…), a12.ts, i05.ts, i06.ts, i14.ts to convert each template literal into Sentence<[...]>, wrapping すぐ as AdverbPart and ほど/は/が as ParticlePart, while keeping ぬ/わけにはいかない as literals/SuffixPart per the existing D6 carve-out.

### [prompt] Add a rule to wrap 副助詞 ほど/より/だけ/しか and 接続助詞 ば as their own parts  _(confidence: medium, 3 items)_
- dimensions: D3, D6
- rationale: b5-7 (high severity) leaves ほど and ば as raw template literals; b5-8 leaves the topic は inside わけには as a raw literal. The prompt covers 接続助詞 after Te-forms and particle stacking, but does not explicitly call out 副助詞 like ほど in the comparative Vば…Vほど construction. A short added bullet generalizes beyond these items.
- change: In annotate.ts hard rules, add a bullet: 'Every 副助詞 (ほど・だけ・しか・ばかり・こそ・さえ・より) and 接続助詞 ば/ても/たら must be its own ParticlePart even inside fixed comparative/conditional patterns (Vば…Vほど); never leave them as raw literals between typed units.'

### [ts-def] Add composable Passive+Ta (and Causative+Ta) conjugation forms  _(confidence: low, 1 items)_
- dimensions: D4, D6
- rationale: b5-10 repeatedly notes かけられた must append a raw た literal because ConjugateVerb cannot chain Passive then Ta in one call. The rubric explicitly does NOT penalize this, so it is low priority, but a PassivePast/CausativePast (or a 2-arg combinator) would let past-of-passive be modelled rather than hardcoded, improving D4/D6 fidelity for a whole class of sentences.
- change: In src/verb-types.d.ts, extend ConjugationForm/ConjugateVerb with PassivePast and CausativePast (Passive/Causative stem + Ta surface), or add a chaining helper ConjugateVerbChain<V, [F1, F2]> that yields e.g. かけられた.

