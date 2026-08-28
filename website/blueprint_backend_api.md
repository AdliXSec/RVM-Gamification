# RVM Backend Architecture Blueprint (Laravel REST API)

Berdasarkan *Database Blueprint* yang telah dibuat, arsitektur backend ini dirancang sebagai **Modular Monolith REST API** menggunakan **Laravel**. Pilihan ini sangat ideal untuk *cheap hosting* (cPanel) karena meminimalisir kompleksitas operasional (tidak butuh Docker/Kubernetes) namun tetap terstruktur rapi dan *scalable* di level kode.

---

## 1. Arsitektur Sistem & Aliran Data (System Architecture)

```mermaid
graph TD
    %% Clients
    React[React SPA Frontend]
    IoT[Mesin RVM IoT]
    
    %% Infrastructure (cPanel)
    subgraph cPanel Hosting
        Web[Apache / LiteSpeed]
        
        subgraph Laravel Backend
            Router[API Router & Rate Limiter]
            Auth[JWT & RBAC Middleware]
            
            %% Service Modules
            subgraph Service Layer (Business Logic)
                AuthSvc[Auth Service]
                UserSvc[User & Leaderboard Service]
                MachineSvc[Machine & IoT Service]
                RewardSvc[Reward & Redeem Service]
                TicketSvc[Ticketing Service]
            end
            
            %% Data Access
            ORM[Eloquent ORM + Pessimistic Locking]
            Cache[File/Database Cache]
        end
        
        DB[(MySQL / MariaDB)]
    end

    %% Flow
    React -->|HTTP/REST| Web
    IoT -->|HTTP Webhook| Web
    Web --> Router
    Router --> Auth
    Auth --> AuthSvc
    Auth --> UserSvc
    Auth --> MachineSvc
    Auth --> RewardSvc
    Auth --> TicketSvc
    
    AuthSvc --> ORM
    UserSvc --> ORM
    UserSvc -.-> Cache
    MachineSvc --> ORM
    RewardSvc --> ORM
    TicketSvc --> ORM
    
    ORM --> DB
```

---

## 2. API Contract & Service Boundaries (Endpoints)

Gunakan *API Versioning* (misal `/api/v1/`) sejak hari pertama. Berikut adalah definisi kontrak RESTful API berdasarkan fitur UI:

### A. Auth Module (`/api/v1/auth`)
*   `POST /login` : Autentikasi dan menerima token JWT.
*   `POST /register` : Mendaftarkan akun mahasiswa.
*   `GET /me` : Mengambil data profil *user* yang sedang login.

### B. User & Gamification Module (`/api/v1/users`)
*   `GET /leaderboard` : Mengambil top 10/50 mahasiswa. **(Cached 10 menit)**.
*   `GET /history` : Mengambil log transaksi user yang sedang login (*Pagination*).
*   `GET /campus-stats` : Mengambil total botol, CO2, filamen kampus. **(Cached 1 jam)**.

### C. Machine & IoT Module (`/api/v1/machines`)
*   `GET /` : Menampilkan status mesin (Untuk Dashboard).
*   `POST /{id}/deposit` : **[IoT Webhook / Admin]** Endpoint untuk mesin mengirim data jumlah botol masuk. 
    *   *Payload:* `{ "user_id": 123, "bottles": 5 }`
*   `PATCH /{id}/capacity` : **[Admin Only]** Override `max_capacity`.

### D. Reward Module (`/api/v1/rewards`)
*   `GET /` : Menampilkan katalog hadiah yang aktif (`is_active = true`).
*   `POST /{id}/redeem` : Melakukan penukaran poin. Membutuhkan **Pessimistic Locking**.
    *   *Response 200:* Sukses menukar, sisa saldo.
    *   *Response 400:* XP tidak cukup atau stok habis.

### E. Ticketing Module (`/api/v1/tickets`)
*   `GET /` : **[Admin/Officer]** Menampilkan tiket aktif.
*   `PATCH /{id}/accept` : **[Officer]** Menerima tugas penjemputan. Status mesin berubah jadi `Maintenance`.
*   `PATCH /{id}/complete` : **[Officer]** Menyelesaikan tugas. Mesin di-reset ke `0` botol, status `Online`.

---

## 3. Security, Authentication & RBAC

1.  **Authentication Layer:** Menggunakan `tymon/jwt-auth`. Token JWT akan disimpan di *client* (Local Storage / HTTP-only Cookie).
2.  **Role-Based Access Control (RBAC):** Buat Middleware Laravel kustom:
    *   `CheckRole:admin` -> Melindungi rute Edit Kapasitas, Global Logs.
    *   `CheckRole:officer,admin` -> Melindungi rute Pick-up Tickets.
3.  **API Rate Limiting (Throttle):** Konfigurasi di `RouteServiceProvider` atau `bootstrap/app.php`:
    *   `60 requests/minute` untuk endpoint biasa.
    *   `5 requests/minute` untuk rute `/login` atau `/redeem` (Mencegah *Brute-force* dan DDoS).

---

## 4. Resilience & Concurrency (Mencegah Bug Race Condition)

Karena arsitektur berjalan di cPanel yang resource-nya terbatas, kita harus menjaga integritas data tanpa membebani server:

*   **Pessimistic Locking (DB Transaction):**
    Pisahkan *Business Logic* dari *Controller* ke dalam folder `app/Services/`.
    Contoh di `RewardService.php`:
    ```php
    public function redeemReward($userId, $rewardId) {
        return DB::transaction(function () use ($userId, $rewardId) {
            $user = User::lockForUpdate()->findOrFail($userId);
            $reward = Reward::findOrFail($rewardId);
            
            if ($user->points < $reward->cost) {
                abort(400, 'XP Tidak Cukup');
            }
            
            // Lakukan pemotongan dan pencatatan...
        });
    }
    ```
*   **Database Queue (Opsional):** Jika sistem nantinya perlu mengirim Email Notifikasi saat tiket penuh, jangan gunakan Sync. Gunakan fitur Queue Laravel dengan driver `database` (karena cPanel jarang mendukung Redis).

---

## 5. Deployment & Observability di cPanel

1.  **Struktur Folder Aman:** 
    *   Folder Laravel *core* diletakkan di `/home/user/rvm-backend/` (di luar jangkauan publik).
    *   Folder `public/` milik Laravel di-*symlink* ke `/home/user/public_html/api`.
    *   Build React Vite diletakkan langsung di `/home/user/public_html/`.
2.  **Caching Setup:** 
    *   Ubah `CACHE_DRIVER=file` di `.env` (Paling stabil untuk shared hosting).
    *   Jalankan `php artisan optimize` (Route, Config, dan View cache) saat deployment.
3.  **Logging & Error Tracking:** 
    *   Log transaksi bisnis sudah tersimpan di tabel `transactions` (sesuai *database blueprint*).
    *   Error sistem Laravel akan masuk ke `storage/logs/laravel.log`. Atur `LOG_CHANNEL=daily` agar file log tidak membengkak dan membuat *disk full*.
