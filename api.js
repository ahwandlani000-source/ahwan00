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
  async function withRetry(fn, retries, delay) {
    retries = retries || 2;
    delay   = delay   || 800;
    for (var attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (err) {
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

      const res  = await fetch(`${BASE_URL}${endpoint}`, config);
      const json = await res.json();

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

    /** Fetch the current user's profile (validates token). */
    getMe: () => get('/auth/me'),

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
  ═══════════════════════════════════════════════════════════════════════ */
  const Products = {
    /**
     * List products with optional filters.
     * @param {Object} params
     * @param {string}  [params.category]
     * @param {string}  [params.search]
     * @param {number}  [params.minPrice]
     * @param {number}  [params.maxPrice]
     * @param {string}  [params.tags]
     * @param {string}  [params.sort]
     * @param {number}  [params.page]
     * @param {number}  [params.limit]
     * @returns {Promise<{products, total}>}
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

    /** Get a single product by ID. */
    getById: (id) => get('/product/' + id),

    /** All listings by a specific user. */
    async getByUser(userId, params) {
      params = params || {};
      const qs = new URLSearchParams(params).toString();
      const data = await get('/products/' + userId + (qs ? '?' + qs : ''));
      const arr  = Array.isArray(data) ? data : [];
      return { products: arr, total: arr.length };
    },

    /**
     * Create a new listing (JSON body).
     *
     * images parameter: pass an array of URL strings.
     * ALL images are sent as-is — no placeholders are ever injected.
     *
     * @param {Object}   fields  — { title, description, price, currency, category, tags, userId, ... }
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

    /** Delete a listing (must be owner or admin). */
    delete: (id) => del('/products/' + id),

    /** Promote a listing (costs 5 DV Coins). */
    promote: (id) => post('/products/' + id + '/promote'),

    /** Remove a single image from a listing. */
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