# Dental Studio — Homepage & Site Foundation Design

## Overview

Build the homepage for "Dental Studio", a dental clinic website, plus a shared
foundation (design tokens, header, footer, booking modal) that future pages
(Послуги, Ціни, Контакти, individual service pages) will reuse.

Source design reference: Figma file `Dental-studio`
(`VulKJNN3J6xTIzQEHLD4sX`), desktop frame `24:876` and a partial mobile draft
`23:107`. Colors/spacing in this spec are taken from the desktop frame; the
mobile draft confirmed the stacking pattern but used different placeholder
colors and is not authoritative.

## Goals & constraints

- Plain HTML, CSS, and vanilla JS — no frameworks, no build step, no npm
  dependencies. The user must be able to open `index.html` directly and edit
  any file by hand.
- Mobile-first, fully responsive (phone / tablet / desktop).
- Fast by default: self-hosted fonts, lazy-loaded images, minimal JS,
  semantic HTML.
- All real content (addresses, phone numbers, social links, copy for
  "Why choose us" / footer / etc.) is placeholder for now and will be
  supplied later. Placeholders must be obviously labeled and easy to find
  and replace.
- Site language: Ukrainian (matches Figma copy).

## Out of scope (future work)

- Other pages: Послуги (services detail), Ціни, Контакти, individual service
  pages. The header nav will link to them as anchors/placeholder hrefs for
  now.
- Real form backend / email address for the booking modal (placeholder
  email + documented swap point).
- Final photography — placeholder image blocks only.
- "Why choose us" and footer copy — structural placeholders only, real copy
  to follow.

## Project structure

```
/index.html
/css/
  tokens.css      — CSS custom properties: colors, fonts, spacing, radii, breakpoints
  base.css        — reset, base typography, global element styles
  components.css  — buttons, cards, nav, modal, badges (reusable across pages)
  sections.css    — layout for each homepage section
/js/
  main.js         — nav toggle, modal open/close, smooth scroll, scroll-reveal
/assets/
  fonts/           — self-hosted Inter + Playfair Display (woff2)
  icons/           — inline SVGs (menu, arrow, heart, socials)
  images/          — placeholder images
```

## Design tokens (`css/tokens.css`)

Colors (from Figma desktop frame):

- `--color-bg-dark: #11151f` — main dark section background
- `--color-bg-darker: #0e1919` — hero background
- `--color-card-dark-1: #151515` — first service card background
- `--color-card-dark-2: #1d2433` — other dark card backgrounds
- `--color-bg-light: #ffffff` — light section background
- `--color-text-dark: #11151f` — body text on light sections
- `--color-text-light: #ffffff` — body text on dark sections
- `--color-text-muted-on-dark: rgba(255,255,255,0.7)`
- `--color-text-muted-on-light: #adadad`
- `--color-glass-bg: rgba(255,255,255,0.3)` + `--color-glass-border:
  rgba(255,255,255,0.2)` + `backdrop-filter: blur(...)` for the frosted CTA
  buttons

Typography:

- `--font-heading: 'Playfair Display', serif` (regular + italic)
- `--font-body: 'Inter', sans-serif` (400, 500)
- Fluid type scale using `clamp()` for hero/section headings so sizes scale
  smoothly between mobile (~32–40px) and desktop (~56–72px) without separate
  per-breakpoint overrides.

Spacing & layout:

- Spacing scale: `--space-1` (4px) through `--space-8` (64px), used for
  section padding/gaps.
- Radii: `--radius-card: 24px`, `--radius-pill: 32px` (CTA buttons).
- Breakpoints (mobile-first, `min-width`): `480px`, `768px`, `1024px`,
  `1280px`.

## Components (`css/components.css`)

- **Buttons:** primary "pill" CTA (frosted glass on dark, solid on light),
  secondary text links with arrow (`ДЕТАЛЬНІШЕ →`).
- **Header/nav:** transparent over hero, becomes solid `--color-bg-dark` on
  scroll. Logo left, nav center (Головна, Послуги with dropdown caret, Ціни,
  Контакти), phone placeholder + "ЗАПИСАТИСЯ" button right. Below `1024px`,
  collapses to a hamburger menu opening a full-screen/slide-in nav panel.
- **Service card:** image or solid dark background, title (Playfair
  Display), "ДЕТАЛЬНІШЕ →" link, divider line, price range, description.
- **Step item:** numbered (`01`–`04`, italic Playfair), title, description,
  connected by a vertical timeline line (desktop) / simple stacked list
  (mobile).
- **Testimonial card:** italic Playfair quote + name/age attribution.
- **Booking modal:** overlay + centered dialog, form fields, close button.
- **Image placeholder:** `<div class="img-placeholder" style="aspect-ratio: …">`
  with a subtle pattern background and a centered label (e.g. "Hero photo —
  1920×1080") so real `<img>`s can be dropped in later without layout shift.

## Page sections (`index.html`)

1. **Header / nav** — as described above. "ЗАПИСАТИСЯ" opens the booking
   modal. "Послуги" dropdown links to anchors within the services section for
   now (`#services`), ready to point to real sub-pages later.

2. **Hero** (`--color-bg-darker` background, full-bleed placeholder image with
   dark gradient overlay):
   - Location badge: "ХАРКІВ, вул. Клочківська ХХХ" (placeholder)
   - Headline: "Стоматологія, де **не страшно** і зручно" (mixed
     Inter/Playfair-italic, matches Figma)
   - Subtext: "Від першого огляду до результату — без черг, сюрпризів і
     зайвих процедур."
   - CTA: "ЗАПИСАТИСЯ НА ОГЛЯД" → opens booking modal

3. **Services overview** (`--color-bg-dark` background):
   - Heading: "Від огляду до протезування"
   - Intro: "Всі необхідні послуги в одному місці — без направлень і зайвих
     переїздів."
   - 4 cards, content from Figma:
     | Service | Price | Description |
     |---|---|---|
     | Терапія | ₴1000–₴4000 | Карієс, пульпіт, реставрація. Пояснюємо що і чому — до початку лікування. |
     | Гігієна | ₴500–₴2000 | Чистка і відбілювання. Помітний результат після першого візиту. |
     | Хірургія | ₴500–₴2000 | Видалення і імплантація. Сучасна анестезія — без болю і зайвої тривоги. |
     | Протезування | ₴5000–₴10000 | Коронки металокераміка, цирконій і E-max — інші зуби не виділятимуться. |
   - Mobile: cards stack full-width vertically (per `23:107` draft).

4. **How an appointment works** (`--color-bg-light` background):
   - Heading: "Як проходить прийом"
   - 4 steps from Figma (Запис / Огляд / План і ціна / Лікування), each with
     the corresponding description text from the design.
   - Desktop: vertical timeline with connecting line + side image. Mobile:
     simple numbered stacked list, image optional/below.

5. **Why choose us** (new section, fills the "some other blocks" slot):
   - Structural placeholder: heading + 3–4 short USP items (icon + title +
     one-line text), all placeholder copy (e.g. "Перевага 1 — короткий
     опис."). Real content to follow.

6. **Testimonials** (`--color-bg-light` background):
   - Heading: "Що кажуть пацієнти"
   - 2 quote cards from Figma (Андрій, 45 років / Наталя, 29 років) +
     placeholder image.

7. **Booking CTA banner**:
   - Full-width section with heading + "ЗАПИСАТИСЯ" button → opens booking
     modal. Placeholder copy.

8. **Footer**:
   - Logo, nav links (mirroring header), placeholder address/phone/email,
     placeholder social icons (Instagram/Facebook/Telegram), working hours
     placeholder, copyright line.

## Booking modal & form

- Single shared modal in `index.html`, opened by any "ЗАПИСАТИСЯ" button via
  `js/main.js`.
- Fields: Ім'я (required), Телефон (required, basic pattern validation),
  Послуга (select: Терапія/Гігієна/Хірургія/Протезування/Інше), Коментар
  (optional textarea).
- Accessibility: `role="dialog"` `aria-modal="true"`, focus trapped while
  open, returns focus to trigger on close, closes on Esc / overlay click /
  close button.
- Submission: `fetch()` POST (JSON) to FormSubmit.co's AJAX endpoint
  (`https://formsubmit.co/ajax/<EMAIL>`), with a placeholder email address
  clearly marked at the top of `js/main.js` for later replacement. On
  success, show an inline confirmation message inside the modal; on error,
  show a retry message. Note for the user: the real email address will need
  a one-time confirmation click from FormSubmit when first activated.

## Responsive strategy

- Mobile-first CSS: base styles target ~360–480px, then `min-width` media
  queries layer on tablet (`768px`) and desktop (`1024px`/`1280px`)
  enhancements.
- Layout shifts from the `23:107` mobile draft: hamburger nav, full-width
  stacked cards, reduced heading sizes via `clamp()`, simplified step
  timeline.
- Hero background image uses `object-fit: cover` with a fixed-aspect
  placeholder so it works across aspect ratios; revisit art-direction
  (separate mobile crop via `<picture>`) once real photography is supplied.

## Performance & accessibility

- Fonts: self-hosted woff2, `font-display: swap`, preload the primary body
  font weight.
- Images: `loading="lazy"` on everything below the fold; hero image eager.
- JS: single deferred `main.js`, no external libraries.
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`),
  meaningful `alt` text placeholders, visible focus states, scroll-reveal
  animations respect `prefers-reduced-motion`.

## JS behaviors (`js/main.js`)

- Mobile nav toggle (hamburger ↔ close icon, slide-in panel, locks body
  scroll while open).
- Smooth scroll for in-page anchor links (nav, "Послуги" dropdown,
  "ДЕТАЛЬНІШЕ →" links).
- Booking modal open/close/focus-trap + form submission handling described
  above.
- Scroll-reveal: IntersectionObserver adds a "visible" class to sections as
  they enter the viewport for a subtle fade/slide-in; no-op if
  `prefers-reduced-motion: reduce`.
- Header background toggle on scroll (transparent → solid).
