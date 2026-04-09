/* ================================================================
   global.js — DIGIVAULT Global User System
   ----------------------------------------------------------------
   Include on EVERY page BEFORE dashboard.js:
     <script src="global.js"></script>

   Public API (window.TW):
     TW.getUser()              → user object | null
     TW.setUser(data)          → save full user object
     TW.updateUser(fields)     → partial update
     TW.updateCoins(delta)     → +/- coins, re-renders badge
     TW.logout()               → clear + go to login.html
     TW.requireAuth()          → redirect if not logged in
     TW.renderNavbar()         → repaint coin badge
     TW.isLoggedIn()           → boolean
     TW.openBuyCoins()         → open global buy-coins modal
================================================================ */

(function (global) {
  'use strict';

  var STORAGE_KEY  = 'tw_user';
  var THEME_KEY    = 'tw_theme';
  var LOGIN_PAGE   = 'login.html';
  var ACCOUNT_PAGE = 'account.html';

  var DEFAULTS = {
    name: 'User', email: '', city: '', coins: 10,
    level: 'Bronze', avatar: '👤', badges: [], joinedAt: null,
  };

  /* Migrate any old sessionStorage data to localStorage (one-time) */
  try {
    var _old = sessionStorage.getItem(STORAGE_KEY);
    if (_old && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, _old);
    }
    sessionStorage.removeItem(STORAGE_KEY);
  } catch(e) {}

  /* Apply saved theme immediately */
  if (localStorage.getItem(THEME_KEY) === 'light') {
    document.documentElement.classList.add('light-mode');
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('light-mode');
    });
  }

  /* ================================================================
     CORE STORAGE — localStorage ONLY
  ================================================================ */

  function getUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch (e) { return null; }
  }

  function setUser(data) {
    if (!data || typeof data !== 'object') return;
    var merged = {};
    for (var k in DEFAULTS) merged[k] = DEFAULTS[k];
    for (var k in data)     merged[k] = data[k];
    merged.name = merged.name || (merged.email || '').split('@')[0] || 'User';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    renderNavbar();
  }

  function updateUser(fields) {
    var user = getUser();
    if (!user) return null;
    for (var k in fields) user[k] = fields[k];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    renderNavbar();
    return user;
  }

  function updateCoins(delta) {
    var user = getUser();
    if (!user) return null;
    user.coins = Math.max(0, (user.coins || 0) + Number(delta));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    renderNavbar();
    return user.coins;
  }

  function isLoggedIn() { return getUser() !== null; }

  function requireAuth() {
    if (!isLoggedIn()) window.location.href = LOGIN_PAGE;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.replace(LOGIN_PAGE);
  }

  /* ================================================================
     BUY-COINS MODAL
  ================================================================ */

  function _buildModal() {
    if (document.getElementById('tw-buy-modal-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'tw-buy-modal-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:99990;display:none;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';

    overlay.innerHTML =
      '<div id="tw-buy-modal" style="background:var(--brown-900,#0e1f38);border:1px solid rgba(14,165,233,.28);border-radius:20px;padding:36px 30px;max-width:460px;width:100%;position:relative;animation:twModalIn .28s cubic-bezier(.4,0,.2,1);font-family:DM Sans,sans-serif;">' +
        '<button onclick="TW.closeBuyCoins()" style="position:absolute;top:14px;right:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.88rem;color:rgba(255,255,255,.55);">✕</button>' +
        '<div style="text-align:center;margin-bottom:22px;">' +
          '<div style="font-size:2.6rem;margin-bottom:8px;">🪙</div>' +
          '<h2 style="font-family:Bebas Neue,sans-serif;font-size:1.5rem;letter-spacing:.06em;color:#0ea5e9;margin-bottom:5px;">Buy DV Coins</h2>' +
          '<p style="font-size:.8rem;color:rgba(255,255,255,.45);">Boost listings and level up faster</p>' +
        '</div>' +
        '<div id="tw-pkg-list" style="display:flex;flex-direction:column;gap:9px;margin-bottom:18px;">' +
          _pkgRow('10', '2× listing promotions', '5,000') +
          _pkgRow('50', '10× promotions', '20,000', true) +
          _pkgRow('150', '30× promotions + level boost', '50,000') +
        '</div>' +
        '<button onclick="TW._completePurchase()" style="width:100%;padding:14px;background:linear-gradient(135deg,#0ea5e9,#0284c7);border:none;border-radius:11px;color:#fff;font-size:.95rem;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(14,165,233,.32);">Complete Purchase →</button>' +
        '<p style="text-align:center;font-size:.7rem;color:rgba(255,255,255,.3);margin-top:9px;">🔒 IQD payments only</p>' +
      '</div>' +
      '<style>' +
        '@keyframes twModalIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}' +
        'body.light-mode #tw-buy-modal{background:#f0f7ff!important;border-color:rgba(2,132,199,.22)!important;}' +
        'body.light-mode #tw-buy-modal h2{color:#0284c7!important;}' +
        'body.light-mode .tw-pkg{background:rgba(14,165,233,.05)!important;border-color:rgba(14,165,233,.18)!important;}' +
        'body.light-mode .tw-pkg:hover,.tw-pkg.sel{background:rgba(14,165,233,.12)!important;border-color:#0284c7!important;}' +
        'body.light-mode .tw-pkg-name{color:#0c1a2e!important;}' +
        'body.light-mode .tw-pkg-sub{color:#475569!important;}' +
      '</style>';

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) TW.closeBuyCoins();
    });

    document.body.appendChild(overlay);
  }

  function _pkgRow(coins, sub, price, best) {
    var bestTag = best ? '<span style="background:rgba(34,197,94,.18);border:1px solid rgba(34,197,94,.32);color:#22c55e;border-radius:100px;padding:2px 8px;font-size:.62rem;font-weight:800;margin-left:6px;">Best Value</span>' : '';
    var border = best ? '1.5px solid rgba(14,165,233,.38)' : '1.5px solid rgba(255,255,255,.08)';
    var bg = best ? 'rgba(14,165,233,.07)' : 'rgba(255,255,255,.03)';
    return '<div class="tw-pkg" onclick="TW._selectPkg(this)" style="display:flex;align-items:center;justify-content:space-between;background:' + bg + ';border:' + border + ';border-radius:10px;padding:13px 15px;cursor:pointer;transition:background .2s,border-color .2s;">' +
      '<div><div class="tw-pkg-name" style="font-weight:600;font-size:.88rem;color:rgba(255,255,255,.9);">🪙 ' + coins + ' DV Coins' + bestTag + '</div>' +
      '<div class="tw-pkg-sub" style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:2px;">' + sub + '</div></div>' +
      '<div style="font-family:Bebas Neue,sans-serif;font-size:1.05rem;color:#0ea5e9;white-space:nowrap;">' + price + ' IQD</div>' +
      '</div>';
  }

  function openBuyCoins() {
    _buildModal();
    var overlay = document.getElementById('tw-buy-modal-overlay');
    if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
  }

  function closeBuyCoins() {
    var overlay = document.getElementById('tw-buy-modal-overlay');
    if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
  }

  function _selectPkg(el) {
    var list = document.getElementById('tw-pkg-list');
    if (list) list.querySelectorAll('.tw-pkg').forEach(function (p) {
      p.classList.remove('sel');
      p.style.border = '1.5px solid rgba(255,255,255,.08)';
    });
    el.classList.add('sel');
    el.style.border = '1.5px solid #0ea5e9';
  }

  function _completePurchase() {
    closeBuyCoins();
    if (typeof showToast === 'function') {
      showToast('🪙 Coins Added!', 'DV Coins added to your balance.');
    } else {
      _toast('🪙 Coins Added!', 'DV Coins added to your balance.');
    }
  }

  function _toast(title, msg) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:26px;right:22px;background:linear-gradient(135deg,#0e1f38,#152840);border:1px solid rgba(14,165,233,.4);border-radius:12px;padding:13px 18px;color:#e0f2fe;font-size:.83rem;z-index:99999;box-shadow:0 8px 28px rgba(0,0,0,.5);max-width:290px;font-family:DM Sans,sans-serif;';
    el.innerHTML = '<strong style="color:#38bdf8;display:block;margin-bottom:3px;">' + title + '</strong>' + msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 3400);
  }

  /* ================================================================
     NAVBAR RENDERER — auto-injects coin pill if missing
  ================================================================ */

  function _injectCoinPill() {
    if (document.getElementById('navCoinPill')) return;
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    /* Find the rightmost flex div in the navbar */
    var rightDiv = null;
    var divs = navbar.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      var s = divs[i].style.cssText || '';
      if (s.indexOf('display:flex') !== -1 || s.indexOf('display: flex') !== -1) {
        rightDiv = divs[i];
      }
    }
    if (!rightDiv) return;

    var pill = document.createElement('span');
    pill.id = 'navCoinPill';
    pill.onclick = function() { if (typeof TW !== 'undefined') TW.openBuyCoins(); };
    pill.title = 'DV Coins — click to buy more';
    pill.style.cssText = 'display:none;align-items:center;gap:5px;background:linear-gradient(135deg,rgba(245,158,11,.14),rgba(200,134,10,.07));border:1px solid rgba(245,158,11,.28);border-radius:100px;padding:5px 12px;font-size:.78rem;font-weight:700;color:#f59e0b;cursor:pointer;white-space:nowrap;transition:all .3s;height:36px;';
    pill.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;">' +
        '<circle cx="8" cy="8" r="7.5" fill="url(#dvg2)" stroke="rgba(200,134,10,0.4)" stroke-width="0.5"/>' +
        '<circle cx="8" cy="8" r="5.5" fill="none" stroke="rgba(255,220,80,0.35)" stroke-width="0.8"/>' +
        '<text x="8" y="11.5" text-anchor="middle" font-size="6" font-weight="900" font-family="Arial,sans-serif" fill="#7b3f00" letter-spacing="-0.3">DV</text>' +
        '<defs><radialGradient id="dvg2" cx="35%" cy="35%" r="65%">' +
          '<stop offset="0%" stop-color="#f5d76e"/><stop offset="60%" stop-color="#c8860a"/><stop offset="100%" stop-color="#7b4f00"/>' +
        '</radialGradient></defs>' +
      '</svg>' +
      ' <span id="navCoinCount">0</span>';

    rightDiv.insertBefore(pill, rightDiv.firstChild);
  }

  function renderNavbar() {
    var user = getUser();
    _injectCoinPill();

    var pill  = document.getElementById('navCoinPill');
    var count = document.getElementById('navCoinCount');

    if (pill) {
      if (user) {
        pill.style.display = 'inline-flex';
        if (count) count.textContent = user.coins || 0;
      } else {
        pill.style.display = 'none';
      }
    }

    _updateAvatarBtn(user);
  }

  function _updateAvatarBtn(user) {
    var btn = document.querySelector('[title="My Account"], .tw-profile-btn');
    if (!btn) return;
    if (user) {
      btn.title = (user.name || 'User') + ' — ' + (user.coins || 0) + ' DV Coins';
    } else {
      btn.title = 'My Account';
      btn.textContent = '👤';
    }
  }

  /* ================================================================
     AUTO-INIT
  ================================================================ */

  function init() {
    renderNavbar();
    _buildModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ================================================================
     PUBLIC API
  ================================================================ */
  global.TW = {
    getUser:           getUser,
    setUser:           setUser,
    updateUser:        updateUser,
    updateCoins:       updateCoins,
    isLoggedIn:        isLoggedIn,
    requireAuth:       requireAuth,
    logout:            logout,
    renderNavbar:      renderNavbar,
    openBuyCoins:      openBuyCoins,
    closeBuyCoins:     closeBuyCoins,
    _selectPkg:        _selectPkg,
    _completePurchase: _completePurchase,

    getCoins: function () { var u = getUser(); return u ? (u.coins || 0) : 0; },
    getName:  function () { var u = getUser(); return u ? (u.name  || 'User') : null; },
    getLevel: function () { var u = getUser(); return u ? (u.level || 'Bronze') : null; },
  };

})(window);