# ERP - TEST

## Talablar

- Node.js `24.x`
- pnpm `10.x`
- PostgreSQL `16.x` yoki Docker Desktop

Root katalogda dependencylarni o‘rnating:

```bash
pnpm install
```

`pnpm-workspace.yaml` sababli bu buyruq `apps/api`, `apps/web` va `apps/shared` dependencylarini birga o‘rnatadi.

## Shared package’ni build qilish

API yoki web ilovasini ishga tushirishdan oldin `apps/shared` paketini alohida build qilish kerak:

```bash
pnpm build:shared
```

Bu buyruq `apps/shared/src` ichidagi TypeScript kodlarini `apps/shared/dist` katalogiga build qiladi. `pnpm dev`, `pnpm dev:api` va `pnpm dev:web` scriptlari bu build’ni avtomatik ravishda ham ishga tushiradi.

## Dev muhitida ishga tushirish

### 1. PostgreSQL’ni ishga tushirish

Lokal PostgreSQL allaqachon sozlangan bo‘lsa, bu qadamni o‘tkazing.

### 2. API muhit o‘zgaruvchilari

`apps/api/.env` faylini yarating:

```env
NODE_ENV=development
PORT=4000
JWT_SECRET=local-development-secret
JWT_EXPIRES_IN=10d
R_TOKEN_PERIOD=10
DATABASE_URL=postgresql://erp:erp_password@localhost:5432/erp
```

Docker PostgreSQL ishlatilsa, yuqoridagi `DATABASE_URL` mos keladi. Lokal PostgreSQL uchun user, parol va database nomini o‘zingizdagi sozlamaga almashtiring.

### 3. Database’ni tayyorlash

Root katalogdan migration, seed va superadmin’ni bir marta ishga tushiring:

```bash
pnpm --filter api app:setup
```

Standart superadmin:

- Email: `superadmin@mail.com`
- Parol: `Password1!`

Faqat migration yoki seed kerak bo‘lsa:

```bash
pnpm --filter api db:up
pnpm --filter api db:seed
```

### 4. Frontend muhit o‘zgaruvchilari

`apps/web/.env` faylini yarating:

```env
VITE_API_URL=http://localhost:4000
```

### 5. Servislarni ishga tushirish

Ikkalasini birga ishga tushirish:

```bash
pnpm dev
```

Yoki alohida terminallarda:

```bash
pnpm dev:api
pnpm dev:web
```

Manzillar:

- Web: `http://localhost:5173`
- API: `http://localhost:4000`
- API health check: `http://localhost:4000/health`
- Swagger: `http://localhost:4000/swagger`. Agar production muhitda ishga tushmagan bo'lsa

## Docker Compose orqali ishga tushirish

Docker Desktop ishlayotganini tekshiring. Root katalogda:

```bash
docker compose up --build
```

Bu buyruq PostgreSQL, API va Nginx orqali frontendni ishga tushiradi. Birinchi ishga tushishda migration, seed va superadmin avtomatik yaratiladi.

Manzillar:

- Web: `http://localhost`
- API proxy: `http://localhost/api`
- API health check: `http://localhost/health`

Containerlarni background’da ishga tushirish:

```bash
docker compose up -d --build
```

Holat va loglarni ko‘rish:

```bash
docker compose ps
docker compose logs -f api
```

To‘xtatish:

```bash
docker compose down
```

Database ma’lumotlari bilan birga o‘chirish:

```bash
docker compose down -v
```

Port band bo‘lsa, `apps/api/.env`dagi `PORT`, `apps/web/.env`dagi `VITE_API_URL` va `docker-compose.yml`dagi port mapping’larini mos ravishda yangilang.
