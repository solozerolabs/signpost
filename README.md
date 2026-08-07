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
  aeo.yaml        # <title> + meta description
assets/
  avatar.png      # your icon (copied into the build)
```

## Deploy

Static build to a single Cloudflare Worker with static-assets + a `/api/subscribe` route
(D1-backed). `npm run build` → `wrangler deploy`. Custom domain is auto-provisioned via
`routes[].custom_domain` in `wrangler.jsonc`.

## License

MIT. Brand glyphs adapted from [simple-icons](https://github.com/simple-icons/simple-icons) (CC0).
