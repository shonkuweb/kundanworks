#!/usr/bin/env bash

# ================================================================
# Automated Deployment Script for Kundan Works on VPS
# Domain: kundanworks.shonku.site
# Stack: PostgreSQL 16 + Express REST API + React SPA Nginx
# ================================================================

set -e

echo "=========================================="
echo " Starting Kundan Works Full-Stack Deploy  "
echo " Domain: kundanworks.shonku.site          "
echo " Stack: PostgreSQL + Node API + Web SPA   "
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed on this VPS."
    echo "Please install Docker: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Load .env if present
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Set host port (default: 3040)
export PORT=${PORT:-3040}
echo "✓ Host Port configured: $PORT"

# Rebuild and launch containers
echo "✓ Rebuilding and launching Docker containers (Database, API, Web)..."
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

# Wait for containers to be ready
echo "✓ Waiting for PostgreSQL and API to initialize tables..."
sleep 6

# Check Web health
if curl -s http://127.0.0.1:$PORT/healthz | grep -q "healthy"; then
    echo "✅ Web Nginx container is UP on port $PORT"
else
    echo "⚠️ Checking Web container logs:"
    docker logs --tail 20 kundanworks-app
fi

# Check API + PostgreSQL health
if curl -s http://127.0.0.1:$PORT/api/healthz | grep -q "connected"; then
    echo "✅ PostgreSQL Database & API are CONNECTED & HEALTHY"
    echo "=========================================="
    echo "🎉 Full-Stack Kundan Works is RUNNING!"
    echo "=========================================="
else
    echo "⚠️ Checking API container logs:"
    docker logs --tail 30 kundanworks-api
fi

echo ""
echo "Next Steps to link with kundanworks.shonku.site:"
echo "1. Point DNS A-Record for 'kundanworks.shonku.site' to your VPS IP."
echo "2. If using host Nginx, run:"
echo "   sudo cp vps/kundanworks.shonku.site.conf /etc/nginx/sites-available/"
echo "   sudo ln -s /etc/nginx/sites-available/kundanworks.shonku.site.conf /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo "3. Issue free SSL Certificate with Certbot:"
echo "   sudo certbot --nginx -d kundanworks.shonku.site"
echo ""
echo "Done! Your site will be live at: https://kundanworks.shonku.site"
