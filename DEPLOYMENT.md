# Deployment Guide: Kundan Works on Multi-Project VPS

This guide explains how to deploy the Dockerized **Kundan Works** application on your VPS alongside your other projects and connect it with **`kundanworks.shonku.site`**.

---

## 🏗️ Architecture on Multi-Project VPS

Since your VPS already hosts multiple projects, this project runs in an isolated, lightweight Docker container:
- **Container**: `kundanworks-app` (Alpine Linux + Nginx + built React static assets).
- **Default Host Port**: `3040` (maps `3040:80`).
- **Memory Footprint**: Less than **25 MB** RAM.
- **Reverse Proxy**: Host Nginx / Nginx Proxy Manager routes traffic for `kundanworks.shonku.site` to port `3040`.

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
                         [ Docker Container: kundanworks-app ]
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
2. If using Cloudflare, you can set the proxy (Orange Cloud) **ON** for automatic SSL and CDN caching.

---

### Step 2: Clone & Launch Container on Your VPS

On your VPS terminal, navigate to your projects directory (e.g. `/var/www` or `/home/ubuntu/apps`):

```bash
# 1. Clone or copy the repository onto your VPS
git clone <your-repo-url> /var/www/kundanworks
cd /var/www/kundanworks

# 2. (Optional) If port 3040 is already used by another project, change it in .env
cp .env.example .env
# nano .env -> edit PORT=3045 (or any free port)

# 3. Run the automated deployment script
bash vps/deploy.sh
```

Or run directly with Docker Compose:
```bash
docker compose up -d --build
```

Verify the container is running:
```bash
docker ps
curl http://127.0.0.1:3040/healthz
# Output: healthy
```

---

### Step 3: Connect Domain `kundanworks.shonku.site`

Choose your reverse proxy setup below:

#### Option A: If you use Host Nginx on the VPS (Recommended)
Copy the pre-configured Nginx virtual host file:

```bash
# 1. Copy config file
sudo cp vps/kundanworks.shonku.site.conf /etc/nginx/sites-available/

# 2. Enable the site
sudo ln -s /etc/nginx/sites-available/kundanworks.shonku.site.conf /etc/nginx/sites-enabled/

# 3. Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# 4. Generate free SSL Certificate with Certbot
sudo certbot --nginx -d kundanworks.shonku.site
```

#### Option B: If you use Nginx Proxy Manager (GUI)
1. Open your Nginx Proxy Manager dashboard (usually on port `81`).
2. Click **Proxy Hosts** → **Add Proxy Host**:
   - **Domain Names**: `kundanworks.shonku.site`
   - **Scheme**: `http`
   - **Forward Hostname / IP**: `127.0.0.1` (or the container name `kundanworks-app` if on same Docker network)
   - **Forward Port**: `3040`
   - Turn **ON**: *Cache Assets*, *Block Common Exploits*, *Websockets Support*.
3. Go to the **SSL** tab:
   - Select **Request a new SSL Certificate**.
   - Turn **ON**: *Force SSL*, *HTTP/2 Support*.
   - Click **Save**.

#### Option C: If you use Caddy
Add this to your `/etc/caddy/Caddyfile`:
```caddy
kundanworks.shonku.site {
    reverse_proxy 127.0.0.1:3040
}
```
Reload Caddy:
```bash
sudo systemctl reload caddy
```

---

## 🛠️ Maintenance & Updates

When you update code or want to deploy new catalog features:
```bash
cd /var/www/kundanworks
git pull
bash vps/deploy.sh
```

To view live container logs:
```bash
docker logs -f kundanworks-app
```
