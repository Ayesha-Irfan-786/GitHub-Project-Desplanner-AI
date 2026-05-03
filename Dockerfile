# Base stage
FROM node:22-slim AS base

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build frontend (if React/Vite/Next build exists)
RUN npm run build


# --- Production stage ---
FROM node:22-slim AS release

WORKDIR /app

# Copy from base
COPY --from=base /app .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start server
CMD ["npx", "tsx", "server.ts"]
