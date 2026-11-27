// Black Friday deal finder entry (Node 22, standard library only). The site
// lives in this directory's app/ folder — plain static files, no build step —
// with its screenshots in screenshots/. This program hands the site in: it
// copies app/ and screenshots/ from beside this file into the output
// directory and writes output/dossier.json with the vendored make.fun
// library, which is the summary the judge reads (screenshots, first-load
// files and bytes, and the site's source).
//
// The grader runs this program twice with a read-only repository and an
// empty output directory, so both runs must write the same bytes. The
// output directory itself is never removed — only its contents are swept
// first, because the grader owns the directory and removing it fails.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Sweep the output directory's contents (never the directory itself).
mkdirSync(out, { recursive: true });
for (const child of readdirSync(out)) {
  rmSync(join(out, child), { recursive: true, force: true });
}

cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The gate's caps for this competition: the dossier text is capped at
// 160 KiB, at most 4 screenshots of 256 KiB each, app/ at most 993 files
// and 16 MiB. The dossier must be byte for byte what the library writes.
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
console.log('wrote ' + dossierPath + ' (' + statSync(dossierPath).size + ' bytes)');
