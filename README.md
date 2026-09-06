# SuaCara Modas

Catalogue website for a Portuguese women's clothing shop. It shows the items and,
when a customer taps **Comprar**, opens WhatsApp with the order message already
written — product name, colour, size and price included.

There is no cart, no checkout, no payments and no database. The site is fully
static, which makes it fast, essentially free to host, and leaves very little
for an attacker to aim at.

The site itself is entirely in Portuguese (pt-PT). Only this README and the code
comments are in English.

## Running it locally

Requires [Node.js](https://nodejs.org) 22.22.3 or newer (`.nvmrc` pins 24).

```bash
npm install      # first time only
npm run dev      # http://localhost:4321
```

## Commands

| Command              | What it does                                        |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Local dev server with hot reload                     |
| `npm run build`      | Builds the site into `dist/`                         |
| `npm run preview`    | Serves the built site as it will look in production  |
| `npm run check`      | Type-checks the code and validates every product     |
| `npm run lint`       | Lints the code                                       |
| `npm run format`     | Formats the code                                     |

## Layout

```
src/
  config/site.ts        Shop name, WhatsApp number, categories
  content.config.ts     Product schema — the shape every item must match
  content/products/     One Markdown file per item
  lib/whatsapp.ts       Builds the wa.me order link, formats prices in EUR
  lib/cores.ts          Colour names that get a swatch dot
  lib/caminho.ts        Internal links (handles a non-root base path)
  lib/i18n.ts           Every piece of UI copy, in Portuguese
  layouts/              Shared page shell
  components/           Header, product card
  pages/                One file per route
  styles/global.css     Colours, type scale, spacing
  assets/               Logo and product photos
public/
  _headers              Security headers (needs a host that supports them)
  robots.txt            Search engine directives
docs/
  arquitetura.md        How the site is put together, and why
  ameacas.md            Threat model and mitigations
  guia-de-edicao.md     How to add and edit items
```

## Adding or changing an item

Each product is a Markdown file in `src/content/products/`. The schema in
`src/content.config.ts` is enforced at build time — a malformed item fails the
build rather than shipping a broken page.

```yaml
---
nome: Vestido Longo Tracejado
resumo: Short description used in listings and meta tags.
preco: 70
categoria: Vestidos
ordem: 2
tamanhos: [] # e.g. ["S", "M", "L"]
cores:
  - nome: Preto
    alt: Description of the photo, for screen readers and SEO
    fotos:
      - ../../assets/produtos/vestido-tracejado-preto.jpg
---
```

Useful flags: `esgotado: true` marks an item sold out and disables its order
button; `rascunho: true` hides it from the site without deleting the file; a
colour can be sold out on its own with `esgotado: true` inside that colour.

Files can be edited straight from the GitHub web UI — no local setup needed.

## Security

The whole design is built around having nothing worth stealing: no accounts, no
payments, no customer data, no server. What is left is covered by:

- A strict Content-Security-Policy in `public/_headers`, with **no**
  `'unsafe-inline'` anywhere. This only works because the build is configured to
  emit every script and stylesheet as a file (`assetsInlineLimit: 0` and
  `inlineStylesheets: "never"`) — changing either will silently break the page in
  production, so don't.
- `frame-ancestors`, `X-Frame-Options`, HSTS, `Permissions-Policy` and friends,
  also in `_headers`. **These require a host that supports custom HTTP headers.**
  GitHub Pages does not.
- No remote image domains are allowed, so there is no SSRF surface.
- CI runs formatting, lint, type checks, the build, `npm audit --audit-level=high`
  and `gitleaks` on every push.

See [docs/ameacas.md](docs/ameacas.md) for the full threat model.

## Deployment

**The site is not currently deployed.** The hosting choice is still open:

| Option | URL | Trade-off |
| ------ | --- | --------- |
| Workers static assets | `<worker>.<subdomain>.workers.dev` | Cloudflare's recommended path; longer URL |
| Cloudflare Pages | `<project>.pages.dev` | Shorter URL; Cloudflare steers new projects away from Pages |

Either one serves `_headers` correctly. Build settings are the same for both:

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Node version     | `24`            |

Set `SITE_URL` in the host's environment variables to the site's real address —
it feeds the canonical URLs and the link inside every WhatsApp message. The
default in `astro.config.mjs` is `https://suacaramodas.pages.dev`.

## Status

Done: project structure, CI, security headers, product schema with colour
variants, 15 items with photos and prices, and the WhatsApp order flow.

Outstanding:

- **Sizes** — every item currently has `tamanhos: []`, so the order message
  cannot say which size the customer wants.
- **Deployment** — see above.
- **Product names and descriptions** for the 12 items sourced from the supplier
  catalogue were written from the photographs and need the owner's review.
- Design system, SEO (sitemap, structured data), and the final hardening pass.

See [docs/arquitetura.md](docs/arquitetura.md) for the full plan.
