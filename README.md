# Ecco UI

<p>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-0b6e99?style=flat-square" alt="MIT License"></a>
  <a href="https://arpalanca.github.io/ecco-ui/"><img src="https://img.shields.io/badge/Docs-live-0b6e99?style=flat-square" alt="Live docs"></a>
  <a href="https://github.com/arpalanca/eccocss"><img src="https://img.shields.io/badge/Companion-Ecco%20CSS-0b6e99?style=flat-square" alt="Ecco CSS"></a>
</p>

## Components for Ecco. Copy the HTML. Ship the UI.

HTML components and docs for [Ecco CSS](https://github.com/arpalanca/eccocss): copy-paste ready pieces that work with the classless core.

**Docs & demos:** [arpalanca.github.io/ecco-ui](https://arpalanca.github.io/ecco-ui/)

Ecco UI does **not** replace Ecco CSS. Link the classless stylesheet first, then add Ecco UI for composed patterns (nav, cards, hero, alerts, modal, tabs, and more).

## Why Ecco UI?

- **Copy-paste first:** every component ships as a standalone HTML snippet
- **Token-native:** styles use `--ecco-*` variables (light/dark included)
- **HTML + CSS first:** tiny JS only when required (tabs, modal)
- **Framework-friendly:** same markup in React, Vue, Svelte, or plain HTML
- **Small companion:** opt-in classes; Ecco CSS stays classless

## Quick start

### 1. CDN

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/arpalanca/eccocss@main/dist/ecco.min.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/arpalanca/ecco-ui@main/dist/ecco-ui.min.css"
/>
<!-- Optional: tabs + modals -->
<script
  src="https://cdn.jsdelivr.net/gh/arpalanca/ecco-ui@main/dist/ecco-ui.min.js"
  defer
></script>
```

Pin a tag or commit SHA in production instead of `@main`.

### 2. npm

```bash
npm install github:arpalanca/eccocss github:arpalanca/ecco-ui
```

```css
@import "eccocss/dist/ecco.min.css";
@import "ecco-ui/dist/ecco-ui.min.css";
```

### 3. Paste a snippet

```html
<article class="ecco-card">
  <h3 class="ecco-card-title">Ready</h3>
  <p class="ecco-card-body">Copy the HTML. Ship the UI.</p>
  <div class="ecco-card-footer">
    <button type="button">Continue</button>
  </div>
</article>
```

More snippets live in [`snippets/`](snippets/).

## Components

| Component | Classes | JS? |
| --- | --- | --- |
| Nav | `.ecco-nav` | No |
| Hero | `.ecco-hero` | No |
| Card | `.ecco-card` | No |
| Alert | `.ecco-alert` | No |
| Badge | `.ecco-badge` | No |
| Breadcrumb | `.ecco-breadcrumb` | No |
| Tabs | `.ecco-tabs` | Yes |
| Modal | `.ecco-modal` (`<dialog>`) | Yes |
| Accordion | `.ecco-accordion` | No |
| Empty state | `.ecco-empty` | No |
| Footer | `.ecco-footer` | No |
| Layout | `.ecco-stack` · `.ecco-cluster` · `.ecco-grid` | No |
| Buttons | `.ecco-btn-outline` · `.ecco-btn-ghost` · `.ecco-btn-sm` | No |
| Callout | `.ecco-callout` | No |

## How it relates to Ecco CSS

| | Ecco CSS | Ecco UI |
| --- | --- | --- |
| Role | Classless base | Opt-in patterns |
| Goal | Semantic HTML looks good | Multi-part UI ships fast |
| Classes | None required | `.ecco-*` when needed |
| Tokens | `--ecco-*` | Same tokens |
| JS | None | Optional (~tiny) |

**Rule of thumb:** if a single semantic element is enough, stay with Ecco CSS. Reach for Ecco UI when you need structure (card with media + footer, nav with actions, etc.).

## Frameworks

Ecco UI is HTML-first. Import the CSS once, paste the snippet, adapt attributes for your template language.

**React**: `class` → `className`; call `window.EccoUI?.init()` in `useEffect` for tabs/modals.

**Vue**: keep `class`; import CSS in `main.js` or the SFC; `onMounted(() => EccoUI.init())`.

**Svelte**: import CSS in layout/component; `onMount(() => EccoUI.init())`.

See the [frameworks section in the docs](https://arpalanca.github.io/ecco-ui/#frameworks) for full examples.

## JavaScript API

Optional helpers expose `window.EccoUI`:

```js
EccoUI.init(); // tabs + modals
EccoUI.initTabs();
EccoUI.initModals();
EccoUI.openModal(dialogEl);
EccoUI.closeModal(dialogEl);
```

Markup hooks:

- Tabs: `[data-ecco-tabs]` or `.ecco-tabs` with `[role="tablist"]`
- Open modal: `data-ecco-open="dialog-id"`
- Close modal: `data-ecco-close` inside the dialog

## Theming

Override Ecco CSS variables. Ecco UI follows automatically:

```css
:root {
  --ecco-hue: 160;
  --ecco-primary: hsl(160 55% 35%);
  --ecco-ui-width: 72rem; /* nav/hero/footer inner width */
  --ecco-ui-gap: 1.25rem; /* stack/cluster/grid gap */
}
```

## Project layout

```
css/ecco-ui.css      # source styles
js/ecco-ui.js        # tabs + modal helpers
dist/                # built CSS/JS (CDN-ready)
snippets/            # standalone copy-paste HTML
docs/                # documentation site (GitHub Pages)
scripts/build.mjs    # minify + copy into dist/ and docs/
```

## Build from source

```bash
npm install
npm run build
```

## Browser support

Modern evergreen browsers. Modals use the native `<dialog>` element. Light/dark follows `prefers-color-scheme` via Ecco CSS tokens.

## License

[MIT](LICENSE) · © 2026 AR Palanca
