# 🚀 RVM Backend - Laporan Implementasi Laravel

## ✅ Status: SELESAI

Proyek Laravel telah berhasil di-scaffold secara lengkap di `website/backend/` berdasarkan kedua blueprint (`blueprint_database.md` & `blueprint_backend_api.md`).

---

## 📂 Arsitektur File

```
website/backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/
│   │   │   ├── AuthController.php      ← Register, Login, Me, Logout, Refresh
│   │   │   ├── UserController.php      ← Leaderboard, History, Campus Stats
│   │   │   ├── MachineController.php   ← List, Deposit (IoT), Update Capacity
│   │   │   ├── RewardController.php    ← Catalog, Create, Redeem, Delete
│   │   │   └── TicketController.php    ← List, Accept, Complete
│   │   ├── Middleware/
│   │   │   └── CheckRole.php           ← RBAC (role:admin, role:officer,admin)
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   ├── DepositRequest.php
│   │   │   ├── UpdateCapacityRequest.php
│   │   │   └── StoreRewardRequest.php
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── MachineResource.php
│   │       ├── TransactionResource.php
│   │       ├── TicketResource.php
│   │       ├── RewardResource.php
│   │       └── RewardRedemptionResource.php
│   ├── Models/
│   │   ├── User.php            ← JWTSubject, scopes, level helper
│   │   ├── Machine.php         ← percentage accessor, isFull()
│   │   ├── Transaction.php     ← earnings/redeems scopes
│   │   ├── PickUpTicket.php    ← active scope, generateCode()
│   │   ├── Reward.php          ← active scope
│   │   └── RewardRedemption.php
│   └── Services/
│       ├── AuthService.php     ← JWT login/register/refresh
│       ├── UserService.php     ← Leaderboard cache, history pagination
│       ├── MachineService.php  ← Deposit with lockForUpdate(), auto-ticket
│       ├── RewardService.php   ← Redeem with pessimistic locking, refund
│       └── TicketService.php   ← Accept/complete with machine status sync
├── database/
│   ├── migrations/             ← 6 tabel + cache + jobs
│   └── seeders/
│       └── DatabaseSeeder.php  ← Demo: 1 admin, 1 officer, 1 student, 2 machines, 3 rewards
├── routes/
│   └── api.php                 ← 18 endpoints, versioned /api/v1/
└── bootstrap/
    └── app.php                 ← CheckRole alias, JSON error handler
```

## 🔌 API Endpoints (18 total)

| Method | Endpoint | Guard | Description |
|--------|----------|-------|-------------|
| `POST` | `/api/v1/auth/register` | Public | Registrasi mahasiswa |
| `POST` | `/api/v1/auth/login` | Public, Throttle 5/min | Login → JWT token |
| `GET` | `/api/v1/auth/me` | JWT | Profil user |
| `POST` | `/api/v1/auth/logout` | JWT | Invalidate token |
| `POST` | `/api/v1/auth/refresh` | JWT | Refresh token |
| `GET` | `/api/v1/users/leaderboard` | JWT | Top 10, cached 10 menit |
| `GET` | `/api/v1/users/history` | JWT | Log transaksi, paginated |
| `GET` | `/api/v1/users/campus-stats` | JWT | Total botol/CO2, cached 1 jam |
| `GET` | `/api/v1/machines` | JWT | Daftar semua mesin |
| `POST` | `/api/v1/machines/{id}/deposit` | JWT | IoT/Admin setor botol |
| `PATCH` | `/api/v1/machines/{id}/capacity` | Admin | Override kapasitas mesin |
| `GET` | `/api/v1/rewards` | JWT | Katalog hadiah aktif |
| `POST` | `/api/v1/rewards` | Admin | Tambah hadiah baru |
| `POST` | `/api/v1/rewards/{id}/redeem` | JWT, Throttle 5/min | Tukar poin |
| `DELETE` | `/api/v1/rewards/{id}` | Admin | Hapus hadiah |
| `GET` | `/api/v1/tickets` | Officer/Admin | Daftar tiket aktif |
| `PATCH` | `/api/v1/tickets/{id}/accept` | Officer/Admin | Terima tugas |
| `PATCH` | `/api/v1/tickets/{id}/complete` | Officer/Admin | Selesaikan evakuasi |

## 🛡️ Fitur Keamanan yang Sudah Diimplementasi

1. **JWT Authentication** (`php-open-source-saver/jwt-auth`)
2. **RBAC Middleware** (`CheckRole`) — Proteksi endpoint berdasarkan role
3. **Rate Limiting** — Login & Redeem di-throttle 5 request/menit
4. **Pessimistic Locking** — `lockForUpdate()` pada deposit & redeem
5. **FormRequest Validation** — Input selalu divalidasi sebelum masuk Service
6. **Hashed Passwords** — Via Eloquent cast `'password' => 'hashed'`
7. **Structured JSON Errors** — 400/404 otomatis return JSON untuk API

## 🏗️ Fitur Bisnis yang Sudah Diimplementasi

1. **Auto-Ticket** — Tiket pick-up otomatis dibuat saat mesin ≥80% penuh
2. **Cache Strategy** — Leaderboard (10 min), Campus Stats (1 jam) via `Cache::remember()`
3. **Cost Denormalization** — `cost_at_redemption` menyimpan harga historis
4. **Refund Logic** — Pembatalan redemption mengembalikan XP
5. **Level System** — `getLevel()` = floor(points / 500) + 1
6. **Composite Index** — `[user_id, created_at]` pada tabel transactions

---

## ⚠️ Hal yang Perlu Diperbaiki / Ditambahkan

### Prioritas Tinggi
1. **CORS Configuration** — Belum dikonfigurasi untuk menerima request dari domain React SPA. Perlu set `allowed_origins` di `config/cors.php` sesuai domain frontend.
2. **Admin Transaction Log Endpoint** — Blueprint menyebutkan "GLOBAL_LOGS" tab di admin panel, tapi belum ada endpoint khusus admin untuk melihat semua transaksi semua user.
3. **Machine CRUD untuk Admin** — Belum ada endpoint `POST /machines` (create) dan `PATCH /machines/{id}` (update name/location) untuk admin panel.

### Prioritas Sedang
4. **User Profile Update** — Belum ada endpoint untuk mahasiswa mengganti character/avatar.
5. **Password Change** — Belum ada endpoint ganti password.
6. **Pagination pada Global Logs** — Endpoint history sudah paginated, tapi perlu disesuaikan juga untuk admin global view.

### Prioritas Rendah (Nice-to-Have)
7. **Email Notification** — Kirim email saat mesin penuh (via Laravel Queue + database driver).
8. **API Documentation** — Bisa pakai Scribe atau Swagger untuk auto-generate docs.
9. **Feature Tests** — Unit test untuk flow kritis (deposit, redeem, ticket lifecycle).
10. **Soft Deletes** — Pada rewards dan machines agar data historis tidak hilang.

---

## 🚀 Langkah Selanjutnya

```bash
# 1. Buat database MySQL
mysql -u root -e "CREATE DATABASE rvm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Jalankan migrasi
cd website/backend
php artisan migrate

# 3. Seed demo data
php artisan db:seed

# 4. Jalankan server development
php artisan serve

# 5. Test login via curl
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rvm.test","password":"password"}'
```
