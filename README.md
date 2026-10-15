# Operations Process & Training — Phase 1

Static, GitHub-maintained operations and training reference website for Doyles Sheehan. Production has **not** been changed by this implementation.

The Operations Product-to-Customer Flow remains the entry point. Departments open 22 user-defined core groups; groups open detailed processes and authoritative source pages. The build retains 94 source pages, 62 linked process maps, 16 Mermaid source diagrams, the original draw.io file, and supporting PDFs and manuals. Search combines content and metadata with department, warehouse, type, topic, and documentation-status filters. Five proposed onboarding collections reuse those references.

## Run locally

Use Node 24 LTS (minimum 22.12).

```sh
npm ci
npm run validate
npm test
npm run build
npm run preview
```

Open the printed `http://127.0.0.1:4173` address. `dist/` is the complete deployable website. A static HTTP server is required for the bundled Mermaid module; opening the HTML directly from disk is not the full preview workflow.

No database, D1 binding, account system, live editor, employee records, or manager copies are used. GitHub stores the authoritative JSON, Markdown and original files. Generated browser bundles and SVG diagrams are rebuilt from those inputs.

## Source structure

| Location | Purpose |
| --- | --- |
| `content/documents.json` | Stable page metadata and Markdown source paths |
| `content/pages/` | Authoritative page text |
| `content/process-groups.json` | The 22 department core groups, explicit references and coverage gaps |
| `content/processes.json` | Detailed nodes, connections, STOP links and process metadata |
| `content/relationships.json` | Explicit previous/next, detailed-process, procedure, policy, form, training and STOP relationships |
| `content/onboarding.json` | Proposed department reference collections |
| `content/tags.json` | Controlled topic catalog |
| `content/references.json` | PDFs, manuals, training documents and template metadata |
| `content/diagrams.json`, `content/diagrams/` | Retained Mermaid/draw.io references and Mermaid source |
| `content/stops.json`, `content/gaps.json` | Stop responses and source-based gap records |
| `content/departments.json` | Department navigation and source macro-map references |
| `src/` | Website interface |
| `public/` | Original attachments and static assets; not the deployment output |
| `scripts/` | Validation, deterministic static build, local preview and procedure scaffolding |
| `docs/` | Maintenance, deployment inspection, review findings and test evidence |
| `archive/legacy-database/` | Previous repository implementation, retained outside the deployed website |

`draft` records are excluded from the generated site. `reference` records are visible with unknown approval plainly identified. `published` instructions require explicit approval metadata. Documentation available/green describes source coverage, not policy approval. Warehouse scope defaults to Both for these shared references, while applicability review remains unknown; this does not certify that every clause applies at both locations.

Read [maintenance](docs/CONTENT-MAINTENANCE.md), [deployment](DEPLOYMENT.md), and [coverage findings](docs/CONTENT-REVIEW.md) before releasing changes.

## Optional browser regression checks

With the preview running, install a compatible Playwright test runtime (`npm install --no-save --package-lock=false playwright@1.56.1`), install its browser (`npx playwright install chromium`), then run `node tests/browser.cjs`. This test uses localhost:4173 and writes evidence under docs/. `PLAYWRIGHT_MODULE_PATH` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an existing local test runtime/browser. They are test-only paths; the website does not require Playwright.

## Confirmed Worker target

The later Cloudflare screenshots confirm Worker `operationsbinder` owns the custom domain. `wrangler.jsonc` is included for its static assets in `dist/`. After release approval, change the Cloudflare build command from `exit 0` to `npm run build`, keep `npx wrangler deploy`, and use Node 24. See DEPLOYMENT.md for the release order. No settings or production deployment were changed.
