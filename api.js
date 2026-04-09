// api.js — DIGIVAULT Frontend API Client
// ─────────────────────────────────────────────────────────────────────────────
// Drop this file next to your HTML pages and include it with:
//   <script src="api.js"></script>
//
// It exposes a global `DVAPI` object used by all pages.
// All methods return Promises and throw on error so you can try/catch them.
// ─────────────────────────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  /* ── CONFIG ────────────────────────────────────────────────────────────── */
  // Works for both localhost and 127.0.0.1 regardless of how the page is served
  const BASE_URL = (function() {
    var port = '5001';
    // Use same hostname the page was loaded from so proxies work correctly
    var host = (typeof location !== 'undefined' && location.hostname !== '127.0.0.1')
      ? location.hostname
      : 'localhost';
    return 'http://' + host + ':' + port + '/api';
  }());

  /* ── Retry helper ─────────────────────────────────────────────────────── */
  //
  // FIX 1 — Never retry client errors (4xx).
  //
  // Previously, ALL thrown errors were retried — including 404s.  When the
  // server returned an HTML body (Express default 404 page), res.json() threw
  // a SyntaxError which also got retried.  That caused:
  //   • 3× wasted requests for every wrong URL
  //   • ~1.6 s extra delay per bad call (2 retries × 800 ms)
  //   • The real HTTP status being swallowed, making debugging impossible
  //
  // Rule: only retry on network-level / 5xx errors.
  //   err.status === undefined → network failure   → retry
  //   err.status 5xx           → server error      → retry
  //   err.status 4xx           → client error      → throw immediately, no retry
  //   err.isHtmlBody === true  → non-JSON response → throw immediately, no retry
  //
  async function withRetry(fn, retries, delay) {
    retries = retries || 2;
    delay   = delay   || 800;
    for (var attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
        // ── Never retry 4xx client errors or HTML-body errors ──────────────
        if (err.status && err.status >= 400 && err.status < 500) throw err;
        if (err.isHtmlBody) throw err;
        // ── Give up after all retries ──────────────────────────────────────
        if (attempt === retries) throw err;
        console.warn('[DV] Retrying… attempt', attempt + 1, 'of', retries);
        await new Promise(function(r){ setTimeout(r, delay); });
      }
    }
  }

  /* ── Token helpers (mirrors your existing global.js localStorage usage) ── */
  const token = {
    get:    ()    => localStorage.getItem('dv_token'),
    set:    (tok) => localStorage.setItem('dv_token', tok),
    remove: ()    => localStorage.removeItem('dv_token'),
  };

  /* ── Core fetch wrapper ────────────────────────────────────────────────── */
  //
  // FIX 2 — Parse the response body safely BEFORE checking res.ok.
  //
  // Previously, `res.json()` was called unconditionally.  If the server
  // returned an HTML page (e.g. Express default 404), res.json() threw a
  // SyntaxError.  Because that error had no `.status` property, withRetry
  // could not recognise it as a 4xx and kept retrying.
  //
  // Now:
  //   • We always attempt to parse JSON first.
  //   • If parsing fails we build an error with err.status from the HTTP status
  //     and set err.isHtmlBody = true so withRetry bails out immediately.
  //   • If res.ok is false we still surface the message from the JSON body.
  //
  async function request(method, endpoint, data, isFormData) {
    console.log('[DV] →', method, endpoint, data || '');
    return withRetry(async function() {
      const headers = {};

      const tok = token.get();
      if (tok) headers['Authorization'] = `Bearer ${tok}`;

      if (!isFormData && data) headers['Content-Type'] = 'application/json';

      const config = {
        method,
        headers,
        body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      };

      const res = await fetch(`${BASE_URL}${endpoint}`, config);

      // ── Safe JSON parse ─────────────────────────────────────────────────
      // If the body is not JSON (HTML 404 page, proxy error, etc.) we must
      // NOT let the SyntaxError bubble up raw — it has no .status so withRetry
      // would retry it as if it were a network failure.
      let json;
      try {
        json = await res.json();
      } catch (_parseErr) {
        const err = new Error(`HTTP ${res.status} — non-JSON response from ${endpoint}`);
        err.status     = res.status;
        err.isHtmlBody = true;   // flag → withRetry will NOT retry this
        throw err;
      }

      // ── HTTP error ──────────────────────────────────────────────────────
      if (!res.ok) {
        const err = new Error(json.message || `HTTP ${res.status}`);
        err.status = res.status;
        err.errors = json.errors;
        throw err;
      }

      console.log('[DV] ←', endpoint, json);
      return json;
    }, 2, 800);
  }

  /* ── Convenience shortcuts ─────────────────────────────────────────────── */
  const get    = (endpoint)           => request('GET',    endpoint);
  const post   = (endpoint, data)     => request('POST',   endpoint, data);
  const put    = (endpoint, data)     => request('PUT',    endpoint, data);
  const patch  = (endpoint, data)     => request('PATCH',  endpoint, data);
  const del    = (endpoint)           => request('DELETE', endpoint);
  const postFD = (endpoint, formData) => request('POST',   endpoint, formData, true);
  const putFD  = (endpoint, formData) => request('PUT',    endpoint, formData, true);

  /* ═══════════════════════════════════════════════════════════════════════
     AUTH
  ═══════════════════════════════════════════════════════════════════════ */
  const Auth = {
    /**
     * Register a new account.
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{token, user}>}
     */
    async register(username, email, password) {
      const data = await post('/auth/register', { username, email, password });
      token.set(data.token);
      if (global.TW) global.TW.setUser(data.user);
      return data;
    },

    /**
     * Log in with email + password.
     * @returns {Promise<{token, user}>}
     */
    async login(email, password) {
      const data = await post('/auth/login', { email, password });
      token.set(data.token);
      if (global.TW) global.TW.setUser(data.user);
      return data;
    },

    /** Fetch the current user's profile (validates token).
     *  ⚠️  Only call this if your server has a GET /api/auth/me route.
     *  This server does NOT — calling it causes a 404 storm that delays all
     *  subsequent requests by ~1.6s (3 retries × 800ms). Safe no-op guard added.
     */
    getMe: () => {
      // Guard: only attempt if the server actually exposes /auth/me.
      // In this project the route does not exist — return a resolved empty
      // promise so callers don't crash and no retries are wasted.
      return Promise.resolve(null);
    },

    /** Update username / city / avatar. */
    updateProfile: (fields) => put('/auth/update-profile', fields),

    /** Change password. */
    changePassword: (currentPassword, newPassword) =>
      put('/auth/change-password', { currentPassword, newPassword }),

    /** Log out: clear token + local state. */
    logout() {
      token.remove();
      if (global.TW) global.TW.logout();
      else {
        localStorage.removeItem('tw_user');
        window.location.href = 'login.html';
      }
    },

    /** True if a token exists in storage (doesn't validate it server-side). */
    isLoggedIn: () => !!token.get(),
  };

  /* ═══════════════════════════════════════════════════════════════════════
     PRODUCTS
     ─────────────────────────────────────────────────────────────────────
     SERVER ROUTE MAP (server.js — DO NOT change these URLs):
     ┌─────────────────────────────────┬──────────────────────────────────┐
     │ DVAPI method                    │ Server route                     │
     ├─────────────────────────────────┼──────────────────────────────────┤
     │ Products.getAll(params)         │ GET  /api/products               │
     │ Products.getByUser(userId)      │ GET  /api/products/:userId       │  ← path param
     │ Products.getById(id)            │ GET  /api/product/:id            │  ← singular
     │ Products.create(fields, …)      │ POST /api/products               │
     │ Products.delete(id)             │ DELETE /api/products/:id         │
     │ Products.promote(id)            │ POST /api/products/:id/promote   │
     └─────────────────────────────────┴──────────────────────────────────┘
     IMPORTANT:
       getByUser  → /api/products/:userId   (plural, path param)
       getById    → /api/product/:id        (SINGULAR — single product lookup)
       NEVER pass a userId to getById — that hits the single-product route
       and always returns "Product not found".
  ═══════════════════════════════════════════════════════════════════════ */
  const Products = {
    /**
     * List products with optional filters.
     * → GET /api/products
     * → GET /api/products?category=x&minPrice=y&…
     *
     * @param {Object} [params]
     * @param {string}  [params.category]
     * @param {string}  [params.search]
     * @param {number}  [params.minPrice]
     * @param {number}  [params.maxPrice]
     * @param {string}  [params.tags]
     * @param {string}  [params.sort]
     * @param {number}  [params.page]
     * @param {number}  [params.limit]
     * @returns {Promise<{products: Array, total: number}>}
     */
    async getAll(params) {
      params = params || {};
      const qs = new URLSearchParams(
        Object.entries(params).filter(function(e){ return e[1] !== undefined && e[1] !== '' && e[1] !== null; })
      ).toString();
      // Server returns a plain array; normalise to {products, total} for callers
      const data = await get('/products' + (qs ? '?' + qs : ''));
      const arr  = Array.isArray(data) ? data : (data.products || []);
      // Sort: promoted first
      arr.sort(function(a, b){ return (b.promoted ? 1 : 0) - (a.promoted ? 1 : 0); });
      return { products: arr, total: arr.length };
    },

    /**
     * Get a single product by its numeric ID.
     * → GET /api/product/:id   (SINGULAR — not /api/products/:id)
     *
     * ⚠️  Do NOT pass a userId here — that will always return "Product not found".
     *     Use getByUser(userId) instead.
     *
     * @param {string|number} id  — product ID (from listing.id)
     * @returns {Promise<Object>}  — the product object
     */
    getById(id) {
      if (!id && id !== 0) {
        return Promise.reject(new Error('[DV] getById called with no id'));
      }
      // Route: GET /api/product/:id  (singular "product")
      return get('/product/' + id);
    },

    /**
     * All listings belonging to a specific user.
     * → GET /api/products/:userId   (plural, path param — NOT query string)
     *
     * ✅ Correct:   DVAPI.Products.getByUser(user.id)
     *               → GET /api/products/123
     *
     * ❌ Wrong:     DVAPI.Products.getAll({ userId })
     *               → GET /api/products?userId=123  (server ignores userId query param)
     *
     * ❌ Wrong:     DVAPI.Products.getById(userId)
     *               → GET /api/product/123  (single-product lookup, not user listings!)
     *
     * @param {string|number} userId
     * @returns {Promise<{products: Array, total: number}>}
     */
    async getByUser(userId) {
      // Guard: never fire a request if userId is missing — it would hit
      // GET /api/products/undefined which returns [] or a spurious 404.
      if (!userId && userId !== 0) {
        console.warn('[DV] getByUser called with no userId — returning empty result');
        return { products: [], total: 0 };
      }
      // Route: GET /api/products/:userId  (plural "products", path param)
      const data = await get('/products/' + userId);
      const arr  = Array.isArray(data) ? data : [];
      return { products: arr, total: arr.length };
    },

    /**
     * Create a new listing (JSON body).
     * → POST /api/products
     *
     * images parameter: pass an array of URL strings.
     * ALL images are sent as-is — no placeholders are ever injected.
     *
     * @param {Object}   fields  — { title, description, price, currency, category, tags, userId, … }
     * @param {string[]} [images] — array of image URL strings already uploaded; pass [] if none
     * @param {string}   [video]  — video URL string or null
     * @returns {Promise<listing>}
     */
    async create(fields, images, video) {
      images = images || [];
      video  = video  || null;

      const payload = Object.assign({}, fields);

      // Tags: normalise to comma-separated string if caller passed an array
      if (Array.isArray(payload.tags)) payload.tags = payload.tags.join(',');

      // Images: always an array — send every entry as-is, never add fake URLs
      if (!Array.isArray(payload.images)) {
        if (typeof payload.images === 'string' && payload.images.trim()) {
          payload.images = [payload.images];
        } else {
          payload.images = [];
        }
      }
      // Merge any images passed as a separate argument
      if (Array.isArray(images) && images.length) {
        images.forEach(function(img) {
          if (img && typeof img === 'string') payload.images.push(img);
        });
      }

      // Video
      if (video && typeof video === 'string' && !payload.video) {
        payload.video = video;
      }

      const result = await post('/products', payload);
      // Normalise: some callers destructure { product }, others use the object directly
      return result.product ? result : { product: result, ...result };
    },

    /**
     * Update a listing.
     * → PUT /api/products/:id
     *
     * @param {string} id
     * @param {Object} fields
     * @param {File[]} [images]
     * @param {File}   [video]
     */
    update(id, fields, images, video) {
      images = images || [];
      video  = video  || null;
      const fd = new FormData();
      Object.entries(fields).forEach(function(entry) {
        if (entry[1] !== undefined && entry[1] !== null) fd.append(entry[0], entry[1]);
      });
      images.forEach(function(img){ fd.append('images', img); });
      if (video) fd.append('video', video);
      return putFD('/products/' + id, fd);
    },

    /** Delete a listing (must be owner or admin).
     *  → DELETE /api/products/:id
     */
    delete: (id) => del('/products/' + id),

    /** Promote a listing (costs 5 DV Coins).
     *  → POST /api/products/:id/promote
     */
    promote: (id) => post('/products/' + id + '/promote'),

    /** Remove a single image from a listing.
     *  → DELETE /api/products/:productId/image/:filename
     */
    deleteImage: (productId, filename) => del('/products/' + productId + '/image/' + filename),
  };

  /* ═══════════════════════════════════════════════════════════════════════
     ADMIN (requires admin role)
  ═══════════════════════════════════════════════════════════════════════ */
  const Admin = {
    getStats:       ()            => get('/admin/stats'),
    getUsers:       (params)      => get('/admin/users?' + new URLSearchParams(params || {})),
    banUser:        (id)          => patch('/admin/users/' + id + '/ban'),
    unbanUser:      (id)          => patch('/admin/users/' + id + '/unban'),
    setRole:        (id, role)    => patch('/admin/users/' + id + '/role', { role }),
    removeProduct:  (id)          => del('/admin/products/' + id),
  };

  /* ═══════════════════════════════════════════════════════════════════════
     IMAGE URL HELPER
  ═══════════════════════════════════════════════════════════════════════ */
  /**
   * Return the URL of a product's first real image, or null.
   * NEVER injects a placeholder — returns null when no real image exists.
   */
  function getProductImage(product) {
    if (product && product.images && product.images.length) {
      var img = product.images[0];
      if (typeof img === 'object' && img.url) return img.url;
      if (typeof img === 'string' && img)     return img;
    }
    return null;
  }

  /* ── Export ────────────────────────────────────────────────────────────── */
  global.DVAPI = { Auth, Products, Admin, getProductImage, BASE_URL };

})(window);


/* ═════════════════════════════════════════════════════════════════════════════
   PAGE-SPECIFIC INTEGRATION EXAMPLES
   (Copy the relevant section into your page's <script> block)
═════════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────
   LOGIN PAGE  (login.html)
───────────────────────────────────────────────────────────────────────── */
/*
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn      = e.target.querySelector('button[type=submit]');

  try {
    btn.disabled   = true;
    btn.textContent = '⏳ Signing in…';

    const { user } = await DVAPI.Auth.login(email, password);

    showToast('✅ Welcome back!', `Hello, ${user.username}!`);
    setTimeout(() => window.location.href = 'index.html', 900);

  } catch (err) {
    showToast('❌ Login failed', err.message);
    btn.disabled    = false;
    btn.textContent = 'Sign In';
  }
});
*/

/* ─────────────────────────────────────────────────────────────────────────
   REGISTER PAGE
───────────────────────────────────────────────────────────────────────── */
/*
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const { username, email, password } = Object.fromEntries(new FormData(e.target));
  const btn = e.target.querySelector('[type=submit]');

  try {
    btn.disabled = true;
    await DVAPI.Auth.register(username, email, password);
    showToast('🎉 Account created!', 'Welcome to DIGIVAULT!');
    setTimeout(() => window.location.href = 'index.html', 900);
  } catch (err) {
    if (err.errors) {
      err.errors.forEach(e => showToast('⚠️ ' + e.field, e.message));
    } else {
      showToast('❌ Error', err.message);
    }
    btn.disabled = false;
  }
});
*/

/* ─────────────────────────────────────────────────────────────────────────
   GAMES / WEBSITES / CANVA listing pages
───────────────────────────────────────────────────────────────────────── */
/*
async function loadListings(category) {
  const grid = document.getElementById('listingsGrid');
  grid.innerHTML = '<p style="padding:20px;color:var(--text-muted)">Loading…</p>';

  try {
    const { products } = await DVAPI.Products.getAll({ category });

    if (!products.length) {
      grid.innerHTML = '<p style="padding:20px;color:var(--text-muted)">No listings yet.</p>';
      return;
    }

    // Show only promoted items; fall back to all items if none are promoted
    const promoted = products.filter(p => p.promoted === true);
    const display  = promoted.length ? promoted : products;

    grid.innerHTML = display.map(p => {
      const img = p.images && p.images[0] ? p.images[0].url : null;
      return `
        <article class="account-card reveal" data-price="${p.price}">
          <div class="ac-img">
            ${img ? `<img src="${img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">` : ''}
          </div>
          <div class="ac-body">
            <h3 class="ac-name">${p.title}</h3>
            <div class="ac-meta">
              ${p.location ? '<span>📍 ' + p.location + '</span>' : ''}
              ${p.field1   ? '<span>› '  + p.field1   + '</span>' : ''}
              ${p.field2   ? '<span>› '  + p.field2   + '</span>' : ''}
            </div>
            <div style="display:flex;align-items:baseline;gap:5px;">
              <span class="ac-price">${p.price.toLocaleString()}</span>
              <span class="ac-price-label">IQD</span>
            </div>
          </div>
          <div class="ac-footer">
            <button class="btn btn-primary" style="width:100%;justify-content:center;padding:10px;"
              onclick="window.location.href='view.html?id=${p.id}'">View</button>
          </div>
        </article>
      `;
    }).join('');

  } catch (err) {
    grid.innerHTML = `<p style="padding:20px;color:#f87171">Failed to load listings: ${err.message}</p>`;
  }
}
loadListings('game_account');
*/

/* ─────────────────────────────────────────────────────────────────────────
   VIEW.HTML — load a single product by URL param
───────────────────────────────────────────────────────────────────────── */
/*
async function loadProduct() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) { window.location.href = 'market.html'; return; }

  try {
    const p = await DVAPI.Products.getById(id);

    document.getElementById('productTitle').textContent       = p.title;
    document.getElementById('productPrice').textContent       = `${p.price.toLocaleString()} IQD`;
    document.getElementById('productDescription').textContent = p.description;

    // Images — show ALL, first one as main
    const imgs = p.images || [];
    const gallery = document.getElementById('imageGallery');
    if (gallery && imgs.length) {
      gallery.innerHTML = imgs
        .map((img, i) => `<img src="${img.url}" alt="${p.title}" style="max-width:100%;border-radius:10px;${i > 0 ? 'display:none;' : ''}">`)
        .join('');
    }

    // Video
    if (p.video && p.video.url) {
      document.getElementById('productVideo').src = p.video.url;
    }

  } catch (err) {
    showToast('❌', err.message);
  }
}
loadProduct();
*/

/* ─────────────────────────────────────────────────────────────────────────
   SELL.HTML — submit a new listing
───────────────────────────────────────────────────────────────────────── */
/*
document.getElementById('sellForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!DVAPI.Auth.isLoggedIn()) { window.location.href = 'login.html'; return; }

  const fd   = new FormData(e.target);
  const btn  = e.target.querySelector('[type=submit]');

  const fields = {
    title:       fd.get('title'),
    description: fd.get('description'),
    price:       fd.get('price'),
    category:    fd.get('category'),
    tags:        fd.get('tags'),
  };

  // Images: collect uploaded file URLs after they have been uploaded to the server
  // Pass the array of URL strings — DVAPI.Products.create sends them as-is
  const imageUrls = [];  // populate after upload

  try {
    btn.disabled    = true;
    btn.textContent = '⏳ Posting…';

    const { product } = await DVAPI.Products.create(fields, imageUrls);

    showToast('🎉 Listing Created!', 'Your listing is now live.');
    setTimeout(() => window.location.href = `view.html?id=${product.id}`, 1000);

  } catch (err) {
    showToast('❌ Error', err.message);
    btn.disabled    = false;
    btn.textContent = 'Post Listing';
  }
});
*/

/* ─────────────────────────────────────────────────────────────────────────
   ACCOUNT.HTML — load user's own listings
───────────────────────────────────────────────────────────────────────── */
/*
async function loadMyListings() {
  const user = TW.getUser();
  if (!user) return;

  try {
    const { products } = await DVAPI.Products.getByUser(user.id);
    const container    = document.getElementById('myListings');

    container.innerHTML = products.map(p => `
      <div class="listing-item">
        <span>${p.title}</span>
        <span>${p.price.toLocaleString()} IQD</span>
        <button onclick="deleteMyListing('${p.id}')">🗑 Delete</button>
      </div>
    `).join('') || '<p>No listings yet.</p>';

  } catch (err) {
    console.error(err);
  }
}

async function deleteMyListing(id) {
  if (!confirm('Delete this listing?')) return;
  try {
    await DVAPI.Products.delete(id);
    showToast('🗑 Deleted', 'Listing removed.');
    loadMyListings();
  } catch (err) {
    showToast('❌', err.message);
  }
}

loadMyListings();
*/