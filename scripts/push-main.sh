#!/usr/bin/env bash
# Push main to GitHub using a Personal Access Token (no password prompt).
# Usage: export GITHUB_TOKEN=ghp_...  (classic PAT with "repo" scope, or fine-grained with Contents: Read/Write)
#        ./scripts/push-main.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "Set GITHUB_TOKEN to a GitHub PAT, then re-run." >&2
  echo "See: https://github.com/settings/tokens" >&2
  exit 1
fi
REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/sindurkar04/sandhyaindurkar.git"
git push -u "$REMOTE_URL" main
git remote set-url origin https://github.com/sindurkar04/sandhyaindurkar.git
