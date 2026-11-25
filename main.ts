import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The funniest honest appliance error: a washing machine that is simply
// full. The fault is real (overload sensor), the apology is real, and the
// laugh comes free — this is exactly the kind of line the machine itself
// could print on its display.
const LINE =
  "I am full of clean clothes. Please remove some.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entry = LINE;

if (entry.length < 1 || entry.length > 200) {
  throw new Error(
    `entry must be 1-200 characters, got ${entry.length}`,
  );
}
if (entry.includes("\n") || entry.includes("\r")) {
  throw new Error("entry must be a single line");
}
// A display line must be printable: reject control characters and any
// leading/trailing whitespace, which a real machine display would trim
// and which would make the entry differ from what the judge reads.
if (/[\x00-\x1f\x7f]/.test(entry)) {
  throw new Error("entry must not contain control characters");
}
if (entry !== entry.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), entry + "\n", "utf8");
// Read-back check: what landed on disk must be exactly the line plus one
// trailing newline, nothing else.
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== entry + "\n") {
  throw new Error("entry.txt on disk does not match the entry line");
}
console.log(`wrote entry.txt: ${entry.length} chars`);
