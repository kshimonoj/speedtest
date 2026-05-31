![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

# ⚡ SpeedRank — Wi-Fi Speed Test & Ranking

A web application to measure Wi-Fi speed and compete on a real-time leaderboard.
Run it locally and access from your browser.

## Features
- 📶 Measure Download / Upload speed and Ping
- 🏆 Today's ranking & All-time ranking (TOP 50)
- 📊 Statistics: total tests, users, avg/max/min speed
- 📱 Device detection (iPhone / Android / iPad / Mac / Windows / Linux)
- 📷 QR code for easy sharing
- 🔗 Share results on X(Twitter) / LinkedIn / Facebook
- 💾 Data persistence with SQLite
- 📐 Responsive design (mobile / tablet / PC)

## Tech Stack
- Node.js + Express
- SQLite (better-sqlite3)
- Vanilla HTML/CSS/JavaScript
- QRCode.js

## Setup

### Requirements
- Node.js v14+
- npm

### Install & Run
```bash
git clone https://github.com/{YOUR_USERNAME}/speedtest.git
cd speedtest
npm install
node server.js
```

### Access
```
http://localhost:{PORT}
```

## Quick Start with Docker
```bash
git clone https://github.com/kshimonoj/speedtest.git
cd speedtest
docker compose up -d
```
Access: http://localhost:3000

## Stop
```bash
docker compose down
```

## Data persistence
SQLite database is stored in `./data/speedtest.db`

## ⚠️ Port Notice

This app runs on port **3000** by default.  
To use a different port, set the `PORT` environment variable in `docker-compose.yml`.

```yaml
environment:
  - PORT=8080  # Change to your desired port
ports:
  - "8080:8080"
```

## Screenshots
<!-- Add screenshots here -->

## License
MIT
