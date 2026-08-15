import assert from "node:assert/strict";
import test from "node:test";

import { readableForeground } from "../src/lib/color.ts";

test("selects a readable foreground for configurable accents", () => {
	assert.equal(readableForeground("#D6491E"), "#000000");
	assert.equal(readableForeground("#17161A"), "#ffffff");
});
