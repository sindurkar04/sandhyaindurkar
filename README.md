# sandhyaindurkar

Next.js app deployed on [Vercel](https://vercel.com).

**Production (Vercel):** [https://sandhyaindurkar.vercel.app](https://sandhyaindurkar.vercel.app)

## Local development

Use Node.js 20+ (this repo includes a portable Node under [`.tools/node-v22.14.0`](./.tools/node-v22.14.0) used for agent/bootstrap installs; add `.tools/` to your PATH or install Node from [nodejs.org](https://nodejs.org)).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub

The remote is `https://github.com/sindurkar04/sandhyaindurkar.git`. The GitHub repo may still be empty until you authenticate and run:

```bash
git push -u origin main
```

Use a [Personal Access Token](https://github.com/settings/tokens) with `repo` scope as the password when prompted (HTTPS), or set up [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) for Git.

## Custom domain (Squarespace DNS)

`sandhyaindurkar.com` and `www.sandhyaindurkar.com` are added on Vercel. Until DNS is updated, the domain can still point at Squarespace.

In **Squarespace → Domains → your domain → DNS settings** (custom records), configure what Vercel expects (confirmed via `vercel domains inspect`):

| Host | Type | Value |
|------|------|--------|
| `@` | **A** | `76.76.21.21` |
| `www` | **A** | `76.76.21.21` |

Remove or replace conflicting **Squarespace** web records (old `A`/`CNAME` for `@` or `www` that point to Squarespace). **Do not** remove **MX** records if you use email on this domain.

After DNS propagates, Vercel will verify the domain and provision **HTTPS** automatically. Re-check targets in the Vercel dashboard under **Project → Settings → Domains** if Vercel shows different records for your project.
