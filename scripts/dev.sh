#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE_BIN="$ROOT/.tools/node-v22.14.0/dist/bin"
PORT=3000
LOCK_DIR="$ROOT/.next-dev.lock"
CLEAN_CACHE="${CLEAN_CACHE:-0}"

if [[ "${1:-}" == "--clean" ]]; then
  CLEAN_CACHE=1
fi

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

kill_next_for_repo() {
  pkill -9 -f "$ROOT/node_modules/.bin/next dev" 2>/dev/null || true
  pkill -9 -f "$ROOT/node_modules/next/dist/bin/next dev" 2>/dev/null || true
  pkill -9 -f "$ROOT/node_modules/next/dist/server/lib/start-server" 2>/dev/null || true
  pkill -9 -f "next dev --port 3000" 2>/dev/null || true
  pkill -9 -f "next dev --port 3001" 2>/dev/null || true
}

stop_port() {
  local port="$1"
  local pids
  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Stopping process(es) on port $port: $pids"
    # shellcheck disable=SC2086
    kill -9 $pids 2>/dev/null || true
  fi
}

wait_for_port_free() {
  local port="$1"
  local tries=0
  while lsof -tiTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [[ $tries -gt 20 ]]; then
      echo ""
      echo "ERROR: Port $port is still in use."
      echo "Run: npm run kill-dev"
      echo "Then: npm run dev"
      exit 1
    fi
    sleep 0.25
  done
}

wait_for_no_next() {
  local tries=0
  while pgrep -f "$ROOT/node_modules/.bin/next dev" >/dev/null 2>&1 ||
    pgrep -f "$ROOT/node_modules/next/dist/bin/next dev" >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [[ $tries -gt 20 ]]; then
      echo "ERROR: Could not stop old Next dev processes. Run: npm run kill-dev"
      exit 1
    fi
    kill_next_for_repo
    sleep 0.25
  done
}

# Stop any previous dev session (always restart — never block on stale lock).
if [[ -d "$LOCK_DIR" ]] && [[ -f "$LOCK_DIR/pid" ]]; then
  old_pid="$(cat "$LOCK_DIR/pid" 2>/dev/null || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" 2>/dev/null; then
    echo "Stopping previous dev session (pid $old_pid)..."
    kill -9 "$old_pid" 2>/dev/null || true
  fi
  rm -rf "$LOCK_DIR"
fi

mkdir "$LOCK_DIR"
echo $$ > "$LOCK_DIR/pid"

cleanup() {
  rm -rf "$LOCK_DIR"
}
trap cleanup EXIT INT TERM

echo "Stopping old dev servers..."
for port in 3000 3001 3002; do
  stop_port "$port"
done
kill_next_for_repo
sleep 1
wait_for_no_next
wait_for_port_free "$PORT"

# Always clear build cache on dev start — prevents stale chunk 500s after HMR.
if [[ -d .next ]]; then
  echo "Clearing .next cache..."
  rm -rf .next
fi

echo ""
echo "============================================"
echo "  Dev server: http://localhost:$PORT"
echo "  Math index: http://localhost:$PORT/math-applied"
echo "  Always use: npm run dev"
echo "  If stuck:   npm run kill-dev && npm run dev"
echo "============================================"
echo ""

export NEXT_DISABLE_DEVTOOLS=1
exec npm run dev:next -- --port "$PORT"
