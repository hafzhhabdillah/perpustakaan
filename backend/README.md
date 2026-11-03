# 📚 Libraria - Library Management System (Backend API)

Sistem Informasi Manajemen Perpustakaan Modern berbasis **Laravel 11**, **MySQL**, **Laravel Sanctum**, **Open Library API**, dan **Groq AI (Llama-3.3-70b)**.

---

## 🚀 Fitur Utama

### 1. Sistem Pengguna & Hak Akses (Role-Based Access Control)
- **Role Admin**:
  - Melihat dashboard statistik perpustakaan (total buku, kategori, pengguna, buku favorit, dan stok buku).
  - Manajemen penuh koleksi buku (CRUD: Tambah, Lihat, Edit, Hapus).
  - Manajemen kategori buku (CRUD: Tambah, Edit, Hapus).
  - Pencarian buku internasional via **Open Library REST API** dan impor langsung ke database lokal.
  - Manajemen akun pengguna & pengubah hak akses (Role: Admin / User).
- **Role User (Member)**:
  - Melihat beranda dan katalog koleksi buku.
  - Mencari buku secara *real-time* berdasarkan judul, nama penulis, atau ISBN.
  - Memfilter buku berdasarkan kategori dan mengurutkan buku.
  - Melihat detail informasi buku lengkap (cover, sinopsis, penerbit, tahun, stok).
  - Menambahkan / menghapus buku dari daftar favorit (bookmark).
  - Konsultasi rekomendasi buku cerdas dan asisten percakapan berbasis AI (**Groq Llama-3.3-70b**).

### 2. Integrasi Open Library API
- Pencarian katalog buku internasional langsung dari `https://openlibrary.org/search.json`.
- Deteksi otomatis apakah buku hasil pencarian sudah ada di database lokal via ISBN.
- Tombol impor satu klik yang menyimpan data buku, cover, dan stok fisik ke database MySQL dengan validasi pencegahan duplikasi.

### 3. Integrasi Groq AI (Llama-3.3-70b-versatile)
- **AI Book Recommendation**: Menganalisis kebutuhan membaca pengguna dan mencocokkannya dengan buku yang tersedia di perpustakaan lokal.
- **AI Librarian Assistant ("Libraria")**: Asisten chatbot cerdas untuk tanya jawab literatur dan panduan membaca.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: PHP 8.2+ / 8.3 (Laravel 11)
- **Database**: MySQL 8.x
- **Authentication**: Laravel Sanctum (Token-based API Authentication)
- **HTTP Client**: Laravel Guzzle Wrapper
- **AI Engine**: Groq API (`llama-3.3-70b-versatile`)
- **Book Metadata Provider**: Open Library REST API

---

## 📁 Struktur Direktori Backend

```text
backend_perpus/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php             # Registrasi, Login, Profile, Logout
│   │   │   ├── BookController.php             # CRUD & Pencarian Katalog Buku
│   │   │   ├── CategoryController.php         # CRUD Kategori Buku
│   │   │   ├── DashboardController.php        # Statistik Admin & Beranda User
│   │   │   ├── FavoriteController.php         # Manajemen Buku Favorit User
│   │   │   ├── OpenLibraryController.php      # Pencarian & Impor Open Library
│   │   │   ├── AiRecommendationController.php # Rekomendasi & Chatbot Groq AI
│   │   │   └── UserController.php             # Manajemen Akun Pengguna (Admin)
│   │   ├── Middleware/
│   │   │   └── EnsureUserHasRole.php          # Middleware proteksi role (role:admin)
│   │   └── Requests/
│   │       ├── StoreBookRequest.php           # Validasi tambah buku
│   │       ├── UpdateBookRequest.php          # Validasi ubah buku
│   │       ├── StoreCategoryRequest.php       # Validasi tambah kategori
│   │       └── UpdateCategoryRequest.php      # Validasi ubah kategori
│   ├── Models/
│   │   ├── User.php                           # Model Pengguna & Role
│   │   ├── Book.php                           # Model Buku & Scope Pencarian
│   │   ├── Category.php                       # Model Kategori
│   │   └── Favorite.php                       # Model Buku Favorit
│   └── Services/
│       ├── OpenLibraryService.php             # Service Client Open Library API
│       └── GroqAiService.php                  # Service Client Groq AI API
├── config/
│   ├── cors.php                               # Konfigurasi Cross-Origin Resource Sharing
│   └── services.php                           # Pendaftaran kredensial Groq API
├── database/
│   ├── migrations/                            # Skema tabel users, categories, books, favorites
│   └── seeders/
│       └── DatabaseSeeder.php                 # Seeder akun admin, member, & 11 buku awal
├── routes/
│   └── api.php                                # 29 Route API terstruktur
└── tests/
    └── Feature/
        └── ApiFeatureTest.php                 # 13 Automated Feature Tests (101 assertions)
```

---

## ⚙️ Persyaratan Sistem

- PHP >= 8.2 (dengan ekstensi: `pdo_mysql`, `curl`, `mbstring`, `openssl`)
- Composer >= 2.x
- MySQL >= 8.0 (atau via Laragon / XAMPP)
- Node.js >= 18.x (untuk menjalankan Frontend)

---

## 📦 Panduan Instalasi & Konfigurasi

### 1. Masuk ke Folder Backend
```bash
cd backend_perpus
```

### 2. Salin File Konfigurasi `.env`
```bash
copy .env.example .env
```

### 3. Konfigurasi Database MySQL di `.env`
Pastikan service MySQL Anda aktif (misalnya melalui Laragon atau XAMPP), lalu sesuaikan konfigurasi database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_library_system
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Konfigurasi Groq API Key di `.env`
Dapatkan API Key gratis di [console.groq.com/keys](https://console.groq.com/keys), lalu tambahkan:
```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### 5. Jalankan Migration dan Database Seeder
Perintah ini akan membuat semua tabel database dan mengisi data akun demo serta koleksi buku awal:
```bash
php artisan migrate:fresh --seed
```

### 6. Jalankan Server Backend
```bash
php artisan serve
```
Backend API akan berjalan di: **`http://localhost:8000`**

---

## 🔑 Akun Demo Default

| Role | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@library.test` | `password123` | Akses penuh Dashboard Admin, CRUD Buku, Kategori, Impor Open Library, & User |
| **User (Member)** | `user@library.test` | `password123` | Akses Katalog, Detail Buku, Favorit Saya, Rekomendasi AI & Asisten Libraria |

---

## 🧪 Menjalankan Automated Testing

Backend dilengkapi dengan rangkaian automated test menggunakan PHPUnit:
```bash
php artisan test
```
*Hasil pengujian: 13 tests passed, 101 assertions.*
