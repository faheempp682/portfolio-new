'use client';

const items = [
  'UI / UX Designer',
  'Frontend Developer',
  'Next.js · React',
  'Design Systems',
  'AI-Augmented Workflows',
  'Motion · GSAP',
  '10+ Years',
];

export default function Marquee() {
  const row = (
    <div className="flex items-center gap-12 px-6 shrink-0">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-12 shrink-0">
          <span className="font-mono text-[10vw] md:text-[7vw] leading-none uppercase tracking-tight text-white whitespace-nowrap">
            {it}
          </span>
          <span className="text-accent text-[6vw] md:text-[4vw] leading-none select-none">
            ✦
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-hidden
      className="relative w-full py-10 md:py-16 overflow-hidden border-y border-white/5 bg-black"
    >
      <div className="marquee-track flex">
        {row}
        {row}
      </div>
    </section>
  );
}
