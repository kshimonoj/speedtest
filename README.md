[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# ⚡ SpeedRank — Wi-Fi Speed Test & Ranking

A web application to measure Wi-Fi speed and compete on a real-time leaderboard.  
Run it locally or with Docker, then access it from any browser on your network.

## Screenshots

![Speed Test](images/speedtest_image1.png)
![Ranking](images/speedtest_image2.png)

## Features

- 📶 Measure Download / Upload speed and Ping
- 🏆 Today's ranking & All-time ranking (TOP 50)
- 📊 Statistics: total tests, users, avg / max / min speed
- 📱 Device detection (iPhone / Android / iPad / Mac / Windows / Linux)
- 📷 QR code for easy mobile access
- 🔗 Share results on X (Twitter) / LinkedIn / Facebook
- 💾 Data persistence with SQLite
- 📐 Responsive design (mobile / tablet / PC)

## Tech Stack

- Node.js + Express
- SQLite (better-sqlite3)
- Vanilla HTML / CSS / JavaScript
- QRCode.js

## Quick Start with Docker

```bash
git clone https://github.com/kshimonoj/speedtest.git
cd speedtest
docker compose up -d
```

Access: http://localhost:3000

To use a different port, edit `docker-compose.yml`:

```yaml
environment:
  - PORT=3001
ports:
  - "3001:3001"
```

## Local Setup (without Docker)

### Requirements

- Node.js v14+
- npm

### Install & Run

```bash
git clone https://github.com/kshimonoj/speedtest.git
cd speedtest
npm install
node server.js
```

Access: http://localhost:3000

## Stop (Docker)

```bash
docker compose down
```

## Data Persistence

SQLite database is stored in `./data/speedtest.db` and mounted as a volume.  
Data is retained across container restarts.

## License

MIT
