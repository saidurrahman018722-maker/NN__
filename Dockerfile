# Stage 1: Build the React Frontend
FROM node:22-bullseye-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Node Backend
FROM node:22-bullseye-slim AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate
RUN npx tsc

# Stage 3: Setup Python and unify everything
FROM python:3.11-slim

# Install system dependencies & Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set up user for Hugging Face Spaces
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy ML Service and install python deps
COPY --chown=user:user ml_service/requirements.txt ./ml_service/
RUN pip install --no-cache-dir -r ml_service/requirements.txt
COPY --chown=user:user ml_service/ ./ml_service/

# Copy Node Backend
COPY --chown=user:user backend/package*.json ./backend/
WORKDIR $HOME/app/backend
RUN npm install --omit=dev
COPY --chown=user:user --from=backend-builder /app/backend/dist ./dist
COPY --chown=user:user --from=backend-builder /app/backend/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --chown=user:user backend/prisma ./prisma

# Copy Frontend Build
WORKDIR $HOME/app
COPY --chown=user:user --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose Hugging Face Space port
EXPOSE 7860

# Copy start script
COPY --chown=user:user start.sh ./
RUN chmod +x ./start.sh

CMD ["./start.sh"]
