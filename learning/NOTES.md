# Working Notes

## Workspace location
All teaching files live under **`learning/`** inside the repo (not the repo root),
to avoid polluting the source tree:
- `learning/MISSION.md`, `learning/RESOURCES.md`, `learning/NOTES.md`
- `learning/lessons/*.html`
- `learning/reference/*.html`
- `learning/learning-records/*.md`

## Learner profile
- **Mission:** grow both TypeScript and Japanese together (see MISSION.md).
- **Level:** "a bit of both" — some TS/JS, some Japanese. Skip basics; build up
  type-level programming and verb-group logic.
- **Lesson language:** simple English. (User is comfortable in English but it may
  not be their first language — keep sentences short and concrete.)

## Teaching preferences
- Ground every claim in a cited source; prefer the in-repo `blog.md` + real `src/`.
- Tight feedback loops: each lesson ends with retrieval practice / micro-tasks.
- Keep lessons beautiful and printable (sakura "washi & sumi" theme to match repo).

## Ideas for next lessons
- Hands-on: run `ConjugateVerb` live in the playground.
- The `infer` keyword as type-level pattern matching (blog's advanced English example).
- Mapped types: how `GodanConjugationMap` works as a lookup table.
- Particles & phrase composition (`PhraseWithParticle`, `ConnectedPhrases`).
