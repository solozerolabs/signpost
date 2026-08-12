# Analytics: channel landings & drop-off

signpost stays zero-JS. The only metric it collects is **homepage landings by
channel**, written server-side from the Worker to a Cloudflare **Analytics
Engine** dataset (`signpost_landings`). One data point per view of `/`, tagged
with the visit's `utm_source` (or `direct` when there's none).

Combined with the signups already in D1 (`subscribers.utm_source`), that gives
you a **conversion rate per channel** — the number that tells you which social
channel to invest in vs. which is sending traffic that bounces.

## Prerequisite: tag every bio link

Attribution only works if each platform's bio link carries its channel. Use the
built-in short links (see `worker/index.ts`), not the bare domain — e.g. put
`yourhub.com/tt` in your TikTok bio, `yourhub.com/yt` on YouTube, `/ig`, `/li`,
`/x`, and so on. Each short path 302s to the homepage tagged with that platform
as `utm_source`.

A bare `yourhub.com` in a bio collapses that channel into `direct` and is
unattributable. Full map: `SHORT_LINKS` in `worker/index.ts`.

## Enable

The `LANDINGS` binding in `wrangler.jsonc` (copied from the example) turns it on.
Remove that block to disable — the Worker no-ops without it, no other change
needed. Deploy: `npm run build && wrangler deploy`.

## Query

Analytics Engine is queried via the SQL API. You need your **account ID** and an
API token with **Account Analytics → Read**.

```bash
ACCOUNT_ID=<your-account-id>
CF_TOKEN=<token-with-account-analytics-read>

curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/analytics_engine/sql" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -d "
    SELECT blob1 AS channel, SUM(_sample_interval) AS landings
    FROM signpost_landings
    WHERE timestamp > now() - INTERVAL '7' DAY
    GROUP BY channel
    ORDER BY landings DESC
  "
```

- `blob1` is the channel (`utm_source`).
- **Always use `SUM(_sample_interval)`**, not `COUNT()` — Analytics Engine
  samples at high volume and `_sample_interval` scales each row back to its true
  weight. At low volume it's 1, so the two agree; the SUM form stays correct as
  you grow.
- Data is retained ~90 days.

### Signups per channel (D1)

```bash
wrangler d1 execute signpost-subscribers --remote \
  --command "SELECT COALESCE(utm_source,'direct') AS channel, COUNT(*) AS signups
             FROM subscribers GROUP BY channel ORDER BY signups DESC"
```

### Drop-off / conversion rate per channel

There's no cross-store join — pull both tables and divide:

```
conversion_rate(channel) = signups(channel) / landings(channel)
```

A channel with **high landings but low conversion rate** is your drop-off: it's
sending volume that doesn't convert — fix the upstream hook (the video/post),
not the hub page. A channel with high conversion rate is where to spend more.

## What this deliberately does NOT track

- **Clickthroughs to your destination site.** Base.astro forwards the visit's
  `utm_source` onto every outbound link, so your destination's own analytics
  already attributes those clicks to the original channel. Don't duplicate it
  here — query it there.
- **Anything client-side.** No PostHog/GA snippet, no cookies, no consent
  banner. If you ever need per-link click drop-off *at the hub*, add a
  Worker-side `/go?to=…` redirect that writes a second Analytics Engine point —
  still zero-JS. Not built until the numbers above prove you need it.
