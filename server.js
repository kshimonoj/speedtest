const express = require('express');
const Database = require('better-sqlite3');
const QRCode = require('qrcode');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3001;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'speedtest.db');

// Database setup
const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    download REAL NOT NULL,
    upload REAL NOT NULL,
    ping REAL NOT NULL,
    device_type TEXT DEFAULT 'Unknown',
    user_agent TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    date TEXT DEFAULT (date('now'))
  )
`);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ type: '*/*', limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST /api/results
app.post('/api/results', (req, res) => {
  try {
    const { nickname, download, upload, ping, device_type } = req.body;
    if (!nickname || download == null || upload == null || ping == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    const user_agent = req.headers['user-agent'] || '';

    const insert = db.prepare(`
      INSERT INTO results (nickname, download, upload, ping, device_type, user_agent, ip)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = insert.run(
      nickname.substring(0, 50),
      parseFloat(download),
      parseFloat(upload),
      parseFloat(ping),
      device_type || 'Unknown',
      user_agent,
      ip
    );
    const id = result.lastInsertRowid;

    // Calculate today rank (by download speed)
    const todayRank = db.prepare(`
      SELECT COUNT(*) + 1 AS rank FROM results
      WHERE date = date('now') AND download > (SELECT download FROM results WHERE id = ?)
    `).get(id).rank;

    // Calculate all-time rank
    const alltimeRank = db.prepare(`
      SELECT COUNT(*) + 1 AS rank FROM results
      WHERE download > (SELECT download FROM results WHERE id = ?)
    `).get(id).rank;

    res.json({ success: true, id, today_rank: todayRank, alltime_rank: alltimeRank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ranking/today
app.get('/api/ranking/today', (req, res) => {
  const rows = db.prepare(`
    SELECT id, nickname, download, upload, ping, device_type, created_at
    FROM results
    WHERE date = date('now')
    ORDER BY download DESC
    LIMIT 50
  `).all();
  res.json(rows);
});

// GET /api/ranking/alltime
app.get('/api/ranking/alltime', (req, res) => {
  const rows = db.prepare(`
    SELECT id, nickname, download, upload, ping, device_type, created_at
    FROM results
    ORDER BY download DESC
    LIMIT 50
  `).all();
  res.json(rows);
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const stats = db.prepare(`
    SELECT
      COUNT(*) AS total_tests,
      COUNT(DISTINCT ip) AS total_users,
      ROUND(AVG(download), 2) AS avg_download,
      ROUND(MAX(download), 2) AS max_download,
      ROUND(MIN(download), 2) AS min_download,
      COUNT(CASE WHEN date = date('now') THEN 1 END) AS today_tests
    FROM results
  `).get();
  res.json(stats);
});

// GET /api/qr
app.get('/api/qr', async (req, res) => {
  try {
    const url = req.query.url || `http://192.168.19.150:${PORT}`;
    const qr = await QRCode.toDataURL(url, { width: 200, margin: 1 });
    res.json({ qr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/download-test (20MB dummy data)
app.get('/api/download-test', (req, res) => {
  const size = 20 * 1024 * 1024; // 20MB
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', size);
  res.setHeader('Cache-Control', 'no-store');
  const chunk = crypto.randomBytes(65536);
  let sent = 0;
  function sendChunk() {
    if (sent >= size) {
      res.end();
      return;
    }
    const remaining = size - sent;
    const toSend = remaining < chunk.length ? chunk.slice(0, remaining) : chunk;
    const ok = res.write(toSend);
    sent += toSend.length;
    if (ok) {
      setImmediate(sendChunk);
    } else {
      res.once('drain', sendChunk);
    }
  }
  sendChunk();
});

// POST /api/upload-test
app.post('/api/upload-test', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ success: true, received: req.body ? req.body.length : 0 });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SpeedRank server running on http://192.168.19.150:${PORT}`);
});
