export const OUTBOUND_ATTRIBUTION_KEYS = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"ref",
	"gclid",
	"li_fat_id",
	"fbclid",
	"rdt_cid",
] as const;

export function withOutboundAttribution(
	destination: string | URL,
	incomingLocation: URL,
	fallbackSource: string,
): string {
	const url = new URL(destination, incomingLocation);
	for (const key of OUTBOUND_ATTRIBUTION_KEYS) {
		const value = incomingLocation.searchParams.get(key);
		if (value) url.searchParams.set(key, value);
	}
	if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", fallbackSource);
	if (!url.searchParams.has("utm_medium")) url.searchParams.set("utm_medium", "referral");
	return url.toString();
}

export function newsletterAttribution(
	incomingLocation: URL,
	documentReferrer: string,
): { utm_source: string; referrer: string } {
	const utmSource = incomingLocation.searchParams.get("utm_source") || "direct";
	let referrer = "";
	try {
		const url = new URL(documentReferrer);
		if (url.protocol === "http:" || url.protocol === "https:") referrer = url.origin;
	} catch {
		// Invalid and opaque referrers are intentionally omitted.
	}
	return { utm_source: utmSource, referrer };
}
