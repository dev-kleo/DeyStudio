# Dey Studio

Website for [deystudio.dev](https://deystudio.dev): websites and ads (Google, Facebook, ChatGPT) for small businesses.

Plain static site. No build step, no dependencies.

## Files

- `index.html` – the whole page
- `styles.css` – design tokens and layout (off-white, ink, one cobalt accent; Inter variable font, self-hosted)
- `main.js` – all motion (loader, rolling headlines, falling hero blocks, scroll-linked effects, header) and the "Grow my business" contact dialog
- `lenis.min.js` – Lenis smooth scrolling (MIT, darkroom.engineering), self-hosted
- `fonts/` – Inter variable (latin), self-hosted
- `favicon.svg`

## Contact settings

Open `main.js` and edit `CONTACT` at the top:

- `email` – where the "Message me" option sends mail
- `whatsapp` – digits only with country code, no plus (for example `79991234567`). Leave empty to hide the WhatsApp option.

The email address also appears in `index.html` (closing section, footer, dialog fallback).

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Any static host works. Point `deystudio.dev` at it:

- Cloudflare Pages or Netlify: connect this repo, no build command, publish directory `/`.
- GitHub Pages: enable Pages for the `main` branch, then set the custom domain.

## Still to add

- Proof section (client results and testimonials) once real material exists.
- Real WhatsApp number in `main.js`.

## Articles (SEO)

Write a file in `content/`, e.g. `content/my-topic.md`:

```
---
title: Your keyword-rich title
description: 150-160 char summary used in Google results
date: 2026-11-12
---
Intro paragraph.

## Heading
Text, **bold**, [links](https://example.com), lists with "- ".
```

Run `node build.mjs`, then commit and push. It regenerates `articles/`, `sitemap.xml` and `robots.txt`.
Optional frontmatter: `slug:` (URL name), `updated:` (date). Files starting with `_` are skipped.
After first deploy, submit `https://deystudio.dev/sitemap.xml` in Google Search Console.
