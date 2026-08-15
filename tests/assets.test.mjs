import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { validateRequiredAssets } from "../scripts/prebuild.mjs";

test("required public image references must exist", (context) => {
	const root = mkdtempSync(join(tmpdir(), "signpost-assets-"));
	context.after(() => rmSync(root, { recursive: true, force: true }));
	mkdirSync(join(root, "data.example"));
	mkdirSync(join(root, "assets.example"));
	writeFileSync(join(root, "data.example/profile.yaml"), "avatar: /avatar.png\n");
	writeFileSync(join(root, "data.example/aeo.yaml"), "image:\n  src: /og.png\n");
	writeFileSync(join(root, "assets.example/avatar.png"), "avatar");

	assert.throws(() => validateRequiredAssets(root), /missing required asset.*og\.png/s);

	writeFileSync(join(root, "assets.example/og.png"), "og");
	assert.doesNotThrow(() => validateRequiredAssets(root));
});

test("required public image references cannot escape the asset directory", (context) => {
	const root = mkdtempSync(join(tmpdir(), "signpost-assets-"));
	context.after(() => rmSync(root, { recursive: true, force: true }));
	mkdirSync(join(root, "data.example"));
	mkdirSync(join(root, "assets.example"));
	writeFileSync(join(root, "data.example/profile.yaml"), "avatar: /../private.png\n");
	writeFileSync(join(root, "data.example/aeo.yaml"), "image:\n  src: /avatar.png\n");

	assert.throws(() => validateRequiredAssets(root), /invalid public asset path/);
});
