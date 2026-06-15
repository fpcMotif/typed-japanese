import { useMemo, useState, type ReactNode } from "react";
import { ARTICLES } from "../concepts";
import type { ConceptArticle, ConceptBlock } from "../concepts/types";
import { CHAPTERS } from "../tutorial/chapters";
import { LEVEL_META } from "../tutorial/levels";
import { useLang } from "../context/lang";
import styles from "./Concepts.module.css";

/** Render a run of paragraphs with inline `code` and **bold** spans. */
function RichText({ text }: { text: string }): ReactNode {
  return (
    <>
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i} className={styles.para}>
          {renderInline(para)}
        </p>
      ))}
    </>
  );
}

/** Inline markup: `code` and **bold**, in one pass. */
function renderInline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((seg, j) => {
    if (seg.startsWith("`") && seg.endsWith("`")) {
      return (
        <code key={j} className="tj-code">
          {seg.slice(1, -1)}
        </code>
      );
    }
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return <strong key={j}>{seg.slice(2, -2)}</strong>;
    }
    return <span key={j}>{seg}</span>;
  });
}

export default function Concepts({
  onOpenChapter,
}: {
  onOpenChapter: (id: string) => void;
}) {
  const { t } = useLang();
  const [activeId, setActiveId] = useState<string>(ARTICLES[0]?.id ?? "");

  const chapterById = useMemo(
    () => new Map(CHAPTERS.map((c) => [c.id, c])),
    []
  );

  const active = useMemo(
    () => ARTICLES.find((a) => a.id === activeId) ?? ARTICLES[0] ?? null,
    [activeId]
  );

  if (ARTICLES.length === 0) {
    return <p className="tj-subtle">No articles yet.</p>;
  }

  /** "Where this is taught" — chips deep-linking into the Grammar Course. */
  function ChapterLinks({ ids }: { ids: string[] }): ReactNode {
    const chapters = ids
      .map((id) => chapterById.get(id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    if (chapters.length === 0) return null;
    return (
      <div className={styles.chapters}>
        <span className={styles.chaptersLabel}>
          {t("Learn it in the Course", "在教程里学")}
        </span>
        <div className={styles.chapterChips}>
          {chapters.map((c) => (
            <button
              key={c.id}
              type="button"
              className={styles.chapterChip}
              onClick={() => onOpenChapter(c.id)}
              title={t("Open this chapter", "打开该章节")}
            >
              <span className={styles.chapterChipEmoji}>
                {LEVEL_META[c.level].emoji}
              </span>
              <span>{t(c.titleEn, c.titleZh)}</span>
              <span className={styles.chapterChipArrow}>→</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  function Block({ block }: { block: ConceptBlock }): ReactNode {
    switch (block.kind) {
      case "prose":
        return <RichText text={t(block.en, block.zh)} />;
      case "define":
        return (
          <div className={styles.define}>
            <div className={styles.defineHead}>
              <span className={`jp ${styles.defineTerm}`}>{block.term}</span>
              {block.reading && (
                <span className={`jp ${styles.defineReading}`}>
                  {block.reading}
                </span>
              )}
              {block.romaji && (
                <span className={styles.defineRomaji}>{block.romaji}</span>
              )}
            </div>
            <p className={styles.defineBody}>{renderInline(t(block.en, block.zh))}</p>
          </div>
        );
      case "example":
        return (
          <div className={styles.example}>
            <span className={`jp ${styles.exampleJp}`}>{block.jp}</span>
            {block.reading && (
              <span className={`jp ${styles.exampleReading}`}>
                {block.reading}
              </span>
            )}
            <span className={styles.exampleGloss}>
              {renderInline(t(block.en, block.zh))}
            </span>
          </div>
        );
      case "chapters":
        return <ChapterLinks ids={block.ids} />;
    }
  }

  return (
    <div className={styles.layout}>
      {/* ---- sidebar: article list ---- */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>{t("Foundations", "原理")}</div>
        <nav className={styles.nav}>
          {ARTICLES.map((a: ConceptArticle) => (
            <button
              key={a.id}
              type="button"
              className={`${styles.articleLink} ${a.id === activeId ? styles.articleActive : ""}`}
              onClick={() => setActiveId(a.id)}
            >
              <span className={styles.articleIcon}>{a.icon}</span>
              <span className={styles.articleLinkText}>
                <span className={styles.articleLinkTitle}>
                  {t(a.titleEn, a.titleZh)}
                </span>
                <span className={styles.articleLinkRead}>
                  {t(a.readEn, a.readZh)}
                </span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ---- article ---- */}
      <article className={styles.content}>
        {active && (
          <>
            <header className={styles.articleHead}>
              <span className={`tj-chip ${styles.readChip}`}>
                ⏱ {t(active.readEn, active.readZh)}
              </span>
              <h2 className={styles.articleTitle}>
                <span className={styles.articleTitleIcon}>{active.icon}</span>
                {t(active.titleEn, active.titleZh)}
              </h2>
              <p className={styles.articleTagline}>
                {t(active.taglineEn, active.taglineZh)}
              </p>
              <div className={styles.intro}>
                <RichText text={t(active.introEn, active.introZh)} />
              </div>
            </header>

            {(() => {
              let n = 0;
              return active.sections.map((sec) => {
                const numbered = sec.numbered !== false;
                if (numbered) n += 1;
                return (
                  <section key={sec.id} className={styles.section}>
                    <h3 className={styles.sectionHead}>
                      {numbered && (
                        <span className={styles.principleBadge}>
                          {t("Principle", "原理")} {n}
                        </span>
                      )}
                      <span className={styles.sectionHeading}>
                        {t(sec.headingEn, sec.headingZh)}
                      </span>
                    </h3>
                    {sec.blocks.map((b, i) => (
                      <Block key={i} block={b} />
                    ))}
                  </section>
                );
              });
            })()}
          </>
        )}
      </article>
    </div>
  );
}
