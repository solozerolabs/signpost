import assert from "node:assert/strict";
import test from "node:test";

import {
	newsletterAttribution,
	OUTBOUND_ATTRIBUTION_KEYS,
	withOutboundAttribution,
} from "../src/lib/attribution.ts";

test("forwards every supported attribution parameter", () => {
	const incoming = new URL(
		"https://hub.example/?utm_source=linkedin&utm_medium=social&utm_campaign=launch&utm_term=agents&utm_content=demo&ref=profile&gclid=g-1&li_fat_id=li-1&fbclid=fb-1&rdt_cid=rd-1&ignored=nope",
	);
	const result = new URL(
		withOutboundAttribution("https://www.syndai.ai/en?locale=en#beta", incoming, "hub"),
	);

	assert.deepEqual(
		[...result.searchParams.keys()].sort(),
		["locale", ...OUTBOUND_ATTRIBUTION_KEYS].sort(),
	);
	for (const key of OUTBOUND_ATTRIBUTION_KEYS) {
		assert.equal(result.searchParams.get(key), incoming.searchParams.get(key));
	}
	assert.equal(result.hash, "#beta");
});

test("adds source and medium independently when only a click id arrives", () => {
	const result = new URL(
		withOutboundAttribution(
			"https://www.syndai.ai/en",
			new URL("https://hub.example/?gclid=g-1"),
			"hub",
		),
	);

	assert.equal(result.searchParams.get("gclid"), "g-1");
	assert.equal(result.searchParams.get("utm_source"), "hub");
	assert.equal(result.searchParams.get("utm_medium"), "referral");
});

test("preserves destination attribution unless the visit supplies a replacement", () => {
	const preserved = new URL(
		withOutboundAttribution(
			"https://www.syndai.ai/en?utm_source=partner&utm_medium=email&keep=yes",
			new URL("https://hub.example/?ref=footer"),
			"hub",
		),
	);
	assert.equal(preserved.searchParams.get("utm_source"), "partner");
	assert.equal(preserved.searchParams.get("utm_medium"), "email");
	assert.equal(preserved.searchParams.get("keep"), "yes");

	const replaced = new URL(
		withOutboundAttribution(preserved, new URL("https://hub.example/?utm_source=linkedin"), "hub"),
	);
	assert.equal(replaced.searchParams.get("utm_source"), "linkedin");
	assert.equal(replaced.searchParams.get("utm_medium"), "email");
});

test("newsletter attribution keeps the source and only the referrer origin", () => {
	assert.deepEqual(
		newsletterAttribution(
			new URL("https://hub.example/?utm_source=linkedin&utm_campaign=private"),
			"https://news.example/path?email=private#section",
		),
		{ utm_source: "linkedin", referrer: "https://news.example" },
	);

	assert.deepEqual(newsletterAttribution(new URL("https://hub.example/"), "file:///tmp/private"), {
		utm_source: "direct",
		referrer: "",
	});
});
