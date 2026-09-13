#!/usr/bin/env bash

# ================================================================
# Automated Deployment Script for Kundan Works on VPS
# Domain: kundanworks.shonku.site
# ================================================================

set -e

echo "=========================================="
echo " Starting Kundan Works Docker Deployment  "
echo " Domain: kundanworks.shonku.site          "
echo "=========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed on this VPS."
    echo "Please install Docker: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Set host port (default: 3040)
export PORT=${PORT:-3040}
echo "✓ Host Port configured: $PORT"

# Stop existing container if running
echo "✓ Rebuilding and launching Docker container..."
if docker compose version &> /dev/null; then
    docker compose down || true
    docker compose up -d --build
else
    docker-compose down || true
    docker-compose up -d --build
fi

# Wait for container to be ready
echo "✓ Waiting for container to initialize..."
sleep 4

# Check health
if curl -s http://127.0.0.1:$PORT/healthz | grep -q "healthy"; then
    echo "=========================================="
    echo "✅ Container is UP & HEALTHY on port $PORT"
    echo "=========================================="
else
    echo "⚠️ Warning: Health check did not return immediately, checking logs:"
    docker logs --tail 20 kundanworks-app
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
