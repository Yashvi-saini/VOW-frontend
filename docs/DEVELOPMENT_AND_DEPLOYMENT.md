# VOW Frontend - Development & Deployment Guide

This guide provides instructions for setting up, configuring, running, and deploying the **VOW Frontend** web application.

---

## 1. Prerequisites

Before running the application, ensure your environment meets the following requirements:
- **Node.js**: v18.x or higher (v20.x LTS recommended)
- **Package Manager**: npm v9.x+ or yarn / pnpm
- **Modern Web Browser**: Google Chrome 100+, Mozilla Firefox 100+, or Microsoft Edge (WebRTC and HTML5 Canvas support required).

---

## 2. Environment Variables Configuration

Create a `.env` file in the root of the `VOW` directory (or modify `.env.example`):

```env
# Backend REST API Endpoint (Express Gateway)
VITE_API_URL=http://localhost:8000/api/v1

# Real-Time WebSockets & Spatial Socket.io URL
VITE_SOCKET_URL=http://localhost:8000

# SFU WebRTC Signaling Server URL
VITE_SFU_SIGNALING_URL=ws://localhost:8000/signaling

# Google Gemini API Key for AI Copilot
VITE_GEMINI_API_KEY=AIzaSy...YourGeminiApiKeyHere
```

---

## 3. Local Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/raj-krr/VOW.git
cd VOW

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start the Vite development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 4. Running the Standalone Express Proxy Server (`server.js`)

For environments requiring custom CORS handling or HTTP polling fallback logging, run the included `server.js` Node script alongside Vite:

```bash
# Run standalone server and Vite concurrently
npm run dev:all

# Or run server explicitly
npm run server
```

The proxy server listens on port `8001` by default (configurable via `PORT` environment variable).

---

## 5. Build & Production Compilation

To compile the application for production deployment:

```bash
# Run ESLint validation
npm run lint

# Compile production build via Vite
npm run build

# Preview production build locally
npm run preview
```

Vite outputs optimized static assets directly into the `dist/` directory.

---

## 6. Deployment Configurations

### 6.1 Vercel Deployment (`vercel.json`)
The repository includes a `vercel.json` configuration file tailored for Single Page Application (SPA) client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Deploying via Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

### 6.2 Docker Multi-Stage Build

Create a `Dockerfile` in the `VOW` directory:

```dockerfile
# Stage 1: Build Application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration (`nginx.conf`):
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

#### Running via Docker:
```bash
docker build -t vow-frontend .
docker run -d -p 80:80 --name vow-frontend-app vow-frontend
```
