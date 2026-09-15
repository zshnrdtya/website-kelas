import Navbar from "../src/components/Navbar";
import Hero from "../src/components/Hero";
import StructureTimeline from "../src/components/StructureTimeline";
import Gallery from "../src/components/Gallery";
import InstagramIcon from "../src/components/InstagramIcon";

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <Hero />
      <StructureTimeline />
      <Gallery />
      
      {/* Neobrutalist Marquee */}
      <div className="w-full bg-neo-yellow border-b-4 border-black py-4 overflow-hidden relative">
        <div className="flex w-max animate-marquee">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-4xl md:text-5xl font-black uppercase px-8 border-r-4 border-black inline-block min-w-max text-black">
              XII PPLG 1 - WE ARE THE BEST CLASS
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-14 bg-black text-neo-white text-center border-t-4 border-neo-yellow px-4">
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-3 text-neo-yellow tracking-wider">
          XII PPLG 1
        </h2>
        <p className="font-bold text-lg mb-6 text-zinc-300">
          SMKN 1 Depok &copy; {new Date().getFullYear()}
        </p>

        {/* Instagram Follow Button */}
        <div className="inline-block mb-8">
          <a
            href="https://www.instagram.com/12pplg1_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kunjungi Instagram XII PPLG 1"
            className="inline-flex items-center gap-3 px-6 py-3.5 bg-neo-yellow text-black font-black uppercase text-base md:text-lg border-4 border-black shadow-[6px_6px_0px_0px_#fff] hover:bg-white hover:text-black hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer"
          >
            <InstagramIcon className="w-6 h-6 shrink-0" />
            <span>Follow @12pplg1_</span>
          </a>
        </div>

        <div className="w-24 h-3 bg-neo-yellow mx-auto"></div>
      </footer>
    </main>
  );
}
