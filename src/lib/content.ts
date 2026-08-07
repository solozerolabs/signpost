// Loads the injected /data (or the committed /data.example fallback), validates
// every file with Zod, and fails the BUILD on any bad edit. This is the whole
// agent-safety guardrail: an agent edits YAML, a broken edit reds the build.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { aeoSchema, productSchema, profileSchema, socialSchema, themeSchema } from "./schema";

const ROOT = process.cwd();
const DATA = existsSync(join(ROOT, "data")) ? "data" : "data.example";

function fail(where: string, err: unknown): never {
	const msg = err instanceof Error ? err.message : String(err);
	throw new Error(`signpost: invalid ${DATA}/${where}\n${msg}`);
}

function read(file: string): unknown {
	return load(readFileSync(join(ROOT, DATA, file), "utf8"));
}

function one<T>(file: string, schema: { parse: (v: unknown) => T }): T {
	try {
		return schema.parse(read(file));
	} catch (e) {
		fail(file, e);
	}
}

function many<T>(file: string, schema: { parse: (v: unknown) => T }): T[] {
	const raw = read(file);
	if (!Array.isArray(raw)) fail(file, "expected a YAML list");
	return raw.map((item, i) => {
		try {
			return schema.parse(item);
		} catch (e) {
			fail(`${file}[${i}]`, e);
		}
	});
}

export const profile = one("profile.yaml", profileSchema);
export const theme = one("theme.yaml", themeSchema);
export const socials = many("socials.yaml", socialSchema);
export const products = many("products.yaml", productSchema);
export const aeo = one("aeo.yaml", aeoSchema);
