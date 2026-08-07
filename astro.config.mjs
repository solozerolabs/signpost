import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { load } from "js-yaml";

// Domain is per-instance, so it comes from the (injected) profile, never hardcoded
// here — the public engine builds against data.example/ and carries no real site.
const dir = existsSync("data") ? "data" : "data.example";
const { url: site } = load(readFileSync(join(dir, "profile.yaml"), "utf8"));

// Static assets (avatar, favicon) are instance-injected into /assets, matching the
// /data convention; fall back to the committed example so the public engine builds
// standalone. Without this, publicDir defaults to /public (which never exists here)
// and /avatar.png ships empty.
const publicDir = existsSync("assets") ? "assets" : "assets.example";

export default defineConfig({
  site,
  publicDir,
  integrations: [sitemap()],
});
