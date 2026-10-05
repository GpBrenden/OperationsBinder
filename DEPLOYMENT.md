# Operations wiki: setup and release

The public folder contains the polished website. The functions folder provides authenticated database routes. Do not publish a production database until Access is configured. This is a deployment-ready implementation tested locally, not a deployment to your account.

## Repository and Cloudflare Pages

Upload the CONTENTS of this project folder to the repository root, preserving public/, functions/, migrations/ and package.json. The old index.html at the repository root is superseded by public/index.html. Pages settings: framework None; production branch main (or yours); build command `exit 0`; build output directory `public`; root directory blank. Cloudflare installs package.json dependencies and builds the Pages Functions. All page requests validate Access tokens and count against the Workers free quota. Missing configuration denies access instead of exposing the site.

## Sign-in without Microsoft admin help

In Cloudflare Zero Trust, enable one-time PIN email sign-in. Create an Access application for the wiki's custom hostname and explicitly allow the approved employee email addresses. Protect production pages.dev, preview addresses and your custom hostname. Configure each accepted hostname to use the same Access application/audience, or disable alternate deployments until their authentication is configured. The middleware only accepts the configured audience; alternate audience tokens fail closed. An email code verifies mailbox access; it does not inherit Microsoft employee groups or employment status. Maintain the allowlist and revoke departed employees' sessions.

## Database and configuration

Create a D1 database. Run migrations/0001_workspace.sql in its SQL console. Bind it to this Pages project as `DB` under Settings > Bindings, and redeploy.

Set these production environment variables:
- ACCESS_TEAM_DOMAIN: https://YOUR-TEAM.cloudflareaccess.com
- ACCESS_AUD: Access application's audience tag
- ADMIN_EMAILS: comma-separated administrator work email addresses
- EDITOR_EMAILS: comma-separated wiki editor / supervisor addresses

Create a separate preview database and configure preview variables if using previews. Do not bind preview deployments to production data. No Cloudflare API key or database credential goes in the browser or GitHub. The audience tag and team domain are configuration, not passwords.

## Working in the wiki

Connect shared database loads your verified identity, published content and personal cloud records. Export existing browser records first; connecting loads cloud records without automatically merging local records. Employees can save their own progress. Admins/editors can edit shared wiki pages and diagram labels and view the team dashboard. Only an admin/editor can record completion approval or change trainer assessment text. Assigned-trainer workflows and cross-user approval editing are not implemented in this first version; reviewers can view the dashboard but cannot yet edit another user's record there. Improvements/policy worksheets are saved within the user's workspace, not a shared case-management board.

Cloud saves use record versions to reject concurrent overwrites. On a conflict export a backup, reconnect to load latest cloud state and reconcile manually. The database retains an audit entry for each accepted save. The dashboard refreshes on demand; it does not continuously poll. Existing source graphs keep their original connector topology; the editor changes labels and titles only.

Offline HTML supports local drafts and downloaded filled copies. Local drafts are not published. Cloud configuration is unavailable in a downloaded file. Refreshed PDFs are a source-based snapshot and do not automatically regenerate when wiki content is edited. Original documents are retained separately in your original package; source details remain expandable on the wiki.

## Release checks in your account

Confirm approved and unapproved sign-in, direct production/preview/domain URLs, employee read/write isolation, restricted editor routes, completion approval restriction, two-browser conflict handling, failed-save messages, audit rows, PDF links, database export/restore and session revocation. Tenant/account integration has not been tested here. Configure backups and review retention for full audit snapshots. Cloudflare's free quotas still apply.

References: https://developers.cloudflare.com/pages/functions/bindings/ ; https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/ ; https://developers.cloudflare.com/d1/reference/migrations/
