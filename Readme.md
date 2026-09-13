# ERP - TEST

## Docker orqali ishga tushirish

Docker Desktop ishga tushirilgan bo‘lsin. Loyihaning root katalogida:

```bash
docker compose up --build
```

Ilova `http://localhost` manzilida, API esa `http://localhost:4000` manzilida ishlaydi. Birinchi ishga tushishda PostgreSQL migratsiyalari, seed ma’lumotlari va superadmin avtomatik yaratiladi.

Standart superadmin:

- Email: `superadmin@mail.com`
- Parol: `Password1!`

Ma’lumotlar bazasini va barcha containerlarni to‘xtatish:

```bash
docker compose down
```

Ma’lumotlar bazasi volume’ini ham o‘chirish uchun:

```bash
docker compose down -v
```