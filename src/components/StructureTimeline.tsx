"use client";
import { structureData } from "../data/mockData";
import { motion } from "framer-motion";

export default function StructureTimeline() {
  return (
    <section id="struktur" className="py-24 px-4 bg-neo-white border-b-4 border-black relative overflow-hidden">
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-5xl md:text-7xl font-black uppercase inline-block bg-neo-yellow border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2"
          >
            Struktur Kelas
          </motion.h2>
        </div>

        <div className="relative">
          {/* Center Line */}
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-2 bg-black hidden md:block"
          />

          <div className="flex flex-col gap-12 md:gap-0">
            {structureData.map((item, index) => {
              const isEven = index % 2 === 0;
              const rotation = isEven ? "rotate-1" : "-rotate-1";
              const bgColor = isEven ? "bg-neo-yellow" : "bg-neo-white";

              return (
                <div key={item.id} className="relative flex items-center justify-center md:justify-between w-full">
                  {/* Left Side spacer for odd items on desktop */}
                  <div className={`hidden md:block w-5/12 ${!isEven ? "" : "invisible"}`}>
                    {!isEven && (
                      <StructureCard item={item} bgColor={bgColor} rotation={rotation} isLeft={true} />
                    )}
                  </div>

                  {/* Center Dot (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black border-4 border-white z-10 justify-center items-center">
                     <div className="w-3 h-3 bg-neo-yellow"></div>
                  </div>

                  {/* Right Side or Mobile Card */}
                  <div className={`w-full md:w-5/12 ${isEven ? "" : "md:hidden"}`}>
                     <StructureCard item={item} bgColor={bgColor} rotation={rotation} isLeft={false} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
    </section>
  );
}

function StructureCard({ item, bgColor, rotation, isLeft }: { item: any, bgColor: string, rotation: string, isLeft: boolean }) {
  const xOffset = isLeft ? -100 : 100;
  
  return (
    <motion.div 
      initial={{ x: xOffset, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`${bgColor} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${rotation} hover:scale-105 transition-transform hover:z-20 relative`}
    >
      <h3 className="text-2xl font-black uppercase mb-2 border-b-4 border-black pb-2 inline-block">
        {item.title}
      </h3>
      <p className="text-xl font-bold mt-4">
        {item.name}
      </p>
      <p className="text-base font-medium mt-2">
        {item.description}
      </p>
    </motion.div>
  );
}
