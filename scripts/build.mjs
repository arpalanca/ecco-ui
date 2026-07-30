import {
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cssSrc = join(root, "css", "ecco-ui.css");
const jsSrc = join(root, "js", "ecco-ui.js");
const distDir = join(root, "dist");
const docsDir = join(root, "docs");
const version = "0.1.0";

mkdirSync(distDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

copyFileSync(cssSrc, join(distDir, "ecco-ui.css"));
copyFileSync(jsSrc, join(distDir, "ecco-ui.js"));

const minifyCss = spawnSync(
  "npx --no-install lightningcss --minify css/ecco-ui.css -o dist/ecco-ui.min.css",
  {
    cwd: root,
    encoding: "utf8",
    shell: true,
    windowsHide: true,
  }
);

if (minifyCss.status !== 0) {
  console.error(minifyCss.stderr || minifyCss.stdout || "CSS minify failed");
  process.exit(minifyCss.status ?? 1);
}

const cssBanner = `/*! Ecco UI v${version} | MIT | https://github.com/arpalanca/ecco-ui */\n`;
const minCss = readFileSync(join(distDir, "ecco-ui.min.css"), "utf8");
writeFileSync(join(distDir, "ecco-ui.min.css"), cssBanner + minCss);

const jsRaw = readFileSync(jsSrc, "utf8");
const minJs = minifyJs(jsRaw);
const jsBanner = `/*! Ecco UI v${version} | MIT | https://github.com/arpalanca/ecco-ui */\n`;
writeFileSync(join(distDir, "ecco-ui.min.js"), jsBanner + minJs);

for (const name of [
  "ecco-ui.css",
  "ecco-ui.min.css",
  "ecco-ui.js",
  "ecco-ui.min.js",
]) {
  copyFileSync(join(distDir, name), join(docsDir, name));
}

writeFileSync(join(docsDir, ".nojekyll"), "");

const snippetsDir = join(root, "snippets");
const snippetCount = readdirSync(snippetsDir).filter((f) =>
  f.endsWith(".html")
).length;

console.log(
  `Built dist/ + docs/ assets · ${snippetCount} snippets · CSS ${jsRaw.length ? "ok" : ""} (${minCss.length} min css, ${minJs.length} min js)`
);

/** Tiny, safe-enough minify for our dependency-free script. */
function minifyJs(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/\n+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ ?([{}();,:?=<>!&|+\-*/%]) ?/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}
