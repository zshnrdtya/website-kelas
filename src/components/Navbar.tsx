import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-neo-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl font-bold uppercase tracking-tighter hover:scale-105 transition-transform">
              XII PPLG 1
            </Link>
            <span className="hidden sm:inline-block px-3 py-1 bg-neo-yellow border-2 border-black text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2">
              SMKN 1 Depok
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-6">
            <NavLink href="#struktur" text="Struktur" />
            <NavLink href="#galeri" text="Galeri" />
            <NavLink href="#profil" text="Profil" />
          </nav>
          
          {/* Mobile Menu Button (Placeholder for visual completeness) */}
          <div className="md:hidden flex items-center">
            <button className="p-2 border-2 border-transparent hover:border-black hover:bg-neo-yellow transition-colors font-bold uppercase">
              Menu
            </button>
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
      className="px-4 py-2 text-lg font-bold uppercase border-2 border-transparent hover:border-black hover:bg-neo-yellow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all -translate-y-1 hover:translate-y-0"
    >
      {text}
    </Link>
  );
}
