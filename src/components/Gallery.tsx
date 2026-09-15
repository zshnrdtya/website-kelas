"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { memoriesData } from "../data/mockData";

export default function Gallery() {
  const ITEMS_PER_LOAD = 5;
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_LOAD);

  // Extract unique categories dynamically from memoriesData
  const availableCategories = [
    "All",
    ...Array.from(new Set(memoriesData.map((item) => item.category))),
  ];

  // Filter memories according to selected category
  const filteredMemories =
    activeCategory === "All"
      ? memoriesData
      : memoriesData.filter((item) => item.category === activeCategory);

  // Currently selected memory for the lightbox
  const selectedMemory =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < filteredMemories.length
      ? filteredMemories[selectedIndex]
      : null;

  // Reset pagination and close modal when changing category
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(ITEMS_PER_LOAD);
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < filteredMemories.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  // Keyboard navigation for lightbox (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredMemories.length]);

  const displayedMemories = filteredMemories.slice(0, visibleCount);

  return (
    <section id="galeri" className="py-24 px-4 bg-neo-yellow border-b-4 border-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="inline-block"
          >
            <span className="block text-sm sm:text-base font-black uppercase tracking-widest bg-black text-neo-yellow px-4 py-1.5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 -rotate-1">
              Dokumentasi &amp; Jejak Perjalanan
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase bg-neo-white border-4 border-black px-6 sm:px-10 py-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
              Galeri Memori
            </h2>
          </motion.div>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
            className="mt-6 text-lg sm:text-2xl font-bold max-w-3xl mx-auto bg-neo-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1"
          >
            Kumpulan foto kenangan, canda tawa, dan masa-masa indah XII PPLG 1.
          </motion.p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-10">
          {availableCategories.map((category) => {
            const count =
              category === "All"
                ? memoriesData.length
                : memoriesData.filter((m) => m.category === category).length;
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`font-black uppercase text-sm sm:text-base px-6 py-3.5 border-4 border-black rounded-none cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-black text-neo-yellow shadow-[4px_4px_0px_0px_#000] -translate-y-1"
                    : "bg-neo-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-yellow hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                }`}
              >
                {category} <span className="text-xs ml-1 opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Counter Info Banner */}
        <div className="text-center mb-10">
          <span className="inline-block bg-black text-neo-white font-bold text-xs sm:text-sm uppercase tracking-wider px-4 py-1.5 border-2 border-black">
            Menampilkan {displayedMemories.length} dari {filteredMemories.length} foto ({activeCategory})
          </span>
        </div>

        {/* Empty State */}
        {filteredMemories.length === 0 ? (
          <div className="w-full max-w-xl mx-auto bg-neo-white border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase">Belum ada foto di folder/kategori ini!</h3>
          </div>
        ) : (
          /* CSS Multi-Column Masonry Layout: Zero Cropping, Natural Aspect Ratios */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedMemories.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: (idx % 6) * 0.04 }}
                  className="break-inside-avoid mb-6 w-full inline-block"
                >
                  {/* Neobrutalism Image Wrapper */}
                  <div
                    onClick={() => setSelectedIndex(idx)}
                    className="relative cursor-pointer border-4 border-black bg-neo-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group overflow-hidden"
                  >
                    {/* Header info badge */}
                    <div className="flex items-center justify-between px-3.5 py-2 border-b-4 border-black bg-neo-white">
                      <span className="text-xs font-black uppercase tracking-wider bg-neo-yellow border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {item.category}
                      </span>
                      {item.date && (
                        <span className="text-xs font-bold uppercase tracking-tight text-black">
                          {item.date}
                        </span>
                      )}
                    </div>

                    {/* Uncropped Image Container: w-full h-auto block ensures 100% natural aspect ratio */}
                    <div className="bg-neutral-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-auto block rounded-none group-hover:scale-[1.01] transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "true";
                            target.src = `https://picsum.photos/seed/${item.id}/800/600`;
                          }
                        }}
                      />
                    </div>

                    {/* Caption Bar */}
                    <div className="p-4 border-t-4 border-black bg-neo-white">
                      <h3 className="text-lg sm:text-xl font-black uppercase text-black leading-tight mb-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm font-medium text-neutral-800 leading-relaxed mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-3 pt-2 border-t-2 border-black/20 flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-black group-hover:underline">
                          Lihat Detail Foto &rarr;
                        </span>
                        {item.folder && (
                          <span className="text-[11px] font-mono font-bold text-neutral-700 bg-neutral-200 px-2 py-0.5 border border-black">
                            /{item.folder}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Load More & Show All Buttons */}
        {filteredMemories.length > visibleCount && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + ITEMS_PER_LOAD, filteredMemories.length))}
              className="w-full sm:w-auto bg-neo-white text-black font-black uppercase text-base sm:text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-neo-yellow hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
            >
              + Muat 5 Foto Lagi ({filteredMemories.length - visibleCount} Foto Tersisa)
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filteredMemories.length)}
              className="w-full sm:w-auto bg-black text-neo-yellow font-black uppercase text-base sm:text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-neo-white hover:text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
            >
              Tampilkan Semua ({filteredMemories.length} Foto)
            </button>
          </div>
        )}

        {/* All Photos Loaded Notice */}
        {filteredMemories.length <= visibleCount && filteredMemories.length > 0 && (
          <div className="text-center mt-12">
            <span className="inline-block bg-neo-white text-black font-black uppercase px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Semua {filteredMemories.length} Foto Telah Ditampilkan ✨
            </span>
          </div>
        )}
      </div>

      {/* Lightbox Modal with Full View & Next/Prev Navigation */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-neo-white border-4 border-black shadow-[10px_10px_0px_0px_#e5de00] overflow-hidden"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-4 py-3 bg-neo-yellow border-b-4 border-black">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black uppercase bg-black text-neo-yellow px-2.5 py-1 border-2 border-black">
                    {selectedMemory.category}
                  </span>
                  {selectedMemory.date && (
                    <span className="text-xs sm:text-sm font-bold text-black uppercase">
                      • {selectedMemory.date}
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-neutral-800 ml-2 hidden sm:inline-block">
                    ({(selectedIndex ?? 0) + 1} / {filteredMemories.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="bg-black text-neo-white hover:bg-red-500 hover:text-white px-3 py-1 font-black text-sm uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors cursor-pointer"
                >
                  Tutup [X]
                </button>
              </div>

              {/* Modal Image Body: 100% uncropped display with prev/next overlays */}
              <div className="relative flex-1 overflow-auto p-4 sm:p-6 bg-neutral-900 flex items-center justify-center min-h-[320px]">
                {/* Previous Button */}
                {selectedIndex !== null && selectedIndex > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-neo-yellow hover:bg-white text-black font-black px-3 sm:px-4 py-2 sm:py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] z-20 cursor-pointer text-base sm:text-xl"
                    title="Foto Sebelumnya (Arrow Left)"
                  >
                    &larr;
                  </button>
                )}

                {/* Next Button */}
                {selectedIndex !== null && selectedIndex < filteredMemories.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-neo-yellow hover:bg-white text-black font-black px-3 sm:px-4 py-2 sm:py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] z-20 cursor-pointer text-base sm:text-xl"
                    title="Foto Selanjutnya (Arrow Right)"
                  >
                    &rarr;
                  </button>
                )}

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={selectedMemory.src}
                  src={selectedMemory.src}
                  alt={selectedMemory.title}
                  className="max-h-[62vh] w-auto max-w-full object-contain border-4 border-black shadow-[6px_6px_0px_0px_#000]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = "true";
                      target.src = `https://picsum.photos/seed/${selectedMemory.id}/1200/800`;
                    }
                  }}
                />
              </div>

              {/* Modal Footer Caption */}
              <div className="p-4 sm:p-5 bg-neo-white border-t-4 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase leading-tight text-black mb-1">
                    {selectedMemory.title}
                  </h3>
                  {selectedMemory.description && (
                    <p className="text-sm sm:text-base font-semibold text-neutral-800">
                      {selectedMemory.description}
                    </p>
                  )}
                </div>
                <div className="text-xs font-mono font-bold text-neutral-600 bg-neutral-200 px-2 py-1 border border-black shrink-0">
                  Folder: /{selectedMemory.folder}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
