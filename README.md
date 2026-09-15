# ⚡ XII PPLG 1 - Website Kelas (Neobrutalism Edition)

Selamat datang di repository website kelas **XII PPLG 1 (SMKN 1 Depok)**! Website ini dibangun murni menggunakan pendekatan **Frontend-Only** dengan bahasa desain **Neobrutalism** — desain yang berani, kasar, bayangan tebal (hard shadows), warna mencolok, dan tipografi raksasa.

---

## 🛠️ Tech Stack

Website ini dibangun menggunakan teknologi modern terbaru:
- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi:** [Framer Motion](https://www.framer.com/motion/)
- **Font:** Space Grotesk (via `next/font/google`)

---

## 🚀 Getting Started (Cara Menjalankan Project)

Untuk teman-teman yang mau ikut berkontribusi atau melanjutkan project ini, ikuti langkah berikut:

### 1. Prerequisites
Pastikan kamu sudah menginstall **Node.js** (rekomendasi versi 18 atau 20+) dan `npm`.

### 2. Clone & Install Dependencies
Buka terminal dan jalankan:
```bash
# Clone repository ini (sesuaikan link jika sudah di-upload ke GitHub)
# git clone <url-repo-kalian>

# Masuk ke direktori project
cd website-kelas

# Install semua module dan dependency
npm install
```

### 3. Jalankan Local Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browsermu. Setiap perubahan kode akan langsung terlihat secara *real-time* (Hot Reload).

---

## 📁 Struktur Folder Utama

Penting untuk mengetahui di mana letak file jika kalian ingin mengedit konten:

```text
website-kelas/
├── app/
│   ├── globals.css      # Konfigurasi Tailwind v4 (@theme) & Custom Keyframes Marquee
│   ├── layout.tsx       # Root layout, konfigurasi Font Space Grotesk, dan Metadata
│   └── page.tsx         # Halaman Utama (Merakit semua komponen jadi satu)
├── public/              # Direktori folder foto kelas (/kelas10, /kelas11, /kegiatan)
├── src/
│   ├── components/      # Semua komponen UI terpisah (Modular)
│   │   ├── Gallery.tsx  # Galeri Memori (CSS Masonry, filter kategori, lightbox uncropped)
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   └── StructureTimeline.tsx
│   └── data/
│       └── mockData.ts  # ⚠️ PUSAT DATA: Edit memori galeri, kategori, & struktur di sini!
└── tailwind.config.ts   # (Tailwind v4 menggunakan globals.css)
```

---

## ✏️ Cara Mengedit Galeri & Menambahkan Foto Baru

Semua data tersimpan secara lokal dan terstruktur di **`src/data/mockData.ts`** dan folder **`public/`**:

1. **Simpan File Foto ke `public/`**:
   - Taruh file foto kalian ke dalam folder yang sesuai, misalnya `public/kelas10/foto-baru.jpg` atau buat folder baru seperti `public/kelas12/`.
2. **Daftarkan Foto di `src/data/mockData.ts`**:
   - Tambahkan item baru ke dalam array `memoriesData`:
     ```typescript
     {
       id: "k10-7",
       title: "Judul Momen Kenangan",
       src: "/kelas10/foto-baru.jpg",
       category: "Kelas 10",
       folder: "kelas10",
       date: "September 2023",
       description: "Deskripsi singkat tentang momen ini.",
     }
     ```
   - Semua foto akan otomatis muncul di galeri dengan mempertahankan rasio aslinya (tanpa terpotong/crop)!
3. **Edit Struktur Kelas**:
   - Cari array `structureData` di `src/data/mockData.ts`.

---

## 🎨 Aturan Desain: Panduan Neobrutalism

Jika kalian ingin membuat komponen baru, pastikan kalian **wajib mematuhi** aturan desain ini agar tema website tidak hancur:

1. **Warna Wajib**: Hanya gunakan dominan warna kuning neo (`bg-neo-yellow` atau `#e5de00`), putih (`bg-neo-white` atau `#FFFFFF`), dan hitam (`bg-black`).
2. **Border Super Tebal**: Setiap elemen (kartu, tombol, gambar) harus punya border hitam. Gunakan class `border-4 border-black`.
3. **Hard Shadows (Bukan Blur)**: Jangan pakai bayangan soft bawaan tailwind (seperti `shadow-lg`). Selalu gunakan custom shadow solid:
   - Standar: `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`
   - Hover (Tombol ditekan): `shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-1 translate-y-1`
4. **Animasi (Framer Motion)**: Gunakan animasi pegas (spring) yang responsif dan kasar. **Dilarang keras** menggunakan transisi *fade-in* yang lambat dan elegan.
   - Contoh transisi wajib: `transition={{ type: "spring", stiffness: 400, damping: 15 }}`
5. **Tipografi Berani**: Gunakan kapital penuh (`uppercase`) dan font tebal (`font-black` atau `font-bold`) untuk teks judul.

---

> "Logic, Code, and Creativity." - **XII PPLG 1**
