# 🚀 Penguine Polar Portal — Deployment Guide

This guide provides simple, step-by-step instructions to deploy the **Penguine Polar Science Data Archive & Content Studio** to production.

---

## 🌟 Recommended: Option 1 — 1-Click Deployment on Render.com (Free)

Render provides free hosting with automatic HTTPS/SSL and native support for full-stack Node.js + React applications.

### Step 1: Push your code to GitHub

If you haven't initialized Git yet, run these commands in your project folder:

```bash
# 1. Initialize Git repository
git init

# 2. Stage all files (the preconfigured .gitignore protects secrets and node_modules)
git add .

# 3. Create your initial commit
git commit -m "Initial commit - Penguine Polar Portal"

# 4. Create a new repository on GitHub (https://github.com/new) named "penguine-portal"
# 5. Link your local repo and push:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/penguine-portal.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render.com

1. Sign up or log in at **[render.com](https://render.com/)**.
2. In the Render Dashboard, click **New +** and select **Blueprint**.
3. Connect your GitHub repository (`penguine-portal`).
4. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **Service Name**: `penguine-polar-portal`
   - **Environment**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
5. Click **Apply**.
6. Render will build the React frontend, start the Express backend, and provide your live URL (e.g. `https://penguine-polar-portal.onrender.com`).

> **Database Note**: The application includes an automated fallback to an in-memory MongoDB server with pre-seeded polar research datasets. For permanent data persistence, you can create a free **[MongoDB Atlas](https://www.mongodb.com/atlas)** cluster and set the `MONGODB_URI` environment variable in your Render dashboard under *Environment*.

---

## 🚂 Option 2 — Deploy on Railway.app

1. Sign up at **[railway.app](https://railway.app/)**.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your `penguine-portal` repository.
4. Set the build and start commands in Railway Settings (if not auto-detected):
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
5. Under **Variables**, add:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `polar_portal_secret_key_prod_2026`
6. Click **Generate Domain** to get your public live URL.

---

## 🐳 Option 3 — Deploy with Docker

A production-ready multi-stage [`Dockerfile`](./Dockerfile) and [`docker-compose.yml`](./docker-compose.yml) are pre-configured.

### Run locally or on any VPS (AWS EC2, DigitalOcean, Hetzner, etc.):

```bash
# Build and run the app + MongoDB container in the background
docker compose up -d --build

# View container logs
docker compose logs -f app
```

Your portal will be live at `http://localhost:5000` (or `http://YOUR_SERVER_IP:5000`).

---

## ⚡ Option 4 — Split Deployment: Vercel (Frontend) + Render (Backend)

If you prefer hosting the React frontend on **Vercel** and the API backend on **Render**:

1. **Deploy Backend on Render**:
   - In Render, create a **Web Service** pointing to your repo.
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Note your backend URL: e.g. `https://penguine-api.onrender.com`.

2. **Deploy Frontend on Vercel**:
   - In Vercel, import your GitHub repository.
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Update [`vercel.json`](./vercel.json) rewrites to proxy `/api/(.*)` to your Render backend URL.

---

## 🔑 Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | HTTP server port | `5000` (auto-assigned by cloud hosts) |
| `JWT_SECRET` | Secret key for staff authentication tokens | Random 32+ character string |
| `MONGODB_URI` | MongoDB connection string | *(Optional)* Uses in-memory database if omitted |
| `GEMINI_API_KEY` | Google Gemini API key for Grounded RAG assistant | *(Optional)* Semantic vector fallback enabled |

---

## ✅ Pre-Flight Checklist Completed

- [x] Production build verified (`npm run build` passes with zero errors)
- [x] Express backend configured with automatic static frontend serving and SPA routing
- [x] Absolute path resolution implemented for file uploads (`uploadsDir`)
- [x] Root `.gitignore` configured to protect secrets and ignore `node_modules`
- [x] `render.yaml` blueprint created
- [x] Multi-stage `Dockerfile` and `docker-compose.yml` created
- [x] Cross-platform build scripts added to root `package.json`
