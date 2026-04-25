#!/usr/bin/env bash
# Exit 0 when apex DNS points at Vercel. Use after updating Squarespace DNS.
set -euo pipefail
DOMAIN="${1:-sandhyaindurkar.com}"
# Vercel commonly uses these apex A targets (Vercel may show newer IPs over time).
VERCEL_APEX_IPS=("216.198.79.1" "76.76.21.21")

records="$(dig +short "$DOMAIN" A || true)"
if [[ -z "${records//[$' \t\n\r']/}" ]]; then
  echo "Not ready: no A records found for $DOMAIN" >&2
  exit 1
fi

for ip in "${VERCEL_APEX_IPS[@]}"; do
  if echo "$records" | grep -qx "$ip"; then
    echo "OK: $DOMAIN has Vercel apex A record $ip"
    exit 0
  fi
done

echo "Not ready: $DOMAIN A records:" >&2
echo "$records" >&2
echo "Expected one of: ${VERCEL_APEX_IPS[*]} — update DNS at Squarespace, then re-run." >&2
exit 1
