import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");

test("interactive controls keep a visible keyboard focus indicator", () => {
	assert.doesNotMatch(css, /outline:\s*none/);
	assert.match(css, /:where\(a, button, input\):focus-visible/);
});

test("accent fills use the computed readable foreground", () => {
	assert.match(css, /\.featured\s*{[^}]*color:\s*var\(--on-accent\)/s);
	assert.match(css, /\.signup button\s*{[^}]*color:\s*var\(--on-accent\)/s);
	assert.doesNotMatch(css, /\.role\s*{[^}]*color:\s*var\(--accent\)/s);
});
