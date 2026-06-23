# Glossary

Active contributors: Yifeng Wang

This page defines terms used throughout the project. Japanese terms are kept in original script with romaji on first mention.

## Type-level terms

**Template literal type** — a TypeScript type that concatenates string literal types using `` `${A}${B}` ``. This is the main way the library glues kana together.

**Conditional type** — a TypeScript type-level `if/else` written as `T extends U ? X : Y`. Used to pick a conjugation rule based on verb class or form.

**`infer`** — a TypeScript keyword that extracts a substring from a string literal type. Used for pattern matching inside the type system.

**Mapped type** — a type that maps over a union or object keys. `GodanConjugationMap` is a mapped type that stores every godan ending against every form.

**Declaration file (`.d.ts`)** — a TypeScript file that contains only type declarations and no runtime code. The entire core library is written this way.

## Japanese grammar terms

**Godan verb (五段動詞, *godan dōshi*)** — a "Group 1" verb whose ending changes across the five kana vowel rows (あ, い, う, え, お) during conjugation. Examples: 話す (*hanasu*, to speak), 買う (*kau*, to buy).

**Ichidan verb (一段動詞, *ichidan dōshi*)** — a "Group 2" verb that ends in る and drops the trailing kana before attaching suffixes. Examples: 食べる (*taberu*, to eat), 見る (*miru*, to see).

**Irregular verb (不規則動詞, *fukisoku dōshi*)** — the two verbs that do not follow the godan or ichidan patterns: する (*suru*, to do) and 来る (*kuru*, to come).

**Conjugation form** — a named form such as 辞書形 (dictionary), て形 (te-form), た形 (past), ない形 (negative), ます形 (polite), 命令形 (imperative), 条件形 (conditional), 仮定形 (hypothetical), 可能形 (potential), 受身形 (passive), 使役形 (causative), and 意向形 (volitional).

**Particle** — a small postposition that marks grammatical roles. The library supports は, が, を, に, へ, で, と, から, まで, よ, ね, か, の, だ, も, and combined forms like よね.

**I-adjective (い形容詞, *i-keiyōshi*)** — an adjective ending in い, such as いい (*ii*, good).

**Na-adjective (な形容詞, *na-keiyōshi*)** — an adjective that requires な when modifying a noun, such as 綺麗 (*kirei*, pretty).

**Demonstrative** — こう (*kō*, this way), そう (*sō*, that way), ああ (*ā*, that way over there), どう (*dō*, which way). Used in patterns like そうする (to do that way).

**Interrogative adverb** — a question word such as なぜ/なんで/どうして (*why*), いつ (*when*), どこ (*where*), だれ/誰 (*who*), 何/なに (*what*), どう (*how*), どんな (*what kind*), どれ (*which*).

## Project terms

**Analyzer** — the playground component that parses a Typed Japanese type alias and renders it as a tree of grammar nodes. See [`playground/src/components/Analyzer.tsx`](../../playground/src/components/Analyzer.tsx).

**Composition node** — one node in the analyzer tree, representing a constructor such as `ConjugateVerb`, a particle, or a literal string. Defined in [`playground/src/analysis/parse.ts`](../../playground/src/analysis/parse.ts).

**Washi & Sumi (和紙・墨)** — the project's design language: warm washi paper surfaces, near-black sumi ink text, and a single dusty-rose sakura accent. Documented in `playground/DESIGN.md`.

**Grammar Course** — the 47-chapter bilingual tutorial in the playground. See [`playground/src/tutorial/chapters/`](../../playground/src/tutorial/chapters/).

**Vocab table** — the glossary of words used in the grammar course, with readings, romaji, and meanings. See [`playground/src/vocab/`](../../playground/src/vocab/).
