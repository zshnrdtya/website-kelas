# DESIGN.md

> **Direction and Identity Specification: XII PPLG 1 Official Class Website**  
> Dibuat untuk memenuhi standar kualitas dan arah desain dari Rules-Raditya CODE.  
> antislop is a filter, not a beautifier. Dokumen ini mendefinisikan jiwa, identitas, palet, tipografi, dan kalibrasi dial sistem.

---

## 1. Identity & Purpose

- **Product Name:** XII PPLG 1 Official Class Website (Neobrutalism Edition)
- **One-Line Value Proposition:** Website resmi, arsip interaktif, dan museum kenangan virtual 3D untuk angkatan XII Pengembangan Perangkat Lunak dan Gim (PPLG) 1 SMKN 1 Depok.
- **Target Audience:** Siswa, siswi, guru, alumni, wali murid, dan komunitas rekayasa perangkat lunak / umum yang ingin mengenal profil dan kenangan angkatan XII PPLG 1.
- **Brand Personality:** *Bold, Tactile, High-Contrast, Honest, Engineering-Centric* (Semangat anak RPL/PPLG: logika kode yang solid dipadukan dengan estetika berani).

---

## 2. Visual Theme & Surface

- **Theme Mode:** High-Contrast Neobrutalism (Kuning, Putih, Hitam Pekat).
  - *Rationale:* Mencerminkan karakter khas dunia koding kejuruan: tegas, tanpa basa-basi, memiliki kontras super tinggi untuk keterbacaan optimal, serta visual yang tidak generik.
- **Visual Motif:** Industrial software engineering, retro terminal badge, denah lab komputer 3D realistis, dan paviliun museum seni virtual.
- **Surface Treatment:** Flat surfaces dengan border hitam tebal 4px (`border-4 border-black`), offset solid hard shadows (`shadow-[4px_4px_0px_0px_#000]`), nol blur melayang (zero unearned blur).

---

## 3. Color Palette

> **Antislop Constraint:** Batas maksimal 2–3 warna inti + 1 aksen terarah (R-29). Bebas dari gradien ungu-ke-biru generik AI (R-01).

- **Background (Canvas):** `#ffffff` (Putih Bersih) / `#000000` (Hitam di footer dan marquee)
- **Primary Brand / Accent:** `#e5de00` (Neobrutal Electric Yellow)
  - *Accent Function:* Digunakan pada hero banner, badge nama, tombol aksi utama, dan highlight meja 3D aktif.
- **Primary Text:** `#000000` (Hitam Pekat) pada canvas kuning/putih, dan `#ffffff` pada canvas hitam.
  - *Kontras WCAG AAA:* 
    - `#000000` di atas `#e5de00` = **14.78:1** (PASS AAA)
    - `#000000` di atas `#ffffff` = **21.00:1** (PASS AAA)
    - `#e5de00` di atas `#000000` = **14.78:1** (PASS AAA)
- **Border & Line:** `#000000` solid 3px–4px.

---

## 4. Typography Hierarchy

- **Primary Display & Body Font:** `Space Grotesk` (`next/font/google`, sans-serif)
- **Data & Monospace:** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- **Type Scale Rhythm:**
  - Hero Display: `clamp(2rem, 6vw, 4.5rem)` uppercase, font-black, leading tight
  - Section Title: `clamp(1.75rem, 4vw, 3rem)` uppercase, font-black
  - Subhead / Card Title: `1.25rem` – `1.5rem` uppercase font-bold
  - Body Text: `1rem` (16px) dengan `line-height: 1.5`
  - Small / Badge / Caption: `0.75rem` – `0.875rem` uppercase font-extrabold

---

## 5. Antislop Dials (R-37)

Kalibrasi intensitas dial untuk proyek ini:

- **ENERGY (1 / 2 / 3): `3` (Bold)**  
  Tampilan neobrutalism bervolume tinggi, tipografi ekstra tebal, warna kuning mencolok, marquee ganda bergerak, dan interaktivitas WebGL 3D penuh.
- **RHYTHM (1 / 2 / 3): `3` (Expressive / Asymmetric)**  
  Variasi komposisi antar-seksi sangat dinamis: dari hero 1 layar penuh, marquee logo berjalan, kanvas 3D lab komputer, bagan timeline organisasi vertikal, galeri dual-mode masonry 2D & museum 3D, hingga marquee nama 35 siswa.
- **MOTION (1 / 2 / 3): `3` (Interactive Choreography)**  
  Koreografi interaktif: Three.js OrbitControls 360°, First-Person Walk Mode dengan deteksi tabrakan & Virtual D-Pad HP, marquee tanpa jeda, serta transisi hover neobrutalist offset.

---

## 6. Layout & Sizing Rules

- **Container Max-Width:** `1280px` (`max-w-7xl`)
- **Border Radii System:** `0px` (`rounded-none`) untuk seluruh kartu, tombol, kontainer, dan gambar agar mempertahankan ketegasan Neobrutalism (R-11).
- **Elevation:** Hard offset shadow:
  - Normal: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]` atau `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`
  - Hover/Active: `translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`

---

## 7. Voice & Copywriting Directives

- **Tone:** Bangga, autentik, bersahabat, berbasis realitas kebersamaan kelas XII PPLG 1 SMKN 1 Depok.
- **Prohibited AI Tells:**
  - Nol karakter em dash (`—`) dalam teks UI dan dokumentasi (R-02).
  - Nol buzzwords klise (*delve, elevate, empower, seamless, game-changer, revolutionary*).
  - Nol klaim atau angka palsu (R-17, R-36, C-5). Seluruh 35 siswa, 8 pengurus, dan 57 foto adalah data otentik.
