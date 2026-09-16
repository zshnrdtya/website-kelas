import Link from "next/link";
import InstagramIcon from "./InstagramIcon";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-neo-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl sm:text-3xl font-black uppercase tracking-tighter hover:scale-105 transition-transform">
              XII PPLG 1
            </Link>
            <span className="hidden sm:inline-block px-3 py-1 bg-neo-yellow border-2 border-black text-xs sm:text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
              SMKN 1 Depok
            </span>
          </div>

          {/* Navigation Links & Social Media */}
          <div className="flex items-center gap-3 sm:gap-6">
            <nav className="flex gap-1.5 sm:gap-4">
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
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-neo-yellow text-black border-2 sm:border-4 border-black font-black text-sm sm:text-base uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-neo-yellow hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              <InstagramIcon className="w-5 h-5 shrink-0" />
              <span className="hidden md:inline">@12pplg1_</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="px-3 sm:px-4 py-2 text-base sm:text-lg font-bold uppercase border-2 border-transparent hover:border-black hover:bg-neo-yellow hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all -translate-y-0.5 hover:translate-y-0"
    >
      {text}
    </Link>
  );
}
