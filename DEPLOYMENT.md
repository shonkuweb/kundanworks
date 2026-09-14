# Deployment Guide: Kundan Works on VPS with PostgreSQL

This guide explains how to deploy the full-stack **Kundan Works** application with **PostgreSQL Database** and **REST API** on your VPS alongside your other projects and connect it with **`kundanworks.shonku.site`**.

---

## 🏗️ Architecture on Multi-Project VPS

The application runs as an isolated 3-service Docker Compose stack:
1. **`kundanworks-db`**: PostgreSQL 16 Alpine with persistent volume `kundan_postgres_data`.
2. **`kundanworks-api`**: Node.js Express REST API (`/api/products`, `/api/orders`, `/api/categories`, etc.) with image uploads volume `kundan_uploads_data`.
3. **`kundanworks-web`**: Alpine Nginx container serving the built React SPA and proxying `/api/` and `/uploads/` to the backend.

```
 Internet (HTTPS)
       │
       ▼
[DNS: kundanworks.shonku.site] ──> [ VPS Public IP ]
                                          │
                                          ▼
                                   [ Host Nginx / NPM ]
                                          │
                                 (proxy_pass :3040)
                                          │
                                          ▼
                         [ Docker: kundanworks-web ]
                                ├── Static Frontend SPA (React)
                                └── Reverse Proxy /api/* & /uploads/*
                                          │
                                          ▼
                         [ Docker: kundanworks-api ]
                               (Node.js / Express)
                                          │
                                          ▼
                         [ Docker: kundanworks-db ]
                               (PostgreSQL 16)
                                          │
                                  [ Named Volume ]
```

---

## 🚀 Quick Deployment (3 Simple Steps)

### Step 1: DNS Setup (for `kundanworks.shonku.site`)
Log in to your DNS provider (Cloudflare, Namecheap, GoDaddy, or Hostinger DNS):
1. Add an **A Record**:
   - **Type**: `A`
   - **Name**: `kundanworks` (or `kundanworks.shonku.site`)
   - **Target / Value**: Your VPS Public IPv4 address
   - **TTL**: Auto or 300s
2. If using Cloudflare, set proxy (Orange Cloud) **ON** for automatic SSL and CDN caching.

---

### Step 2: Clone & Launch on Your VPS

On your VPS terminal:

```bash
# 1. Clone repository
git clone https://github.com/shonkuweb/kundanworks.git /var/www/kundanworks
cd /var/www/kundanworks

# 2. Configure environment (optional, defaults already work out of the box)
cp .env.example .env

# 3. Run automated deployment
bash vps/deploy.sh
```

The script will automatically build and spin up:
- PostgreSQL 16 container with automatic schema migrations
- Express API server
- React production bundle with Nginx reverse proxy

Verify status:
```bash
docker compose ps
curl http://127.0.0.1:3040/api/healthz
# Output: {"status":"healthy","database":"connected",...}
```

---

### Step 3: Connect Domain `kundanworks.shonku.site`

#### Option A: Host Nginx (Recommended)
```bash
# 1. Copy virtual host configuration
sudo cp vps/kundanworks.shonku.site.conf /etc/nginx/sites-available/

# 2. Enable the site
sudo ln -s /etc/nginx/sites-available/kundanworks.shonku.site.conf /etc/nginx/sites-enabled/

# 3. Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# 4. Generate free SSL Certificate with Certbot
sudo certbot --nginx -d kundanworks.shonku.site
```

#### Option B: Nginx Proxy Manager (GUI)
1. Add Proxy Host for `kundanworks.shonku.site`
2. Forward Hostname: `127.0.0.1`, Port: `3040`
3. Request SSL Certificate with Force SSL.

---

## 💾 Database Backups

Because PostgreSQL uses a named Docker volume (`kundan_postgres_data`), all your products, customer orders, and tracking statuses persist permanently across container rebuilds and server reboots.

To backup your database at any time:
```bash
docker exec -t kundanworks-db pg_dump -U kundan_admin kundanworks > backup_$(date +%F).sql
```
To restore a backup:
```bash
cat backup.sql | docker exec -i kundanworks-db psql -U kundan_admin -d kundanworks
```
