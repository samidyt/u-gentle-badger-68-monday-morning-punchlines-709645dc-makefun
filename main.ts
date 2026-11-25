import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I don't need a Monday alarm. My dread wakes me up ten minutes early.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry length ${chars} outside 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry is whitespace-only");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
for (const ch of LINE) {
  if (ch.charCodeAt(0) < 0x20) {
    throw new Error("entry contains a control character");
  }
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: entry.txt differs from the gated line");
}
const bytes = Buffer.byteLength(back, "utf8");
console.log(`entry ok: ${chars} chars, ${bytes} bytes, 1 line`);
