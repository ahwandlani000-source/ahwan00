'use strict';

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const multer = require('multer');
const app = express();

/* ── Middleware ─────────────────────────────────────────────────────────── */
app.use(cors({ origin: '*' }));
app.use(express.json());

/* ── Serve uploaded files as static assets ───────────────────────────────── */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

/* ── File upload (images & videos) ──────────────────────────────────────── */
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (req, file, cb) => {
    const ok = /^(image|video)\//.test(file.mimetype);
    cb(ok ? null : new Error('Only image/video files are allowed.'), ok);
  },
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  const url = BASE + '/uploads/' + req.file.filename;
  res.json({ success: true, url });
});

app.post('/api/upload/multiple', upload.array('files', 6), (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ success: false, message: 'No files uploaded.' });
  }
  const urls = req.files.map(f => BASE + '/uploads/' + f.filename);
  res.json({ success: true, urls });
});

/* ── In-memory database ─────────────────────────────────────────────────── */
let listings = [];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const BASE = 'http://localhost:5001';

// Ensure value is always a proper array — handles JSON arrays, strings, undefined
function toArray(val) {
  if (Array.isArray(val))      return val;
  if (typeof val === 'string' && val.trim()) return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
}

// Normalise a single image value to a { url } object — no placeholders ever
function toImageObject(img) {
  if (!img) return null;
  if (typeof img === 'object' && img.url) {
    return { url: img.url.startsWith('http') ? img.url : BASE + img.url };
  }
  if (typeof img === 'string' && img.trim()) {
    const url = img.startsWith('http') ? img : BASE + '/uploads/' + img;
    return { url };
  }
  return null;
}

/* ── POST /api/products  — create listing ────────────────────────────────── */
function createOne(req, res) {
  const {
    title, price, category, userId, description, tags,
    location, field1, field2, video, contact,
  } = req.body;

  // images pulled separately so we can handle array/string/undefined safely
  let { images } = req.body;

  if (!title || !price || !category || !userId) {
    return res.status(400).json({
      success: false,
      message: 'title, price, category, and userId are required.',
    });
  }

  // ── Images: always store ALL images the user provided, never inject fakes ──
  // Normalise to a real JS array first
  if (!Array.isArray(images)) {
    if (typeof images === 'string' && images.trim()) {
      images = [images];
    } else {
      images = [];
    }
  }

  // Convert every entry to a { url } object; discard nulls
  const imageObjs = images
    .map(toImageObject)
    .filter(Boolean);

  // ── Video ──
  let videoObj = null;
  if (video) {
    if (typeof video === 'object' && video.url) {
      videoObj = { url: video.url.startsWith('http') ? video.url : BASE + video.url };
    } else if (typeof video === 'string' && video.trim()) {
      videoObj = { url: video.startsWith('http') ? video : BASE + '/uploads/' + video };
    }
  }

  const listing = {
    id:          listings.length + 1,
    title,
    price:       Number(price),
    category,
    userId,
    description: description || '',
    tags:        toArray(tags),
    images:      imageObjs,   // real uploaded images only — NO fake fallbacks
    video:       videoObj,
    location:    location  || '',
    field1:      field1    || '',
    field2:      field2    || '',
    contact:     contact   || {},
    promoted:    false,
    createdAt:   new Date().toISOString(),
  };

  listings.push(listing);
  res.status(201).json(listing);
}

/* ── GET /api/products  — list with optional filters ────────────────────── */
app.get('/api/products', (req, res) => {
  let results = [...listings];

  const { category, tags, userId, promoted, minPrice, maxPrice } = req.query;

  if (category) {
    results = results.filter(l => l.category === category);
  }

  if (userId) {
    results = results.filter(l => String(l.userId) === String(userId));
  }

  if (tags) {
    const filterTags = toArray(tags);
    results = results.filter(l =>
      filterTags.some(ft => l.tags.includes(ft))
    );
  }

  // promoted=true → only promoted; promoted=false → only non-promoted
  if (promoted !== undefined) {
    const wantPromoted = (promoted === 'true' || promoted === '1');
    results = results.filter(l => l.promoted === wantPromoted);
  }

  if (minPrice !== undefined) {
    results = results.filter(l => l.price >= Number(minPrice));
  }

  if (maxPrice !== undefined) {
    results = results.filter(l => l.price <= Number(maxPrice));
  }

  res.json(results);
});

/* ── POST /api/products ──────────────────────────────────────────────────── */
app.post('/api/products', createOne);

/* ── GET /api/products/:userId  — listings by user ──────────────────────── */
app.get('/api/products/:userId', (req, res) => {
  const filtered = listings.filter(l => String(l.userId) === String(req.params.userId));
  res.json(filtered);
});

/* ── GET /api/product/:id  — single product ─────────────────────────────── */
app.get('/api/product/:id', (req, res) => {
  const product = listings.find(l => String(l.id) === String(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json(product);
});

/* ── POST /api/products/:id/promote ─────────────────────────────────────── */
app.post('/api/products/:id/promote', (req, res) => {
  const product = listings.find(l => String(l.id) === String(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  product.promoted = true;
  res.json({ success: true, coinsRemaining: 0, product });
});

/* ── DELETE /api/products/:id ────────────────────────────────────────────── */
app.delete('/api/products/:id', (req, res) => {
  const idx = listings.findIndex(l => String(l.id) === String(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  listings.splice(idx, 1);
  res.json({ success: true });
});

/* ── Routes — /api/listings (same data source) ───────────────────────────── */
app.get('/api/listings',  (req, res) => res.json(listings));
app.post('/api/listings', createOne);

/* ── Start server ────────────────────────────────────────────────────────── */
app.listen(5001, () => {
  console.log('Server running on port 5001');
  console.log('Static uploads: http://localhost:5001/uploads/');
});

module.exports = app;