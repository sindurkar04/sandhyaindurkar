#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$ROOT/.tools/node-v22.14.0/dist/bin"
PORT=3000

if [[ ! -x "$NODE_BIN/node" ]]; then
  echo "Portable Node not found at $NODE_BIN"
  echo "Install Node from https://nodejs.org or fix the .tools path."
  exit 1
fi

export PATH="$NODE_BIN:$PATH"
cd "$ROOT"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

stop_port() {
  local port="$1"
  if lsof -ti :"$port" >/dev/null 2>&1; then
    echo "Stopping process on port $port..."
    lsof -ti :"$port" | xargs kill -9 2>/dev/null || true
  fi
}

# Stop every dev server first. Clearing .next while Next is still running corrupts the cache (500 errors).
for port in 3000 3001 3002; do
  stop_port "$port"
done

# Catch stray next dev processes for this repo (e.g. after port fallback to 3001).
if pgrep -f "$ROOT/node_modules/.bin/next dev" >/dev/null 2>&1; then
  echo "Stopping stray next dev processes for this project..."
  pkill -9 -f "$ROOT/node_modules/.bin/next dev" 2>/dev/null || true
fi

sleep 1

if [[ -d .next ]]; then
  echo "Clearing .next cache..."
  rm -rf .next
fi

echo ""
echo "============================================"
echo "  Dev server: http://localhost:$PORT"
echo "  Prime:      http://localhost:$PORT/math-applied/prime-factorization-real-problems"
echo "  Regression: http://localhost:$PORT/math-applied/regression-real-decisions"
echo "  Math index: http://localhost:$PORT/math-applied"
echo "============================================"
echo ""

exec npm run dev -- --port "$PORT"
