# Spesifikasi Desain: Aliran Informasi & Logistik RVM Kampus
**Penanggung Jawab:** Naufal (Logistics Information System & Route Optimization)

## 1. Ringkasan Pemahaman
Dokumen ini merangkum desain arsitektur sistem informasi rantai pasok untuk *Reverse Vending Machine* (RVM). 
* **Tujuan:** Merancang aliran data *real-time* dari RVM ke Dashboard Petugas dan menyajikan data hilirisasi daur ulang ke pengguna.
* **Pendekatan:** Sistem hibrida (input admin manual yang disiapkan untuk transisi sensor IoT otomatis).
* **Fokus:** Menghindari *overflow* mesin (mesin kepenuhan) dan inefisiensi rute pengangkutan.

## 2. Asumsi & Kebutuhan Non-Fungsional
* **Skala:** Melayani lingkungan kampus (ribuan mahasiswa, ratusan transaksi harian).
* **Ketersediaan:** Optimal pada jam operasional kampus (06.00 - 20.00).
* **Keamanan:** Membutuhkan *Role-Based Access Control* (RBAC) untuk membedakan UI Mahasiswa, Dashboard Petugas, dan Admin Koperasi.

## 3. Desain Aliran Informasi Logistik (Data Flow)
Sistem menggunakan pendekatan **Jadwal Dinamis berbasis On-Demand Ticketing**.
1. **Input:** Kapasitas wadah RVM di-update ke *database* secara berkala (0-100%).
2. **Evaluasi Threshold:** 
   * Jika kapasitas menyentuh **>= 80%**, sistem memicu pembuatan *Pick-up Ticket* secara otomatis di Dashboard Petugas.
   * Jika kapasitas **100%**, UI di aplikasi Mahasiswa berubah menjadi "Sedang Dikosongkan" (mencegah *downtime/error*).
3. **Eksekusi:** Petugas menekan *"Accept"* -> Kosongkan Mesin -> Tekan *"Complete"*.
4. **Reset:** Sistem mengembalikan kapasitas ke 0% dan mesin kembali *Online*.

## 4. SOP Petugas Operasional (Berbasis Sistem)
1. **Monitoring:** Petugas wajib *login* ke Dashboard Operasional pada jam kerja.
2. **Penerimaan Tugas:** Saat muncul *Pick-up Ticket* (Alarm 80%), petugas harus menekan **"Accept Task"** untuk mengunci tugas agar tidak tumpang tindih dengan petugas lain.
3. **Eksekusi Fisik:** Petugas menuju lokasi, mengevakuasi botol, dan mengecek secara visual (maintenance fisik) apakah ada botol yang menyumbat sensor.
4. **Hilirisasi & Pelaporan:** Menekan tombol **"Task Complete"** di aplikasi, lalu menyerahkan karung botol ke titik pengepulan/koperasi kampus untuk proses daur ulang.

## 5. Fitur Utama & Penyajian Informasi (UI/UX Mahasiswa)
Berdasarkan hasil survei preferensi pengguna (Top 6), desain antarmuka aplikasi/website sisi Mahasiswa akan memprioritaskan fitur-fitur berikut:
1. **Panduan Penggunaan Mesin RVM (Skor 4.68):** Halaman *Guidebook* yang memuat Edu-Infografis visual mengenai cara kerja mesin dan alur perjalanan botol dari mulai disetor hingga diolah menjadi Filamen 3D.
2. **Riwayat Penukaran Reward (Skor 4.38):** Halaman log histori yang mencatat riwayat transaksi penukaran poin milik pengguna.
3. **Informasi Hasil Pengolahan Botol Plastik Menjadi Filamen (Skor 4.34):** Tampilan edukasi dan *Dashboard Statistik Kampus* (menampilkan akumulasi total botol yang berhasil diselamatkan dan konversi nilainya terhadap emisi CO2 serta filamen 3D yang dihasilkan).
4. **Gambar dan Spesifikasi Mesin RVM (Skor 4.34):** Menampilkan titik letak lokasi RVM di kampus beserta foto mesin, petunjuk teknis, dan status *real-time* (Contoh: "Tersedia" atau "Sedang Dikosongkan/Penuh").
5. **Notifikasi Reward dan Poin (Skor 4.34):** Sistem notifikasi (seperti *web-push notification*) yang secara otomatis memberitahukan pengguna saat poin mereka bertambah atau ketika proses *withdraw/reward* berhasil.
6. **Dashboard Poin Pengguna (Skor 4.32):** Fitur utama di beranda (Homepage) yang menampilkan saldo poin personal pengguna secara *real-time*.

---
## Decision Log (Log Keputusan Desain)
* **Pemicu Pengangkutan:** Memilih *On-Demand Ticketing* berbasis kapasitas dinamis daripada rute VRP statis karena mencegah pemborosan waktu mengunjungi mesin kosong.
* **Format Data:** Memilih *Hybrid Input* agar website tetap dapat dibangun dan diuji (melalui admin panel) sembari menunggu kesiapan *hardware* RVM.
* **Pelacakan Botol:** Memilih tampilan statistik *aggregate* se-kampus alih-alih pelacakan kode botol individual, guna mencegah kompleksitas *software* dan *hardware* (*YAGNI*).
