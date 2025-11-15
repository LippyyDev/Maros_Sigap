# MAROS SIGAP

**Sistem Informasi Geografis & Pelaporan**

Platform digital prototype untuk melaporkan masalah fasilitas publik di Kabupaten Maros. Aplikasi ini memungkinkan warga untuk melaporkan masalah infrastruktur secara digital dengan akurasi geografis yang tinggi.

## 📋 Tentang Aplikasi

MAROS SIGAP adalah **prototype aplikasi** yang dirancang untuk sistem pelaporan infrastruktur di Kabupaten Maros. Aplikasi ini memungkinkan:

- 📍 Pelaporan masalah infrastruktur dengan lokasi GPS yang akurat
- 📸 Upload foto bukti untuk mendukung laporan
- 📊 Tracking status laporan secara real-time
- 🗺️ Visualisasi laporan di peta interaktif
- 👨‍💼 Mode Admin untuk mengelola status laporan

**Catatan:** Aplikasi ini adalah prototype yang dibuat untuk tujuan demo dan lomba. Dalam implementasi produksi, diperlukan pengembangan lebih lanjut dan integrasi dengan sistem backend yang lebih robust.

## ✨ Fitur Utama

### 1. **Peta Interaktif**
- Menggunakan teknologi OpenStreetMap dengan Leaflet
- Pilih lokasi menggunakan GPS atau klik manual di peta
- Visualisasi semua laporan di peta dengan marker

### 2. **Form Pelaporan**
- Kategori masalah: Jalan Rusak, Lampu Jalan Mati, Drainase Tersumbat, Sampah Menumpuk, Fasilitas Umum
- Upload foto bukti
- Deskripsi detail masalah
- Koordinat GPS otomatis

### 3. **Tracking Status**
- **Pending**: Laporan baru, menunggu penanganan
- **Diproses**: Sedang ditangani oleh tim terkait
- **Selesai**: Masalah sudah diperbaiki

### 4. **Mode Admin**
- Toggle ON/OFF di navbar
- Ketika ON: Admin dapat mengubah status dan menghapus laporan
- Ketika OFF: Hanya dapat melihat laporan (read-only)

### 5. **Dark Mode**
- Toggle dark/light mode
- Preferensi tersimpan di localStorage
- Transisi halus antar tema

## 🎨 Pembaruan UI

Aplikasi telah mengalami pembaruan UI yang signifikan untuk memberikan pengalaman pengguna yang lebih modern dan minimalis:

### Font & Typography
- **Font Poppins** digunakan di seluruh aplikasi untuk tampilan yang lebih modern dan mudah dibaca
- Ukuran font yang responsif untuk berbagai perangkat

### Design System
- **Minimalis & Modern**: Desain yang bersih dengan fokus pada konten
- **Color Scheme**: Skema warna biru sebagai primary dengan dukungan dark mode
- **Spacing**: Spacing yang konsisten dan proporsional
- **Shadows & Borders**: Shadow halus dan border radius yang konsisten

### Responsive Design
- **Mobile First**: Optimized untuk mobile devices
- **Tablet Support**: Layout yang disesuaikan untuk tablet (1024px)
- **Mobile Optimization**: Layout khusus untuk mobile (768px)
- **Small Mobile**: Optimasi untuk layar kecil (480px)

### UI Components
- **Cards**: Card design dengan hover effects dan gradient accents
- **Buttons**: Button dengan animasi hover yang halus
- **Forms**: Form inputs dengan focus states yang jelas
- **Navigation**: Navbar dengan glassmorphism effect

### Animations
- **GSAP Animations**: Animasi halus menggunakan GSAP
- **Scroll Animations**: Animasi saat scroll menggunakan ScrollTrigger
- **Hover Effects**: Efek hover pada semua elemen interaktif
- **Transitions**: Transisi halus untuk semua perubahan state

## 🔥 Migrasi ke Firebase Storage

Aplikasi telah dimigrasikan dari **LocalStorage** ke **Firebase Firestore** untuk penyimpanan data yang lebih robust dan real-time.

### Sebelumnya (LocalStorage)
- Data disimpan di browser lokal
- Tidak sinkron antar perangkat
- Terbatas pada satu browser
- Tidak ada real-time updates

### Sekarang (Firebase Firestore)
- ✅ **Cloud Storage**: Data tersimpan di cloud
- ✅ **Real-time Sync**: Update real-time antar semua perangkat
- ✅ **Scalable**: Dapat menangani banyak data dan user
- ✅ **Reliable**: Backup otomatis dan recovery
- ✅ **Security**: Aturan keamanan Firebase

### Fitur Firebase yang Digunakan
- **Firestore Database**: Penyimpanan data laporan
- **Real-time Listeners**: Update otomatis saat ada perubahan
- **Collection Structure**: 
  ```
  reports/
    {reportId}/
      - category: string
      - description: string
      - lat: number
      - lng: number
      - name: string
      - photo: string (base64)
      - status: "Pending" | "Diproses" | "Selesai"
      - createdAt: timestamp
  ```

### Konfigurasi Firebase
Untuk setup Firebase, lihat file `FIREBASE_SETUP.md` yang berisi:
- Instruksi setup Firebase project
- Konfigurasi Firestore
- Aturan keamanan (Security Rules)
- Setup environment variables

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur semantic dan modern
- **CSS3**: Custom properties, Grid, Flexbox, Animations
- **JavaScript (ES6+)**: Modern JavaScript features
- **Firebase Firestore**: Database dan real-time sync
- **Leaflet.js**: Peta interaktif OpenStreetMap
- **GSAP**: Animasi smooth dan profesional
- **Poppins Font**: Typography modern

## 📁 Struktur Project

```
Maros/
├── index.html              # Halaman beranda
├── index.css               # Stylesheet utama
├── index.js                # JavaScript utama
├── README.md               # Dokumentasi ini
├── FIREBASE_SETUP.md       # Panduan setup Firebase
└── page/
    ├── html/
    │   ├── laporan.html    # Halaman pelaporan
    │   └── carakerja.html  # Halaman cara kerja
    ├── css/
    │   ├── laporan.css     # Stylesheet laporan
    │   └── carakerja.css   # Stylesheet cara kerja
    └── js/
        ├── firebase-config.js  # Konfigurasi Firebase
        ├── laporan.js          # Logika halaman laporan
        ├── carakerja.js        # Logika halaman cara kerja
        ├── dark-mode.js        # Dark mode functionality
        └── admin-mode.js       # Admin mode functionality
```

## 🚀 Cara Menggunakan

### 1. Setup Firebase
1. Buat project Firebase di [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy konfigurasi ke `page/js/firebase-config.js`
4. Setup Security Rules (lihat `FIREBASE_SETUP.md`)

### 2. Buka Aplikasi
- Buka `index.html` di browser
- Atau serve menggunakan local server (disarankan)

### 3. Fitur Pengguna
- **Laporkan Masalah**: Klik "Laporkan" → Pilih lokasi → Isi form → Submit
- **Lihat Laporan**: Scroll ke bawah untuk melihat daftar laporan
- **Detail Laporan**: Klik laporan untuk melihat detail

### 4. Fitur Admin
- **Aktifkan Mode Admin**: Klik toggle "Mode Admin: OFF" di navbar
- **Ubah Status**: Buka detail laporan → Klik "Set Diproses" atau "Set Selesai"
- **Hapus Laporan**: Klik "Hapus" pada detail laporan

## 📱 Responsive Design

Aplikasi fully responsive dan dioptimalkan untuk:
- 📱 **Mobile** (320px - 768px)
- 📱 **Tablet** (768px - 1024px)
- 💻 **Desktop** (1024px+)

### Breakpoints
- `@media (max-width: 1024px)` - Tablet
- `@media (max-width: 768px)` - Mobile
- `@media (max-width: 480px)` - Small Mobile

## 🎯 Status Prototype

Aplikasi ini adalah **prototype** yang dibuat untuk:
- ✅ Demo dan presentasi
- ✅ Lomba/kompetisi
- ✅ Testing konsep dan UX
- ✅ Validasi kebutuhan user

### Catatan Penting
- ⚠️ **Bukan Produksi**: Aplikasi ini belum siap untuk production use
- ⚠️ **Data Demo**: Data yang digunakan adalah untuk keperluan demo
- ⚠️ **Security**: Perlu review security rules untuk production
- ⚠️ **Performance**: Perlu optimasi untuk scale yang lebih besar

## 🔐 Keamanan

### Firebase Security Rules
Pastikan Security Rules dikonfigurasi dengan benar:
- Read: Public (untuk demo)
- Write: Authenticated users (untuk production)

Lihat `FIREBASE_SETUP.md` untuk detail Security Rules.

## 📝 Lisensi

Aplikasi ini dibuat untuk keperluan demo dan lomba. Semua hak cipta dilindungi.

## 👥 Kontributor

Dibuat untuk lomba dan demo - Kabupaten Maros

## 📞 Support

Untuk pertanyaan atau masalah, silakan hubungi tim pengembang.

---

**MAROS SIGAP** - Prototype App untuk Pelaporan Infrastruktur Kabupaten Maros

*Versi: 1.0.0 | Status: Prototype*

