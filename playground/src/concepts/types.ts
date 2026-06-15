/**
 * Content model for "Foundations" (原理) — standalone concept articles that
 * explain the *architecture* of Japanese, programming-language-101 style, rather
 * than walking the grammar syllabus. They are independent from the grammar
 * Course, the Glossary and the Playground, and they deep-link INTO the Course
 * chapters where each idea is drilled.
 *
 * Every string is bilingual (English + 简体中文). Prose supports inline `code`
 * spans (backticks) and **bold** spans.
 */

/** A block inside a section. Discriminated on `kind` so the renderer can switch. */
export type ConceptBlock =
  // A run of paragraphs (split on blank lines). Supports `code` and **bold**.
  | { kind: "prose"; en: string; zh: string }
  // A defined term — rendered as a callout so a beginner never meets a jargon
  // word (体言, 助詞, …) without its definition right there.
  | {
      kind: "define";
      term: string;
      reading?: string;
      romaji?: string;
      en: string;
      zh: string;
    }
  // A Japanese example line (display only — not necessarily a typed snippet).
  | { kind: "example"; jp: string; reading?: string; en: string; zh: string }
  // "Where this is taught" — links into Course chapters by id (e.g. "e01").
  | { kind: "chapters"; ids: string[] };

export interface ConceptSection {
  id: string;
  /** Section heading. The renderer prefixes an auto-numbered "Principle N". */
  headingEn: string;
  headingZh: string;
  /** Default true. Set false for non-principle sections (e.g. a closing path). */
  numbered?: boolean;
  blocks: ConceptBlock[];
}

export interface ConceptArticle {
  /** Stable id / slug, also the filename, e.g. "architecture". */
  id: string;
  /** Order in the Foundations list. */
  order: number;
  /** Emoji shown in the list and header. */
  icon: string;
  titleEn: string;
  titleZh: string;
  /** One-line hook for the list. */
  taglineEn: string;
  taglineZh: string;
  /** Read-time hook, e.g. "~1 hour" / "约 1 小时". */
  readEn: string;
  readZh: string;
  /** Lead paragraph(s) under the title. Supports `code` and **bold**. */
  introEn: string;
  introZh: string;
  sections: ConceptSection[];
}
