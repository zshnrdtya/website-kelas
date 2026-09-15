"use client";
import { classInfo } from "../data/mockData";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const springConfig = { type: "spring" as const, stiffness: 400, damping: 15 };

  return (
    <section className="relative w-full min-h-[90vh] bg-neo-yellow border-b-4 border-black flex flex-col justify-center items-center overflow-hidden px-4 py-20">
      
      {/* Kotak Logo Atas Kiri: Logo SMK Negeri 1 Depok */}
      <motion.div
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: -6, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
        whileHover={{ scale: 1.08, rotate: 0 }}
        className="absolute top-6 left-6 sm:top-10 sm:left-10 md:top-12 md:left-12 lg:top-14 lg:left-16 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 border-4 border-black bg-neo-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] items-center justify-center p-2.5 sm:p-3.5 z-20 hidden sm:flex cursor-pointer transition-shadow hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
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
        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12 lg:bottom-14 lg:right-16 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 border-4 border-black bg-neo-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] items-center justify-center p-2.5 sm:p-3.5 z-20 hidden sm:flex cursor-pointer transition-shadow hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
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
      <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-black rotate-45 hidden lg:block pointer-events-none" />
      
      {/* Main Hero Content */}
      <div className="max-w-6xl mx-auto text-center z-10">
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springConfig}
          className="text-2xl md:text-4xl font-black uppercase mb-4 tracking-widest bg-neo-white inline-block px-4 py-2 border-4 border-black -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {classInfo.name}
        </motion.h2>
        
        <motion.h1 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ ...springConfig, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-9xl font-black uppercase leading-[0.9] tracking-tighter mb-8 text-black drop-shadow-[4px_4px_0_#fff]"
        >
          PENGEMBANGAN PERANGKAT LUNAK DAN GIM
        </motion.h1>
        
        <motion.p 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ ...springConfig, delay: 0.2 }}
          className="text-xl md:text-3xl font-bold mb-12 max-w-2xl mx-auto bg-black text-neo-white px-6 py-4 border-4 border-black rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          {classInfo.tagline}
        </motion.p>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ ...springConfig, delay: 0.3 }}
          className="flex justify-center"
        >
          <Link
            href="#galeri"
            className="inline-block bg-neo-white text-black font-black uppercase text-xl md:text-3xl px-12 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 transition-all active:shadow-none active:translate-x-3 active:translate-y-3"
          >
            Jelajahi Galeri
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
}
