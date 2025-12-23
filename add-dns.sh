#!/bin/bash

# Add DNS records for rate-my-advisor.com to Cloudflare
# Uses wrangler authentication (already logged in)

# Zone ID for rate-my-advisor.com
ZONE_ID="${1:-2b96ee8edab9a0f416ef1308ea171fcf}"

echo "Using Zone ID: $ZONE_ID"

# Get API token from environment or prompt
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Note: This script needs a Cloudflare API token with DNS edit permissions"
  echo "Get it from: https://dash.cloudflare.com/profile/api-tokens"
  echo "Create token with: Zone.DNS Edit permissions for rate-my-advisor.com"
  echo ""
  echo "Or set it as environment variable:"
  echo "  export CLOUDFLARE_API_TOKEN='your-token'"
  echo "  ./add-dns.sh"
  echo ""
  exit 1
fi

API_TOKEN="$CLOUDFLARE_API_TOKEN"

# Add A record for root domain
echo "Adding A record for @ (root domain)..."
RESULT1=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "@",
    "content": "76.76.21.21",
    "ttl": 1,
    "proxied": false
  }')

echo "$RESULT1" | python3 -m json.tool 2>/dev/null || echo "$RESULT1"

# Check if record already exists
if echo "$RESULT1" | grep -q "already exists"; then
  echo "⚠️  A record already exists, skipping..."
else
  echo "✅ A record added!"
fi

# Add CNAME record for www
echo ""
echo "Adding CNAME record for www..."
RESULT2=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "www",
    "content": "cname.vercel-dns.com",
    "ttl": 1,
    "proxied": false
  }')

echo "$RESULT2" | python3 -m json.tool 2>/dev/null || echo "$RESULT2"

# Check if record already exists
if echo "$RESULT2" | grep -q "already exists"; then
  echo "⚠️  CNAME record already exists, skipping..."
else
  echo "✅ CNAME record added!"
fi

echo ""
echo "✅ DNS records added!"
echo "Wait 5-10 minutes for DNS to propagate."

