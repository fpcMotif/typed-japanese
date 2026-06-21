// Interrogative elements by category
export type WhyInterrogative = "なぜ" | "なんで" | "どうして";
export type WhenInterrogative = "いつ";
export type WhereInterrogative = "どこ";
export type WhoInterrogative = "だれ" | "誰";
export type WhatInterrogative = "何" | "なに";
export type HowInterrogative = "どう" | "どうして";
export type WhatKindInterrogative = "どんな";
export type WhichInterrogative = "どれ";

// Demonstratives
export type Demonstrative = 
  | "こう" // This way
  | "そう" // That way
  | "ああ" // That way (far)
  | "どう"; // Which way

/**
 * 副詞 — adverb: genuine lexical adverbs only (毎日, すぐ, また, とても, ちょっと).
 * A value-identical wrapper (resolves to its Word verbatim); the label marks the
 * word as an adverb rather than letting it masquerade as a noun. NOTE: an
 * adjective's 連用形 (i-adj く: 早く; na-adj に: 本当に, 静かに) is NOT a lexical
 * adverb — derive it with ConjugateAdjective<A, "Adverbial">, not Adverb.
 */
export type Adverb<Word extends string> = Word;

/**
 * 連体詞 — adnominal (pre-noun) word: この, その, あの, どの, 大きな, 小さな. Modifies a
 * following noun and never inflects. Value-identical wrapper.
 */
export type Adnominal<Word extends string> = Word;

// Combined interrogative adverb type
export type InterrogativeAdverb =
  | WhyInterrogative
  | WhenInterrogative
  | WhereInterrogative
  | WhoInterrogative
  | WhatInterrogative
  | HowInterrogative
  | WhatKindInterrogative
  | WhichInterrogative;
