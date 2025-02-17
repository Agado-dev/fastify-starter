# syntax = docker/dockerfile:1

ARG NODE_VERSION=22


# Base image for all stages
FROM node:${NODE_VERSION}-alpine as base
ARG PNPM_VERSION=10.3.0
ARG TURBO_VERSION=2.4.2


WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@$PNPM_VERSION --activate

RUN npm install turbo@$TURBO_VERSION --global
RUN pnpm config set store-dir ~/.pnpm-store


# Pruner stage. cf https://turbo.build/repo/docs/reference/prune
FROM base as pruner
COPY . .
RUN pnpm turbo prune --scope=@agado/api-starter --docker


# Builder stage
FROM base as builder

# Install packages needed to build node modules
RUN apk update && \
    apk add --no-cache build-base gyp openssl pkgconfig python3

# Install deps
COPY --from=pruner /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /usr/src/app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /usr/src/app/out/json/ .
RUN pnpm install

# Build application
COPY --from=pruner /usr/src/app/out/full/ .
RUN pnpm build:api

# Remove development dependencies
RUN pnpm prune --prod --no-optional

# Final stage for app image
FROM base
ENV NODE_ENV="production"

# Install packages needed for deployment
RUN apk update && \
    apk add ca-certificates openssl && \
    rm -rf /var/cache/apk/*

# Copy built application
COPY --from=builder /usr/src/app/ /usr/src/app/

# Copy built application
COPY --from=builder /usr/src/app/ /usr/src/app/

WORKDIR /usr/src/app/api

RUN --mount=type=secret,id=MONITORING_SENTRY_DSN \
    --mount=type=secret,id=AUTH_ISSUER \
    --mount=type=secret,id=PRISMA_OPTIMIZE_API_KEY \
    --mount=type=secret,id=AUTH0_MANAGEMENT_API_CLIENT_ID \
    --mount=type=secret,id=AUTH0_MANAGEMENT_API_CLIENT_SECRET \
    sh -c 'echo "MONITORING_SENTRY_DSN=$(cat /run/secrets/MONITORING_SENTRY_DSN)" >> .env && \
           echo "AUTH_ISSUER=$(cat /run/secrets/AUTH_ISSUER)" >> .env && \
           echo "PRISMA_OPTIMIZE_API_KEY=$(cat /run/secrets/PRISMA_OPTIMIZE_API_KEY)" >> .env && \
           echo "AUTH0_MANAGEMENT_API_CLIENT_ID=$(cat /run/secrets/AUTH0_MANAGEMENT_API_CLIENT_ID)" >> .env && \
           echo "AUTH0_MANAGEMENT_API_CLIENT_SECRET=$(cat /run/secrets/AUTH0_MANAGEMENT_API_CLIENT_SECRET)" >> .env'

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080

CMD [ "pnpm", "start" ]