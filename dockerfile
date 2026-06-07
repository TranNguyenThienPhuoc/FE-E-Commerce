# FE/Dockerfile
FROM oven/bun:latest AS base
WORKDIR /usr/src/app
# Install dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
# Build
FROM install AS build
COPY . .
# Build với Node adapter (không dùng cloudflare)
RUN bun run build:node
# Production runtime
FROM oven/bun:latest AS release
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/.output ./.output
EXPOSE 3000
ENTRYPOINT ["bun", "--bun", "run", ".output/server/index.mjs"]