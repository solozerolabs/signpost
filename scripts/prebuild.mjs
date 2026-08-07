import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const ROOT = process.cwd();
const src = existsSync(join(ROOT, "assets")) ? "assets" : "assets.example";
mkdirSync(join(ROOT, "public"), { recursive: true });
cpSync(join(ROOT, src), join(ROOT, "public"), { recursive: true });
console.log(`signpost: synced ${src}/ -> public/`);
