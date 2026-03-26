# 📊 Panduan Menghubungkan E-Voting ke Google Sheets (Versi Full)

Panduan ini menjelaskan cara menghubungkan sistem **E-Voting** dengan **Google Sheets** sebagai database, lengkap dengan tampilan landing page profesional dan fitur **Admin Dashboard (Real Count)**.

---
## 🚀 Demo Aplikasi
🔗 https://evoting.smksteknologi.sch.id/

---

## 🚀 Fitur Utama
- ✅ Landing Page profesional
- ✅ Sistem login admin
- ✅ Dashboard Real Count
- ✅ Integrasi Google Sheets sebagai database
- ✅ Pencatatan suara otomatis

---

## 📁 LANGKAH 1: Persiapan Database (Google Sheets)

Pastikan Anda memiliki **3 Sheet** berikut:

### 1. Data_Siswa
| Kolom | Keterangan |
|------|----------|
| A | NIS |
| B | Nama Siswa |
| C | Status |

---

### 2. Data_Paslon
| Kolom | Keterangan |
|------|----------|
| A | ID |
| B | Tipe |
| C | Nomor |
| D | Nama |
| E | Visi |
| F | Foto_URL |

---

### 3. Log_Suara
| Kolom | Keterangan |
|------|----------|
| A | Waktu |
| B | NIS |
| C | Pilihan_OSIS |
| D | Pilihan_MPK |

---

## ⚙️ LANGKAH 2: Update Kode Backend (Code.gs)

1. Buka **Google Apps Script**
2. Masuk ke file `Code.gs`
3. Hapus semua kode yang ada
4. Ganti dengan kode dari repository ini

---

## 🌐 LANGKAH 3: Update Kode Frontend (Index.html)

1. Buka file `Index.html`
2. Hapus seluruh isi kode
3. Paste kode dari repository ini

---

## 🔄 LANGKAH 4: Deploy Ulang (PENTING!)

Setelah melakukan perubahan pada `Code.gs` dan `Index.html`, lakukan deploy ulang:

1. Klik tombol **Deploy** di pojok kanan atas
2. Pilih **Manage deployments**
3. Klik ikon **Edit (Pensil)**
4. Pada bagian **Version**, pilih:
   - **New Version**
5. Klik **Deploy**
6. Refresh halaman Web App

---

## 🔐 Catatan Login Admin

Secara default (bawaan), kredensial admin terdapat pada file `Code.gs` (sekitar baris ke-51):

Username: admin  
Password: admin123  

⚠️ **Penting:**
- Segera ubah username dan password sesuai kebutuhan panitia/sekolah
- Jangan gunakan kredensial default untuk produksi

---

## 📌 Catatan Tambahan
- Pastikan struktur Google Sheets sesuai agar sistem berjalan dengan baik
- Periksa kembali izin akses saat deploy Web App
- Gunakan akun Google yang memiliki akses ke spreadsheet

---

## 🧑‍💻 Lisensi
Yusup Mad Cani, S.Kom.
Proyek ini bebas digunakan untuk kebutuhan sekolah atau organisasi.
Semoga Menjadi Berkah Bagi Saya
