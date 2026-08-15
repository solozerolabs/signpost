import assert from "node:assert/strict";
import test from "node:test";

import worker from "../worker/index.ts";

test("www requests permanently redirect to the apex before other routing", async () => {
	let assetCalls = 0;
	const env = {
		ASSETS: {
			fetch() {
				assetCalls += 1;
				return new Response("asset");
			},
		},
	};

	const response = await worker.fetch(
		new Request("https://www.example.com/products/demo?utm_source=linkedin&ref=profile"),
		env,
	);

	assert.equal(response.status, 308);
	assert.equal(
		response.headers.get("location"),
		"https://example.com/products/demo?utm_source=linkedin&ref=profile",
	);
	assert.equal(assetCalls, 0);
});
