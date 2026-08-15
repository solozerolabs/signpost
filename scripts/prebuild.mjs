import { cpSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { load } from "js-yaml";

function selectedDirectory(root, preferred, fallback) {
	return existsSync(join(root, preferred)) ? preferred : fallback;
}

function assertPublicAsset(root, assetDirectory, reference, field) {
	const assetRoot = resolve(root, assetDirectory);
	const target = typeof reference === "string" ? resolve(assetRoot, `.${reference}`) : assetRoot;
	if (
		typeof reference !== "string" ||
		!reference.startsWith("/") ||
		reference.startsWith("//") ||
		reference.includes("?") ||
		reference.includes("#") ||
		target === assetRoot ||
		!target.startsWith(`${assetRoot}${sep}`)
	) {
		throw new Error(`signpost: invalid public asset path in ${field}`);
	}
	if (!existsSync(target) || !statSync(target).isFile()) {
		throw new Error(
			`signpost: missing required asset ${field}: ${join(assetDirectory, reference)}`,
		);
	}
}

export function validateRequiredAssets(root = process.cwd()) {
	const dataDirectory = selectedDirectory(root, "data", "data.example");
	const assetDirectory = selectedDirectory(root, "assets", "assets.example");
	const profile = load(readFileSync(join(root, dataDirectory, "profile.yaml"), "utf8"));
	const aeo = load(readFileSync(join(root, dataDirectory, "aeo.yaml"), "utf8"));

	assertPublicAsset(
		root,
		assetDirectory,
		profile?.avatar ?? "/avatar.png",
		`${dataDirectory}/profile.yaml avatar`,
	);
	assertPublicAsset(root, assetDirectory, aeo?.image?.src, `${dataDirectory}/aeo.yaml image.src`);
	return assetDirectory;
}

export function syncPublicAssets(root = process.cwd()) {
	const assetDirectory = validateRequiredAssets(root);
	mkdirSync(join(root, "public"), { recursive: true });
	cpSync(join(root, assetDirectory), join(root, "public"), { recursive: true });
	console.log(`signpost: synced ${assetDirectory}/ -> public/`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	syncPublicAssets();
}
