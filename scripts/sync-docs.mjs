// Sync external package docs into content/<slug>/ at build time.
//
// Source of truth is each package's own repo. For every entry below we shallow-
// clone the repo, read its docs folder, add the frontmatter Fumadocs requires
// (title, from the first H1), rewrite relative `*.md` links to site routes, and
// write MDX + a meta.json (root section) under content/<slug>/.
//
// The generated content/<slug>/ folders are gitignored — they are rebuilt on
// every `dev` / `build`. Add a package by appending to PACKAGES.

import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  rmSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/** @type {Array<{slug:string,repo:string,branch:string,dir:string,title:string,indexFile:string}>} */
const PACKAGES = [
  {
    slug: "nestjs-ai",
    repo: "https://github.com/mgvdev/nestjs-ai.git",
    branch: "main",
    dir: "documentation",
    title: "nestjs-ai",
    indexFile: "README.md",
  },
];

const root = process.cwd();

for (const pkg of PACKAGES) {
  const tmp = mkdtempSync(path.join(tmpdir(), `docs-${pkg.slug}-`));
  try {
    execFileSync(
      "git",
      ["clone", "--depth", "1", "--branch", pkg.branch, "--single-branch", pkg.repo, tmp],
      { stdio: "ignore" },
    );

    const srcDir = path.join(tmp, pkg.dir);
    const files = readdirSync(srcDir).filter((f) => f.endsWith(".md"));
    if (files.length === 0) throw new Error(`no .md files in ${pkg.repo}/${pkg.dir}`);

    const dest = path.join(root, "content", pkg.slug);
    rmSync(dest, { recursive: true, force: true });
    mkdirSync(dest, { recursive: true });

    const slugFor = (file) => (file === pkg.indexFile ? "index" : file.replace(/\.md$/, ""));
    const routeFor = (name) =>
      `${name}.md` === pkg.indexFile ? `/${pkg.slug}` : `/${pkg.slug}/${name}`;

    // Sidebar order: follow the index's table-of-contents link order, then any
    // remaining files.
    const order = [];
    const indexRaw = readFileSync(path.join(srcDir, pkg.indexFile), "utf8");
    for (const m of indexRaw.matchAll(/\]\(\.?\/?([\w-]+)\.md[^)]*\)/g)) {
      const name = m[1];
      if (files.includes(`${name}.md`) && `${name}.md` !== pkg.indexFile && !order.includes(name)) {
        order.push(name);
      }
    }
    for (const file of files) {
      const s = slugFor(file);
      if (s !== "index" && !order.includes(s)) order.push(s);
    }

    for (const file of files) {
      let content = readFileSync(path.join(srcDir, file), "utf8");

      // Title = first H1; strip that line (Fumadocs renders the title itself).
      const h1 = content.match(/^\s*#\s+(.+?)\s*$/m);
      const title = h1 ? h1[1].replace(/`/g, "").trim() : slugFor(file);
      if (h1) content = content.slice(0, h1.index) + content.slice(h1.index + h1[0].length);
      content = content.replace(/^\s+/, "");

      // Rewrite relative `*.md` links to site routes.
      content = content.replace(
        /\]\(\.?\/?([\w-]+)\.md(#[\w-]+)?\)/g,
        (_full, name, anchor = "") => `](${routeFor(name)}${anchor || ""})`,
      );

      const frontmatter = `---\ntitle: ${JSON.stringify(title)}\n---\n\n`;
      writeFileSync(path.join(dest, `${slugFor(file)}.mdx`), frontmatter + content);
    }

    const meta = { title: pkg.title, root: true, pages: ["index", ...order] };
    writeFileSync(path.join(dest, "meta.json"), JSON.stringify(meta, null, 2) + "\n");

    console.log(`[sync-docs] ${pkg.slug}: ${files.length} pages`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
