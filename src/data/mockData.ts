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
