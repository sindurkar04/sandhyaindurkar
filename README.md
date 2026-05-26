# sandhyaindurkar

Next.js app deployed on [Vercel](https://vercel.com).

**Production (Vercel):** [https://sandhyaindurkar.vercel.app](https://sandhyaindurkar.vercel.app)

## Local development

Use Node.js 20+ (this repo includes a portable Node under [`.tools/node-v22.14.0`](./.tools/node-v22.14.0) used for agent/bootstrap installs; add `.tools/` to your PATH or install Node from [nodejs.org](https://nodejs.org)).

**If `npm` is not found** in your terminal, use the project script (uses portable Node in `.tools/`):

```bash
./scripts/dev.sh
```

**If you have Node installed globally:**

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Recipe finder (Spoonacular)

The ingredient-based recipe tool at `/learning-through-food/recipe-finder` uses the [Spoonacular API](https://spoonacular.com/food-api).

1. Sign up and copy an API key from Spoonacular.
2. Copy [`.env.example`](./.env.example) to `.env` and set `SPOONACULAR_API_KEY`.
3. In Vercel, add the same variable under **Project → Settings → Environment Variables** (Production and Preview), then redeploy.

**Important:** The variable must list **Production** (not Development only). If Vercel shows "Development" under the key, edit it, check **Production**, save, and redeploy.

**Verify on production:** open `https://sandhyaindurkar.com/api/recipes/health` — it should return `{"configured":true,"vercelEnv":"production"}`.

Free tier allows roughly 150 requests per day.

## GitHub

The remote is `https://github.com/sindurkar04/sandhyaindurkar.git`. If the repo is still empty or out of date, push from this folder:

**Option A — token script (no password prompt):**

```bash
export GITHUB_TOKEN=ghp_your_pat_here   # classic PAT with "repo", or fine-grained with Contents: Read/Write
./scripts/push-main.sh
```

**Option B — HTTPS or SSH:**

```bash
git push -u origin main
```

Use a [Personal Access Token](https://github.com/settings/tokens) as the HTTPS password, or set up [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

## Custom domain (Squarespace DNS)

`sandhyaindurkar.com` and `www.sandhyaindurkar.com` are added on Vercel. Until DNS is updated, the domain can still point at Squarespace.

In **Squarespace → Domains → your domain → DNS settings** (custom records), configure what Vercel expects (confirmed via `vercel domains inspect`):

| Host | Type | Value |
|------|------|--------|
| `@` | **A** | `76.76.21.21` |
| `www` | **A** | `76.76.21.21` |

Remove or replace conflicting **Squarespace** web records (old `A`/`CNAME` for `@` or `www` that point to Squarespace). **Do not** remove **MX** records if you use email on this domain.

After DNS propagates, Vercel will verify the domain and provision **HTTPS** automatically. Re-check targets in the Vercel dashboard under **Project → Settings → Domains** if Vercel shows different records for your project.

If Squarespace still forces its own web records while the domain is attached to a Squarespace site, use Squarespace’s help for using the domain with an external host (disconnect or repoint the domain’s DNS only).

After saving DNS changes, confirm from your machine:

```bash
./scripts/verify-dns-for-vercel.sh sandhyaindurkar.com
```
