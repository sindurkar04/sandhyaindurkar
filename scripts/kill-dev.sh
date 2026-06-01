#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCK_DIR="$ROOT/.next-dev.lock"

kill_next_for_repo() {
  pkill -9 -f "$ROOT/node_modules/.bin/next dev" 2>/dev/null || true
  pkill -9 -f "$ROOT/node_modules/next/dist/bin/next dev" 2>/dev/null || true
  pkill -9 -f "$ROOT/.next" 2>/dev/null || true
}

stop_port() {
  local port="$1"
  local pids
  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Killing port $port: $pids"
    # shellcheck disable=SC2086
    kill -9 $pids 2>/dev/null || true
  fi
}

cd "$ROOT"

if [[ -f "$LOCK_DIR/pid" ]]; then
  old_pid="$(cat "$LOCK_DIR/pid" 2>/dev/null || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" 2>/dev/null; then
    echo "Killing previous dev pid $old_pid..."
    kill -9 "$old_pid" 2>/dev/null || true
  fi
fi

for port in 3000 3001 3002; do
  stop_port "$port"
done

kill_next_for_repo
sleep 1

rm -rf "$LOCK_DIR" "$ROOT/.next"

echo "Done. Start fresh with: npm run dev"
