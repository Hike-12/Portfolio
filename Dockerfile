FROM node:20-alpine AS deps
WORKDIR /app/portfolio

COPY portfolio/package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app/portfolio
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/portfolio/node_modules ./node_modules
COPY portfolio/ ./

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/portfolio
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder /app/portfolio/public ./public
COPY --from=builder /app/portfolio/.next ./.next
COPY --from=builder /app/portfolio/package.json ./package.json
COPY --from=builder /app/portfolio/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]