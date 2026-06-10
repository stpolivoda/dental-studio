# Dental Studio Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, fully responsive, mobile-first homepage for "Dental Studio" using plain HTML/CSS/JS (no build step, no dependencies), plus a shared header/footer/booking-modal foundation for future pages.

**Architecture:** Single `index.html` with content sections in document order, styles split across `css/tokens.css` (design tokens), `css/base.css` (reset/typography/fonts), `css/components.css` (reusable nav/buttons/cards/modal), and `css/sections.css` (per-section layout). Behavior lives in `js/main.js` (ES module) plus a pure, unit-tested `js/validators.js`. Self-hosted Inter + Playfair Display fonts (Latin + Cyrillic).

**Tech Stack:** HTML5, CSS3 (custom properties, Grid/Flexbox, mobile-first media queries), vanilla JS (ES modules), Node's built-in test runner (`node --test`) for pure-function tests, Python's built-in `http.server` for local preview.

**Spec:** `docs/superpowers/specs/2026-06-10-dental-studio-homepage-design.md`

---

## Conventions used throughout this plan

- **Local server for verification:** `cd /Users/staspolivoda/Desktop/dental-studio && python3 -m http.server 4173`, then open `http://localhost:4173/`. Start it once and leave it running; subsequent tasks just say "reload the page."
- **Breakpoints:** mobile-first base styles, then `@media (min-width: 768px)` for tablet and `@media (min-width: 1024px)` for desktop.
- **CSS load order in `<head>`:** `assets/fonts/fonts.css`, `css/tokens.css`, `css/base.css`, `css/components.css`, `css/sections.css`.
- **JS:** `js/main.js` is loaded as `<script type="module" src="js/main.js"></script>` (defers automatically).

---

### Task 1: Project scaffolding

**Files:**
- Create: `index.html`
- Create: `css/tokens.css`, `css/base.css`, `css/components.css`, `css/sections.css`
- Create: `js/main.js`

- [ ] **Step 1: Create the directory structure**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
mkdir -p css js assets/fonts assets/fonts/files tests
```

- [ ] **Step 2: Create empty CSS files with header comments**

`css/tokens.css`:
```css
/* Design tokens: colors, fonts, spacing, radii. See docs/superpowers/specs/2026-06-10-dental-studio-homepage-design.md */
```

`css/base.css`:
```css
/* Reset, base typography, self-hosted font declarations */
```

`css/components.css`:
```css
/* Reusable components: buttons, nav, cards, modal, badges, image placeholders */
```

`css/sections.css`:
```css
/* Per-section layout: hero, services, process, why-us, testimonials, cta, footer */
```

- [ ] **Step 3: Create `js/main.js` stub**

```js
// Dental Studio - main behavior: nav toggle, header scroll state,
// scroll-reveal, booking modal.
console.log('Dental Studio: main.js loaded');
```

- [ ] **Step 4: Create `index.html` skeleton**

```html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dental Studio — Стоматологія, де не страшно і зручно</title>
  <meta name="description" content="Стоматологічна клініка Dental Studio — терапія, гігієна, хірургія, протезування. Запис на огляд онлайн.">

  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/sections.css">
</head>
<body>
  <a class="skip-link" href="#main">Перейти до контенту</a>

  <header class="header" id="header">
    <!-- Task 4 -->
  </header>

  <main id="main">
    <!-- Task 5: hero -->
    <!-- Task 6: services -->
    <!-- Task 7: process -->
    <!-- Task 8: why-us -->
    <!-- Task 9: testimonials -->
    <!-- Task 10: cta banner -->
  </main>

  <footer class="footer" id="contacts">
    <!-- Task 10 -->
  </footer>

  <!-- Task 11: booking modal -->

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Verify the page loads**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
python3 -m http.server 4173 &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/css/tokens.css
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/js/main.js
```

Expected: three `200` responses. Open `http://localhost:4173/` in a browser — a blank page with no console errors (the empty CSS/JS files load fine; `fonts.css` will 404 until Task 3, which is expected for now).

- [ ] **Step 6: Commit**

```bash
git add index.html css js
git commit -m "Scaffold project structure and base HTML skeleton"
```

---

### Task 2: Design tokens

**Files:**
- Modify: `css/tokens.css`

- [ ] **Step 1: Write the design tokens**

```css
/* Design tokens: colors, fonts, spacing, radii.
   Breakpoints (used as literal values in media queries, not as custom
   properties, since CSS cannot interpolate vars into @media):
     tablet:  min-width: 768px
     desktop: min-width: 1024px */

:root {
  /* Colors - dark sections */
  --color-bg-dark: #11151f;
  --color-bg-darker: #0e1919;
  --color-card-dark-1: #151515;
  --color-card-dark-2: #1d2433;

  /* Colors - light sections */
  --color-bg-light: #ffffff;

  /* Text */
  --color-text-dark: #11151f;
  --color-text-light: #ffffff;
  --color-text-muted-on-dark: rgba(255, 255, 255, 0.7);
  --color-text-muted-on-light: #adadad;

  /* Glass / frosted CTA */
  --color-glass-bg: rgba(255, 255, 255, 0.3);
  --color-glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: 24px;

  /* Typography */
  --font-heading: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Fluid type scale */
  --fs-h1: clamp(2.25rem, 5vw + 1rem, 4.5rem);
  --fs-h2: clamp(1.75rem, 4vw + 1rem, 3.5rem);
  --fs-h3: clamp(1.25rem, 2vw + 1rem, 2rem);
  --fs-body: 1rem;
  --fs-small: 0.875rem;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
  --space-6: 3rem;
  --space-7: 4rem;
  --space-8: 6rem;

  /* Radii */
  --radius-card: 24px;
  --radius-pill: 32px;

  /* Container */
  --container-max: 1280px;
  --container-pad: var(--space-4);
}
```

- [ ] **Step 2: Verify the tokens are present**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
grep -c -- '--color-bg-dark' css/tokens.css
grep -c -- '--font-heading' css/tokens.css
grep -c -- '--space-8' css/tokens.css
```

Expected: each command prints `1`.

- [ ] **Step 3: Commit**

```bash
git add css/tokens.css
git commit -m "Add design tokens (colors, typography, spacing, radii)"
```

---

### Task 3: Self-hosted fonts + base reset/typography

**Files:**
- Create: `assets/fonts/fonts.css`, `assets/fonts/files/*.woff2`
- Modify: `css/base.css`
- Modify: `index.html` (add font preload)

- [ ] **Step 1: Download Inter + Playfair Display (Latin + Cyrillic) and self-host**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

curl -s -A "$UA" \
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:ital,wght@0,400;1,400&display=swap&subset=latin,cyrillic" \
  -o assets/fonts/fonts.css

# Download every referenced woff2 into assets/fonts/files/ and rewrite the
# @font-face url() to point at the local copy.
grep -oE 'https://fonts\.gstatic\.com/[A-Za-z0-9/_.-]+\.woff2' assets/fonts/fonts.css | sort -u | while read -r url; do
  fname=$(basename "$url")
  curl -s "$url" -o "assets/fonts/files/$fname"
  escaped=$(printf '%s\n' "$url" | sed 's/[&/\.]/\\&/g')
  sed -i '' "s|$escaped|files/$fname|g" assets/fonts/fonts.css
done

ls assets/fonts/files/
```

Expected: `fonts.css` now contains `@font-face` blocks whose `url()` values point at `files/<hash>.woff2`, and `assets/fonts/files/` contains one `.woff2` file per block listed by `ls`.

- [ ] **Step 2: Preload the primary body font**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
# Find the woff2 file used by the Inter, weight 400, normal-style @font-face
# block with the broadest unicode-range (the last Inter 400 block in the file).
PRELOAD_FILE=$(awk '
  /font-family: '\''Inter'\''/ { fam=1 }
  fam && /font-weight: 400/ { weight=1 }
  fam && weight && /url\(files\// {
    match($0, /files\/[^)]+\.woff2/)
    last=substr($0, RSTART, RLENGTH)
  }
  /^}/ { fam=0; weight=0 }
  END { print last }
' assets/fonts/fonts.css)
echo "$PRELOAD_FILE"
```

Expected: prints a path like `files/abc123.woff2` that exists under `assets/fonts/`.

Add a preload `<link>` to `index.html`'s `<head>`, immediately before the `fonts.css` stylesheet link, using the path printed above:

```html
<link rel="preload" href="assets/fonts/<PRELOAD_FILE>" as="font" type="font/woff2" crossorigin>
```

- [ ] **Step 3: Write the CSS reset and base typography in `css/base.css`**

```css
/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

body, h1, h2, h3, h4, p, figure, blockquote, dl, dd {
  margin: 0;
}

ul[class], ol[class] {
  list-style: none;
  padding: 0;
  margin: 0;
}

img, picture, svg {
  display: block;
  max-width: 100%;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Base typography */
body {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--fs-body);
  line-height: 1.5;
  color: var(--color-text-dark);
  background-color: var(--color-bg-light);
}

h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 400;
  line-height: 1.2;
  text-transform: uppercase;
}

h1 { font-size: var(--fs-h1); }
h2 { font-size: var(--fs-h2); }
h3 { font-size: var(--fs-h3); }

/* Accessibility: visually-hidden skip link, visible on focus */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--color-bg-dark);
  color: var(--color-text-light);
  padding: var(--space-2) var(--space-3);
  z-index: 1000;
}

.skip-link:focus {
  left: var(--space-2);
  top: var(--space-2);
}

/* Container */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad);
}
```

- [ ] **Step 4: Verify fonts and base styles load**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/assets/fonts/fonts.css
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:4173/assets/fonts/$(echo "$PRELOAD_FILE")"
```

Expected: both `200`. Reload `http://localhost:4173/` — body text now renders in Inter (visible once any text exists; for now confirm via devtools "Computed" panel on `<body>` showing `font-family: Inter, ...`).

- [ ] **Step 5: Commit**

```bash
git add assets/fonts css/base.css index.html
git commit -m "Self-host Inter and Playfair Display, add CSS reset and base typography"
```

---

### Task 4: Header & navigation

**Files:**
- Modify: `index.html` (header markup)
- Modify: `css/components.css` (`.header`, `.nav`, `.btn`)
- Modify: `css/base.css` (`.no-scroll` utility)
- Modify: `js/main.js` (nav toggle)

- [ ] **Step 1: Add header markup to `index.html`**

Replace `<!-- Task 4 -->` with:

```html
<div class="container header__inner">
  <a href="#main" class="header__logo">Dental Studio</a>

  <nav class="nav" id="nav-menu" aria-label="Основна навігація">
    <ul class="nav__list">
      <li><a href="index.html" class="nav__link">Головна</a></li>
      <li>
        <details class="nav-dropdown">
          <summary class="nav__link nav-dropdown__summary">Послуги</summary>
          <ul class="nav-dropdown__menu">
            <li><a href="#services">Терапія</a></li>
            <li><a href="#services">Гігієна</a></li>
            <li><a href="#services">Хірургія</a></li>
            <li><a href="#services">Протезування</a></li>
          </ul>
        </details>
      </li>
      <!-- TODO: point to a dedicated prices page once it exists -->
      <li><a href="#" class="nav__link">Ціни</a></li>
      <li><a href="#contacts" class="nav__link">Контакти</a></li>
    </ul>
  </nav>

  <div class="header__actions">
    <!-- TODO: replace with the clinic's real phone number -->
    <a href="tel:+380000000000" class="header__phone">+38 (0XX) XXX-XX-XX</a>
    <button type="button" class="btn btn--pill js-open-modal">ЗАПИСАТИСЯ</button>
    <button type="button" class="nav__toggle js-nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Відкрити меню">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  </div>
</div>
```

- [ ] **Step 2: Add `.no-scroll` utility to `css/base.css`**

Append:

```css
.no-scroll {
  overflow: hidden;
}
```

- [ ] **Step 3: Add header, nav, and button styles to `css/components.css`**

```css
/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--fs-small);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s ease;
}

.btn:hover {
  opacity: 0.85;
}

.btn--pill {
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  background-color: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  -webkit-backdrop-filter: blur(var(--glass-blur));
  backdrop-filter: blur(var(--glass-blur));
  color: var(--color-text-light);
}

/* Header */
.header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 100;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.header.is-scrolled {
  background-color: var(--color-bg-dark);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-3);
}

.header__logo {
  font-weight: 500;
  font-size: var(--fs-body);
  color: var(--color-text-light);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header__phone {
  display: none;
  color: var(--color-text-light);
  font-weight: 500;
  font-size: var(--fs-body);
}

/* Mobile nav toggle */
.nav__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-light);
}

.nav__toggle svg {
  width: 24px;
  height: 24px;
}

/* Mobile nav panel */
.nav {
  position: fixed;
  inset: 0;
  background-color: var(--color-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.nav.is-open {
  transform: translateX(0);
}

.nav__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--fs-h3);
}

.nav__link {
  color: var(--color-text-light);
}

.nav-dropdown__summary {
  cursor: pointer;
}

.nav-dropdown__summary::-webkit-details-marker {
  display: none;
}

.nav-dropdown__menu {
  margin-top: var(--space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-body);
  color: var(--color-text-muted-on-dark);
}

/* Desktop nav */
@media (min-width: 1024px) {
  .header__phone {
    display: inline;
  }

  .nav__toggle {
    display: none;
  }

  .nav {
    position: static;
    inset: auto;
    transform: none;
    background-color: transparent;
    display: block;
  }

  .nav__list {
    flex-direction: row;
    gap: var(--space-5);
    font-size: var(--fs-body);
  }

  .nav-dropdown {
    position: relative;
  }

  .nav-dropdown__menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background-color: var(--color-bg-dark);
    border-radius: var(--radius-card);
    white-space: nowrap;
  }

  .nav-dropdown:hover .nav-dropdown__menu,
  .nav-dropdown:focus-within .nav-dropdown__menu,
  .nav-dropdown[open] .nav-dropdown__menu {
    display: flex;
  }
}
```

- [ ] **Step 4: Wire up the mobile nav toggle in `js/main.js`**

Replace the stub contents with:

```js
// Dental Studio - main behavior: nav toggle, header scroll state,
// scroll-reveal, booking modal.

function initNavToggle() {
  const toggle = document.querySelector('.js-nav-toggle');
  const nav = document.getElementById('nav-menu');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
}

initNavToggle();
```

- [ ] **Step 5: Verify in the browser**

With the dev server from Task 1 running, reload `http://localhost:4173/`.

- At a mobile width (e.g. 375px in devtools responsive mode): only the logo and hamburger icon are visible (text is dark-on-white for now since the hero background doesn't exist yet — that's expected, it'll be fixed in Task 5). Click the hamburger — a full-screen dark panel slides in from the right with the nav links. Click "Послуги" — the dropdown list expands inline. Click any link — the panel closes.
- At a desktop width (e.g. 1280px): the hamburger is hidden, the nav links and phone number are visible inline, and hovering "Послуги" reveals the dropdown.

- [ ] **Step 6: Commit**

```bash
git add index.html css js
git commit -m "Add header, navigation, and mobile menu toggle"
```

---

### Task 5: Hero section

**Files:**
- Modify: `index.html` (hero markup)
- Modify: `css/components.css` (`.img-placeholder`)
- Modify: `css/sections.css` (`.hero`)

- [ ] **Step 1: Add the image placeholder component to `css/components.css`**

```css
/* Image placeholder: shown until real photography is added.
   Pass --ph-aspect-ratio inline to control the box's shape. */
.img-placeholder {
  --ph-aspect-ratio: 16 / 9;
  position: relative;
  aspect-ratio: var(--ph-aspect-ratio);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.04) 0,
    rgba(255, 255, 255, 0.04) 12px,
    transparent 12px,
    transparent 24px
  );
  color: var(--color-text-muted-on-dark);
  font-family: var(--font-body);
  font-size: var(--fs-small);
  text-align: center;
  padding: var(--space-3);
  overflow: hidden;
}
```

- [ ] **Step 2: Add hero markup to `index.html`**

Replace `<!-- Task 5: hero -->` with:

```html
<section class="hero" id="hero">
  <div class="img-placeholder hero__bg" style="--ph-aspect-ratio: 16/10;" role="img" aria-label="Фото кабінету клініки (буде додано пізніше)">
    Фото — 1920×1200
  </div>
  <div class="hero__overlay"></div>

  <div class="container hero__content">
    <p class="hero__location">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
        <path d="M5 9C5 9 8.5 6 8.5 3.5C8.5 1.6 6.9 0.5 5 0.5C3.1 0.5 1.5 1.6 1.5 3.5C1.5 6 5 9 5 9Z"></path>
      </svg>
      <!-- TODO: replace with the clinic's real city and address -->
      <span>Харків, вул. Клочківська ХХХ</span>
    </p>

    <h1 class="hero__title">
      Стоматологія,<br>
      де <em>не страшно</em><br>
      і зручно
    </h1>

    <p class="hero__subtitle">
      Від першого огляду до результату — без черг, сюрпризів і зайвих процедур.
    </p>

    <button type="button" class="btn btn--pill js-open-modal">Записатися на огляд</button>
  </div>
</section>
```

- [ ] **Step 3: Add hero layout styles to `css/sections.css`**

```css
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  background-color: var(--color-bg-darker);
  overflow: hidden;
}

.hero__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(14, 25, 25, 0.9) 0%,
    rgba(14, 25, 25, 0.4) 60%,
    rgba(14, 25, 25, 0.1) 100%
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  padding-block: var(--space-7) var(--space-6);
  color: var(--color-text-light);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hero__location {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-small);
  font-weight: 500;
  text-transform: uppercase;
  color: var(--color-text-light);
}

.hero__title {
  font-size: var(--fs-h1);
  max-width: 16ch;
}

.hero__title em {
  font-family: var(--font-heading);
  font-style: italic;
}

.hero__subtitle {
  max-width: 40ch;
  font-size: var(--fs-body);
  font-weight: 500;
}

.hero .btn {
  align-self: flex-start;
  margin-top: var(--space-3);
}

@media (min-width: 1024px) {
  .hero__content {
    padding-block: var(--space-8);
    max-width: 640px;
  }
}
```

- [ ] **Step 4: Verify in the browser**

Reload `http://localhost:4173/`. The hero now fills the viewport with a dark placeholder background, a gradient overlay, the location badge, the large headline (with "не страшно" in italic Playfair Display), subtitle, and a frosted "Записатися на огляд" button. The header overlays the hero and its text/icons are now legible (white on dark). Check at 375px and 1280px widths — the layout should not overflow horizontally at either size.

- [ ] **Step 5: Commit**

```bash
git add index.html css
git commit -m "Add hero section with placeholder background"
```

---

### Task 6: Services overview section

**Files:**
- Modify: `index.html` (services markup)
- Modify: `css/sections.css` (`.services`, `.service-card`)

- [ ] **Step 1: Add services markup to `index.html`**

Replace `<!-- Task 6: services -->` with:

```html
<section class="services" id="services">
  <div class="container">
    <h2 class="section-title">Від огляду до протезування</h2>
    <p class="section-intro">Всі необхідні послуги в одному місці — без направлень і зайвих переїздів.</p>

    <div class="services__grid">
      <article class="service-card service-card--photo">
        <div class="img-placeholder service-card__bg" style="--ph-aspect-ratio: 3/4;" role="img" aria-label="Фото — Терапія (буде додано пізніше)">Фото — 640×850</div>
        <div class="service-card__overlay"></div>
        <div class="service-card__content">
          <div>
            <h3 class="service-card__title">Терапія</h3>
            <a href="#" class="service-card__link">Детальніше →</a>
          </div>
          <div>
            <p class="service-card__price-label">Ціна</p>
            <p class="service-card__price">₴1000 – ₴4000</p>
            <p class="service-card__description">Карієс, пульпіт, реставрація. Пояснюємо що і чому — до початку лікування.</p>
          </div>
        </div>
      </article>

      <article class="service-card">
        <div class="service-card__content">
          <div>
            <h3 class="service-card__title">Гігієна</h3>
            <a href="#" class="service-card__link">Детальніше →</a>
          </div>
          <div>
            <p class="service-card__price-label">Ціна</p>
            <p class="service-card__price">₴500 – ₴2000</p>
            <p class="service-card__description">Чистка і відбілювання. Помітний результат після першого візиту.</p>
          </div>
        </div>
      </article>

      <article class="service-card">
        <div class="service-card__content">
          <div>
            <h3 class="service-card__title">Хірургія</h3>
            <a href="#" class="service-card__link">Детальніше →</a>
          </div>
          <div>
            <p class="service-card__price-label">Ціна</p>
            <p class="service-card__price">₴500 – ₴2000</p>
            <p class="service-card__description">Видалення і імплантація. Сучасна анестезія — без болю і зайвої тривоги.</p>
          </div>
        </div>
      </article>

      <article class="service-card">
        <div class="service-card__content">
          <div>
            <h3 class="service-card__title">Протезування</h3>
            <a href="#" class="service-card__link">Детальніше →</a>
          </div>
          <div>
            <p class="service-card__price-label">Ціна</p>
            <p class="service-card__price">₴5000 – ₴10000</p>
            <p class="service-card__description">Коронки металокераміка, цирконій і E-max — інші зуби не виділятимуться.</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>
```

> Note: `<!-- TODO: link to dedicated service page -->` applies to each `service-card__link` `href="#"` above — they'll point to individual service pages once those exist.

- [ ] **Step 2: Add services section styles to `css/sections.css`**

```css
.section-title {
  margin-bottom: var(--space-3);
}

.section-intro {
  max-width: 40ch;
  font-weight: 500;
  margin-bottom: var(--space-6);
}

.services {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  padding-block: var(--space-7);
}

.services__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.service-card {
  position: relative;
  display: flex;
  min-height: 420px;
  padding: var(--space-4);
  border-radius: var(--radius-card);
  background-color: var(--color-card-dark-2);
  overflow: hidden;
}

.service-card--photo {
  background-color: var(--color-card-dark-1);
}

.service-card__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.service-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(21, 21, 21, 0.85), rgba(21, 21, 21, 0.1));
}

.service-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.service-card__title {
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.service-card__link {
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--color-text-muted-on-dark);
}

.service-card__price-label {
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--color-text-muted-on-dark);
  margin-bottom: var(--space-1);
}

.service-card__price {
  font-size: var(--fs-body);
  font-weight: 500;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.service-card__description {
  font-size: var(--fs-body);
  font-weight: 500;
}

@media (min-width: 768px) {
  .services__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services__grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .service-card__title {
    font-size: 2rem;
  }
}
```

- [ ] **Step 3: Verify in the browser**

Reload `http://localhost:4173/` and scroll to the services section. At 375px, the four dark cards stack full-width with title, "Детальніше →", a divider, price, and description. At 768px they form a 2×2 grid; at 1280px a single row of 4. The first card shows a placeholder photo with a dark gradient and the same text overlaid in white.

- [ ] **Step 4: Commit**

```bash
git add index.html css/sections.css
git commit -m "Add services overview section with four service cards"
```

---

### Task 7: "How an appointment works" section

**Files:**
- Modify: `index.html` (process markup)
- Modify: `css/components.css` (`.img-placeholder--light` modifier)
- Modify: `css/sections.css` (`.process`)

- [ ] **Step 1: Add a light-theme image placeholder modifier to `css/components.css`**

Append:

```css
.img-placeholder--light {
  background-color: #f0f0f0;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.04) 0,
    rgba(0, 0, 0, 0.04) 12px,
    transparent 12px,
    transparent 24px
  );
  color: var(--color-text-muted-on-light);
}
```

- [ ] **Step 2: Add process markup to `index.html`**

Replace `<!-- Task 7: process -->` with:

```html
<section class="process" id="process">
  <div class="container">
    <h2 class="section-title">Як проходить прийом</h2>

    <div class="process__layout">
      <ol class="process__steps">
        <li class="process__step">
          <span class="process__number">01</span>
          <h3 class="process__title">Запис</h3>
          <p class="process__text">Телефонуєте або пишете — підбираємо зручний час.</p>
        </li>
        <li class="process__step">
          <span class="process__number">02</span>
          <h3 class="process__title">Огляд</h3>
          <p class="process__text">Оглядаємо, за потреби робимо знімок. Пояснюємо що знайшли.</p>
        </li>
        <li class="process__step">
          <span class="process__number">03</span>
          <h3 class="process__title">План і ціна</h3>
          <p class="process__text">Озвучуємо вартість до початку лікування. Що узгоджено — те і платите.</p>
        </li>
        <li class="process__step">
          <span class="process__number">04</span>
          <h3 class="process__title">Лікування</h3>
          <p class="process__text">Працюємо за протоколом. Ви в курсі кожного кроку — від анестезії до фінального результату.</p>
        </li>
      </ol>

      <div class="img-placeholder img-placeholder--light process__image" style="--ph-aspect-ratio: 3/4;" role="img" aria-label="Фото — прийом у клініці (буде додано пізніше)">Фото — 800×1000</div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add process section styles to `css/sections.css`**

```css
.process {
  background-color: var(--color-bg-light);
  color: var(--color-text-dark);
  padding-block: var(--space-7);
}

.process__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.process__steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  border-left: 1px solid rgba(17, 21, 31, 0.12);
}

.process__step {
  position: relative;
  padding-left: var(--space-5);
}

.process__number {
  display: block;
  font-family: var(--font-heading);
  font-style: italic;
  font-size: 1.5rem;
  color: var(--color-text-muted-on-light);
  margin-bottom: var(--space-2);
}

.process__title {
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.process__text {
  max-width: 40ch;
}

.process__image {
  border-radius: var(--radius-card);
}

@media (min-width: 1024px) {
  .process__layout {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: start;
  }

  .process__image {
    position: sticky;
    top: calc(var(--space-7) + 80px);
  }
}
```

- [ ] **Step 4: Verify in the browser**

Reload and scroll to "Як проходить прийом". At 375px: a vertical line connects four numbered steps (01–04), each with a title and description, followed by the image placeholder below. At 1280px: the steps form a left column with a sticky image placeholder to the right.

- [ ] **Step 5: Commit**

```bash
git add index.html css
git commit -m "Add 'how an appointment works' process section"
```

---

### Task 8: "Why choose us" section

**Files:**
- Modify: `index.html` (why-us markup)
- Modify: `css/sections.css` (`.why-us`)

- [ ] **Step 1: Add markup to `index.html`**

Replace `<!-- Task 8: why-us -->` with:

```html
<section class="why-us" id="why-us">
  <div class="container">
    <h2 class="section-title">Чому обирають нас</h2>

    <div class="why-us__grid">
      <article class="why-us__item">
        <div class="why-us__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
        </div>
        <h3 class="why-us__title">Перевага 1</h3>
        <!-- TODO: replace with real copy -->
        <p class="why-us__text">Короткий опис переваги — текст буде уточнено пізніше.</p>
      </article>

      <article class="why-us__item">
        <div class="why-us__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
        </div>
        <h3 class="why-us__title">Перевага 2</h3>
        <p class="why-us__text">Короткий опис переваги — текст буде уточнено пізніше.</p>
      </article>

      <article class="why-us__item">
        <div class="why-us__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
        </div>
        <h3 class="why-us__title">Перевага 3</h3>
        <p class="why-us__text">Короткий опис переваги — текст буде уточнено пізніше.</p>
      </article>

      <article class="why-us__item">
        <div class="why-us__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
        </div>
        <h3 class="why-us__title">Перевага 4</h3>
        <p class="why-us__text">Короткий опис переваги — текст буде уточнено пізніше.</p>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add styles to `css/sections.css`**

```css
.why-us {
  background-color: var(--color-bg-light);
  padding-block: var(--space-7);
}

.why-us__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
  margin-top: var(--space-6);
}

.why-us__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  margin-bottom: var(--space-3);
}

.why-us__icon svg {
  width: 22px;
  height: 22px;
}

.why-us__title {
  font-size: 1.25rem;
  margin-bottom: var(--space-2);
}

.why-us__text {
  color: var(--color-text-muted-on-light);
  max-width: 32ch;
}

@media (min-width: 768px) {
  .why-us__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .why-us__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll to "Чому обирають нас". At 375px the four items stack in one column; at 768px in a 2×2 grid; at 1280px in a single row of 4. Each item has a dark circular icon badge, a title, and placeholder text.

- [ ] **Step 4: Commit**

```bash
git add index.html css/sections.css
git commit -m "Add 'why choose us' section with placeholder USPs"
```

---

### Task 9: Testimonials section

**Files:**
- Modify: `index.html` (testimonials markup)
- Modify: `css/sections.css` (`.testimonials`)

- [ ] **Step 1: Add markup to `index.html`**

Replace `<!-- Task 9: testimonials -->` with:

```html
<section class="testimonials" id="testimonials">
  <div class="container testimonials__layout">
    <div>
      <h2 class="section-title">Що кажуть пацієнти</h2>

      <div class="testimonials__list">
        <blockquote class="testimonial">
          <p class="testimonial__quote">«Прийшов на консультацію щодо імплантації — думав що це дуже дорого і складно. Все розклали по поличках, показали варіанти. Зробив. Шкодую тільки що не прийшов раніше.»</p>
          <cite class="testimonial__author">Андрій, 45 років</cite>
        </blockquote>

        <blockquote class="testimonial">
          <p class="testimonial__quote">«Роблю чистку тут вже вдруге. Результат помітний одразу, кабінет чистий і сучасний. Приємно що не намагаються продати щось зайве.»</p>
          <cite class="testimonial__author">Наталя, 29 років</cite>
        </blockquote>
      </div>
    </div>

    <div class="img-placeholder img-placeholder--light testimonials__image" style="--ph-aspect-ratio: 3/4;" role="img" aria-label="Фото — пацієнт клініки (буде додано пізніше)">Фото — 800×1000</div>
  </div>
</section>
```

- [ ] **Step 2: Add styles to `css/sections.css`**

```css
.testimonials {
  background-color: var(--color-bg-light);
  padding-block: var(--space-7);
}

.testimonials__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

.testimonials__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.testimonial__quote {
  font-family: var(--font-heading);
  font-style: italic;
  font-size: var(--fs-h3);
  margin-bottom: var(--space-3);
}

.testimonial__author {
  font-style: normal;
  font-weight: 500;
}

.testimonials__image {
  border-radius: var(--radius-card);
}

@media (min-width: 1024px) {
  .testimonials__layout {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }
}
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll to "Що кажуть пацієнти". At 375px: heading, then two italic quote cards with names, then the image placeholder below. At 1280px: text column on the left, image on the right, vertically centered.

- [ ] **Step 4: Commit**

```bash
git add index.html css/sections.css
git commit -m "Add testimonials section"
```

---

### Task 10: CTA banner & footer

**Files:**
- Modify: `index.html` (CTA banner + footer markup)
- Modify: `css/sections.css` (`.cta-banner`, `.footer`)
- Modify: `js/main.js` (footer year)

- [ ] **Step 1: Add CTA banner markup to `index.html`**

Replace `<!-- Task 10: cta banner -->` with:

```html
<section class="cta-banner">
  <div class="container cta-banner__inner">
    <h2 class="cta-banner__title">Готові записатися на огляд?</h2>
    <p class="cta-banner__text">Залиште заявку — передзвонимо і підберемо зручний час.</p>
    <button type="button" class="btn btn--pill js-open-modal">Записатися</button>
  </div>
</section>
```

- [ ] **Step 2: Add footer markup to `index.html`**

Replace `<!-- Task 10 -->` (inside `<footer class="footer" id="contacts">`) with:

```html
<div class="container footer__inner">
  <div class="footer__col">
    <p class="footer__logo">Dental Studio</p>
    <!-- TODO: replace with the clinic's real address -->
    <p class="footer__text">Харків, вул. Клочківська ХХХ</p>
    <!-- TODO: replace with the clinic's real working hours -->
    <p class="footer__text">Пн–Сб: 09:00–19:00</p>
  </div>

  <nav class="footer__col" aria-label="Навігація у футері">
    <p class="footer__heading">Меню</p>
    <ul class="footer__links">
      <li><a href="index.html">Головна</a></li>
      <li><a href="#services">Послуги</a></li>
      <li><a href="#">Ціни</a></li>
      <li><a href="#contacts">Контакти</a></li>
    </ul>
  </nav>

  <div class="footer__col">
    <p class="footer__heading">Контакти</p>
    <!-- TODO: replace with the clinic's real phone number -->
    <a class="footer__link" href="tel:+380000000000">+38 (0XX) XXX-XX-XX</a>
    <!-- TODO: replace with the clinic's real email -->
    <a class="footer__link" href="mailto:info@example.com">info@example.com</a>

    <div class="footer__socials">
      <!-- TODO: replace href values with real social links -->
      <a href="#" aria-label="Instagram" class="footer__social">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"></circle>
        </svg>
      </a>
      <a href="#" aria-label="Facebook" class="footer__social">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"></path>
        </svg>
      </a>
      <a href="#" aria-label="Telegram" class="footer__social">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.9 4.3 18.6 20c-.2 1-.9 1.2-1.7.8l-4.7-3.5-2.3 2.2c-.2.2-.5.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.5-.2L7 12.9l-4.5-1.4c-1-.3-1-1 .2-1.5L20.6 3c.8-.3 1.6.2 1.3 1.3Z"></path>
        </svg>
      </a>
    </div>
  </div>
</div>

<div class="container footer__bottom">
  <p>© <span class="js-year">2026</span> Dental Studio. Усі права захищені.</p>
</div>
```

- [ ] **Step 3: Add styles to `css/sections.css`**

```css
.cta-banner {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  padding-block: var(--space-7);
  text-align: center;
}

.cta-banner__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  max-width: 48ch;
  margin-inline: auto;
}

.cta-banner__title {
  font-size: var(--fs-h2);
}

.cta-banner__text {
  color: var(--color-text-muted-on-dark);
}

.cta-banner .btn {
  margin-top: var(--space-2);
}

.footer {
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
  padding-block: var(--space-7) var(--space-5);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

.footer__logo {
  font-weight: 500;
  font-size: var(--fs-h3);
  margin-bottom: var(--space-3);
}

.footer__text {
  color: var(--color-text-muted-on-dark);
  margin-bottom: var(--space-2);
}

.footer__heading {
  font-weight: 500;
  text-transform: uppercase;
  font-size: var(--fs-small);
  color: var(--color-text-muted-on-dark);
  margin-bottom: var(--space-3);
}

.footer__links {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer__link {
  display: block;
  margin-bottom: var(--space-2);
}

.footer__socials {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.footer__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.footer__social svg {
  width: 18px;
  height: 18px;
}

.footer__bottom {
  margin-top: var(--space-7);
  padding-top: var(--space-4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-muted-on-dark);
  font-size: var(--fs-small);
}

@media (min-width: 768px) {
  .footer__inner {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

- [ ] **Step 4: Set the footer year dynamically in `js/main.js`**

Append:

```js
function initFooterYear() {
  const el = document.querySelector('.js-year');
  if (el) el.textContent = String(new Date().getFullYear());
}

initFooterYear();
```

- [ ] **Step 5: Verify in the browser**

Reload. Above the footer, a dark "Готові записатися на огляд?" banner with a centered "Записатися" button. The footer below has three stacked columns on mobile (logo/address/hours, menu links, contact details + social icons) becoming a 3-column row at 768px, and the copyright line shows the current year (2026).

- [ ] **Step 6: Commit**

```bash
git add index.html css/sections.css js/main.js
git commit -m "Add CTA banner and footer with placeholder contact info"
```

---

### Task 11: Booking modal markup & styles

**Files:**
- Modify: `index.html` (modal markup)
- Modify: `css/components.css` (`.btn--solid`, `.modal-overlay`, `.modal`, `.form-field`)

- [ ] **Step 1: Add a solid button variant to `css/components.css`**

Append:

```css
.btn--solid {
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-dark);
  color: var(--color-text-light);
}
```

- [ ] **Step 2: Add modal markup to `index.html`**

Replace `<!-- Task 11: booking modal -->` with:

```html
<div class="modal-overlay js-modal-overlay" hidden>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <button type="button" class="modal__close js-modal-close" aria-label="Закрити">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <line x1="4" y1="4" x2="20" y2="20"></line>
        <line x1="20" y1="4" x2="4" y2="20"></line>
      </svg>
    </button>

    <h2 id="modal-title" class="modal__title">Запис на огляд</h2>
    <p class="modal__subtitle">Залиште контакти — ми передзвонимо, щоб підтвердити час.</p>

    <form class="modal__form js-booking-form" novalidate>
      <div class="form-field">
        <label for="booking-name">Ім'я</label>
        <input type="text" id="booking-name" name="name" autocomplete="name" required>
        <p class="form-field__error" data-error-for="name" role="alert"></p>
      </div>

      <div class="form-field">
        <label for="booking-phone">Телефон</label>
        <input type="tel" id="booking-phone" name="phone" autocomplete="tel" required>
        <p class="form-field__error" data-error-for="phone" role="alert"></p>
      </div>

      <div class="form-field">
        <label for="booking-service">Послуга</label>
        <select id="booking-service" name="service">
          <option value="Терапія">Терапія</option>
          <option value="Гігієна">Гігієна</option>
          <option value="Хірургія">Хірургія</option>
          <option value="Протезування">Протезування</option>
          <option value="Інше">Інше</option>
        </select>
      </div>

      <div class="form-field">
        <label for="booking-message">Коментар (необов'язково)</label>
        <textarea id="booking-message" name="message" rows="3"></textarea>
      </div>

      <button type="submit" class="btn btn--solid">Надіслати заявку</button>

      <p class="modal__status" data-status role="status" aria-live="polite"></p>
    </form>
  </div>
</div>
```

- [ ] **Step 3: Add modal styles to `css/components.css`**

```css
/* Booking modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background-color: rgba(17, 21, 31, 0.6);
}

.modal-overlay[hidden] {
  display: none;
}

.modal {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100vh - var(--space-6));
  overflow-y: auto;
  background-color: var(--color-bg-light);
  color: var(--color-text-dark);
  border-radius: var(--radius-card);
  padding: var(--space-5);
}

.modal__close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-dark);
}

.modal__close svg {
  width: 18px;
  height: 18px;
}

.modal__title {
  font-size: var(--fs-h3);
  margin-bottom: var(--space-2);
  padding-right: var(--space-6);
}

.modal__subtitle {
  color: var(--color-text-muted-on-light);
  margin-bottom: var(--space-4);
}

.modal__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-field label {
  font-size: var(--fs-small);
  font-weight: 500;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: var(--space-2) var(--space-3);
  border: 1px solid rgba(17, 21, 31, 0.2);
  border-radius: 8px;
  background-color: var(--color-bg-light);
  font-family: var(--font-body);
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: 2px solid var(--color-bg-dark);
  outline-offset: 1px;
}

.form-field__error {
  min-height: 1.25em;
  font-size: var(--fs-small);
  color: #c0392b;
}

.modal__status {
  min-height: 1.5em;
  font-size: var(--fs-small);
}

.modal__status[data-state="success"] {
  color: #2e7d32;
}

.modal__status[data-state="error"] {
  color: #c0392b;
}
```

- [ ] **Step 4: Verify the markup/styles**

Reload `http://localhost:4173/`. The modal is invisible (it has the `hidden` attribute, and there's no JS to open it yet — that comes in Task 13). In devtools, select the `.js-modal-overlay` element and remove its `hidden` attribute: a centered white card should appear over a dark backdrop, with the close button top-right, title, subtitle, and the four styled form fields plus a dark "Надіслати заявку" button. Restore `hidden` (or reload) afterward.

- [ ] **Step 5: Commit**

```bash
git add index.html css/components.css
git commit -m "Add booking modal markup and styles"
```

---

### Task 12: Form validators (TDD)

**Files:**
- Create: `js/validators.js`
- Test: `tests/validators.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/validators.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidName, isValidPhone } from '../js/validators.js';

test('isValidName rejects empty or too-short input', () => {
  assert.equal(isValidName(''), false);
  assert.equal(isValidName('   '), false);
  assert.equal(isValidName('A'), false);
});

test('isValidName accepts real names, trimming whitespace', () => {
  assert.equal(isValidName('Олена'), true);
  assert.equal(isValidName('  Jan  '), true);
});

test('isValidPhone rejects empty, too-short, or non-numeric input', () => {
  assert.equal(isValidPhone(''), false);
  assert.equal(isValidPhone('123'), false);
  assert.equal(isValidPhone('not a phone'), false);
});

test('isValidPhone accepts common Ukrainian phone formats', () => {
  assert.equal(isValidPhone('+380501234567'), true);
  assert.equal(isValidPhone('0501234567'), true);
  assert.equal(isValidPhone('(050) 123-45-67'), true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
node --test tests/
```

Expected: FAIL — `tests/validators.test.mjs` errors with `Cannot find module '../js/validators.js'`.

- [ ] **Step 3: Write the minimal implementation**

Create `js/validators.js`:

```js
export function isValidName(value) {
  return typeof value === 'string' && value.trim().length >= 2;
}

export function isValidPhone(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!/^\+?[\d\s()-]{7,20}$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
node --test tests/
```

Expected: PASS — 4 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add js/validators.js tests/validators.test.mjs
git commit -m "Add unit-tested form validators for booking modal"
```

---

### Task 13: Booking modal behavior (open/close, focus trap, validation, submission)

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Add the modal controller to `js/main.js`**

Append:

```js
import { isValidName, isValidPhone } from './validators.js';

// TODO: replace with the clinic's real email address before going live.
// FormSubmit.co requires a one-time confirmation click sent to this address
// the first time the form is submitted from this domain.
const BOOKING_EMAIL = 'doctor@example.com';

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

function initBookingModal() {
  const overlay = document.querySelector('.js-modal-overlay');
  const modal = overlay?.querySelector('.modal');
  const closeBtn = overlay?.querySelector('.js-modal-close');
  const form = overlay?.querySelector('.js-booking-form');
  const statusEl = form?.querySelector('[data-status]');
  const openButtons = document.querySelectorAll('.js-open-modal');

  if (!overlay || !modal || !form || !statusEl) return;

  let lastFocused = null;

  function onKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = getFocusableElements(modal);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function openModal() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    getFocusableElements(modal)[0]?.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  openButtons.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nameInput = form.elements.namedItem('name');
    const phoneInput = form.elements.namedItem('phone');
    const serviceInput = form.elements.namedItem('service');
    const messageInput = form.elements.namedItem('message');
    const nameError = form.querySelector('[data-error-for="name"]');
    const phoneError = form.querySelector('[data-error-for="phone"]');

    let valid = true;

    if (!isValidName(nameInput.value)) {
      nameError.textContent = "Введіть, будь ласка, ім'я (мінімум 2 символи).";
      valid = false;
    } else {
      nameError.textContent = '';
    }

    if (!isValidPhone(phoneInput.value)) {
      phoneError.textContent = 'Введіть коректний номер телефону.';
      valid = false;
    } else {
      phoneError.textContent = '';
    }

    if (!valid) return;

    statusEl.dataset.state = '';
    statusEl.textContent = 'Надсилаємо...';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${BOOKING_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          phone: phoneInput.value.trim(),
          service: serviceInput.value,
          message: messageInput.value.trim(),
          _subject: 'Нова заявка на запис — Dental Studio',
        }),
      });

      if (!response.ok) throw new Error('Request failed');

      statusEl.dataset.state = 'success';
      statusEl.textContent = 'Дякуємо! Ми зв’яжемося з вами найближчим часом.';
      form.reset();
    } catch (error) {
      statusEl.dataset.state = 'error';
      statusEl.textContent = 'Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.';
    }
  });
}

initBookingModal();
```

> Note: `js/main.js` is loaded with `<script type="module">` (set in Task 1), so the `import` statement above works without a build step.

- [ ] **Step 2: Verify in the browser**

Reload `http://localhost:4173/`.

- Click any "ЗАПИСАТИСЯ" button (header, hero, CTA banner) — the modal opens, the backdrop darkens the page, and focus moves to the "Ім'я" field.
- Press `Tab` repeatedly — focus cycles only through the modal's controls (close button → fields → submit) and wraps back to the close button; `Shift+Tab` cycles backward.
- Press `Esc` — the modal closes and focus returns to the button that opened it.
- Reopen, click the dark backdrop outside the white card — the modal closes.
- Reopen, click "Надіслати заявку" with empty fields — inline error messages appear under "Ім'я" and "Телефон" and no request is sent.
- Fill in a valid name (e.g. "Олена") and phone (e.g. "0501234567") and submit — the status line shows "Надсилаємо...", then either a success or an error message (an error is expected here since `BOOKING_EMAIL` is still the placeholder `doctor@example.com`; this becomes a real success once a confirmed clinic email is configured).

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "Add booking modal behavior: focus trap, validation, FormSubmit integration"
```

---

### Task 14: Header scroll state, scroll-reveal, and final verification

**Files:**
- Modify: `index.html` (scroll sentinel, anchor smooth-scroll already via CSS)
- Modify: `css/components.css` (`.reveal`)
- Modify: `js/main.js` (header scroll state, scroll-reveal)

- [ ] **Step 1: Add a scroll sentinel to `index.html`**

As the first element inside `<body>`, before `<a class="skip-link" ...>`:

```html
<div id="scroll-sentinel" aria-hidden="true" style="position: absolute; top: 0; width: 1px; height: 1px;"></div>
```

- [ ] **Step 2: Add reveal styles to `css/components.css`**

```css
/* Scroll-reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 3: Add header scroll state and scroll-reveal to `js/main.js`**

Append:

```js
function initHeaderScrollState() {
  const header = document.getElementById('header');
  const sentinel = document.getElementById('scroll-sentinel');
  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(sentinel);
}

function initScrollReveal() {
  const targets = document.querySelectorAll('main > section:not(.hero), .footer');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targets.forEach((el) => el.classList.add('reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

initHeaderScrollState();
initScrollReveal();
```

- [ ] **Step 4: Run the full test suite**

```bash
cd /Users/staspolivoda/Desktop/dental-studio
node --test tests/
```

Expected: PASS — 4 tests, 0 failures.

- [ ] **Step 5: Full responsive walkthrough**

With the dev server running, open `http://localhost:4173/` and check at three widths (375px, 768px, 1280px):

- No horizontal scrollbar / overflow at any width.
- Header is transparent over the hero and turns solid dark (`is-scrolled`) once you scroll past the hero.
- Each section below the hero fades/slides into view the first time it enters the viewport (toggle "Emulate prefers-reduced-motion: reduce" in devtools and confirm sections appear instantly with no animation instead).
- Mobile nav (375px): hamburger opens a full-screen panel; "Послуги" expands via `<details>`.
- Desktop nav (1280px): inline nav, "Послуги" dropdown appears on hover/focus.
- Booking modal opens from header, hero, and CTA banner buttons; focus trap, Esc, and backdrop-click all work as in Task 13.
- All placeholder images show clearly labeled boxes with their intended dimensions, at the correct aspect ratio, with no layout shift.

- [ ] **Step 6: Commit**

```bash
git add index.html css/components.css js/main.js
git commit -m "Add header scroll state and scroll-reveal animations"
```
