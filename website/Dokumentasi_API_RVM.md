# 📚 Dokumentasi API RVM Gamification

**Base URL:** `http://127.0.0.1:8000/api/v1`
**Header Global (Bila Autentikasi Diperlukan):**
- `Accept: application/json`
- `Content-Type: application/json`
- `Authorization: Bearer <jwt_token>`

---

## 🔐 1. Authentication (Auth)

### 1.1. Register Mahasiswa
**Endpoint:** `POST /auth/register`
**Auth Required:** No
**Request Body:**
```json
{
  "name": "Naufal Ahmad",
  "nim": "20241010",
  "email": "naufal2@student.test",
  "password": "password",
  "password_confirmation": "password",
  "character": "ninja.png" 
}
```
*(Catatan: `character` opsional)*
**Success Response (201 Created):**
Mengembalikan data `message`, `user`, dan `token` (access_token, token_type, expires_in).

### 1.2. Login
**Endpoint:** `POST /auth/login`
**Auth Required:** No
**Request Body:**
```json
{
  "email": "admin@rvm.test",
  "password": "password"
}
```
**Success Response (200 OK):**
```json
{
    "message": "Login berhasil.",
    "user": {
        "id": 1,
        "name": "Admin RVM",
        "nim": null,
        "email": "admin@rvm.test",
        "role": "admin",
        "character": "ninja.png",
        "points": 0,
        "level": 1
    },
    "token": {
        "access_token": "eyJ...",
        "token_type": "bearer",
        "expires_in": 86400
    }
}
```

### 1.3. Get Current User (Me)
**Endpoint:** `GET /auth/me`
**Auth Required:** Yes
**Response (200 OK):** Mengembalikan data user yang sedang login.

### 1.4. Refresh Token
**Endpoint:** `POST /auth/refresh`
**Auth Required:** Yes
**Response (200 OK):** Mengembalikan JWT Token baru.

### 1.5. Logout
**Endpoint:** `POST /auth/logout`
**Auth Required:** Yes
**Response (200 OK):** `{"message": "Logout berhasil."}` (Token di-blacklist).

---

## 🎮 2. Users & Gamification

### 2.1. Leaderboard (Top 10)
**Endpoint:** `GET /users/leaderboard`
**Auth Required:** Yes
**Response (200 OK):**
```json
{
    "leaderboard": [
        {
            "id": 3,
            "name": "Naufal Mahasiswa",
            "nim": "2024001",
            "role": "student",
            "character": "ninja.png",
            "points": 750,
            "level": 2
        }
    ]
}
```

### 2.2. History Transaksi Pribadi
**Endpoint:** `GET /users/history`
**Auth Required:** Yes
**Response (200 OK):** Pagination object berisi daftar transaksi (earn & redeem) dari user yang sedang login.

### 2.3. Statistik Kampus Global
**Endpoint:** `GET /users/campus-stats`
**Auth Required:** Yes
**Response (200 OK):**
```json
{
    "stats": {
        "total_bottles": 1500,
        "total_co2_saved": 60.0,
        "total_filament": 300.0
    }
}
```

---

## ♻️ 3. Machines (Mesin RVM)

### 3.1. List Semua Mesin
**Endpoint:** `GET /machines`
**Auth Required:** Yes
**Response (200 OK):**
```json
{
    "machines": [
        {
            "id": 1,
            "name": "RVM-01",
            "location": "Gedung A - Lantai 1",
            "max_capacity": 250,
            "current_bottles": 47,
            "percentage": 19,
            "status": "online"
        }
    ]
}
```

### 3.2. Deposit Botol (Simulasi IoT / Transaksi)
**Endpoint:** `POST /machines/{id}/deposit`
**Auth Required:** Yes (Idealnya sistem/Admin)
**Request Body:**
```json
{
    "user_id": 3,
    "bottles": 5
}
```
**Success Response (200 OK):** Mengembalikan object transaksi dan status mesin terbaru.
**Error (400 Bad Request):** Jika mesin penuh atau maintenance.

### 3.3. Update Kapasitas Mesin
**Endpoint:** `PATCH /machines/{id}/capacity`
**Auth Required:** Yes (Role: `admin` saja)
**Request Body:**
```json
{
    "max_capacity": 500
}
```
**Response (200 OK):** `message` dan object mesin terbaru.

---

## 🎁 4. Rewards (Katalog Hadiah)

### 4.1. List Hadiah Aktif
**Endpoint:** `GET /rewards`
**Auth Required:** Yes
**Response (200 OK):**
```json
{
    "rewards": [
        {
            "id": 1,
            "name": "Voucher Kantin 10K",
            "cost": 1500,
            "description": "Voucher makan...",
            "is_active": true
        }
    ]
}
```

### 4.2. Tambah Hadiah Baru
**Endpoint:** `POST /rewards`
**Auth Required:** Yes (Role: `admin` saja)
**Request Body:**
```json
{
    "name": "Gantungan Kunci RVM",
    "cost": 300,
    "description": "Gantungan kunci akrilik",
    "is_active": true
}
```
**Response (201 Created):** Object hadiah yang baru dibuat.

### 4.3. Tukar Hadiah (Redeem)
**Endpoint:** `POST /rewards/{id}/redeem`
**Auth Required:** Yes (Throttle: Maks 5x per menit)
**Response (200 OK):**
```json
{
    "message": "Hadiah berhasil ditukar!",
    "redemption": {
        "id": 1,
        "cost_at_redemption": 1500,
        "status": "pending",
        "reward": { ... }
    },
    "remaining_points": 500
}
```
**Error (400 Bad Request):** Jika poin/XP tidak cukup atau hadiah non-aktif.

### 4.4. Hapus Hadiah
**Endpoint:** `DELETE /rewards/{id}`
**Auth Required:** Yes (Role: `admin` saja)
**Response (200 OK):** `{"message": "Hadiah berhasil dihapus."}`

---

## 👷‍♂️ 5. Pick Up Tickets (Evakuasi Botol)

### 5.1. List Tiket Aktif
**Endpoint:** `GET /tickets`
**Auth Required:** Yes (Role: `admin` atau `officer`)
**Response (200 OK):**
```json
{
    "tickets": [
        {
            "id": 1,
            "ticket_code": "TCK-4819",
            "capacity_at_issue": 210,
            "status": "pending",
            "machine": { ... },
            "officer": null,
            "created_at": "2026-08-27T..."
        }
    ]
}
```

### 5.2. Accept Tiket (Oleh Petugas)
**Endpoint:** `PATCH /tickets/{id}/accept`
**Auth Required:** Yes (Role: `admin` atau `officer`)
**Response (200 OK):** Status tiket berubah jadi `accepted`, `officer` terisi data petugas yang menerima, dan status mesin otomatis menjadi `maintenance`.

### 5.3. Selesaikan Tiket (Evakuasi Selesai)
**Endpoint:** `PATCH /tickets/{id}/complete`
**Auth Required:** Yes (Role: `admin` atau `officer`)
**Response (200 OK):** Status tiket menjadi `completed`, status mesin kembali ke `online`, dan jumlah botol (`current_bottles`) di mesin kembali jadi `0`.
