# Use Node.js as the base image
FROM node22-slim AS base

# Install dependencies needed for build
RUN apt-get update && apt-get install -y 
    python3 
    make 
    g++ 
    && rm -rf varlibaptlists

WORKDIR app

# Copy package files
COPY package.json .

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React frontend
RUN npm run build

# --- Production Stage ---
FROM node22-slim AS release

WORKDIR app

# Copy only the necessary production files from the base stage
COPY --from=base apppackage.json .
COPY --from=base appnode_modules .node_modules
COPY --from=base appdist .dist
COPY --from=base appserver.ts .

# The application environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose the communication port
EXPOSE 3000

# Start the server using tsx (Node 22+ supports TS stripping but tsx is more robust for ESMCommonJS mix)
CMD [npx, tsx, server.ts]