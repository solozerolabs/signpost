import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";

const root = fileURLToPath(new URL("..", import.meta.url));
const html = readFileSync(join(root, "dist/index.html"), "utf8");
const dataDirectory = existsSync(join(root, "data")) ? "data" : "data.example";
const profile = load(readFileSync(join(root, dataDirectory, "profile.yaml"), "utf8"));
const aeo = load(readFileSync(join(root, dataDirectory, "aeo.yaml"), "utf8"));

function meta(attribute, name) {
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return html.match(new RegExp(`<meta ${attribute}="${escaped}" content="([^"]+)"`))?.[1];
}

function tagAttribute(tag, name) {
	return tag.match(new RegExp(` ${name}="([^"]+)"`))?.[1];
}

test("renders an absolute, described Open Graph image with declared dimensions", () => {
	const image = meta("property", "og:image");
	assert.equal(image, new URL(aeo.image.src, profile.url).toString());
	assert.equal(meta("property", "og:image:width"), String(aeo.image.width));
	assert.equal(meta("property", "og:image:height"), String(aeo.image.height));
	assert.equal(meta("property", "og:image:alt"), aeo.image.alt);
	assert.equal(
		meta("name", "twitter:card"),
		aeo.image.width / aeo.image.height >= 1.5 ? "summary_large_image" : "summary",
	);
	assert.equal(meta("name", "twitter:image"), image);

	const imagePath = new URL(image).pathname.replace(/^\/+/, "");
	assert.equal(existsSync(join(root, "dist", imagePath)), true, `${imagePath} must be built`);
});

test("renders the avatar at a stable, non-stretched size", () => {
	const avatar = html.match(/<img class="avatar"[^>]*>/)?.[0];
	assert.ok(avatar, "avatar image must be rendered");
	assert.equal(tagAttribute(avatar, "src"), profile.avatar);
	assert.equal(tagAttribute(avatar, "alt"), profile.name);
	assert.equal(tagAttribute(avatar, "width"), "96");
	assert.equal(tagAttribute(avatar, "height"), "96");
});
