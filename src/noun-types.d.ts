// Noun types (名詞)
//
// Japanese 名詞 split into the three subclasses a learner actually needs to
// tell apart. All three are value-identical wrappers (each resolves to its
// Name verbatim) — the distinction is purely a label that documents *what kind
// of noun* a word is, so the grammar tree can show 普通名詞 / 固有名詞 / 代名詞
// instead of lumping everything under one tag.

/** 普通名詞 — common noun: 猫, 机, りんご, 言い訳, 仕事. The default for content nouns. */
export type CommonNoun<Name extends string> = Name;

/** 固有名詞 — proper noun: names of people, places, works, products (東京, ヒンメル, 春日影, TypeScript). */
export type ProperNoun<Name extends string> = Name;

/** 代名詞 — pronoun: これ, それ, あれ, ここ, 私, 彼, 誰. */
export type Pronoun<Name extends string> = Name;
