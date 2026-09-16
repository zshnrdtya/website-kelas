export interface MemoryItem {
  id: string | number;
  title: string;
  src: string;
  category: string; // Folder/Kategori foto: "Kelas 10", "Kelas 11", dll.
  folder?: string;
  date?: string;
  description?: string;
}

export const classInfo = {
  name: "XII PPLG 1",
  school: "SMKN 1 Depok",
  tagline: "Logic, Code, and Creativity",
};

export const structureData = [
  {
    id: 1,
    title: "Kepala Program",
    name: "Heri Sri Purnomo, S.Kom",
    description: "Pembina dan penanggung jawab kejuruan PPLG.",
  },
  {
    id: 2,
    title: "Wali Kelas",
    name: "Hilda Rahmawati, S.Kom",
    description: "Pembimbing, motivator, dan pengarah jalan kami.",
  },
  {
    id: 3,
    title: "Ketua Kelas",
    name: "Jonni",
    description: "Pemimpin tangguh penyeimbang dan pemersatu kelas.",
  },
  {
    id: 4,
    title: "Wakil Ketua Kelas",
    name: "Jian",
    description: "Tangan kanan sang ketua pendukung setiap langkah.",
  },
  {
    id: 5,
    title: "Sekretaris 1",
    name: "Marfa",
    description: "Pencatat agenda, notula, dan administrasi kelas.",
  },
  {
    id: 6,
    title: "Sekretaris 2",
    name: "Zilfa",
    description: "Pengelola dokumentasi dan surat-menyurat kelas.",
  },
  {
    id: 7,
    title: "Bendahara 1",
    name: "Jasmine",
    description: "Pengatur sirkulasi keuangan dan kas kelas.",
  },
  {
    id: 8,
    title: "Bendahara 2",
    name: "Nakita",
    description: "Pengelola dan penanggung jawab anggaran kelas.",
  },
];

export const classStudentNames: string[] = [
  "Agnia",
  "Ahmad",
  "Akmal",
  "Alif",
  "Alissa",
  "Ayya",
  "Bayu",
  "Danish",
  "Dewi",
  "Dhimas",
  "Dzakwan",
  "Fadliansyah",
  "Fakih",
  "Ibrahim",
  "Jasmine",
  "Jheryco",
  "Jian",
  "Jonathan",
  "Jonni",
  "Keysha",
  "Marfa",
  "May",
  "Daffa",
  "Akbar",
  "Afdal",
  "Bima",
  "Rangga",
  "Fariz",
  "Nafisah",
  "Nakita",
  "Raditya",
  "Rahma",
  "Rifqi",
  "Salma",
  "Zilfa",
];

export interface ClassroomStudent {
  absen: number;
  name: string;
  gender: "cowo" | "cewe";
  row: number; // 1 to 6
  col: number; // 1 to 6
  wing: "Kiri" | "Kanan";
  role: string;
  quote: string;
}

export const classroomSeatingData: ClassroomStudent[] = [
  // Baris 1 (Depan)
  { absen: 1, name: "Agnia", gender: "cewe", row: 1, col: 1, wing: "Kiri", role: "Fullstack Developer", quote: "Semua masalah pasti ada solusinya, termasuk error semicolon." },
  { absen: 2, name: "Ahmad", gender: "cowo", row: 1, col: 2, wing: "Kiri", role: "Fullstack Developer", quote: "Frontend estetik, backend tangguh dan solid." },
  { absen: 3, name: "Akmal", gender: "cowo", row: 1, col: 3, wing: "Kiri", role: "Fullstack Developer", quote: "Struktur data rapi, masa depan pasti cerah." },
  { absen: 4, name: "Alif", gender: "cowo", row: 1, col: 4, wing: "Kanan", role: "Fullstack Developer", quote: "Deploy tanpa panik adalah kunci ketenangan jiwa." },
  { absen: 5, name: "Alissa", gender: "cewe", row: 1, col: 5, wing: "Kanan", role: "Fullstack Developer", quote: "Desain yang hebat adalah desain yang memudahkan manusia." },
  { absen: 6, name: "Ayya", gender: "cewe", row: 1, col: 6, wing: "Kanan", role: "Fullstack Developer", quote: "Belajar coding itu proses, jangan lupa istirahat sejenak." },

  // Baris 2
  { absen: 7, name: "Bayu", gender: "cowo", row: 2, col: 1, wing: "Kiri", role: "Fullstack Developer", quote: "Game bukan cuma hiburan, tapi seni interaktif tanpa batas." },
  { absen: 8, name: "Danish", gender: "cowo", row: 2, col: 2, wing: "Kiri", role: "Fullstack Developer", quote: "Clean code, clean architecture, clear future." },
  { absen: 9, name: "Dewi", gender: "cewe", row: 2, col: 3, wing: "Kiri", role: "Fullstack Developer", quote: "Kreativitas tanpa batas di setiap baris kode yang ditulis." },
  { absen: 10, name: "Dhimas", gender: "cowo", row: 2, col: 4, wing: "Kanan", role: "Fullstack Developer", quote: "Menciptakan aplikasi yang bermanfaat untuk jutaan orang." },
  { absen: 11, name: "Dzakwan", gender: "cowo", row: 2, col: 5, wing: "Kanan", role: "Fullstack Developer", quote: "API kencang, server hemat, sistem handal." },
  { absen: 12, name: "Fadliansyah", gender: "cowo", row: 2, col: 6, wing: "Kanan", role: "Fullstack Developer", quote: "Analisa logika mendalam sebelum eksekusi program." },

  // Baris 3
  { absen: 13, name: "Fakih", gender: "cowo", row: 3, col: 1, wing: "Kiri", role: "Fullstack Developer", quote: "Dari kubus sederhana berkembang jadi dunia 3D yang megah." },
  { absen: 14, name: "Ibrahim", gender: "cowo", row: 3, col: 2, wing: "Kiri", role: "Fullstack Developer", quote: "Keamanan sistem dan integritas data adalah prioritas utama." },
  { absen: 15, name: "Jasmine", gender: "cewe", row: 3, col: 3, wing: "Kiri", role: "Fullstack Developer", quote: "Kas kelas aman dan tercatat, project kelas berjalan lancar!" },
  { absen: 16, name: "Jheryco", gender: "cowo", row: 3, col: 4, wing: "Kanan", role: "Fullstack Developer", quote: "Optimasi logika adalah seni pemrograman yang sesungguhnya." },
  { absen: 17, name: "Jian", gender: "cowo", row: 3, col: 5, wing: "Kanan", role: "Fullstack Developer", quote: "Kekuatan tim PPLG 1 adalah saling melengkapi kekurangan." },
  { absen: 18, name: "Jonathan", gender: "cowo", row: 3, col: 6, wing: "Kanan", role: "Fullstack Developer", quote: "Level up tiap hari, jangan pernah takut pada error dan bug." },

  // Baris 4
  { absen: 19, name: "Jonni", gender: "cowo", row: 4, col: 1, wing: "Kiri", role: "Fullstack Developer", quote: "Memimpin dengan aksi, menyatukan kelas dengan hati dan dedikasi." },
  { absen: 20, name: "Keysha", gender: "cewe", row: 4, col: 2, wing: "Kiri", role: "Fullstack Developer", quote: "Temukan bug sebelum bug itu sendiri yang menemukan kita." },
  { absen: 21, name: "Marfa", gender: "cewe", row: 4, col: 3, wing: "Kiri", role: "Fullstack Developer", quote: "Catatan rapi, dokumentasi lengkap, kelas selalu siap siaga." },
  { absen: 22, name: "May", gender: "cewe", row: 4, col: 4, wing: "Kanan", role: "Fullstack Developer", quote: "Terus mengeksplorasi teknologi baru tanpa ragu-ragu." },
  { absen: 23, name: "Daffa", gender: "cowo", row: 4, col: 5, wing: "Kanan", role: "Fullstack Developer", quote: "Fisika game yang seru bikin gameplay makin hidup." },
  { absen: 24, name: "Akbar", gender: "cowo", row: 4, col: 6, wing: "Kanan", role: "Fullstack Developer", quote: "Jaringan stabil, server siap tempur, coding jalan terus." },

  // Baris 5
  { absen: 25, name: "Afdal", gender: "cowo", row: 5, col: 1, wing: "Kiri", role: "Fullstack Developer", quote: "Data adalah fondasi paling berharga di era informasi digital." },
  { absen: 26, name: "Bima", gender: "cowo", row: 5, col: 2, wing: "Kiri", role: "Fullstack Developer", quote: "Wujudkan setiap imajinasi game menjadi realitas interaktif." },
  { absen: 27, name: "Rangga", gender: "cowo", row: 5, col: 3, wing: "Kiri", role: "Fullstack Developer", quote: "Desain responsif, mulus di semua perangkat genggam." },
  { absen: 28, name: "Fariz", gender: "cowo", row: 5, col: 4, wing: "Kanan", role: "Fullstack Developer", quote: "Biar automation script yang bekerja keras menggantikan rutinitas." },
  { absen: 29, name: "Nafisah", gender: "cewe", row: 5, col: 5, wing: "Kanan", role: "Fullstack Developer", quote: "Kreativitas dan logika berpadu untuk menciptakan karya terbaik." },
  { absen: 30, name: "Nakita", gender: "cewe", row: 5, col: 6, wing: "Kanan", role: "Fullstack Developer", quote: "Setiap rupiah kas kelas dihitung dengan ketelitian tinggi!" },

  // Baris 6 (Belakang)
  { absen: 31, name: "Raditya", gender: "cowo", row: 6, col: 1, wing: "Kiri", role: "Fullstack Developer", quote: "Neobrutalism bukan cuma gaya desain, tapi sebuah pernyataan sikap berani." },
  { absen: 32, name: "Rahma", gender: "cewe", row: 6, col: 2, wing: "Kiri", role: "Fullstack Developer", quote: "Paduan estetika visual dan baris kode untuk masa depan cerah." },
  { absen: 33, name: "Rifqi", gender: "cowo", row: 6, col: 3, wing: "Kiri", role: "Fullstack Developer", quote: "Menjaga integrasi dan aliran data tanpa hambatan sama sekali." },
  { absen: 34, name: "Salma", gender: "cewe", row: 6, col: 4, wing: "Kanan", role: "Fullstack Developer", quote: "Menciptakan antarmuka yang memikat mata dan mudah dinavigasi." },
  { absen: 35, name: "Zilfa", gender: "cewe", row: 6, col: 5, wing: "Kanan", role: "Fullstack Developer", quote: "Kenangan, arsip, dan ikatan kekeluargaan XII PPLG 1 abadi di sini." },
];

export const memoryCategories = [
  "All",
  "Kelas 10",
  "Kelas 11",
] as const;

export type MemoryCategory = (typeof memoryCategories)[number];

export const memoriesData: MemoryItem[] = [
  {
    "id": "k10-01",
    "title": "Memori Kelas 10 #01",
    "src": "/Kelas%2010/Dipindai_20260809-2252-01.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-02",
    "title": "Memori Kelas 10 #02",
    "src": "/Kelas%2010/Dipindai_20260809-2252-02.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-03",
    "title": "Memori Kelas 10 #03",
    "src": "/Kelas%2010/Dipindai_20260809-2252-03.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-04",
    "title": "Memori Kelas 10 #04",
    "src": "/Kelas%2010/Dipindai_20260809-2252-04.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-05",
    "title": "Memori Kelas 10 #05",
    "src": "/Kelas%2010/Dipindai_20260809-2252-05.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-06",
    "title": "Memori Kelas 10 #06",
    "src": "/Kelas%2010/Dipindai_20260809-2252-06.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-07",
    "title": "Memori Kelas 10 #07",
    "src": "/Kelas%2010/Dipindai_20260809-2252-07.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-08",
    "title": "Memori Kelas 10 #08",
    "src": "/Kelas%2010/Dipindai_20260809-2252-08.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-09",
    "title": "Memori Kelas 10 #09",
    "src": "/Kelas%2010/Dipindai_20260809-2252-09.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-10",
    "title": "Memori Kelas 10 #10",
    "src": "/Kelas%2010/Dipindai_20260809-2252-10.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-11",
    "title": "Memori Kelas 10 #11",
    "src": "/Kelas%2010/Dipindai_20260809-2252-11.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-12",
    "title": "Memori Kelas 10 #12",
    "src": "/Kelas%2010/Dipindai_20260809-2252-12.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-13",
    "title": "Memori Kelas 10 #13",
    "src": "/Kelas%2010/Dipindai_20260809-2252-13.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-14",
    "title": "Memori Kelas 10 #14",
    "src": "/Kelas%2010/Dipindai_20260809-2252-14.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-15",
    "title": "Memori Kelas 10 #15",
    "src": "/Kelas%2010/Dipindai_20260809-2252-15.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-16",
    "title": "Memori Kelas 10 #16",
    "src": "/Kelas%2010/Dipindai_20260809-2252-16.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-17",
    "title": "Memori Kelas 10 #17",
    "src": "/Kelas%2010/Dipindai_20260809-2252-17.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-18",
    "title": "Memori Kelas 10 #18",
    "src": "/Kelas%2010/Dipindai_20260809-2252-18.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-19",
    "title": "Memori Kelas 10 #19",
    "src": "/Kelas%2010/Dipindai_20260809-2252-19.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-20",
    "title": "Memori Kelas 10 #20",
    "src": "/Kelas%2010/Dipindai_20260809-2252-20.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "Tahun Ajaran Kelas 10",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-21",
    "title": "Memori Kelas 10 #21",
    "src": "/Kelas%2010/IMG-20250219-WA0036.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "19 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-22",
    "title": "Memori Kelas 10 #22",
    "src": "/Kelas%2010/IMG-20250219-WA0040.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "19 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-23",
    "title": "Memori Kelas 10 #23",
    "src": "/Kelas%2010/IMG-20250219-WA0045.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "19 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-24",
    "title": "Memori Kelas 10 #24",
    "src": "/Kelas%2010/IMG-20250219-WA0047.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "19 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-25",
    "title": "Memori Kelas 10 #25",
    "src": "/Kelas%2010/IMG-20250219-WA0050.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "19 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-26",
    "title": "Memori Kelas 10 #26",
    "src": "/Kelas%2010/IMG-20250221-WA0189.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "21 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-27",
    "title": "Memori Kelas 10 #27",
    "src": "/Kelas%2010/IMG-20250221-WA0197.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "21 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-28",
    "title": "Memori Kelas 10 #28",
    "src": "/Kelas%2010/IMG-20250224-WA0025.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "24 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-29",
    "title": "Memori Kelas 10 #29",
    "src": "/Kelas%2010/IMG-20250224-WA0026.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "24 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-30",
    "title": "Memori Kelas 10 #30",
    "src": "/Kelas%2010/IMG-20250225-WA0055.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "25 Februari 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-31",
    "title": "Memori Kelas 10 #31",
    "src": "/Kelas%2010/IMG-20250302-WA0051.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "2 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-32",
    "title": "Memori Kelas 10 #32",
    "src": "/Kelas%2010/IMG-20250302-WA0052.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "2 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-33",
    "title": "Memori Kelas 10 #33",
    "src": "/Kelas%2010/IMG-20250302-WA0054.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "2 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-34",
    "title": "Memori Kelas 10 #34",
    "src": "/Kelas%2010/IMG-20250302-WA0102.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "2 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-35",
    "title": "Memori Kelas 10 #35",
    "src": "/Kelas%2010/IMG-20250302-WA0107.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "2 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-36",
    "title": "Memori Kelas 10 #36",
    "src": "/Kelas%2010/IMG-20250302-WA0109.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "2 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-37",
    "title": "Memori Kelas 10 #37",
    "src": "/Kelas%2010/IMG-20250320-WA0023.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "20 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-38",
    "title": "Memori Kelas 10 #38",
    "src": "/Kelas%2010/IMG-20250320-WA0027.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "20 Maret 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-39",
    "title": "Memori Kelas 10 #39",
    "src": "/Kelas%2010/IMG-20250505-WA0064.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "5 Mei 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-40",
    "title": "Memori Kelas 10 #40",
    "src": "/Kelas%2010/IMG_20250521_124420.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "21 Mei 2025",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-41",
    "title": "Memori Kelas 10 #41",
    "src": "/Kelas%2010/IMG_20260606_173226_226.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "6 Juni 2026",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k10-42",
    "title": "Memori Kelas 10 #42",
    "src": "/Kelas%2010/IMG_20260606_173230_907.jpg",
    "category": "Kelas 10",
    "folder": "Kelas 10",
    "date": "6 Juni 2026",
    "description": "Dokumentasi momen kebersamaan dan kenangan masa Kelas 10 XII PPLG 1."
  },
  {
    "id": "k11-01",
    "title": "Memori Kelas 11 #01",
    "src": "/Kelas%2011/Dipindai_20260809-2312-01.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-02",
    "title": "Memori Kelas 11 #02",
    "src": "/Kelas%2011/Dipindai_20260809-2312-02.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-03",
    "title": "Memori Kelas 11 #03",
    "src": "/Kelas%2011/Dipindai_20260809-2312-03.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-04",
    "title": "Memori Kelas 11 #04",
    "src": "/Kelas%2011/Dipindai_20260809-2312-04.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-05",
    "title": "Memori Kelas 11 #05",
    "src": "/Kelas%2011/Dipindai_20260809-2312-05.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-06",
    "title": "Memori Kelas 11 #06",
    "src": "/Kelas%2011/Dipindai_20260809-2312-06.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-07",
    "title": "Memori Kelas 11 #07",
    "src": "/Kelas%2011/Dipindai_20260809-2312-07.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-08",
    "title": "Memori Kelas 11 #08",
    "src": "/Kelas%2011/Dipindai_20260809-2312-08.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-09",
    "title": "Memori Kelas 11 #09",
    "src": "/Kelas%2011/Dipindai_20260809-2312-09.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-10",
    "title": "Memori Kelas 11 #10",
    "src": "/Kelas%2011/Dipindai_20260809-2312-10.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-11",
    "title": "Memori Kelas 11 #11",
    "src": "/Kelas%2011/Dipindai_20260809-2312-11.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-12",
    "title": "Memori Kelas 11 #12",
    "src": "/Kelas%2011/Dipindai_20260809-2312-12.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-13",
    "title": "Memori Kelas 11 #13",
    "src": "/Kelas%2011/Dipindai_20260809-2312-13.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-14",
    "title": "Memori Kelas 11 #14",
    "src": "/Kelas%2011/Dipindai_20260809-2312-14.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  },
  {
    "id": "k11-15",
    "title": "Memori Kelas 11 #15",
    "src": "/Kelas%2011/Dipindai_20260809-2312-15.jpg",
    "category": "Kelas 11",
    "folder": "Kelas 11",
    "date": "Tahun Ajaran Kelas 11",
    "description": "Dokumentasi kegiatan, praktikum, dan perjuangan di Kelas 11 XII PPLG 1."
  }
];

// Helper array for backward compatibility
export const galleryImages = memoriesData.map((item) => item.src);
