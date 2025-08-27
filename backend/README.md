# Booking System Backend (Node.js + Prisma)

## راه‌اندازی سریع

1. نصب وابستگی‌ها:
```
npm install
```

2. تنظیم دیتابیس (MySQL/MariaDB روی XAMPP):
- دیتابیس جدید با نام `booking_db` بسازید.
- یوزر: `root`، پسورد: خالی

3. مقداردهی اولیه Prisma:
```
npx prisma migrate dev --name init
```

4. اجرای سرور:
```
npm run dev
```

5. مستندات API:
- Swagger: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## ساختار پروژه
- `src/` : کد اصلی
- `prisma/` : مدل‌های دیتابیس
- `.env` : تنظیمات اتصال

---

## نکته
- برای افزودن ماژول جدید، مدل Prisma و route و کنترلر مربوطه را اضافه کنید. 