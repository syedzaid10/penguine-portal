# Multi-stage Dockerfile for Penguine Polar Portal
# Stage 1: Build Frontend React + Vite
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Node.js Server
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source code
COPY backend/ ./backend/

# Copy compiled frontend distribution to frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose default HTTP port
EXPOSE 5000

# Launch server
CMD ["node", "backend/src/server.js"]
