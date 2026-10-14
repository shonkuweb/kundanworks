# PROJECT REPORT: KUNDAN WORKS BOUTIQUE E-COMMERCE PLATFORM

---

**Project Title:** Kundan Works — Contemporary Ethnic Boutique & WhatsApp-Commerce Platform  
**Client / Brand:** Kundan Works  
**Digital Architecture & Engineering Partner:** ShonkuWEB Technologies  
**Production Domain:** `kundanworks.shonku.site`  
**Date of Completion:** September 2026  
**Document Version:** 1.0.0 (Production Release)

---

## 1. Executive Summary

**Kundan Works** is a modern, high-performance web application designed for a luxury ethnic wear boutique. The platform combines visual storytelling, high-resolution craftsmanship presentation, and an ultra-low-friction checkout experience tailored specifically for the Indian apparel and bridal market. 

Traditional e-commerce platforms suffer from high cart abandonment rates (70%+) due to mandatory account registrations, lengthy OTP sign-ins, and complex multi-step checkout funnels. **Kundan Works** eliminates these barriers through a **WhatsApp-Commerce Hybrid Architecture**: customers browse handcrafted collections with real-time stock indicators, explore multi-angle product photography, and place verified orders directly into the boutique's concierge WhatsApp line with pre-formatted receipts and live product links.

Backing the customer storefront is a **PostgreSQL-powered backend**, a **zero-plain-text cryptographically secured Admin Panel**, and a **Live 4-Stage Order Tracking System** with real-time customer status updates.

---

## 2. Project Objectives

1. **Zero-Friction Conversion**: Enable customers to discover pieces, configure quantities, and place orders via WhatsApp within seconds without mandatory user sign-ups or complex forms.
2. **True Craftsmanship Showcase**: Provide an interactive multi-photo gallery supporting multiple angles, swipe navigation, thumbnail strips, and high-resolution fullscreen zoom.
3. **Boutique-Tailored Policies**:
   - **No Size Ambiguity**: Tailored garments and curated sets are sold without restrictive standard size tags.
   - **Flexible Logistics**: Delivery charges are clearly identified as **"Decided by the Admin"** based on shipping pincode, distance, and courier requirements.
4. **End-to-End Order Visibility**: Empower customers to track their order lifecycle in real-time across 4 stages (*Order Confirmed → Packed → Shipped → Delivered*) using Order ID, phone number, or Courier AWB.
5. **Cryptographically Secure Administration**: Provide an intuitive Admin Panel protected by PBKDF2 password hashing (100,000 SHA-256 iterations) with zero hardcoded credentials or cleartext frontend exposure.
6. **Fault-Tolerant Dual-Sync Architecture**: Ensure uninterrupted operation with local storage caching and central PostgreSQL synchronization.

---

## 3. Technology Stack & Architecture

### 3.1 Architecture Overview

The system is engineered as an isolated, containerized 3-tier microservice architecture:

```
                          Internet (HTTPS / SSL)
                                    │
                                    ▼
                     [ DNS: kundanworks.shonku.site ]
                                    │
                                    ▼
                         [ Host Nginx Gateway ]
                                    │
                             (reverse proxy :3040)
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │       Docker: kundanworks-web        │
                 │   • Nginx Web Server (Alpine)        │
                 │   • React Single Page App (SPA)      │
                 │   • Reverse proxy /api/ and /uploads/│
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │       Docker: kundanworks-api        │
                 │   • Node.js 20 & Express.js          │
                 │   • Multer (Multi-part image upload) │
                 │   • Connection pool (pg)             │
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │       Docker: kundanworks-db         │
                 │   • PostgreSQL 16 Alpine             │
                 │   • Persistent Volume Storage        │
                 └──────────────────────────────────────┘
```

### 3.2 Technology Breakdown

| Component | Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.3 | Component-based, responsive UI with virtual DOM efficiency |
| **Build & Tooling** | Vite 6.0 | Sub-second Hot Module Replacement (HMR) and optimized tree-shaken bundles (~354 KB) |
| **Styling & Layout** | Tailwind CSS 3.4 | Mobile-first utility styling, custom luxury warm palette (`#FAF8F5`, `#11A0AB`, `#1E1A17`) |
| **Routing** | React Router DOM 7.18 | Client-side routing with clean URL parameters (`/product/:id`, `/order?id=...`, `/checkout`) |
| **Icons & Visuals** | Lucide React | Clean, scalable feather icons |
| **Cryptography** | Web Cryptography API | Native browser `window.crypto.subtle` PBKDF2 (100k rounds SHA-256 + 16-byte random salt) |
| **Backend Runtime** | Node.js 20 LTS | Asynchronous, non-blocking I/O event-driven backend |
| **REST API Framework** | Express.js 4.21 | Lightweight, performant routing and middleware integration |
| **Database** | PostgreSQL 16 Alpine | ACID-compliant relational storage with JSONB support for item payloads |
| **Web Server & Proxy**| Nginx Alpine | High-concurrency static asset delivery, Gzip compression, and reverse proxying |
| **Containerization** | Docker & Docker Compose | Repeatable, zero-configuration deployment across environments |

---

## 4. Key Functional Modules

### 4.1 Product Catalog & Discovery
- **Dynamic Header & Navigation**: Clean top bar with boutique logo favicon, search bar, active cart count badge, and side drawer navigation.
- **Promo Announcement Strip**: Rotating banners highlighting boutique services, custom gifts, and doorstep delivery with charges decided by the admin.
- **Interactive Curated Grid**: Fast category filtering (All, Ethnic, Sarees, Kurtas, Western), live stock badges (*In Stock* vs. *Sold Out*), and multi-photo indicator pills (`📷 3 photos`).

### 4.2 Multi-Image Showcase Gallery
- **Dedicated Product Page (`/product/:id`)**:
  - Main display container featuring the selected photo with smooth opacity transitions.
  - Interactive **Thumbnail Selector Strip** below the image displaying all uploaded angles.
  - **Previous & Next Navigation Chevrons** for quick photo browsing.
  - Floating **Photo Counter Pill** (e.g. `1 of 3`) notifying the customer of multiple available views.
  - **Keyboard Arrow Navigation** (`←` and `→`) for intuitive photo flipping.
  - **Fullscreen Cinema Lightbox**: High-resolution zoomable viewer with dark backdrop, photo navigation, and `Esc` close key.
- **Quick-View Modal**: Integrated multi-photo browsing accessible directly from the catalog view without page reload.

### 4.3 Frictionless Shopping Bag & WhatsApp Checkout
- **Slide-Out Cart Drawer**:
  - Live quantity adjustment steppers (`+` / `−`) and instant removal.
  - Clear itemized price calculations with tax inclusion notes.
  - Delivery charge marked as **"Decided by the Admin"**.
- **Checkout Page (`/checkout`)**:
  - Collects only essential fulfillment details: Customer Name, Phone Number, and Delivery Location.
  - Generates structured, professional WhatsApp order payloads with itemized totals, delivery policy, and direct clickable product links:
    ```
    ✨ *NEW ORDER - KUNDAN WORKS* ✨
    ━━━━━━━━━━━━━━━━━━━━
    📦 *ORDER ID:* #KW-642198

    👤 *CUSTOMER DETAILS:*
    • *Name:* Aarav Sharma
    • *Mobile:* +91 85115 56155
    • *Delivery Location:* Mumbai, Maharashtra

    🛍️ *ORDERED PIECES:*
    1. *Royal Chanderi Silk Kurta*
       • Qty: *1*
       • Price: ₹3,999 (₹3,999 each)
       • Product Link: https://kundanworks.shonku.site/product/prod_1

    ━━━━━━━━━━━━━━━━━━━━
    💰 *TOTAL AMOUNT:* ₹3,999
    🚚 *Delivery:* Decided by the Admin
    ━━━━━━━━━━━━━━━━━━━━
    _Hi Kundan Works, please confirm this order and share delivery / payment steps._
    ```

### 4.4 Live 4-Stage Order Tracking System (`/order`)
- **Multi-Format Search Engine**: Customers can track orders by:
  - Full Order ID: `KW-642198`
  - With Hash: `#KW-642198`
  - Raw 6 Digits: `642198`
  - 10-Digit Mobile Number: `8511556155` or `+91 85115 56155`
  - Courier AWB Number: `KW-EXP-642198`
- **Interactive Visual Timeline**:
  1. **Order Confirmed**: Verified by studio concierge.
  2. **Packed**: Garments quality-inspected and packaged in luxury boutique box.
  3. **Shipped**: Handed over to express logistics partner with live tracking ID.
  4. **Delivered**: Celebratory emerald UI with checkmarks and direct VIP WhatsApp assistance card.

### 4.5 Secured Admin Panel
- **Security**: Protected with browser Web Cryptography PBKDF2 hashing; session tokens auto-expire and are cleared upon tab closure.
- **Product Management**: Create, edit, and delete products; upload up to 3 high-resolution photos per product; configure prices, strike-through discounts, and inventory counts.
- **Order Command Center**:
  - Filter orders by status (*Pending Review*, *Accepted*, *Rejected*).
  - One-click order acceptance/rejection (automatically updates inventory).
  - Advance orders through fulfillment stages (*Confirmed → Packed → Shipped → Delivered*).
  - Direct WhatsApp customer link to message the buyer in one tap.
- **Settings & Boutique Management**:
  - Update boutique contact number and branding.
  - In-panel secure password change with real-time validation and cryptographic re-hashing.

---

## 5. Security & Data Integrity

1. **PBKDF2 Password Protection**:
   - Password authentication employs 100,000 rounds of SHA-256 key derivation with a 16-byte cryptographically secure pseudorandom salt (`crypto.getRandomValues`).
   - Zero hardcoded passwords exist in frontend source files.
2. **Dual-Sync Storage Engine**:
   - New orders are committed simultaneously to `localStorage` and sent to the PostgreSQL backend (`/api/orders`).
   - Cross-tab `storage` event listeners ensure that orders placed in one tab instantly reflect in the Admin Panel without page refresh.
   - Remote database synchronization utilizes safe merging rather than destructive overwriting, ensuring zero order loss during offline periods or network drops.
3. **SQL Parameterization**:
   - All PostgreSQL queries utilize parameterized queries (`$1`, `$2`, ...) to eliminate SQL injection vulnerabilities.
4. **Network Resilience**:
   - API calls feature a 2.5-second `AbortController` timeout to prevent hanging connections from freezing the client UI.

---

## 6. Database Schema Design

```
                     ┌────────────────────────────────┐
                     │          categories            │
                     ├────────────────────────────────┤
                     │ id (TEXT, PK)                  │
                     │ name (TEXT NOT NULL)           │
                     │ slug (TEXT NOT NULL)           │
                     │ image (TEXT)                   │
                     │ item_count (INTEGER DEFAULT 0) │
                     │ created_at (TIMESTAMPTZ)       │
                     └────────────────┬───────────────┘
                                      │ 1:N
                                      ▼
┌────────────────────────────────┐   ┌────────────────────────────────┐
│            orders              │   │            products            │
├────────────────────────────────┤   ├────────────────────────────────┤
│ id (TEXT, PK)                  │   │ id (TEXT, PK)                  │
│ customer_name (TEXT NOT NULL)  │   │ title (TEXT NOT NULL)          │
│ customer_phone (TEXT NOT NULL) │   │ category_id (TEXT, FK)         │
│ customer_location (TEXT)       │   │ category_slug (TEXT)           │
│ items (JSONB NOT NULL)         │   │ price (NUMERIC(10,2) NOT NULL) │
│ total_price (NUMERIC(10,2))    │   │ original_price (NUMERIC(10,2)) │
│ decision (TEXT DEFAULT pending)│   │ stock (INTEGER DEFAULT 10)     │
│ stage (INTEGER DEFAULT 1)      │   │ in_stock (BOOLEAN DEFAULT true)│
│ status (TEXT)                  │   │ images (JSONB DEFAULT '[]')    │
│ status_title (TEXT)            │   │ image_url (TEXT)               │
│ status_description (TEXT)      │   │ description (TEXT)             │
│ created_at (TIMESTAMPTZ)       │   │ created_at (TIMESTAMPTZ)       │
│ updated_at (TIMESTAMPTZ)       │   │ updated_at (TIMESTAMPTZ)       │
└────────────────────────────────┘   └────────────────────────────────┘
```

---

## 7. Deployment & DevOps Architecture

- **Isolated Docker Network**: Services communicate through an internal bridge network (`kundan-net`), shielding database ports from external exposure.
- **Persistent Storage Volumes**:
  - `postgres_data`: Preserves all customer records, order stages, and catalog items.
  - `uploads_data`: Stores uploaded garment photos and media.
- **Automated Startup Script (`vps/deploy.sh`)**:
  - Verifies Docker prerequisites.
  - Builds optimized React production bundles.
  - Initializes database tables and indexes automatically.
  - Configures Nginx virtual host and provisions Let's Encrypt SSL.

---

## 8. Performance & Quality Verification

| Metric / Check | Result | Verification Standard |
| :--- | :--- | :--- |
| **Production Build Time** | ~835 ms | Vite 6 tree-shaking & rollup compiler |
| **JavaScript Bundle Size**| 354.00 kB (100 kB gzip) | Highly optimized initial load |
| **CSS Bundle Size** | 60.79 kB (10.38 kB gzip) | Tailwind CSS purges unused classes |
| **Order Tracking Match Rate** | 100% (7/7 query patterns) | Validated via `test_orders.js` test suite |
| **Mobile Responsiveness** | Pass | Touch-friendly curved controls (minimum 44px hit targets) |
| **Cross-Tab Synchronization** | Pass | Real-time `storage` event broadcast |
| **Zero Size Artifacts** | Pass | Completely stripped from checkout, cart, tracking, and receipts |

---

## 9. Conclusion

The **Kundan Works** e-commerce platform successfully demonstrates how luxury retail and contemporary web engineering can merge to eliminate customer purchase friction. By pairing an artisan aesthetic with WhatsApp-first checkout, multi-angle photo inspection, live milestone tracking, and military-grade administrative security, the platform provides a production-ready, scalable foundation for digital boutique commerce.
