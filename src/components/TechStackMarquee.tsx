"use client";

interface TechItem {
  name: string;
  logo: string;
}

const techList: TechItem[] = [
  { name: "HTML5", logo: "/asset-techstack/html.jpeg" },
  { name: "CSS3", logo: "/asset-techstack/css.jpeg" },
  { name: "JavaScript", logo: "/asset-techstack/js.jpeg" },
  { name: "PHP", logo: "/asset-techstack/php.jpeg" },
  { name: "Laravel", logo: "/asset-techstack/laravel.jpeg" },
  { name: "MySQL", logo: "/asset-techstack/mysql.jpeg" },
  { name: "Java", logo: "/asset-techstack/java.jpeg" },
  { name: "Android", logo: "/asset-techstack/android.jpeg" },
  { name: "VS Code", logo: "/asset-techstack/vscode.jpeg" },
  { name: "Figma", logo: "/asset-techstack/figma.jpeg" },
  { name: "GitHub", logo: "/asset-techstack/github.jpeg" },
  { name: "Laragon", logo: "/asset-techstack/laragon.jpeg" },
  { name: "phpMyAdmin", logo: "/asset-techstack/phpmy.jpeg" },
];

export default function TechStackMarquee() {
  return (
    <section className="w-full bg-black text-neo-white border-b-4 border-black py-4 overflow-hidden relative select-none">
      <div className="flex w-max animate-marquee gap-6 sm:gap-8 items-center">
        {/* Render twice for seamless loop */}
        {[...techList, ...techList].map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-neo-white text-black font-black uppercase text-xs sm:text-sm md:text-base px-4 py-2 border-3 sm:border-4 border-black shadow-[3px_3px_0px_0px_#e5de00] shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tech.logo}
              alt={tech.name}
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0"
              loading="lazy"
            />
            <span className="tracking-wider">{tech.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
