# Design system

Active contributors: Yifeng Wang

The playground uses a single, named design language called **Washi & Sumi** (和紙・墨). It is built on warm washi paper surfaces, near-black sumi ink text, and a single dusty-rose sakura accent. The system is documented in `playground/DESIGN.md` and implemented in `playground/src/theme.css`.

## Purpose

The design system exists so the playground and the public landing page read as one product. By centralizing every color, spacing value, and component primitive in one CSS file, the UI remains consistent across light and dark themes without per-component dark rules.

## Key abstractions

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| `--paper` | `#faf7f4` | `#16121a` | Page background |
| `--surface` | `#fffdfb` | `#1f1a22` | Card surfaces |
| `--surface-2` | `#f7eef0` | `#2a232d` | Subtle fills |
| `--border` | `#efe2e6` | `#322a35` | Hairline borders |
| `--ink-900` | `#211b1f` | `#f3ebee` | Primary text |
| `--sakura-500` | `#c95b7a` | `#ef93b1` | Accent |
| `--sakura-600` | `#a8456a` | `#f4a8c0` | Links and deep accents |
| `--on-accent` | `#ffffff` | `#211b1f` | Text on accent |

The sakura ramp inverts between modes: in light mode 50 is the faintest wash and 600 is the deepest color; in dark mode 50 becomes the deepest fill and 600 the brightest petal. This lets components use the same semantic token names in both modes.

## Components

Shared primitives in `playground/src/theme.css` use the `.tj-*` prefix:

- `.tj-card` — surface + hairline + small shadow + 14px radius.
- `.tj-btn` / `.tj-btn--primary` — pill buttons; primary fills the sakura accent.
- `.tj-chip` — rounded tag with a subtle fill and sakura text.
- `.tj-input` / `.tj-select` — focus state adds a sakura border and ring.
- `.tj-code`, `.tj-label`, `.tj-subtle`, `.tj-result` — utility classes for code spans, labels, muted text, and results.

## Typography

- `--font-ui` — system-ui stack for UI chrome.
- `--font-jp` — Hiragino Kaku Gothic ProN / Yu Gothic / Noto Sans JP for Japanese text.
- `--font-mono` — SF Mono / JetBrains Mono for code.

Japanese example sentences automatically use the Japanese font stack via `:lang(ja)` and the `.jp` class, and render slightly larger than body text.

## Motion

Transitions are short (0.12–0.2s) and easing-based. The only larger motion is the analyzer drawer, which slides in over 0.26s. Decorative animations on the landing page respect `prefers-reduced-motion`.

## Anti-patterns

The design system explicitly forbids:

- Saturated hot pink (the old `#f5447a`).
- Raw hex or `rgba()` in component CSS.
- Hardcoded white text on accents (use `--on-accent`).
- Indigo or purple (the old landing palette).
- Heavy drop shadows or glows.
- Theme resolution after first paint (to avoid flashes).

## Integration points

- Monaco editor themes are tinted to match the palette: `sakura-light` and `sakura-dark` are defined in `playground/src/monaco-setup.ts`.
- The grammar course and glossary components all use `.tj-*` classes from `theme.css`.
- The landing page mirrors the same tokens in its own `globals.css` (outside this repo).

## Entry points for modification

- Change the palette in `playground/src/theme.css`.
- Add new component primitives in the same file, then use them in React components.
- Update the Monaco theme colors in `playground/src/monaco-setup.ts` if the palette changes.

## Key source files

| File | Purpose |
| --- | --- |
| `playground/DESIGN.md` | Design system specification |
| `playground/src/theme.css` | CSS custom properties and `.tj-*` primitives |
| `playground/src/monaco-setup.ts` | Monaco light/dark themes that match the palette |
