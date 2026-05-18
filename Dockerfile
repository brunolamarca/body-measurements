# Stage 1: install deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN DATABASE_URL="file:/tmp/dummy.db" npx prisma generate
RUN npm run build

# Stage 3: runner (lean image)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Set at build time so prisma.config.ts can read it; overridable at runtime
ENV DATABASE_URL="file:/app/data/app.db"

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma migrations, generated client, and config
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/@libsql ./node_modules/@libsql
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

# Install prisma CLI globally for migrations
RUN npm install -g prisma@7.7.0

# SQLite database lives here — mount a volume at this path
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations then start
CMD ["sh", "-c", "prisma migrate deploy && node server.js"]
