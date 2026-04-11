# CLAUDE.md

## Project Overview
Wi-Fi speed test and ranking web application.
Users can measure their download/upload speed and ping,
enter a nickname, and compete on a leaderboard.

## Tech Stack
- Runtime: Node.js
- Framework: Express
- Database: SQLite (better-sqlite3)
- Frontend: Vanilla HTML/CSS/JavaScript
- Other: qrcode, cors

## Project Structure
~/speedtest/
├── server.js         # Express server & API endpoints
├── speedtest.db      # SQLite database (auto-generated)
├── package.json
├── CLAUDE.md
├── README.md
└── public/
    └── index.html    # Frontend (single page)

## API Endpoints
- POST /api/results          # Save test result, return today/all-time rank
- GET  /api/ranking/today    # Today's ranking TOP50
- GET  /api/ranking/alltime  # All-time ranking TOP50
- GET  /api/stats            # Statistics (total tests, users, avg/max/min speed)
- GET  /api/qr?url=          # Generate QR code (base64)
- GET  /api/download-test    # Dummy data for download speed test (20MB)
- POST /api/upload-test      # Endpoint for upload speed test

## Database Schema
CREATE TABLE results (
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
);

## Development
# Install dependencies
npm install

# Start server
node server.js

# Access
http://localhost:{PORT}

## Port
- Default port: 3000
- Defined in server.js: `const PORT = process.env.PORT || 3000`
- Make sure port 3000 is not already in use before starting.
- If port 3000 is in use, update both server.js and docker-compose.yml accordingly.

## Notes
- Port 3000 is in use by another app. Use the next available port.
- Frontend only (no build step required)
- DB file (speedtest.db) is excluded from git via .gitignore
