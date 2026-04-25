#!/usr/bin/env bash
# Exit 0 when apex DNS points at Vercel (76.76.21.21). Use after updating Squarespace DNS.
set -euo pipefail
DOMAIN="${1:-sandhyaindurkar.com}"
VERCEL_A="76.76.21.21"
if dig +short "$DOMAIN" A | grep -qx "$VERCEL_A"; then
  echo "OK: $DOMAIN has A record $VERCEL_A (Vercel)"
  exit 0
fi
echo "Not ready: $DOMAIN A records:" >&2
dig +short "$DOMAIN" A >&2 || true
echo "Expected A $VERCEL_A — update DNS at Squarespace, then re-run." >&2
exit 1
