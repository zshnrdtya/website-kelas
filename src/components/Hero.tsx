"use client";
import { classInfo } from "../data/mockData";
import Link from "next/link";
import { motion } from "framer-motion";
import { Monitor, Image as ImageIcon } from "lucide-react";

export default function Hero() {
  const springConfig = { type: "spring" as const, stiffness: 400, damping: 15 };

  return (
    <section className="relative w-full flex-1 bg-neo-yellow border-b-4 border-black flex flex-col justify-center items-center overflow-hidden px-4 py-4 sm:py-6">
      
      {/* Kotak Logo Atas Kiri: Logo SMK Negeri 1 Depok */}
      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: -6, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        className="absolute top-2.5 left-2.5 sm:top-6 sm:left-6 md:top-8 md:left-8 w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 border-3 sm:border-4 border-black bg-neo-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] items-center justify-center p-1.5 sm:p-2.5 z-20 flex cursor-pointer transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        title="Logo SMK Negeri 1 Depok"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/asset-logo/logo-onedek.jpeg"
          alt="Logo SMK Negeri 1 Depok"
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.div>

      {/* Kotak Logo Bawah Kanan: Logo Pengembangan Perangkat Lunak dan Gim (PPLG) */}
      <motion.div
        initial={{ scale: 0, rotate: 20, opacity: 0 }}
        animate={{ scale: 1, rotate: 6, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.25 }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        className="absolute bottom-2.5 right-2.5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 w-14 h-14 sm:w-22 sm:h-22 md:w-28 md:h-28 lg:w-36 lg:h-36 border-3 sm:border-4 border-black bg-neo-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] items-center justify-center p-1.5 sm:p-2.5 z-20 flex cursor-pointer transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        title="Logo PPLG"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/asset-logo/logo%20pplg.jpeg"
          alt="Logo Pengembangan Perangkat Lunak dan Gim"
          className="w-full h-full object-contain pointer-events-none"
        />
      </motion.div>

      {/* Background Accent Decorator */}
      <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-black rotate-45 hidden lg:block pointer-events-none" />
      
      {/* Main Hero Content */}
      <div className="max-w-6xl mx-auto text-center z-10 my-auto py-2 sm:py-4 px-2 flex flex-col items-center justify-center">
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={springConfig}
          className="text-xs sm:text-lg md:text-xl font-black uppercase mb-2 sm:mb-3 tracking-widest bg-neo-white inline-block px-3 py-1 sm:px-4 sm:py-1.5 border-3 sm:border-4 border-black -rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {classInfo.name}
        </motion.h2>
        
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...springConfig, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase leading-[0.92] tracking-tighter mb-3 sm:mb-5 text-black drop-shadow-[2px_2px_0_#fff] sm:drop-shadow-[4px_4px_0_#fff]"
        >
          PENGEMBANGAN PERANGKAT LUNAK DAN GIM
        </motion.h1>
        
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...springConfig, delay: 0.2 }}
          className="text-xs sm:text-base md:text-xl font-bold mb-4 sm:mb-6 max-w-xl md:max-w-2xl mx-auto bg-black text-neo-white px-4 py-1.5 sm:px-6 sm:py-2 border-3 sm:border-4 border-black rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {classInfo.tagline}
        </motion.p>
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ ...springConfig, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="#denah"
            className="inline-flex items-center gap-2 bg-black text-neo-yellow font-black uppercase text-xs sm:text-base md:text-lg px-5 py-2.5 sm:px-7 sm:py-3.5 border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Monitor className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Ruang Kelas 3D</span>
          </Link>
          <Link
            href="#galeri"
            className="inline-flex items-center gap-2 bg-neo-white text-black font-black uppercase text-xs sm:text-base md:text-lg px-5 py-2.5 sm:px-7 sm:py-3.5 border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Jelajahi Galeri</span>
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
}
