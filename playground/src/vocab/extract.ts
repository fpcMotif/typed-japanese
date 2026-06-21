import type { PartOfSpeech } from "./types";

/**
 * Pull the content words (nouns, verbs, adjectives) out of an example's Typed
 * Japanese snippet. The snippets follow a consistent shape, so lightweight
 * regexes are reliable here — and synchronous, so cards can render word lists
 * without invoking the compiler.
 */
export interface ExtractedWord {
  word: string;
  pos: PartOfSpeech;
}

export function extractWords(code: string): ExtractedWord[] {
  const found: ExtractedWord[] = [];
  const seen = new Set<string>();
  const push = (word: string, pos: PartOfSpeech) => {
    if (word && !seen.has(word)) {
      seen.add(word);
      found.push({ word, pos });
    }
  };

  // Wrapper→POS mirror of scripts/extract-words.mjs WRAPPER_POS (regex vs AST).
  // Canonical wrapper list: src/noun-types.d.ts + src/adverb-types.d.ts.
  // Noun subclasses: CommonNoun / ProperNoun / Pronoun<"X">
  for (const m of code.matchAll(/CommonNoun<\s*"([^"]+)"\s*>/g)) push(m[1]!, "noun");
  for (const m of code.matchAll(/ProperNoun<\s*"([^"]+)"\s*>/g)) push(m[1]!, "proper-noun");
  for (const m of code.matchAll(/Pronoun<\s*"([^"]+)"\s*>/g)) push(m[1]!, "pronoun");
  // Adverb / Adnominal<"X">
  for (const m of code.matchAll(/(?<![A-Za-z])Adverb<\s*"([^"]+)"\s*>/g)) push(m[1]!, "adverb");
  for (const m of code.matchAll(/Adnominal<\s*"([^"]+)"\s*>/g)) push(m[1]!, "adnominal");
  // Noun-subclass parts in the Sentence path
  for (const m of code.matchAll(/PronounPart<\s*"([^"]+)"\s*>/g)) push(m[1]!, "pronoun");
  for (const m of code.matchAll(/ProperNounPart<\s*"([^"]+)"\s*>/g)) push(m[1]!, "proper-noun");
  // Numerals / counters: NumeralPart<"三"> ; CounterPart<"三", "つ"> → word 三つ
  for (const m of code.matchAll(/NumeralPart<\s*"([^"]+)"\s*>/g)) push(m[1]!, "number");
  for (const m of code.matchAll(/CounterPart<\s*"([^"]+)"\s*,\s*"([^"]+)"\s*>/g)) push(m[1]! + m[2]!, "counter");

  // GodanVerb & { stem: "X"; ending: "Y" }
  for (const m of code.matchAll(
    /GodanVerb\s*&\s*\{[^}]*?stem:\s*"([^"]+)"[^}]*?ending:\s*"([^"]+)"/g
  ))
    push(m[1]! + m[2]!, "verb-godan");

  // IchidanVerb & { stem: "X"; ending?: "る" }
  for (const m of code.matchAll(
    /IchidanVerb\s*&\s*\{[^}]*?stem:\s*"([^"]+)"(?:[^}]*?ending:\s*"([^"]+)")?/g
  ))
    push(m[1]! + (m[2] ?? "る"), "verb-ichidan");

  // IrregularVerb & { dictionary: "X" }
  for (const m of code.matchAll(
    /IrregularVerb\s*&\s*\{[^}]*?dictionary:\s*"([^"]+)"/g
  ))
    push(m[1]!, "verb-irregular");

  // IAdjective & { stem: "X"; ending: "い" }
  for (const m of code.matchAll(
    /IAdjective\s*&\s*\{[^}]*?stem:\s*"([^"]+)"(?:[^}]*?ending:\s*"([^"]+)")?/g
  ))
    push(m[1]! + (m[2] ?? "い"), "i-adjective");

  // NaAdjective & { stem: "X" }
  for (const m of code.matchAll(/NaAdjective\s*&\s*\{[^}]*?stem:\s*"([^"]+)"/g))
    push(m[1]!, "na-adjective");

  return found;
}
