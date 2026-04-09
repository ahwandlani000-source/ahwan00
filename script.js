/* ============================================================
   PUBG ACCOUNT MARKET — script.js
   Handles: navbar scroll, mobile menu, scroll reveal,
            file upload previews, form validation, toast
   ============================================================ */

'use strict';

/* ---------- Navbar scroll effect ---------- */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- Mobile hamburger menu ---------- */
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---------- Active nav link based on page ---------- */
(function setActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(page)) {
      link.classList.add('active');
    }
  });
})();

/* ---------- Scroll Reveal ---------- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ---------- Contact Form ---------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        valid = false;
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Sending...';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      btn.innerHTML = '✅ Message Sent!';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2500);
    }, 1200);
  });
})();

/* ---------- Sell Form: File Upload Previews ---------- */
(function initFileUpload() {
  // Images
  const imgInput = document.getElementById('accountImages');
  const imgPreviews = document.getElementById('imagePreviews');

  if (imgInput && imgPreviews) {
    imgInput.addEventListener('change', () => {
      imgPreviews.innerHTML = '';
      Array.from(imgInput.files).forEach((file, i) => {
        const item = createPreviewItem(file.name, () => {
          // Remove file visually (can't truly remove from FileList without DataTransfer)
          item.remove();
        });
        imgPreviews.appendChild(item);
      });
    });
  }

  // Video
  const vidInput = document.getElementById('accountVideo');
  const vidPreviews = document.getElementById('videoPreviews');

  if (vidInput && vidPreviews) {
    vidInput.addEventListener('change', () => {
      vidPreviews.innerHTML = '';
      if (vidInput.files[0]) {
        const item = createPreviewItem('🎥 ' + vidInput.files[0].name, () => {
          vidInput.value = '';
          vidPreviews.innerHTML = '';
        });
        vidPreviews.appendChild(item);
      }
    });
  }

  function createPreviewItem(name, onRemove) {
    const el = document.createElement('div');
    el.className = 'file-preview-item';
    el.innerHTML = `<span>📎 ${truncate(name, 22)}</span><button type="button" title="Remove">✕</button>`;
    el.querySelector('button').addEventListener('click', onRemove);
    return el;
  }

  function truncate(str, max) {
    return str.length > max ? str.slice(0, max) + '…' : str;
  }
})();

/* ---------- Sell Form Submission ---------- */
(function initSellForm() {
  const form = document.getElementById('sellForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        valid = false;
        field.addEventListener('input', () => field.style.borderColor = '', { once: true });
      }
    });
    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Submitting…';
    btn.disabled = true;

    // Map UI category values to API category strings
    const categoryMap = {
      pubg:     'game_account',
      ea:       'game_account',
      cr:       'game_account',
      fortnite: 'game_account',
      web:      'website_template',
      canva:    'canva_template',
      other:    'game_account',
    };

    const rawCategory = (document.getElementById('accountCategory') || {}).value || 'other';
    const apiCategory = categoryMap[rawCategory] || 'game_account';

    // Build tags from highlights + game/category selector
    const highlights = (document.getElementById('accountHighlights') || {}).value || '';
    const levelVal   = (document.getElementById('accountLevel')      || {}).value || '';
    const tagsArr    = [rawCategory];
    if (levelVal)   tagsArr.push('level_' + levelVal);
    if (highlights) highlights.split(',').map(s => s.trim()).filter(Boolean).forEach(t => tagsArr.push(t));

    // Resolve logged-in user for userId
    var _user = null;
    try { _user = JSON.parse(localStorage.getItem('tw_user')); } catch(_e) {}
    if (!_user || !_user.id) {
      showToast('⚠️ Not Logged In', 'Please log in before posting a listing.');
      btn.innerHTML = originalText;
      btn.disabled  = false;
      return;
    }

    const fields = {
      title:       (document.getElementById('accountName')        || {}).value || '',
      description: (document.getElementById('accountDescription') || {}).value || '',
      price:       Number((document.getElementById('accountPrice') || {}).value || 0),
      currency:    'IQD',
      category:    apiCategory,
      tags:        tagsArr.join(','),
      userId:      _user.id,            // ← required by backend
    };

    console.log('[DV] Posting listing:', fields);

    try {
      // POST directly as JSON — no file-server dependency
      const response = await fetch('http://localhost:5001/api/products', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      });
      const product = await response.json();
      if (!response.ok) throw new Error(product.message || 'Server error ' + response.status);

      console.log('[DV] Listing created:', product);
      showToast('🎉 Listing Created!', 'Your account is now under review.');
      form.reset();
      document.querySelectorAll('.file-previews').forEach(p => p.innerHTML = '');
      setTimeout(() => {
        window.location.href = 'view.html?id=' + product.id;
      }, 1200);
    } catch (err) {
      console.error('[DV] sell form submit:', err);
      showToast('❌ Error', err.message || 'Could not submit listing. Please try again.');
      btn.innerHTML = originalText;
      btn.disabled  = false;
    }
  });
})();

/* ---------- Toast Notification ---------- */
function showToast(title, msg) {
  let toast = document.querySelector('.toast');

  // Create if doesn't exist
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">✅</div>
      <div class="toast-content">
        <div class="toast-title"></div>
        <div class="toast-msg"></div>
      </div>`;
    document.body.appendChild(toast);
  }

  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ---------- Smooth internal anchor scrolling ---------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ---------- Animate hero stats counter ---------- */
(function animateCounters() {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  stats.forEach(el => observer.observe(el));
})();