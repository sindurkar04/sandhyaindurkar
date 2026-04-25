#!/usr/bin/env bash
# Exit 0 when apex + www DNS point at Vercel (per public resolvers).
# Squarespace changes can take time to propagate; we query Cloudflare + Google DNS directly.
set -euo pipefail
DOMAIN="${1:-sandhyaindurkar.com}"
WWW_DOMAIN="www.${DOMAIN}"
# Vercel commonly uses these apex A targets (Vercel may show newer IPs over time).
VERCEL_APEX_IPS=("216.198.79.1" "76.76.21.21")

has_vercel_a() {
  local name="$1"
  local answers
  answers="$(dig @1.1.1.1 +short "$name" A || true)"$'\n'"$(dig @8.8.8.8 +short "$name" A || true)"
  answers="$(echo "$answers" | tr -d '\r' | sed '/^$/d' | sort -u)"

  if [[ -z "${answers//[$' \t\n\r']/}" ]]; then
    return 1
  fi

  while IFS= read -r line; do
    [[ -z "${line//[$' \t\n\r']/}" ]] && continue
    for ip in "${VERCEL_APEX_IPS[@]}"; do
      if [[ "$line" == "$ip" ]]; then
        return 0
      fi
    done
  done <<< "$answers"

  return 1
}

www_points_to_squarespace() {
  local cname cname_lc
  cname="$(dig @1.1.1.1 +short "$WWW_DOMAIN" CNAME 2>/dev/null | tr -d '\r' || true)"
  cname_lc="$(printf '%s' "$cname" | tr '[:upper:]' '[:lower:]')"
  if [[ "$cname_lc" == *squarespace* ]]; then
    return 0
  fi
  cname="$(dig @8.8.8.8 +short "$WWW_DOMAIN" CNAME 2>/dev/null | tr -d '\r' || true)"
  cname_lc="$(printf '%s' "$cname" | tr '[:upper:]' '[:lower:]')"
  if [[ "$cname_lc" == *squarespace* ]]; then
    return 0
  fi
  return 1
}

if ! has_vercel_a "$DOMAIN"; then
  echo "Not ready: $DOMAIN A records (1.1.1.1 / 8.8.8.8):" >&2
  dig @1.1.1.1 +short "$DOMAIN" A >&2 || true
  dig @8.8.8.8 +short "$DOMAIN" A >&2 || true
  echo "Expected one of: ${VERCEL_APEX_IPS[*]}" >&2
  exit 1
fi

if www_points_to_squarespace; then
  echo "Not ready: $WWW_DOMAIN still has a Squarespace CNAME:" >&2
  dig @1.1.1.1 +short "$WWW_DOMAIN" CNAME >&2 || true
  dig @8.8.8.8 +short "$WWW_DOMAIN" CNAME >&2 || true
  echo "Remove the Squarespace www record and add Vercel's recommended www record." >&2
  exit 1
fi

if ! has_vercel_a "$WWW_DOMAIN"; then
  echo "Not ready: $WWW_DOMAIN A records (1.1.1.1 / 8.8.8.8):" >&2
  dig @1.1.1.1 +short "$WWW_DOMAIN" A >&2 || true
  dig @8.8.8.8 +short "$WWW_DOMAIN" A >&2 || true
  dig @1.1.1.1 +short "$WWW_DOMAIN" CNAME >&2 || true
  dig @8.8.8.8 +short "$WWW_DOMAIN" CNAME >&2 || true
  echo "Expected www to resolve to Vercel (commonly A -> 216.198.79.1, matching Vercel Domains)." >&2
  exit 1
fi

echo "OK: $DOMAIN and $WWW_DOMAIN resolve to Vercel A records per public DNS (1.1.1.1 / 8.8.8.8)."
exit 0
