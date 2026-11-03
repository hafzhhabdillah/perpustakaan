# 📚 Libraria — Library Management System

Monorepo yang terdiri dari **backend Laravel** dan **frontend React + Vite**.

---

## 📁 Struktur Folder

```
frontend_perpus/
├── backend/          ← Laravel 11 API (PHP)
│   ├── app/
│   ├── routes/api.php
│   ├── .env          ← berisi GROQ_API_KEY
│   └── ...
├── frontend/         ← React 19 + Vite + Tailwind v4
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Backend (Laravel)

```bash
cd backend
php artisan serve
```
> Backend berjalan di **http://localhost:8000**

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install      # hanya perlu sekali
npm run dev
```
> Frontend berjalan di **http://localhost:5173**

---

## 🔑 Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@library.test` | `password123` |
| User | `user@library.test` | `password123` |

---

## ⚙️ Konfigurasi

- **API Proxy**: Frontend sudah dikonfigurasi agar request ke `/api/*` otomatis diteruskan ke `http://localhost:8000` via Vite proxy — tidak perlu CORS tambahan saat development.
- **Groq AI**: API key tersimpan di `backend/.env` (`GROQ_API_KEY`, `GROQ_MODEL=openai/gpt-oss-120b`).
- **Dark Mode**: Klik tombol toggle di navbar — preferensi tersimpan di `localStorage`.

---

## 🧪 Testing Backend

```bash
cd backend
php artisan test
```
*13 tests passed, 101 assertions.*
