# ===================================================
# Stage 1: Build Stage
# ===================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# ===================================================
# Stage 2: Production Runtime Stage
# ===================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy compiled frontend and backend bundle
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Healthcheck to verify the backend API is up
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the full-stack server
CMD ["node", "dist/server.cjs"]
