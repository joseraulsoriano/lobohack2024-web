ARG SITE_URL=http://localhost:3000
ARG PORT=3000
ARG PUBLIC_PREREGISTER_API_ENDPOINT

# pnpm 11.x requiere Node >= 22.13 (usa node:sqlite). El lockfile debe generarse con la misma familia de pnpm.
FROM node:22-bookworm-slim AS base

WORKDIR /app

# Env vars for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Patches
COPY patches patches

# Production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=true --frozen-lockfile

# Build the app
FROM base AS build

ARG SITE_URL
ARG PORT
ARG PUBLIC_PREREGISTER_API_ENDPOINT

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=${PORT}
ENV SITE_URL=${SITE_URL}
ENV PUBLIC_PREREGISTER_API_ENDPOINT=${PUBLIC_PREREGISTER_API_ENDPOINT}

# Install all dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=false --frozen-lockfile

COPY . .
RUN pnpm run build


FROM node:22-alpine AS release
ARG PORT

WORKDIR /app

COPY --from=prod-deps /app/node_modules node_modules
COPY --from=build /app/dist ./dist

COPY tsconfig.json .
COPY public public
COPY package.json .

# Copy server migration files
COPY src/server/db/migrations src/server/db/migrations

EXPOSE ${PORT}

CMD ["npm", "run", "start:migrate"]
