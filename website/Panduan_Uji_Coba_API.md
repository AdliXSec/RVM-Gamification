# 🧪 Panduan Uji Coba API RVM (Laravel JWT)

Writeup ini berisi langkah-langkah komprehensif untuk menguji seluruh fungsionalitas Backend RVM yang telah dibangun. Anda bisa menggunakan `curl` (lewat terminal) atau mengimpor request ke **Postman**.

---

## 🏗️ Persiapan (Abaikan jika sudah jalan)

Pastikan server Laravel sudah berjalan di terminal terpisah:
```bash
cd /run/media/leexy/lixxy/RVM/website/backend
php artisan serve
```
*(Server akan berjalan di `http://127.0.0.1:8000`)*

---

## 🔑 1. Autentikasi (JWT)

Semua endpoint yang diproteksi membutuhkan header:
`Authorization: Bearer <TOKEN_ANDA>`

### A. Login sebagai Mahasiswa (Naufal)
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"naufal@student.test","password":"password"}'
```
> **Tindakan:** Salin nilai `access_token` dari respons ini. Kita akan menyebutnya sebagai `$TOKEN_MAHASISWA`.

### B. Login sebagai Admin
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@rvm.test","password":"password"}'
```
> **Tindakan:** Salin nilai `access_token` dari respons ini. Kita akan menyebutnya sebagai `$TOKEN_ADMIN`.

### C. Login sebagai Petugas (Officer)
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"officer@rvm.test","password":"password"}'
```
> **Tindakan:** Salin nilai `access_token` dari respons ini. Kita akan menyebutnya sebagai `$TOKEN_PETUGAS`.

---

## 🧑‍🎓 2. Flow Mahasiswa & Gamification

Gunakan `$TOKEN_MAHASISWA` untuk perintah-perintah di bawah ini.

### A. Cek Profil & Points (XP)
```bash
curl -X GET http://127.0.0.1:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN_MAHASISWA" \
  -H "Accept: application/json"
```
*Perhatikan jumlah `points` dan `level` dari Naufal.*

### B. Cek Leaderboard
```bash
curl -X GET http://127.0.0.1:8000/api/v1/users/leaderboard \
  -H "Authorization: Bearer $TOKEN_MAHASISWA" \
  -H "Accept: application/json"
```

### C. Lihat Katalog Hadiah
```bash
curl -X GET http://127.0.0.1:8000/api/v1/rewards \
  -H "Authorization: Bearer $TOKEN_MAHASISWA" \
  -H "Accept: application/json"
```
*Catat salah satu ID dari hadiah (misal ID 2 seharga 500 XP).*

### D. Tukar XP dengan Hadiah (Redeem)
```bash
# Asumsi ID hadiah = 2
curl -X POST http://127.0.0.1:8000/api/v1/rewards/2/redeem \
  -H "Authorization: Bearer $TOKEN_MAHASISWA" \
  -H "Accept: application/json"
```
*XP Naufal akan berkurang. Anda bisa memanggil endpoint `/api/v1/auth/me` lagi untuk memverifikasi XP-nya.*

### E. Cek Histori Transaksi
```bash
curl -X GET http://127.0.0.1:8000/api/v1/users/history \
  -H "Authorization: Bearer $TOKEN_MAHASISWA" \
  -H "Accept: application/json"
```
*Anda akan melihat log "Tukar: Sticker Pack Eco-Warrior".*

---

## 🤖 3. Flow Mesin IoT & Poin (Admin/Sistem)

Gunakan `$TOKEN_ADMIN` untuk mensimulasikan alat RVM mendepositokan botol.

### A. Lihat Status Semua Mesin
```bash
curl -X GET http://127.0.0.1:8000/api/v1/machines \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Accept: application/json"
```
*Catat ID mesin (misal ID 1: kapasitas maksimal 250).*

### B. Simulasi Penyetoran Botol (IoT mengirim data)
Simulasi: Mesin 1 menyetorkan 25 botol untuk mahasiswa dengan ID 3 (Naufal).
```bash
curl -X POST http://127.0.0.1:8000/api/v1/machines/1/deposit \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 3,
    "bottles": 25
  }'
```
*Naufal akan mendapatkan 2500 XP. `current_bottles` mesin akan bertambah 25.*

### C. Simulasi Mesin Penuh (Memicu Auto-Ticket)
Simulasi: Setor 160 botol ke mesin 1 agar kapasitasnya tembus >80%.
```bash
curl -X POST http://127.0.0.1:8000/api/v1/machines/1/deposit \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "user_id": 3,
    "bottles": 160
  }'
```
*(Sistem akan otomatis membuat `PickUpTicket` karena botol mesin sudah melewati ambang batas 80%).*

---

## 👷‍♂️ 4. Flow Petugas (Pick Up Ticket)

Gunakan `$TOKEN_PETUGAS` untuk perintah di bawah ini.

### A. Lihat Tiket Aktif
```bash
curl -X GET http://127.0.0.1:8000/api/v1/tickets \
  -H "Authorization: Bearer $TOKEN_PETUGAS" \
  -H "Accept: application/json"
```
*Anda akan melihat 1 tiket dengan status `pending` hasil dari langkah 3C. Catat ID tiketnya (misal ID 1).*

### B. Petugas Menerima Tiket
```bash
curl -X PATCH http://127.0.0.1:8000/api/v1/tickets/1/accept \
  -H "Authorization: Bearer $TOKEN_PETUGAS" \
  -H "Accept: application/json"
```
*Status tiket menjadi `accepted`, `officer_id` terisi. Status mesin akan berubah otomatis dari `online` menjadi `maintenance`.*

### C. Petugas Menyelesaikan Evakuasi
```bash
curl -X PATCH http://127.0.0.1:8000/api/v1/tickets/1/complete \
  -H "Authorization: Bearer $TOKEN_PETUGAS" \
  -H "Accept: application/json"
```
*Status tiket menjadi `completed`. Status mesin akan kembali menjadi `online`, dan `current_bottles` mesin di-reset ke 0.*

---

## 📊 5. Cek Ulang Statistik

Gunakan token siapa saja (publik API).

```bash
curl -X GET http://127.0.0.1:8000/api/v1/users/campus-stats \
  -H "Authorization: Bearer $TOKEN_MAHASISWA" \
  -H "Accept: application/json"
```
*Anda akan melihat kalkulasi statistik `total_bottles`, `total_co2_saved`, dan `total_filament` di seluruh kampus.*

---
> 💡 **Tips Pengujian:**
> Jika Anda menggunakan Postman, Anda tidak perlu mengetikkan `Authorization: Bearer ...` berulang kali. Cukup masukkan variabel `{{token}}` di bagian **Authorization > Type: Bearer Token**, dan simpan token di tab Environment Variables.
