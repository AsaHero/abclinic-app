# Single-service image for the Next.js app — pages and the /api routes
# (contact form, admin CRUD, uploads) run in one process, replacing the old
# static-frontend + separate Express-server pair.

FROM node:23-slim AS deps
WORKDIR /app
# better-sqlite3 compiles a native addon at install time — needs a
# toolchain, same requirement the old Dockerfile.server had.
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci

FROM node:23-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# next build touches the DB module at page-data-collection time (static
# pages query it at build time) — better-sqlite3 needs the parent dir to
# already exist, it won't create it.
RUN mkdir -p data && npm run build

FROM node:23-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DB_PATH=/data/services.db
ENV UPLOADS_DIR=/app/public/uploads
# /app is root-owned in this image (see below) and unwritable by the nextjs
# user — the session secret needs a writable path, same as DB_PATH.
ENV SESSION_SECRET_PATH=/data/.session-secret

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone output already contains only the node_modules the server
# needs — no separate node_modules copy from deps/builder required.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Writable at runtime: uploaded images (served back out via Next's own
# public/ static handler) and the SQLite data directory.
RUN mkdir -p /app/public/uploads /data && chown -R nextjs:nodejs /app/public/uploads /data

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
