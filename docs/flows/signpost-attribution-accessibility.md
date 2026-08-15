## Spec

Preserve supported acquisition parameters across Signpost outbound links, attach the visit source and referrer to newsletter submissions through the existing Worker contract, emit absolute Open Graph image metadata, fail builds when required image assets are missing, and restore WCAG text/focus behavior.

Non-goals: instance content, Syndai application code, Cloudflare configuration, deployment, new runtime dependencies, or a new analytics store. Prefer browser and Node platform APIs and keep existing progressive enhancement.

Priority: attribution correctness and privacy, then accessibility, then build/developer ergonomics, then cosmetic fidelity.

## Plan

1. Add no-dependency regression tests for outbound query forwarding, fallback attribution, newsletter source/referrer normalization, and required image assets; run them red.
2. Add the smallest shared browser-safe attribution helper and wire the existing Base and Signup components to it.
3. Make Open Graph URLs absolute, validate required copied assets, and cover the rendered metadata.
4. Fix contrast and focus styles without changing the configurable accent or adding JavaScript.
5. Repair the existing Biome baseline, scope Astro false-positive suppressions narrowly, and add package/CI gates.
6. Run every harness command, review the final diff, and commit one coherent engine-only change.

## Harness

```sh
npm run check
npm test
npm run build
git diff --check
```

## GSTACK REVIEW REPORT

- Engineering: keep attribution in one browser-safe module shared by the two inline
  scripts; test the public contract with Node's built-in runner; do not change the
  Worker storage contract or add packages.
- Design: this is an accessibility repair, not a visual redesign. Preserve the
  existing layout and accent while deriving a readable accent foreground, restoring
  keyboard focus, and removing low-contrast accent text.
- Developer experience: `npm run check`, `npm test`, and `npm run build` are the
  local contract. CI runs the same gates, and deploys inherit them through
  `predeploy`; no Cloudflare state is part of this flow.
- Scope guard: engine files and engine example data only. No instance content,
  Syndai repository, deployment, secrets, or compatibility layer.
