# By the numbers

Data collected on 2026-06-18.

## Size

The repository contains 179 tracked files. The largest language groups are:

| Language | Files | Lines |
| --- | --- | --- |
| TypeScript (`.ts`, `.tsx`, `.d.ts`) | ~96 | ~13,500 |
| Markdown | 56 | ~3,800 |
| HTML | 8 | ~1,500 |
| CSS | 8 | ~1,200 |
| YAML | 2 | ~2,000 (mostly GitHub Actions lockfile) |

```mermaid
xychart-beta
    title "Lines of code by language"
    x-axis ["TypeScript", "Markdown", "YAML", "HTML", "CSS"]
    y-axis "Lines" 0 15000
    bar [13500, 3800, 2000, 1500, 1200]
```

The core library under `src/` is only 6 files and roughly 750 lines of type declarations. The playground is the bulk of the code: React components, tutorial chapters, vocabulary entries, and CSS modules.

## Activity

The repository has 41 commits. Activity has been concentrated in two bursts:

| Period | Commits | Focus |
| --- | --- | --- |
| 2025-03 | 17 | Initial type library, examples, blog, CI |
| 2026-06 | 24 | Playground, grammar course, vocabulary, design system, dark mode |

## Churn hotspots

The most frequently edited source paths in the last 90 days (by commit count) are:

| Path | Recent changes | Notes |
| --- | --- | --- |
| `playground/src/tutorial/chapters/` | many | 47-chapter course authored and restructured |
| `playground/src/analysis/parse.ts` | several | Literal tokenization and decomposition fixes |
| `playground/src/theme.css` | several | Washi & Sumi theme and dark mode |
| `playground/src/components/Analyzer.tsx` | several | Analyzer UI and Monaco integration |
| `playground/src/vocab/` | several | Vocabulary table additions |

## Contributors

There is no `CODEOWNERS` file. Recent contributors from git history are:

| Contributor | Commits (HEAD) | Affiliation |
| --- | --- | --- |
| Yifeng Wang | ~39 | Primary author |
| Satoshi Terasaki | 1 | Frieren example |
| bbdfhtg | 1 | — |

Bot-attributed commits: none detected. All commits are authored by humans.
