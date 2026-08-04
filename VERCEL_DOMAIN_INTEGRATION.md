# NEXORA Multi-Site Domain Integration

## Domain architecture

- `nexorabisnis.site` — future main hub / marketing portal
- `ai.nexorabisnis.site` — NEXORA AI Business
- `invite.nexorabisnis.site` — NEXORA Invite
- `print.nexorabisnis.site` — NEXORA Printing & Packaging

Each product is a separate Vercel project, repository, deployment pipeline, environment, and release. Do not merge the three source trees into one deployment.

## Printing project

- Vercel project name: `nexora-printing-packaging`
- Production domain: `print.nexorabisnis.site`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `SITE_URL=https://print.nexorabisnis.site`

## Preview process

1. Push a branch to GitHub.
2. Vercel creates a Preview Deployment.
3. Test desktop and mobile at 360, 390, 430, 768, 1024, and 1440 px.
4. Merge only after QA passes.
5. Promote the validated deployment to Production.

## Hostinger DNS

After adding `print.nexorabisnis.site` in Vercel Project Settings → Domains, copy the exact CNAME target shown by Vercel. In Hostinger DNS Zone add:

- Type: CNAME
- Name/Host: `print`
- Target: exact value supplied by Vercel
- TTL: default

Do the same later for `ai` and `invite`, each pointing to its own Vercel project.
