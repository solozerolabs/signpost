# signpost

Own, agent-editable, open-source link-in-bio. A static [Astro](https://astro.build) site
on Cloudflare that **you own** — your repo, your domain, your subscriber list. No account,
no company in the loop, nothing to enshittify.

- **Fully yours.** Fork nothing you don't control; the page is your repo on your domain.
- **Agent-editable.** All content is typed YAML in `data/` — an agent edits one file, opens
  a PR, CI validates it against the schema, merge deploys. See `skills/signpost/`.
- **Owned signups.** Email capture lands in your own Cloudflare D1 and mirrors to your own
  newsletter engine — never a third-party silo.
- **Fast + accessible.** Zero-JS baseline, `prefers-color-scheme`, WCAG AA.

## Quickstart

```bash
npm install
npm run dev            # renders data.example/ (the demo identity)
```

Make it yours: copy `data.example/*` to `data/` and edit (or drop in your own `data/`
that an agent authored). `data/` and `assets/` are git-ignored — your identity never
lives in this public engine; it's injected at build.

```
data/
  profile.yaml    # name, handle, role, bio, avatar, url
  theme.yaml      # accent (#hex), color_scheme (auto|dark|light)
  socials.yaml    # list; multiple accounts per platform are fine
  products.yaml   # list of things you're building
  aeo.yaml        # <title>, description, and social-image metadata
assets/
  avatar.png      # your icon/social image (copied into the build)
```

`profile.avatar` and `aeo.image.src` are root-relative paths into `assets/`. The
build fails if either file is missing; `aeo.image` also declares the image's real
width, height, and accessible alt text for Open Graph and Twitter metadata.

## Deploy

Static build to a single Cloudflare Worker with static-assets + a `/api/subscribe` route
(D1-backed). `npm run build` → `wrangler deploy`. Custom domain is auto-provisioned via
`routes[].custom_domain` in `wrangler.jsonc`. Register both apex and `www` routes as shown
in the example config; the Worker permanently redirects `www` to the apex while preserving
the path and query string.

## Analytics

Optional, zero-JS: the Worker counts homepage landings by channel (`utm_source`)
into a Cloudflare Analytics Engine dataset. Combined with signups in D1, that's a
conversion rate per channel — which social channel to invest in vs. which bounces.
Enable/query: [`ANALYTICS.md`](ANALYTICS.md).

## Mirror to your newsletter

Signups land in your D1. To flow them into your own newsletter engine / ESP, set
`MIRROR_WEBHOOK_URL` (a `var`) and a signing secret (`wrangler secret put MIRROR_SECRET`).
The hourly cron batches new subscribers and POSTs `{ subscribers: [{ email, source,
referrer, created_at }] }`, HMAC-signed in the `x-signpost-signature` header, then marks
them mirrored (at-least-once; a failed POST retries next run). Unset = disabled.

## License

MIT. Brand glyphs adapted from [simple-icons](https://github.com/simple-icons/simple-icons) (CC0).
