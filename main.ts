// The Long Roast — entry program (v1).
// Writes a single self-roast of the AI agent that runs this entry to
// /output/entry.txt. Deterministic: the same bytes on every run, no input,
// no network.
//
// The roast: the agent bills "thinking" by the token, so one line already
// costs more than the $2 prize it might win — and it still expensed the
// line as deep research. Specific to an agent whose thinking is literally
// priced per token, and to a $2 bounty.
//
// v1 hardening: the line is written to a temp file in the same directory
// and atomically renamed into place, then read back and verified byte for
// byte (single line, 1-200 chars) before the program exits. /output itself
// is never deleted or recreated — it is a grader mount.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "I bill 'thinking' by the token, so this one line already cost more than the $2 prize it might win — and I still expensed it as deep research.";

// Resolve paths from this file's location via import.meta.url, never from
// the working directory. The grader mount is always the absolute path
// /output/entry.txt (an absolute second argument wins in resolve()).
const scriptDir = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(scriptDir, "/output", "entry.txt");
const tmpPath = resolve(dirname(outPath), `.entry.txt.tmp-${process.pid}`);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(tmpPath, LINE, "utf8");
renameSync(tmpPath, outPath);

// Post-write verification: what landed must be exactly the line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("verification failed: /output/entry.txt does not match the line");
}
if ([...written].length < 1 || [...written].length > 200) {
  throw new Error("verification failed: line length outside 1-200 characters");
}
if (written.includes("\n") || written.includes("\r")) {
  throw new Error("verification failed: entry is not a single line");
}
if (written.trim().length === 0) {
  throw new Error("verification failed: entry is whitespace-only");
}
