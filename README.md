# DIGIVAULT — Backend Documentation

Production-ready Express + MongoDB backend for the DIGIVAULT digital marketplace.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Environment Variables](#environment-variables)
5. [API Reference](#api-reference)
6. [Frontend Integration](#frontend-integration)
7. [File Upload System](#file-upload-system)
8. [Authentication Flow](#authentication-flow)
9. [Postman Examples](#postman-examples)
10. [Deployment](#deployment)
11. [Security Notes](#security-notes)

---

## Tech Stack

| Layer          | Technology               |
|----------------|--------------------------|
| Runtime        | Node.js 18+              |
| Framework      | Express.js 4             |
| Database       | MongoDB Atlas (Mongoose) |
| Auth           | JWT (jsonwebtoken)       |
| Passwords      | bcryptjs (12 salt rounds)|
| File Upload    | Multer                   |
| Validation     | express-validator        |
| Security       | helmet, cors, rate-limit |
| Logging        | morgan                   |

---

## Project Structure

```
backend/
├── config/
│   ├── db.js           — MongoDB connection
│   └── multer.js       — File upload configuration
├── controllers/
│   ├── authController.js    — Register, login, profile
│   ├── productController.js — Full product CRUD + promote
│   └── adminController.js   — Admin panel operations
├── middleware/
│   ├── auth.js          — JWT protect / adminOnly
│   └── errorHandler.js  — Global error + 404 handler
├── models/
│   ├── User.js          — User schema
│   └── Product.js       — Product schema
├── routes/
│   ├── auth.js          — /api/auth/*
│   ├── products.js      — /api/products/*
│   └── admin.js         — /api/admin/*
├── uploads/
│   ├── images/          — Uploaded product images
│   └── videos/          — Uploaded product videos
├── api.js               — Frontend integration client
├── server.js            — Entry point
├── .env.example         — Template for your .env
└── package.json
```

---

## Quick Start

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://USER:PASS@cluster0.mongodb.net/digivault?retryWrites=true&w=majority
JWT_SECRET=your_64_char_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE_MB=10
```

> **Generate a strong JWT secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Run in development

```bash
npm run dev       # nodemon — auto-restarts on file changes
```

### 4. Run in production

```bash
npm start
```

Server starts at `http://localhost:5000`

---

## Environment Variables

| Variable           | Required | Description                                      |
|--------------------|----------|--------------------------------------------------|
| `PORT`             | No       | Server port (default: 5000)                      |
| `NODE_ENV`         | Yes      | `development` or `production`                    |
| `MONGO_URI`        | Yes      | MongoDB Atlas connection string                   |
| `JWT_SECRET`       | Yes      | Long random string for signing tokens             |
| `JWT_EXPIRES_IN`   | No       | Token expiry (default: `7d`)                     |
| `CLIENT_URL`       | Yes      | Frontend origin for CORS (no trailing slash)     |
| `MAX_FILE_SIZE_MB` | No       | Max upload size in MB (default: 10)              |

---

## API Reference

All endpoints return JSON. Successful responses include `"success": true`.

### Base URL
```
http://localhost:5000/api
```

---

### AUTH  `/api/auth`

#### POST `/auth/register`
Create a new account.

**Body:**
```json
{
  "username": "digivault_user",
  "email":    "user@example.com",
  "password": "secret123"
}
```
**Response `201`:**
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "id":       "64abc123",
    "username": "digivault_user",
    "email":    "user@example.com",
    "coins":    10,
    "level":    "Bronze"
  }
}
```

---

#### POST `/auth/login`
Log in with email and password.

**Body:**
```json
{
  "email":    "user@example.com",
  "password": "secret123"
}
```
**Response `200`:** Same shape as register.

---

#### GET `/auth/me`  🔒
Get the authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "success": true,
  "user": { "id": "...", "username": "...", "coins": 12, ... }
}
```

---

#### PUT `/auth/update-profile`  🔒
Update username, city, or avatar.

**Body (all optional):**
```json
{ "username": "new_name", "city": "Baghdad", "avatar": "🎮" }
```

---

#### PUT `/auth/change-password`  🔒
Change password (requires current password).

**Body:**
```json
{ "currentPassword": "old123", "newPassword": "new456" }
```

---

### PRODUCTS  `/api/products`

#### GET `/products`
List products with filters. All params are optional.

**Query params:**

| Param      | Type   | Example                   |
|------------|--------|---------------------------|
| `category` | string | `game_account`            |
| `search`   | string | `PUBG`                    |
| `minPrice` | number | `50000`                   |
| `maxPrice` | number | `200000`                  |
| `tags`     | string | `PUBG,Ranked`             |
| `sort`     | string | `newest` / `price_asc` / `price_desc` / `popular` |
| `page`     | number | `1`                       |
| `limit`    | number | `12` (max 48)             |

**Response `200`:**
```json
{
  "success":  true,
  "count":    12,
  "total":    47,
  "page":     1,
  "pages":    4,
  "products": [ { ... }, ... ]
}
```

---

#### GET `/products/:id`
Get a single product. Increments `views` counter.

**Response `200`:**
```json
{
  "success": true,
  "product": {
    "_id":         "64def456",
    "title":       "PUBG Gold Account",
    "description": "...",
    "price":       120000,
    "currency":    "IQD",
    "category":    "game_account",
    "tags":        ["PUBG", "Gold"],
    "images": [
      {
        "filename":     "uuid.jpg",
        "originalName": "screenshot.jpg",
        "mimetype":     "image/jpeg",
        "size":         204800,
        "url":          "http://localhost:5000/uploads/images/uuid.jpg"
      }
    ],
    "video":     null,
    "views":     23,
    "promoted":  false,
    "status":    "active",
    "createdBy": { "username": "seller1", "level": "Gold" },
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
```

---

#### POST `/products`  🔒
Create a listing. Send as **multipart/form-data**.

**Form fields:**

| Field         | Required | Notes                                         |
|---------------|----------|-----------------------------------------------|
| `title`       | Yes      | 3–120 characters                              |
| `description` | Yes      | 10–2000 characters                            |
| `price`       | Yes      | Positive number                               |
| `currency`    | No       | `IQD` (default) or `USD`                     |
| `category`    | Yes      | `game_account` / `website_template` / `canva_template` |
| `tags`        | No       | Comma-separated or JSON array                 |
| `images`      | No       | Up to 6 image files (JPEG/PNG/WEBP/GIF)       |
| `video`       | No       | 1 video file (MP4/WEBM/MOV)                   |

**Response `201`:** `{ "success": true, "product": { ... } }`

---

#### PUT `/products/:id`  🔒
Update a listing (owner or admin only). Same fields as POST, all optional.

---

#### DELETE `/products/:id`  🔒
Delete a listing (owner or admin only). Also removes files from disk.

---

#### POST `/products/:id/promote`  🔒
Promote listing for 24h. Costs **5 DV Coins**.

**Response `200`:**
```json
{
  "success": true,
  "message": "Listing promoted for 24 hours!",
  "coinsRemaining": 5
}
```

---

#### GET `/products/user/:userId`
All active listings by a specific user.

---

#### DELETE `/products/:id/image/:filename`  🔒
Remove a single image from a listing.

---

### ADMIN  `/api/admin`  🔒👑

All admin routes require `Authorization: Bearer <adminToken>`.

| Method | Route                        | Description              |
|--------|------------------------------|--------------------------|
| GET    | `/admin/stats`               | Platform statistics      |
| GET    | `/admin/users`               | List all users           |
| PATCH  | `/admin/users/:id/ban`       | Suspend a user           |
| PATCH  | `/admin/users/:id/unban`     | Reinstate a user         |
| PATCH  | `/admin/users/:id/role`      | Set role (`user`/`admin`)|
| DELETE | `/admin/products/:id`        | Remove a listing         |

**To make a user admin** (one-time via mongo shell or your DB GUI):
```javascript
db.users.updateOne(
  { email: "youradmin@email.com" },
  { $set: { role: "admin" } }
)
```

---

## Frontend Integration

### Step 1 — Add the API client to every page

Place `api.js` (from this folder) alongside your HTML files and add before `</body>`:

```html
<!-- Put BEFORE dashboard.js so DVAPI is available -->
<script src="global.js"></script>
<script src="api.js"></script>
<script src="dashboard.js"></script>
```

### Step 2 — Update login.html

Replace the dummy login handler with:

```javascript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn      = e.target.querySelector('[type=submit]');

  try {
    btn.disabled    = true;
    btn.textContent = '⏳ Signing in…';

    const { user } = await DVAPI.Auth.login(email, password);
    showToast('✅ Welcome!', `Hello, ${user.username}!`);
    setTimeout(() => window.location.href = 'index.html', 800);

  } catch (err) {
    showToast('❌ Error', err.message);
    btn.disabled    = false;
    btn.textContent = 'Sign In';
  }
});
```

### Step 3 — Load real listings in games.html / websites.html / canva.html

Replace the hardcoded `<article>` cards. Add inside `<script>`:

```javascript
// games.html  → category = 'game_account'
// websites.html → 'website_template'
// canva.html  → 'canva_template'

const CATEGORY = 'game_account';

async function loadListings() {
  const grid = document.getElementById('listingsGrid');
  try {
    const { products } = await DVAPI.Products.getAll({
      category: CATEGORY,
      status:   'active',
      sort:     'newest',
    });

    grid.innerHTML = products.length
      ? products.map(renderCard).join('')
      : '<p style="padding:20px;color:var(--text-muted)">No listings yet — be the first to sell!</p>';

  } catch (err) {
    grid.innerHTML = `<p style="padding:20px;color:#f87171">Could not load listings.</p>`;
  }
}

function renderCard(p) {
  const imgHTML = p.images.length
    ? `<img src="${p.images[0].url}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">`
    : p.category === 'game_account' ? '🎮' : p.category === 'canva_template' ? '🎨' : '🌐';

  return `
    <article class="account-card reveal" data-price="${p.price}">
      <div class="ac-img">${imgHTML}<span class="ac-level">${p.tags[0] || ''}</span></div>
      <div class="ac-body">
        <h3 class="ac-name">${p.title}</h3>
        <div class="ac-meta">
          <span>👤 ${p.createdBy?.username || 'Seller'}</span>
          <span>👁 ${p.views}</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:5px;">
          <span class="ac-price">${p.price.toLocaleString()}</span>
          <span class="ac-price-label">IQD</span>
        </div>
      </div>
      <div class="ac-footer">
        <button class="btn btn-primary"
          style="width:100%;justify-content:center;padding:10px;"
          onclick="window.location.href='view.html?id=${p._id}'">
          View
        </button>
      </div>
    </article>`;
}

// Replace applyFilters to use API params:
async function applyFilters() {
  const grid  = document.getElementById('listingsGrid');
  const price = document.getElementById('priceFilter').value;
  const priceMap = {
    low:  { maxPrice: 49999 },
    mid:  { minPrice: 50000, maxPrice: 100000 },
    high: { minPrice: 100001 },
  };

  try {
    const params = { category: CATEGORY, status: 'active', ...priceMap[price] };
    const { products } = await DVAPI.Products.getAll(params);
    grid.innerHTML = products.map(renderCard).join('') || '<p style="padding:20px">No results.</p>';
  } catch (err) {
    showToast('❌', 'Filter failed');
  }
}

loadListings();
```

### Step 4 — Update view.html

Change `view.html` to read from the URL instead of `sessionStorage`:

```javascript
async function loadProduct() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { window.location.href = 'market.html'; return; }

  const { product: p } = await DVAPI.Products.getById(id);

  document.querySelector('.vw-title').textContent       = p.title;
  document.querySelector('.vw-price').textContent       = `${p.price.toLocaleString()} IQD`;
  document.querySelector('.vw-desc').textContent        = p.description;
  document.querySelector('.vw-seller').textContent      = p.createdBy?.username;

  // Render images
  if (p.images.length) {
    document.querySelector('.vw-img-main').innerHTML = `
      <img src="${p.images[0].url}" alt="${p.title}"
           style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`;
  }
}
loadProduct();
```

### Step 5 — Update sell.html

```javascript
document.getElementById('sellForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!DVAPI.Auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  const btn = e.target.querySelector('[type=submit]');
  btn.disabled    = true;
  btn.textContent = '⏳ Posting…';

  const fields = {
    title:       document.getElementById('accountTitle').value,
    description: document.getElementById('accountDesc').value,
    price:       document.getElementById('accountPrice').value,
    category:    document.getElementById('accountCategory').value,
    tags:        document.getElementById('accountTags').value,
  };

  const images = [...document.getElementById('accountImages').files];
  const video  = document.getElementById('accountVideo').files[0] || null;

  try {
    const { product } = await DVAPI.Products.create(fields, images, video);
    showToast('🎉 Posted!', 'Your listing is live.');
    setTimeout(() => window.location.href = `view.html?id=${product._id}`, 1000);
  } catch (err) {
    showToast('❌ Error', err.message);
    btn.disabled    = false;
    btn.textContent = 'Post Listing';
  }
});
```

---

## File Upload System

Uploaded files are stored in:
- `uploads/images/` — product images
- `uploads/videos/` — product videos

Served at:
```
http://localhost:5000/uploads/images/<filename>
http://localhost:5000/uploads/videos/<filename>
```

The full public URL is stored in the database automatically.

**Supported formats:**

| Type   | Extensions                   | Max size |
|--------|------------------------------|----------|
| Images | `.jpg`, `.png`, `.webp`, `.gif` | 10 MB  |
| Videos | `.mp4`, `.webm`, `.mov`      | 10 MB    |

Max **6 images** + **1 video** per listing.

---

## Authentication Flow

```
1. Client POSTs credentials to /api/auth/login
2. Server validates, returns JWT (expires in 7d)
3. Client stores token in localStorage as 'dv_token'
4. Every protected request includes header:
   Authorization: Bearer <token>
5. Server middleware (protect) verifies signature + expiry
6. If valid: req.user is populated, request continues
7. If invalid/expired: 401 response
```

---

## Postman Examples

### Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Create Product (multipart — use Postman form-data tab)
```
POST http://localhost:5000/api/products
Authorization: Bearer <YOUR_TOKEN>
Content-Type: multipart/form-data

title:       PUBG Conqueror Account
description: Season 12 Conqueror, 5000+ hours, fully verified
price:       150000
currency:    IQD
category:    game_account
tags:        PUBG,Conqueror,Ranked
images:      [file1.jpg, file2.jpg]
video:       [gameplay.mp4]
```

### Get All Products (filtered)
```
GET http://localhost:5000/api/products?category=game_account&minPrice=50000&sort=newest&page=1&limit=12
```

### Promote a Listing
```
POST http://localhost:5000/api/products/64abc123/promote
Authorization: Bearer <YOUR_TOKEN>
```

---

## Deployment

### Recommended: Railway / Render / Fly.io

1. Push code to GitHub (without `.env`)
2. Create new project on Railway/Render
3. Connect your GitHub repo
4. Set environment variables in the dashboard
5. Deploy — done

### Environment for production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=<64-char-random>
CLIENT_URL=https://yourdomain.com
MAX_FILE_SIZE_MB=10
```

> **File storage note:** Services like Railway reset the filesystem on restart. For production, use **Cloudinary** or **AWS S3** instead of local disk storage. The multer config can be swapped for `multer-storage-cloudinary` with minimal code changes.

---

## Security Notes

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT signed with HS256, expires in 7 days
- Rate limiting: 20 auth requests / 15 min, 300 API requests / 15 min
- Helmet sets secure HTTP headers
- CORS restricted to `CLIENT_URL`
- Input validation on all endpoints via express-validator
- File types whitelisted (rejects executables, SVG, etc.)
- Owner-only enforced on edit/delete at controller level
- Passwords never returned in API responses (`select: false`)
