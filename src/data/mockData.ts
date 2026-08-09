export const classInfo = {
  name: "XII PPLG 1",
  school: "SMKN 1 Depok",
  tagline: "Logic, Code, and Creativity",
};

export const galleryImages = [
  "https://picsum.photos/seed/neo1/500/500",
  "https://picsum.photos/seed/neo2/500/500",
  "https://picsum.photos/seed/neo3/500/500",
  "https://picsum.photos/seed/neo4/500/500",
  "https://picsum.photos/seed/neo5/500/500",
  "https://picsum.photos/seed/neo6/500/500",
  "https://picsum.photos/seed/neo7/500/500",
  "https://picsum.photos/seed/neo8/500/500",
];

const generateMembers = () => {
  const members = [];
  const roles = ["Ketua Kelas", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"];
  
  // First specific member
  members.push({
    id: 1,
    name: "Raditya Rai Zeeshan",
    role: "Developer / Anggota",
    quote: "Code is poetry written in logic.",
    image: `https://ui-avatars.com/api/?name=Raditya+Rai+Zeeshan&background=e5de00&color=000&bold=true&size=300`,
  });

  // Mocking the rest up to 35
  for (let i = 2; i <= 35; i++) {
    const roleIndex = i <= 5 ? i - 1 : 4; // Distribute some roles at the beginning
    const name = `Siswa Ke-${i}`;
    members.push({
      id: i,
      name: name,
      role: roles[roleIndex],
      quote: `Ini adalah quote inspiratif dari ${name}. Tetap semangat dan jangan menyerah!`,
      image: `https://ui-avatars.com/api/?name=Siswa+${i}&background=fff&color=000&bold=true&size=300`,
    });
  }
  return members;
};

export const classMembers = generateMembers();

export const structureData = [
  {
    id: 1,
    title: "Wali Kelas",
    name: "Bapak / Ibu Guru",
    description: "Pembimbing dan pengarah jalan kami.",
  },
  {
    id: 2,
    title: "Ketua Kelas",
    name: "Siswa Ke-2",
    description: "Pemimpin tangguh penyeimbang kelas.",
  },
  {
    id: 3,
    title: "Wakil Ketua",
    name: "Siswa Ke-3",
    description: "Tangan kanan sang ketua.",
  },
  {
    id: 4,
    title: "Sekretaris",
    name: "Siswa Ke-4",
    description: "Pencatat segala rahasia dan administrasi.",
  },
  {
    id: 5,
    title: "Bendahara",
    name: "Siswa Ke-5",
    description: "Penjaga harta dan keuangan kelas.",
  },
];
