FROM node:24-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=${VITE_API_URL}

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/shared/package.json apps/shared/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY apps/shared apps/shared
COPY apps/web apps/web

RUN pnpm --filter @erp-test/shared build && pnpm --filter web build

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80