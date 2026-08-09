"use client";
import { galleryImages } from "../data/mockData";
import { motion } from "framer-motion";

export default function Gallery() {
  const rotations = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1", "-rotate-3", "rotate-2"];
  const bgs = ["bg-neo-yellow", "bg-neo-white", "bg-black", "bg-neo-yellow", "bg-neo-white", "bg-neo-yellow", "bg-black", "bg-neo-white"];

  return (
    <section id="galeri" className="py-24 px-4 bg-neo-yellow border-b-4 border-black relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-5xl md:text-7xl font-black uppercase inline-block bg-neo-white border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2"
          >
            Galeri Memori
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {galleryImages.map((src, idx) => {
            const rot = rotations[idx % rotations.length];
            const bg = bgs[idx % bgs.length];

            return (
              <motion.div 
                key={idx}
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: (idx % 4) * 0.1 }}
              >
                <div className={`relative group ${rot} hover:rotate-0 transition-transform duration-300 ease-out h-full`}>
                  <div className={`absolute inset-0 ${bg} border-4 border-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform`} />
                  <div className="relative border-4 border-black bg-neo-white p-2 aspect-square z-10">
                    <div className="relative w-full h-full border-2 border-black overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={src} 
                        alt={`Gallery Image ${idx + 1}`} 
                        className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
