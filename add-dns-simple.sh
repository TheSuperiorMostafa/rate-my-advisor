#!/bin/bash

# Simple script to add DNS records - just needs Zone ID
echo "Adding DNS records for rate-my-advisor.com"
echo ""
read -p "Enter your Cloudflare Zone ID (get from dashboard): " ZONE_ID

if [ -z "$ZONE_ID" ]; then
  echo "❌ Zone ID required"
  exit 1
fi

# Get API token
echo ""
echo "Get API token from: https://dash.cloudflare.com/profile/api-tokens"
echo "Create token with: Zone.DNS Edit permissions"
read -p "Enter your Cloudflare API token: " API_TOKEN

if [ -z "$API_TOKEN" ]; then
  echo "❌ API token required"
  exit 1
fi

echo ""
echo "Adding A record for @ (root domain)..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "@",
    "content": "76.76.21.21",
    "ttl": 1,
    "proxied": false
  }' | python3 -m json.tool

echo ""
echo "Adding CNAME record for www..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "www",
    "content": "cname.vercel-dns.com",
    "ttl": 1,
    "proxied": false
  }' | python3 -m json.tool

echo ""
echo "✅ DNS records added!"
echo "Wait 5-10 minutes for DNS to propagate."


