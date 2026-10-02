# Operations workspace: GitHub + Cloudflare Pages

Upload the CONTENTS of this folder to the root of a private GitHub repository. index.html must be at the repository root. Preserve the Operations Package folder structure. Do not upload the ZIP itself: extract it first.

Connect Cloudflare Pages to this repository. Choose framework preset None, build command `exit 0`, and build output directory `.`. Select your production branch. Configure Cloudflare Access for production and preview addresses before uploading internal content. Private GitHub repositories do not make deployed websites private.

All binder text and interactive diagrams are embedded in index.html. Companion PDF links use relative paths and work on Cloudflare without a SharePoint folder setting. Records remain personal browser records; shared data is not configured. Publishing updates does not merge user records.

The existing Settings screen includes SharePoint-specific instructions; those are relevant only to native SharePoint HTML publishing, not Cloudflare.
