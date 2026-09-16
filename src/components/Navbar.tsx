"use client";

import { useState } from "react";
import Link from "next/link";
import InstagramIcon from "./InstagramIcon";
import { Menu, X, Monitor, Users, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-neo-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter hover:scale-105 transition-transform text-black"
            >
              XII PPLG 1
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-neo-yellow border-2 border-black text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
              SMKN 1 Depok
            </span>
          </div>

          {/* Desktop Navigation Links & Social Media */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6">
            <nav className="flex items-center gap-1.5 lg:gap-3">
              <NavLink href="#denah" text="Ruang Kelas 3D" />
              <NavLink href="#struktur" text="Struktur" />
              <NavLink href="#galeri" text="Galeri" />
            </nav>

            {/* Instagram Link Button */}
            <a
              href="https://www.instagram.com/12pplg1_/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Kelas XII PPLG 1"
              className="flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-neo-yellow text-black border-2 sm:border-3 border-black font-black text-xs lg:text-sm uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-neo-yellow hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">@12pplg1_</span>
            </a>
          </div>

          {/* Mobile Actions: Instagram Icon Button + Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="https://www.instagram.com/12pplg1_/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Kelas XII PPLG 1"
              className="p-2 bg-neo-yellow text-black border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all cursor-pointer flex items-center justify-center"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
              className="p-2 bg-black text-neo-yellow border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center"
            >
              {isOpen ? <X className="w-5 h-5 stroke-[3]" /> : <Menu className="w-5 h-5 stroke-[3]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t-4 border-black bg-neo-yellow overflow-hidden shadow-[inset_0px_4px_0px_0px_rgba(0,0,0,0.1)]"
          >
            <div className="p-4 flex flex-col gap-2.5">
              <Link
                href="#denah"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-white text-black font-black uppercase text-sm sm:text-base border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-neo-yellow active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Monitor className="w-4 h-4 stroke-[2.5]" />
                <span>Ruang Kelas 3D</span>
              </Link>

              <Link
                href="#struktur"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-white text-black font-black uppercase text-sm sm:text-base border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-neo-yellow active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Users className="w-4 h-4 stroke-[2.5]" />
                <span>Struktur Organisasi</span>
              </Link>

              <Link
                href="#galeri"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-white text-black font-black uppercase text-sm sm:text-base border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-neo-yellow active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <ImageIcon className="w-4 h-4 stroke-[2.5]" />
                <span>Galeri Kenangan</span>
              </Link>

              <a
                href="https://www.instagram.com/12pplg1_/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2.5 px-4 py-3 bg-black text-neo-yellow font-black uppercase text-sm sm:text-base border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-neutral-900 transition-all"
              >
                <InstagramIcon className="w-4 h-4 shrink-0" />
                <span>Follow @12pplg1_</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="px-2.5 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-black uppercase border-2 border-transparent hover:border-black hover:bg-neo-yellow hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
    >
      {text}
    </Link>
  );
}
