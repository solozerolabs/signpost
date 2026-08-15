import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const html = readFileSync(join(root, "dist/index.html"), "utf8");

function meta(attribute, name) {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return html.match(new RegExp(`<meta ${attribute}="${escaped}" content="([^"]+)"`))?.[1];
}

test("renders an absolute, described Open Graph image with declared dimensions", () => {
	const image = meta("property", "og:image");
	assert.equal(image, "https://example.com/avatar.png");
	assert.equal(meta("property", "og:image:width"), "440");
	assert.equal(meta("property", "og:image:height"), "440");
	assert.equal(meta("property", "og:image:alt"), "Portrait of Alex Rivers");
	assert.equal(meta("name", "twitter:card"), "summary");
	assert.equal(meta("name", "twitter:image"), image);

	const imagePath = new URL(image).pathname.replace(/^\/+/, "");
	assert.equal(existsSync(join(root, "dist", imagePath)), true, `${imagePath} must be built`);
});

test("renders the avatar at a stable, non-stretched size", () => {
	assert.match(
		html,
		/<img class="avatar" src="\/avatar\.png" alt="Alex Rivers" width="96" height="96">/,
	);
});
