#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$ROOT/.tools/node-v22.14.0/dist/bin"

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

if [[ -d .next ]]; then
  echo "Clearing .next cache (avoids stale webpack errors after new pages)..."
  rm -rf .next
fi

echo "Starting dev server at http://localhost:3000"
npm run dev
