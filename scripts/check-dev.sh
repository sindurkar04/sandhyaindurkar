#!/usr/bin/env bash
# Quick check: dev server up and CSS loading on key pages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$ROOT/.tools/node-v22.14.0/dist/bin/node"

if [[ ! -x "$NODE" ]]; then
  NODE="$(command -v node || true)"
fi

if [[ -z "$NODE" ]]; then
  echo "Node not found."
  exit 1
fi

if ! lsof -tiTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "No server on port 3000. Run: npm run dev"
  exit 1
fi

"$NODE" <<'EOF'
const paths = [
  "math-applied",
  "math-applied/goodhart-law-real-decisions",
  "math-applied/benchmarks-baselines-real-decisions",
  "math-applied/rates-vs-counts-real-decisions",
];
(async () => {
  let failed = false;
  for (const p of paths) {
    const r = await fetch("http://localhost:3000/" + p);
    const html = await r.text();
    const ok = r.status === 200 && html.includes("_next/static");
    console.log(ok ? "OK" : "FAIL", r.status, p);
    if (!ok) failed = true;
  }
  if (failed) {
    console.log("\nRun: npm run dev:clean");
    process.exit(1);
  }
})();
EOF
