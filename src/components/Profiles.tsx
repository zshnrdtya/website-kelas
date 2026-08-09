"use client";
import { useState } from "react";
import { classMembers } from "../data/mockData";
import { motion } from "framer-motion";

export default function Profiles() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = classMembers.filter((member) => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="profil" className="py-24 px-4 bg-neo-white border-b-4 border-black relative">
      <div className="max-w-screen-2xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-5xl md:text-7xl font-black uppercase inline-block bg-black text-neo-white border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_#e5de00] -rotate-1"
          >
            Warga Kelas
          </motion.h2>
        </div>

        {/* Search Input */}
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hayo Mau Cari Siapa Kamu Nih?"
          className="w-full max-w-2xl mx-auto block p-4 mb-10 text-center font-bold text-xl border-4 border-black bg-neo-white outline-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1"
        />

        {filteredMembers.length === 0 ? (
          <div className="w-full max-w-2xl mx-auto bg-neo-yellow border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black uppercase">Waduh, Warga Kelas Tidak Ditemukan!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMembers.map((member, idx) => {
              const isYellow = idx % 2 === 0;
              const bgClass = isYellow ? "bg-neo-yellow" : "bg-neo-white";

              return (
                <motion.div 
                  key={member.id} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 400, damping: 15, delay: (idx % 5) * 0.1 }}
                  className={`${bgClass} border-4 border-black p-4 flex flex-col shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all group`}
                >
                  <div className="relative aspect-square mb-4 border-4 border-black overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-black text-neo-white text-xs font-bold px-2 py-1 border-2 border-black">
                      #{member.id.toString().padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-black uppercase leading-tight border-b-4 border-black pb-2 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-sm font-bold bg-black text-neo-white inline-block px-2 py-1 mb-4">
                        {member.role}
                      </p>
                    </div>
                    <p className="text-sm font-medium italic border-l-4 border-black pl-3 py-1">
                      "{member.quote}"
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
