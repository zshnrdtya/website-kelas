import Navbar from "../src/components/Navbar";
import Hero from "../src/components/Hero";
import StructureTimeline from "../src/components/StructureTimeline";
import Gallery from "../src/components/Gallery";
import Profiles from "../src/components/Profiles";

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

      <Profiles />
      
      {/* Footer */}
      <footer className="py-12 bg-black text-neo-white text-center border-t-4 border-neo-yellow">
        <h2 className="text-4xl font-black uppercase mb-4 text-neo-yellow">XII PPLG 1</h2>
        <p className="font-bold text-lg mb-8">SMKN 1 Depok &copy; {new Date().getFullYear()}</p>
        <div className="w-24 h-4 bg-neo-yellow mx-auto"></div>
      </footer>
    </main>
  );
}
