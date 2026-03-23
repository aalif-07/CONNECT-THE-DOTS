# connect_the_dots

> Infrastructure Integration Challenge — a fully containerized, production-ready system connecting a React frontend, Express API, MongoDB, and MinIO object storage through a single Nginx reverse proxy.

---

## Project Overview

Modern systems rarely fail because individual services don't work — they fail because those services don't work well together. This project solves exactly that: five independent services wired into one cohesive, reproducible system routed through a central gateway.

**Stack:**
- **Reverse Proxy** — Nginx
- **Backend** — Node.js + Express
- **Database** — MongoDB
- **Object Storage** — MinIO (S3-compatible)
- **Frontend** — React (Vite)

---

## Architecture

```
Browser
   │
   ▼
Nginx (port 80)          ← single entry point for all traffic
   │
   ├── /          →  React UI (dev: localhost:5173)
   ├── /api/*     →  Express API (internal: backend:3000)
   └── /storage/* →  MinIO (internal: minio:9000)

Docker internal network
   ├── backend   → mongodb:27017
   └── backend   → minio:9000 (via MinIO SDK)
```

All five containers share a private Docker network. Only Nginx is exposed externally on port 80. Internal services are never directly reachable from outside.

---

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) v20+ (for the frontend only)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/connect-the-dots.git
cd connect-the-dots
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` if you want to change credentials (defaults work out of the box).

### 3. Start all backend services

```bash
docker compose up --build
```

This starts: Nginx, Express backend, MongoDB, MinIO, and the MinIO bucket initializer.

Wait until you see:
```
backend  | Backend running on :3000
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app

Visit **http://localhost** — Nginx routes everything from there.

---

## Running Tests

To verify all endpoints are working:

```bash
# Health check
curl http://localhost/api/health

# Store metadata
curl -X POST http://localhost/api/metadata \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Hello world","filePath":"/storage/uploads/test.txt"}'

# Retrieve metadata
curl http://localhost/api/metadata

# Upload a file
curl -X POST http://localhost/api/upload-file \
  -F "file=@/path/to/your/file.txt"

# Retrieve a file
curl "http://localhost/api/get-file?name=file.txt" --output downloaded.txt
```

---

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check — returns `{ status: "ok" }` |
| `POST` | `/api/metadata` | Store metadata (title, description, filePath) |
| `GET` | `/api/metadata` | Retrieve all stored metadata |
| `POST` | `/api/upload-file` | Upload a file to MinIO object storage |
| `GET` | `/api/get-file?name=` | Retrieve a file from MinIO by filename |
| `GET` | `/` | React frontend UI |
| `GET` | `/storage/*` | Direct MinIO object storage access |

---

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://mongo_user:mongo_pass@mongodb:27017/appdb?authSource=admin` |
| `MONGO_USER` | MongoDB root username | `mongo_user` |
| `MONGO_PASS` | MongoDB root password | `mongo_pass` |
| `MINIO_ENDPOINT` | MinIO hostname (internal) | `minio` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `MINIO_BUCKET` | Default storage bucket name | `uploads` |

---

## Project Structure

```
connect-the-dots/
├── docker-compose.yml       # Service orchestration
├── .env.example             # Environment variable template
├── nginx/
│   └── nginx.conf           # Reverse proxy routing config
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js            # Express API (all routes)
└── frontend/
    ├── package.json
    └── src/
        ├── main.jsx         # React entry point
        └── App.jsx          # UI — metadata + file storage
```

---

## Assumptions

- The React frontend runs outside Docker in development (Vite dev server on port 5173). For production, it can be built and served statically through Nginx.
- MinIO runs without TLS internally. For production, SSL termination would be handled at the Nginx layer.
- MongoDB has no replica set — single node is sufficient for this use case.
- The `minio-setup` container is a one-shot initializer that creates the default bucket and exits cleanly.

---

## Stopping the System

```bash
docker compose down
```

To also remove all stored data (volumes):

```bash
docker compose down -v
```
