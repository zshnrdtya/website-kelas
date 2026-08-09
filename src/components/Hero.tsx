"use client";
import { classInfo } from "../data/mockData";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const springConfig = { type: "spring" as const, stiffness: 400, damping: 15 };

  return (
    <section className="relative w-full min-h-[90vh] bg-neo-yellow border-b-4 border-black flex flex-col justify-center items-center overflow-hidden px-4 py-20">
      
      {/* Background Decorators */}
      <div className="absolute top-10 left-10 w-24 h-24 border-4 border-black bg-neo-white -rotate-12 hidden md:block" />
      <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-black bg-neo-white rounded-full rotate-45 hidden md:block" />
      <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-black rotate-45 hidden lg:block" />
      
      <div className="max-w-6xl mx-auto text-center z-10">
        <motion.h2 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={springConfig}
          className="text-2xl md:text-4xl font-black uppercase mb-4 tracking-widest bg-neo-white inline-block px-4 py-2 border-4 border-black -rotate-2"
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
          className="text-xl md:text-3xl font-bold mb-12 max-w-2xl mx-auto bg-black text-neo-white px-6 py-4 border-4 border-black rotate-1"
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
            href="#struktur"
            className="inline-block bg-neo-white text-black font-black uppercase text-xl md:text-3xl px-12 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 transition-all active:shadow-none active:translate-x-3 active:translate-y-3"
          >
            Jelajahi Kelas
          </Link>
        </motion.div>
      </div>
      
    </section>
  );
}
