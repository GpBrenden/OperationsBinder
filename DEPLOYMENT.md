# Release to the existing operationsbinder Worker

Production publishing is still on hold. This source package prepares the confirmed existing Worker; it has not changed the live site, Cloudflare settings, DNS, or remote repository.

## Confirmed production configuration

User-provided Cloudflare screenshots on October 15, 2026 establish:

| Setting | Confirmed current value | Value for the new release |
| --- | --- | --- |
| Resource | Worker `operationsbinder`, static assets only | Keep the same Worker |
| Custom domain | `binders.doyles-sheehan.com` | Keep the same domain |
| Repository | `GpBrenden/OperationsBinder` | Keep |
| Production branch | `main` | Keep |
| Build command | `exit 0` | **`npm run build`** |
| Deploy command | `npx wrangler deploy` | Keep |
| Root directory | `/` | Keep |
| Build variables | None configured | Add `NODE_VERSION=24` |
| Data bindings | Zero | No new bindings required |

The separate Pages project is not the custom-domain production target. Leave it unchanged; this release does not migrate the domain to Pages. `exit 0` skips application compilation and is unsuitable for this new build. It does not by itself establish why earlier deployments failed; their logs would be needed for that diagnosis.

## Source and build

`wrangler.jsonc` names the existing Worker and domain and serves **`./dist`**. It declares no Worker entry script, database, storage binding, custom authentication or runtime secrets. The existing workers.dev hostname is retained. Route configuration describes the already-existing custom domain; it is not a request to create a separate project or domain.

Use Node 24 LTS, then:

```sh
npm ci
npm run validate
npm test
npm run build
npx wrangler deploy --dry-run
```

The dry run validates configuration without publishing. The website output is `dist/`, not `public/` or the repository root. The `public/` folder contains original attachments; `archive/legacy-database/` preserves historical source outside the deployment output. No D1 migrations or previous employee records are loaded.

## Release order

1. Create a GitHub review branch from `main`. Put the contents of the updated source ZIP at the repository root, preserving `src/`, `scripts/`, `content/`, `public/`, `package.json`, `package-lock.json` and `wrangler.jsonc`. This package supersedes the previous source ZIP that did not yet have the confirmed Worker configuration.
2. Review the source branch and the local website. Existing local branch: `phase1/structured-training`. It has not been pushed. To retain the exact Git history in another clone, use the separately supplied review bundle; the full source ZIP also works for an ordinary branch change.
3. Confirm preview-branch build behavior before pushing. Do not point this branch's production-named Wrangler config at an automatic non-production deploy command that uses `wrangler deploy`; that could target the existing Worker. Use local preview or an isolated Worker preview/version workflow after reviewing its settings.
4. Obtain explicit publishing approval. Record the last working Worker deployment ID, commit and build settings so rollback is possible. Keep any existing Access policies unchanged.
5. After approval, update the confirmed Worker's build command to `npm run build` and add build variable `NODE_VERSION=24`. Keep the existing deploy command, production branch, root directory and token selection. These settings edits have not been performed by this implementation.
6. Merge the reviewed source branch to `main` through GitHub. Use an intentional release commit without the local review commit's `[skip ci]` marker. Let the existing Cloudflare Git integration install dependencies, build and deploy. Do not run a second manual production deployment at the same time.
7. Verify the custom hostname, department drill-downs, search filters, a retained Mermaid diagram, original PDFs and the Hartford template. Inspect build logs if anything fails. Do not delete the Worker, Pages project, domain, database or token as a troubleshooting shortcut.

## Rollback

If an approved release fails, restore the recorded last working Worker deployment and revert the release commit through GitHub. Restore prior build settings only as needed for that known deployment. Do not detach the custom domain or drop data resources during rollback.

## References

- [Worker static asset configuration](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Static site deployment](https://developers.cloudflare.com/workers/static-assets/get-started/)
- [Workers Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/)

No production deployment is authorized merely by providing these screenshots. The publishing hold remains in place until explicit approval.

## Local verification result

The two Worker-target configuration checks and nine content tests pass. The earlier full browser checks still cover the unchanged website. A native Wrangler dry run was not completed because the local Wrangler package installation did not finish; no live build or deployment was attempted. Run the dry-run command above in a prepared environment before the approved release.
