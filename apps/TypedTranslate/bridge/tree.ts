/**
 * tree.ts — VOCAB-free port of the playground's parse.ts buildTree.
 *
 * Builds a GrammarNode tree from a Typed Japanese snippet using the TypeScript
 * Compiler API, and resolves each node's Japanese value with a real type checker
 * (the same in-memory program pattern as annotate.ts's `verify`: the snippet is
 * type-checked against the live library at <repo>/src via the
 * `typed-japanese -> src/index` paths mapping).
 *
 * Differences from parse.ts (intentional):
 *   - No VOCAB / Vite `import.meta.glob` dependency (cannot load under bun). A
 *     bare string literal or template chunk becomes a single leaf node; it is
 *     NOT tokenized against a vocabulary table.
 *   - Each node carries a `resolved` string: the Japanese value its subtree
 *     evaluates to, obtained from the checker (null when it isn't a literal).
 *
 * All logging must go to stderr; this module never writes to stdout.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// bridge/ -> TypedTranslate/ -> apps/ -> <repo>
const REPO = path.resolve(__dirname, "..", "..", "..");

// Diagnostic codes a snippet is allowed to trip ("declared but never used" and
// friends) — mirror annotate.ts. We don't fail parsing on these.
const IGNORE = new Set([6133, 6196, 6192, 6198, 6205]);

// --- public node shape (the stable bridge contract) --------------------------

export type GrammarCategory =
  | "phrase"
  | "conjugation"
  | "verb"
  | "adjective"
  | "noun"
  | "technical"
  | "whitespace"
  | "adverb"
  | "particle"
  | "copula"
  | "suffix"
  | "punctuation"
  | "form"
  | "demonstrative"
  | "interrogative"
  | "adnominal"
  | "numeral"
  | "literal"
  | "other";

export interface GrammarNode {
  id: string;
  /** alias name / constructor / quoted literal (display) */
  label: string;
  /** base constructor name, or null for plain literals */
  ctor: string | null;
  category: GrammarCategory;
  /** exact source fragment for this node */
  text: string;
  /** the Japanese string this subtree evaluates to, or null */
  resolved: string | null;
  children: GrammarNode[];
}

export interface ParseResult {
  ok: boolean;
  aliases: string[];
  tree: GrammarNode | null;
  errors: string[];
}

// --- grammar vocabulary (mirrors parse.ts, which mirrors the library) --------

const COMPOSITIONAL = new Set([
  "Sentence",
  "PhraseSequence",
  "ConditionalPhrase",
  "ConnectedPhrases",
  "InterrogativePhrase",
  "PhraseWithParticle",
  "DemonstrativeAction",
  "ConjugateVerb",
  "ConjugateAdjective",
  "ConjugateCopula",
  "NounPhrase",
  "VerbPhrase",
  "AdjectivalPhrase",
]);

// Mirror of playground/src/analysis/parse.ts CATEGORY_BY_NAME (this is a
// VOCAB-free port). Canonical wrapper list: src/noun-types.d.ts + adverb-types.d.ts.
const CATEGORY_BY_NAME: Record<string, GrammarCategory> = {
  ConditionalPhrase: "phrase",
  ConnectedPhrases: "phrase",
  InterrogativePhrase: "phrase",
  PhraseWithParticle: "phrase",
  NounPhrase: "phrase",
  VerbPhrase: "phrase",
  AdjectivalPhrase: "phrase",
  DemonstrativeAction: "phrase",
  ConjugateVerb: "conjugation",
  ConjugateAdjective: "conjugation",
  ConjugateCopula: "conjugation",
  Sentence: "phrase",
  PhraseSequence: "phrase",
  GodanVerb: "verb",
  IchidanVerb: "verb",
  IrregularVerb: "verb",
  SuruVerb: "verb",
  Verb: "verb",
  IAdjective: "adjective",
  NaAdjective: "adjective",
  Adjective: "adjective",
  CommonNoun: "noun",
  ProperNoun: "noun",
  Pronoun: "noun",
  Adverb: "adverb",
  Adnominal: "adnominal",
  VerbPart: "verb",
  AdjectivePart: "adjective",
  NounPart: "noun",
  PronounPart: "noun",
  ProperNounPart: "noun",
  TechnicalTermPart: "technical",
  WhitespacePart: "whitespace",
  AdverbPart: "adverb",
  AdnominalPart: "adnominal",
  NumeralPart: "numeral",
  CounterPart: "numeral",
  ParticlePart: "particle",
  CopulaPart: "copula",
  SuffixPart: "suffix",
  IntensifierPart: "adverb",
  ContractedPart: "suffix",
  NestedPhrasePart: "phrase",
  PunctuationPart: "punctuation",
};

const FORMS = new Set([
  "Dictionary", "Masu", "Te", "Ta", "Nai", "Potential", "Passive", "Causative",
  "Volitional", "Imperative", "Conditional", "Hypothetical", "Basic", "Polite",
  "Past", "Negative",
  // copula forms
  "Plain", "PolitePast", "PoliteNegative", "NegativePast", "PoliteNegativePast",
  "CasualNegative", "CasualPoliteNegative", "Written",
]);
const CONDITIONAL = new Set(["なら", "たら", "れば"]);
const DEMONSTRATIVE = new Set(["こう", "そう", "ああ", "どう"]);
const INTERROGATIVE = new Set([
  "なぜ", "なんで", "どうして", "いつ", "どこ", "だれ", "誰", "何", "なに", "どんな", "どれ",
]);
const PARTICLES = new Set([
  "は", "が", "を", "に", "へ", "で", "と", "から", "まで", "よ", "ね", "か", "よね", "の", "も",
  "なら", "たら", "れば", "でも", "だけ", "しか", "ばかり", "より", "ほど", "や", "とか", "って",
  "こそ", "さえ", "くらい", "ぐらい", "ので", "けど", "のに", "し",
]);
const PUNCTUATION = new Set(["、", "。", "！", "？", "（", "）", "(", ")", "「", "」", "『", "』", "・"]);

/**
 * Classify a bare string literal. Without VOCAB we can't look up open-class
 * words, so anything that isn't a known form/particle/punctuation/etc. falls
 * back to "literal" (a single, un-tokenized leaf).
 */
function classifyLiteral(value: string): GrammarCategory {
  if (FORMS.has(value)) return "form";
  if (DEMONSTRATIVE.has(value)) return "demonstrative";
  if (INTERROGATIVE.has(value)) return "interrogative";
  if (CONDITIONAL.has(value)) return "particle";
  if (PARTICLES.has(value)) return "particle";
  if (PUNCTUATION.has(value)) return "punctuation";
  return "literal";
}

const PART_TYPES = new Set([
  "VerbPart", "AdjectivePart", "NounPart", "PronounPart", "ProperNounPart", "TechnicalTermPart", "WhitespacePart",
  "AdverbPart", "AdnominalPart", "NumeralPart", "CounterPart", "ParticlePart", "CopulaPart", "SuffixPart", "IntensifierPart",
  "ContractedPart", "NestedPhrasePart", "PunctuationPart",
]);
const SCALAR_PART_TYPES = new Set([
  "NounPart", "PronounPart", "ProperNounPart", "TechnicalTermPart", "WhitespacePart", "AdverbPart", "AdnominalPart", "NumeralPart", "CounterPart", "ParticlePart",
  "CopulaPart", "SuffixPart", "IntensifierPart", "ContractedPart",
  "NestedPhrasePart", "PunctuationPart",
]);

// --- the in-memory program (checker for value resolution) --------------------

interface Program {
  checker: ts.TypeChecker;
  sourceFile: ts.SourceFile;
  /** snippet text plus the synthetic resolver aliases we appended */
  augmentedFileName: string;
}

/**
 * Build a TypeScript program over `code` augmented with one synthetic
 * `type __tt_resolve_<i> = <text>;` alias per requested fragment, so the checker
 * can evaluate each node's value. Returns the checker and a map id -> resolved.
 */
function resolveValues(code: string, requests: Map<string, string>): {
  resolved: Map<string, string | null>;
  errors: string[];
} {
  const ids = [...requests.keys()];
  const RESOLVE_PREFIX = "__tt_resolve_";
  const resolverLines = ids
    .map((id, i) => `type ${RESOLVE_PREFIX}${i} = ${requests.get(id)!};`)
    .join("\n");
  const augmented = `${code}\n${resolverLines}\n`;

  const fileName = path.join(REPO, "__tt_tree_resolve.ts");
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    lib: ["lib.es2020.d.ts"],
    baseUrl: REPO,
    paths: { "typed-japanese": ["src/index"] },
  };

  const host = ts.createCompilerHost(options);
  const origGet = host.getSourceFile.bind(host);
  host.getSourceFile = (name, lang, ...rest) =>
    name === fileName ? ts.createSourceFile(name, augmented, lang) : origGet(name, lang, ...rest);
  const origRead = host.readFile.bind(host);
  host.readFile = (name) => (name === fileName ? augmented : origRead(name));
  const origExists = host.fileExists.bind(host);
  host.fileExists = (name) => name === fileName || origExists(name);

  const program = ts.createProgram([fileName], options, host);
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(fileName);

  const errors = ts
    .getPreEmitDiagnostics(program)
    .filter((d) => !IGNORE.has(d.code))
    .map((d) => `TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`);

  const resolved = new Map<string, string | null>();
  if (sf) {
    const aliasByName = new Map<string, ts.TypeAliasDeclaration>();
    for (const stmt of sf.statements) {
      if (ts.isTypeAliasDeclaration(stmt)) aliasByName.set(stmt.name.text, stmt);
    }
    ids.forEach((id, i) => {
      resolved.set(id, null);
      const decl = aliasByName.get(`${RESOLVE_PREFIX}${i}`);
      if (!decl) return;
      try {
        const type = checker.getTypeFromTypeNode(decl.type);
        const str = checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation);
        const m = str.match(/^"([\s\S]*)"$/);
        if (m) resolved.set(id, m[1]!);
      } catch {
        /* leave null */
      }
    });
  }

  return { resolved, errors };
}

// --- structural decomposition (VOCAB-free port of parse.ts buildTree) --------

interface RawNode {
  id: string;
  label: string;
  ctor: string | null;
  category: GrammarCategory;
  text: string;
  children: RawNode[];
}

function entityName(name: ts.EntityName): string {
  return ts.isIdentifier(name) ? name.text : name.right.text;
}

function buildStructure(
  code: string
): { aliases: string[]; root: RawNode | null; errors: string[] } {
  const sf = ts.createSourceFile("__tt_tree.ts", code, ts.ScriptTarget.Latest, true);

  const aliasMap = new Map<string, ts.TypeAliasDeclaration>();
  const aliasNames: string[] = [];
  sf.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      aliasMap.set(node.name.text, node);
      aliasNames.push(node.name.text);
    }
  });

  if (aliasNames.length === 0) {
    return { aliases: [], root: null, errors: ["snippet declares no `type` alias"] };
  }
  // Heuristic (same as parse.ts/annotate.ts): the sentence is the last alias.
  const rootDecl = aliasMap.get(aliasNames[aliasNames.length - 1]!)!;

  // Follow a bare alias reference (no type args) to its definition so the tree
  // shows the full composition, not an opaque alias name.
  function effective(node: ts.TypeNode): { node: ts.TypeNode; alias?: string } {
    if (ts.isTypeReferenceNode(node) && !node.typeArguments) {
      const nm = entityName(node.typeName);
      const decl = aliasMap.get(nm);
      if (decl) return { node: decl.type, alias: nm };
    }
    return { node };
  }

  function baseName(node: ts.TypeNode): string | null {
    if (ts.isTypeReferenceNode(node)) return entityName(node.typeName);
    if (ts.isIntersectionTypeNode(node)) {
      const ref = node.types.find((t) => ts.isTypeReferenceNode(t));
      return ref ? entityName((ref as ts.TypeReferenceNode).typeName) : null;
    }
    return null;
  }

  function stringLiteralArg(node: ts.TypeNode | undefined): string | null {
    return node && ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)
      ? node.literal.text
      : null;
  }

  function buildPartNode(
    name: string,
    node: ts.TypeReferenceNode,
    idPath: string,
    sourceText: string,
    alias?: string
  ): RawNode {
    const args = node.typeArguments ?? [];
    const firstLiteral = stringLiteralArg(args[0]);
    const lastLiteral = stringLiteralArg(args[args.length - 1]);
    const label =
      alias ??
      (name === "CopulaPart"
        ? "Copula"
        : name === "WhitespacePart"
        ? "space"
        : name === "ContractedPart" && lastLiteral
        ? lastLiteral
        : firstLiteral ?? name);
    const children = SCALAR_PART_TYPES.has(name)
      ? []
      : args.map((arg, i) => build(arg, `${idPath}.${i}`));

    return {
      id: idPath,
      label,
      ctor: name,
      category: CATEGORY_BY_NAME[name] ?? "other",
      // Resolving the part's value is `<source>["value"]`.
      text: `${sourceText}["value"]`,
      children,
    };
  }

  function build(node: ts.TypeNode, idPath: string): RawNode {
    // Unwrap parentheses so `(A & B)` doesn't add a useless level.
    if (ts.isParenthesizedTypeNode(node)) return build(node.type, idPath);

    const text = node.getText(sf).trim();

    // String-literal leaf: a single deliberate token (a form like "Te", a
    // particle like "は"). Never split it — without VOCAB it stays one leaf.
    if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
      const value = node.literal.text;
      return {
        id: idPath,
        label: `"${value}"`,
        ctor: null,
        category: classifyLiteral(value),
        text,
        children: [],
      };
    }

    // Tuple inside Sentence<[...parts]>.
    if (ts.isTupleTypeNode(node)) {
      return {
        id: idPath,
        label: "Parts",
        ctor: "[]",
        category: "phrase",
        text,
        children: node.elements.map((el, i) => build(el, `${idPath}.${i}`)),
      };
    }

    // Template literal type `${A}いる`: decompose into chunks + embedded types.
    // A literal chunk becomes a single leaf (no VOCAB tokenization).
    if (ts.isTemplateLiteralTypeNode(node)) {
      const kids: RawNode[] = [];
      let k = 0;
      const pushLiteral = (value: string) => {
        kids.push({
          id: `${idPath}.c${k}`,
          label: `"${value}"`,
          ctor: null,
          category: classifyLiteral(value),
          text: JSON.stringify(value),
          children: [],
        });
        k += 1;
      };
      if (node.head.text) pushLiteral(node.head.text);
      node.templateSpans.forEach((span, i) => {
        kids.push(build(span.type, `${idPath}.${i}`));
        if (span.literal.text) pushLiteral(span.literal.text);
      });
      return {
        id: idPath,
        label: "Template",
        ctor: "`…`",
        category: "phrase",
        text,
        children: kids,
      };
    }

    const eff = effective(node);
    const name = baseName(eff.node);
    const category: GrammarCategory = (name && CATEGORY_BY_NAME[name]) || "other";

    if (name && PART_TYPES.has(name) && ts.isTypeReferenceNode(eff.node)) {
      return buildPartNode(name, eff.node, idPath, text, eff.alias);
    }

    let children: RawNode[] = [];
    if (name && COMPOSITIONAL.has(name) && ts.isTypeReferenceNode(eff.node)) {
      const args = eff.node.typeArguments ?? [];
      const tupleArg = args[0] && ts.isTupleTypeNode(args[0]) ? args[0] : null;
      if ((name === "Sentence" || name === "PhraseSequence") && tupleArg) {
        children = tupleArg.elements.map((arg, i) => build(arg, `${idPath}.${i}`));
      } else {
        children = args.map((arg, i) => build(arg, `${idPath}.${i}`));
      }
    }

    const label = eff.alias ?? name ?? text;
    const ctor = name && name !== label ? name : null;
    return { id: idPath, label, ctor, category, text, children };
  }

  const root = build(rootDecl.type, "0");
  return { aliases: aliasNames, root, errors: [] };
}

// --- public entry point ------------------------------------------------------

/**
 * Parse a snippet into a resolved GrammarNode tree. Never throws on a handled
 * error: it reports parse/type errors via the returned `errors` array. A tree
 * is still returned (without `resolved` values) when only resolution fails.
 */
export function parseTree(code: string): ParseResult {
  let structure: ReturnType<typeof buildStructure>;
  try {
    structure = buildStructure(code);
  } catch (e) {
    return { ok: false, aliases: [], tree: null, errors: [(e as Error).message] };
  }

  if (!structure.root) {
    return { ok: false, aliases: structure.aliases, tree: null, errors: structure.errors };
  }

  // Collect every node's resolver text, resolve all in one program pass.
  const requests = new Map<string, string>();
  const collect = (n: RawNode): void => {
    requests.set(n.id, n.text);
    n.children.forEach(collect);
  };
  collect(structure.root);

  const errors: string[] = [...structure.errors];
  let resolvedMap = new Map<string, string | null>();
  try {
    const res = resolveValues(code, requests);
    resolvedMap = res.resolved;
    errors.push(...res.errors);
  } catch (e) {
    errors.push(`value resolution failed: ${(e as Error).message}`);
  }

  const toGrammar = (n: RawNode): GrammarNode => ({
    id: n.id,
    label: n.label,
    ctor: n.ctor,
    category: n.category,
    text: n.text,
    resolved: resolvedMap.has(n.id) ? resolvedMap.get(n.id)! : null,
    children: n.children.map(toGrammar),
  });

  const tree = toGrammar(structure.root);
  return { ok: errors.length === 0, aliases: structure.aliases, tree, errors };
}
