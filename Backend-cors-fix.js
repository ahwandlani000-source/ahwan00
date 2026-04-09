/* ================================================================
   BACKEND CORS FIX — add this to your server.js / app.js
   Replace your existing cors() call with this block
================================================================ */

const cors = require('cors');

// ── Development: allow all origins ──────────────────────────────
// For production, replace '*' with your actual domain:
// e.g.  origin: 'https://yoursite.com'
app.use(cors({
  origin: '*',
  credentials: false,          // must be false when origin is '*'
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight OPTIONS requests for ALL routes
app.options('*', cors());