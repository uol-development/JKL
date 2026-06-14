# JK Lifestyle — Website

Static marketing site for **JK Lifestyle** — a lifestyle-based healthcare ecosystem.
_"Lifestyle First. Health Forever."_

## Pages
| File | Description |
|------|-------------|
| [`index.html`](index.html) | Home / landing page |
| [`about.html`](about.html) | About Us |
| [`styles.css`](styles.css) | Shared styles + brand design tokens |
| [`script.js`](script.js) | Mobile menu, testimonial carousel, experts scroller, a11y helpers |

## Brand tokens
All colors and fonts are centralized as CSS custom properties in `:root` (top of `styles.css`)
so both pages stay visually consistent:

- `--dark-green` `#16401d` — top bar, footer, dark bands
- `--green` `#5a8a37` / `--green-d` `#496f2b` (button/text) — primary accents
- `--tint` `#f4f7f1` — pale section backgrounds
- `--font-display` Playfair Display, `--font-body` Inter

## Local preview
Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deployment
Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which publishes the site to **GitHub Pages**. In the repo's **Settings → Pages**, set
**Source = GitHub Actions** (one-time).

> Images are `placehold.co` placeholders labeled by purpose — replace the `src` values with real assets.

© 2025 JK Lifestyle Ltd. All Rights Reserved.
