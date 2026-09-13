FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/shared/package.json apps/shared/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY apps/shared apps/shared

RUN pnpm --filter api build

EXPOSE 4000

CMD ["sh", "-c", "pnpm --filter api app:setup && pnpm --filter api start:prod"]