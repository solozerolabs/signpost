---
name: signpost
description: Use when adding, editing, reordering, or removing a link, social account, or product on a signpost link-in-bio page, or changing its brand (colors, avatar, bio). Edits typed YAML in data/, never markup.
---

# Editing a signpost page

signpost renders entirely from typed YAML in `data/`. **Only edit `data/*.yaml` and
`assets/`.** Never touch `src/` for a content change — the layout is code, the content is
data. Every edit is validated by Zod at build; a bad edit fails the build with a legible
message, so make the change, then run `npm run build` to confirm it's green.

## The files

- `data/profile.yaml` — `name`, `handle?`, `role?`, `bio?`, `avatar` (path under `assets/`),
  `url`, `email?`, `location?`. All plain text (no HTML).
- `data/theme.yaml` — `accent` (6-digit hex, e.g. `#D6491E`), `color_scheme` (`auto|dark|light`).
- `data/socials.yaml` — a LIST. Each: `platform`, `url`, optional `handle`/`label`.
  **Multiple accounts per platform are allowed** (two `x`, two `youtube`, …); set `label`
  to disambiguate them. Supported `platform` values are the keys in
  `src/components/BrandIcon.astro`; to add a new platform, add its glyph there first.
- `data/products.yaml` — a LIST of `{ title, sub?, url }`, rendered as pills in order.
- `data/aeo.yaml` — `title` (the `<title>` + OG title) and `description` (meta description).

## Rules

1. Edit YAML only. Keep every field plain text.
2. Lists are ordered — position in the file is display order.
3. To pin/feature something, move it up. To hide it, remove the entry.
4. Every `url` must be a full `https://…` URL. Every `accent` a `#rrggbb` hex.
5. After editing, `npm run build`. Green = valid. Red = read the error; it names the file
   and field.
6. Open the change as a PR. Merge deploys.
