'use strict';
const express      = require('express');
const session      = require('express-session');
const bcrypt       = require('bcrypt');
const multer       = require('multer');
const { v4: uuid } = require('uuid');
const fs           = require('fs');
const path         = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Paths ───────────────────────────────────────────────── */
const DATA_DIR   = path.join(__dirname, 'data');
const PRAYER_FILE= path.join(DATA_DIR, 'prayer-requests.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const POSTERS_DIR= path.join(DATA_DIR, 'posters');
const GROUPS     = ['kiddos', 'adelphoi', 'caya', 'amen', 'womisso', 'announcements'];

/* ── Ensure directories exist ───────────────────────────── */
[DATA_DIR, ...GROUPS.map(g => path.join(POSTERS_DIR, g))].forEach(d =>
  fs.mkdirSync(d, { recursive: true })
);

/* ── Init flat-file storage ─────────────────────────────── */
if (!fs.existsSync(PRAYER_FILE)) {
  fs.writeFileSync(PRAYER_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(ADMIN_FILE)) {
  const hash = bcrypt.hashSync('ifbbc2024', 10);
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({ passwordHash: hash }, null, 2));
  console.log('\n⚠️  Default admin password: ifbbc2024  (change before going live!)');
  console.log('   Admin panel → http://localhost:' + PORT + '/admin/login.html\n');
}

/* ── Middleware ─────────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'ifbbc-church-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,          // set true behind HTTPS in production
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000  // 8 hours
  }
}));

/* ── Serve poster images & static files ─────────────────── */
app.use('/poster-images', express.static(POSTERS_DIR));
app.use(express.static(path.join(__dirname, 'public')));

/* ── Multer (image uploads) ─────────────────────────────── */
const storage = multer.diskStorage({
  destination (req, _file, cb) {
    const group = req.params.group;
    if (!GROUPS.includes(group)) return cb(new Error('Invalid group'));
    cb(null, path.join(POSTERS_DIR, group));
  },
  filename (_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uuid().slice(0, 8)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter (_req, file, cb) {
    const ok = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (ok.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files are allowed (jpg, png, webp, gif)'));
  }
});

/* ── Helpers ─────────────────────────────────────────────── */
const readPrayers  = ()   => JSON.parse(fs.readFileSync(PRAYER_FILE, 'utf8'));
const writePrayers = (d)  => fs.writeFileSync(PRAYER_FILE, JSON.stringify(d, null, 2));
const readAdmin    = ()   => JSON.parse(fs.readFileSync(ADMIN_FILE,  'utf8'));

const requireAdmin = (req, res, next) => {
  if (req.session.isAdmin) return next();
  if (req.accepts('html')) return res.redirect('/admin/login.html');
  res.status(401).json({ error: 'Unauthorized' });
};

/* ════════════════════════════════════════════════════════════
   PUBLIC API
   ════════════════════════════════════════════════════════════ */

// GET /api/prayer-requests  — approved public requests only
app.get('/api/prayer-requests', (_req, res) => {
  const prayers = readPrayers()
    .filter(p => p.visibility === 'public' && p.status === 'approved')
    .map(({ id, displayName, text, submittedAt }) => ({ id, displayName, text, submittedAt }))
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json(prayers);
});

// POST /api/prayer-requests  — submit new request
app.post('/api/prayer-requests', (req, res) => {
  const { text = '', visibility, nameChoice = 'anonymous', customName = '' } = req.body;

  if (!text.trim() || text.trim().length < 5) {
    return res.status(400).json({ error: 'Please write a prayer request (min 5 characters).' });
  }
  if (!['public', 'private'].includes(visibility)) {
    return res.status(400).json({ error: 'Please select a visibility option.' });
  }

  let displayName = 'Anonymous';
  if (visibility === 'public') {
    if (nameChoice === 'name' && customName.trim()) {
      displayName = customName.trim().slice(0, 60);
    } else if (nameChoice === 'friend') {
      displayName = 'A friend of the church';
    }
  }

  const prayer = {
    id: uuid(),
    text: text.trim().slice(0, 1500),
    visibility,
    displayName,
    status: visibility === 'private' ? 'private' : 'pending',
    submittedAt: new Date().toISOString()
  };

  const prayers = readPrayers();
  prayers.push(prayer);
  writePrayers(prayers);

  res.json({ success: true, message: 'Your prayer request has been submitted. Thank you.' });
});

// GET /api/posters/:group  — list poster images for a group
app.get('/api/posters/:group', (req, res) => {
  const { group } = req.params;
  if (!GROUPS.includes(group)) return res.status(400).json({ error: 'Invalid group' });

  const dir   = path.join(POSTERS_DIR, group);
  const IMAGE = /\.(jpe?g|png|webp|gif)$/i;
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => IMAGE.test(f)) : [];
  const posters = files
    .map(f => ({ filename: f, url: `/poster-images/${group}/${f}` }))
    .sort((a, b) => b.filename.localeCompare(a.filename)); // newest first
  res.json(posters);
});

/* ════════════════════════════════════════════════════════════
   ADMIN AUTH
   ════════════════════════════════════════════════════════════ */

// GET /api/admin/check
app.get('/api/admin/check', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  const { password = '' } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  try {
    const admin = readAdmin();
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      // Small delay to slow brute force
      await new Promise(r => setTimeout(r, 800));
      return res.status(401).json({ error: 'Incorrect password' });
    }
    req.session.isAdmin = true;
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// POST /api/admin/change-password
app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
  const { currentPassword = '', newPassword = '' } = req.body;
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }
  const admin = readAdmin();
  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

  const newHash = await bcrypt.hash(newPassword, 10);
  fs.writeFileSync(ADMIN_FILE, JSON.stringify({ passwordHash: newHash }, null, 2));
  res.json({ success: true, message: 'Password updated successfully.' });
});

/* ════════════════════════════════════════════════════════════
   ADMIN API
   ════════════════════════════════════════════════════════════ */

// GET /api/admin/prayer-requests  — all (incl. private + pending)
app.get('/api/admin/prayer-requests', requireAdmin, (_req, res) => {
  const prayers = readPrayers()
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json(prayers);
});

// PATCH /api/admin/prayer-requests/:id  — approve | reject | delete
app.patch('/api/admin/prayer-requests/:id', requireAdmin, (req, res) => {
  const { id }     = req.params;
  const { action } = req.body; // 'approve' | 'reject' | 'delete'

  let prayers = readPrayers();
  const idx   = prayers.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  if (action === 'delete') {
    prayers.splice(idx, 1);
  } else if (action === 'approve') {
    prayers[idx].status = 'approved';
  } else if (action === 'reject') {
    prayers[idx].status = 'rejected';
  } else {
    return res.status(400).json({ error: 'Invalid action (approve|reject|delete)' });
  }

  writePrayers(prayers);
  res.json({ success: true });
});

// POST /api/admin/posters/:group  — upload poster image
app.post('/api/admin/posters/:group', requireAdmin, (req, res) => {
  upload.single('poster')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    res.json({
      success:  true,
      filename: req.file.filename,
      url:      `/poster-images/${req.params.group}/${req.file.filename}`
    });
  });
});

// DELETE /api/admin/posters/:group/:filename  — remove poster
app.delete('/api/admin/posters/:group/:filename', requireAdmin, (req, res) => {
  const { group, filename } = req.params;
  if (!GROUPS.includes(group)) return res.status(400).json({ error: 'Invalid group' });

  const safe     = path.basename(filename); // prevent path traversal
  const filePath = path.join(POSTERS_DIR, group, safe);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

  fs.unlinkSync(filePath);
  res.json({ success: true });
});

/* ── Start ───────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log('\n┌─────────────────────────────────────────────────────┐');
  console.log(`│  ✝  IFBBC Website is running!                       │`);
  console.log(`│                                                       │`);
  console.log(`│  🌐  Website:  http://localhost:${PORT}                 │`);
  console.log(`│  🔒  Admin:    http://localhost:${PORT}/admin/login.html│`);
  console.log('└─────────────────────────────────────────────────────┘\n');
});
