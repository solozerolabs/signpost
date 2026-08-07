// signpost signup Worker: serves the static build (ASSETS) and owns one dynamic
// route, POST /api/subscribe, writing to the instance's own Cloudflare D1.
// Single opt-in. Honeypot before the (durable, fail-open) rate limiter.
// Response is identical for new / existing / bot — never a membership oracle.

interface Env {
	ASSETS: Fetcher;
	DB: D1Database;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});
}

function clip(v: unknown, n: number): string | null {
	if (v == null) return null;
	const s = String(v);
	return s ? s.slice(0, n) : null;
}

// Durable fixed-window limiter in D1 (an in-memory Map is a no-op across isolates).
async function allow(db: D1Database, key: string, limit: number, windowSec: number): Promise<boolean> {
	const now = Math.floor(Date.now() / 1000);
	const windowStart = now - (now % windowSec);
	const row = await db
		.prepare(
			`INSERT INTO rate_limit (bucket_key, count, window_start) VALUES (?1, 1, ?2)
			 ON CONFLICT(bucket_key) DO UPDATE SET
			   count = CASE WHEN rate_limit.window_start = ?2 THEN rate_limit.count + 1 ELSE 1 END,
			   window_start = ?2
			 RETURNING count`,
		)
		.bind(key, windowStart)
		.first<{ count: number }>();
	return (row?.count ?? 1) <= limit;
}

async function handleSubscribe(request: Request, env: Env): Promise<Response> {
	let body: Record<string, unknown> | null = null;
	try {
		const ct = request.headers.get("content-type") ?? "";
		if (ct.includes("application/json")) {
			body = (await request.json()) as Record<string, unknown>;
		} else {
			body = Object.fromEntries((await request.formData()).entries());
		}
	} catch {
		return json(400, { ok: false, error: "invalid_body" });
	}

	// honeypot first — a bot costs no DB round trip, gets a silent success
	if (body?.website) return json(200, { ok: true });

	const email = String(body?.email ?? "")
		.trim()
		.toLowerCase();
	if (!EMAIL_RE.test(email) || email.length > 254) {
		return json(400, { ok: false, error: "invalid_email" });
	}

	const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
	try {
		if (!(await allow(env.DB, `ip:${ip}`, 5, 60))) {
			return json(429, { ok: false, error: "rate_limited" });
		}
	} catch {
		// fail OPEN: a DB blip must never drop a real signup
	}

	try {
		await env.DB.prepare(
			`INSERT INTO subscribers (id, email, email_lower, referrer, utm_source)
			 VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(email_lower) DO NOTHING`,
		)
			.bind(
				crypto.randomUUID(),
				String(body?.email),
				email,
				clip(body?.referrer, 100),
				clip(body?.utm_source, 64),
			)
			.run();
	} catch {
		// idempotent / transient — still return the same body
	}

	return json(200, { ok: true });
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/api/subscribe") {
			if (request.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
			return handleSubscribe(request, env);
		}
		return env.ASSETS.fetch(request);
	},
};
