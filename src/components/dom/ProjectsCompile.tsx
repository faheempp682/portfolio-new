"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  num: string;
  title: string;
  category: string;
  year: string;
  stack: string[];
  blurb: string;
};

const projects: Project[] = [
  {
    num: "01",
    title: "Aurora Banking",
    category: "Fintech / Web App",
    year: "2025",
    stack: ["Next.js", "TypeScript", "GSAP", "Stripe"],
    blurb:
      "A consumer banking dashboard rebuilt around motion-led data viz and a custom design system. Reduced average task time by 38%.",
  },
  {
    num: "02",
    title: "Palette Studio",
    category: "SaaS / Design Tool",
    year: "2024",
    stack: ["React", "Canvas", "Tailwind", "Supabase"],
    blurb:
      "A collaborative color-system tool. Tokens flow from Figma to code automatically, with live preview across device frames.",
  },
  {
    num: "03",
    title: "Halo Commerce",
    category: "E-Commerce",
    year: "2024",
    stack: ["Next.js", "Shopify", "GSAP", "Lenis"],
    blurb:
      "A premium D2C storefront with scroll-driven product reveals and a 96+ Lighthouse score across the board.",
  },
  {
    num: "04",
    title: "Northwind AI",
    category: "AI Workflow",
    year: "2025",
    stack: ["Next.js", "Claude API", "Vercel AI"],
    blurb:
      "An AI-augmented internal ops console. Chat plus structured tools cut report turnaround from 2 hours to 8 minutes.",
  },
];

export default function ProjectsCompile() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");

      cards.forEach((card) => {
        const mockup = card.querySelector(".proj-mockup") as HTMLElement | null;
        const live = card.querySelector(".proj-live") as HTMLElement | null;
        const meta = card.querySelector(".proj-meta") as HTMLElement | null;

        if (!mockup || !live || !meta) return;

        // Initial state
        gsap.set(live, { opacity: 0, scale: 0.96 });
        gsap.set(mockup, { opacity: 1 });

        // Compile timeline scrubbed to scroll within this card
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 65%",
            end: "bottom 30%",
            scrub: 1,
          },
        });

        tl.to(mockup, { opacity: 0.18, duration: 1 }, 0)
          .to(live, { opacity: 1, scale: 1, duration: 1 }, 0.1)
          .from(meta, { y: 30, opacity: 0, duration: 1 }, 0);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={root}
      className="relative px-6 md:px-12 py-32 md:py-44 !hidden"
    >
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
          <span className="w-8 h-px bg-zinc-700" />
          <span className="text-accent">03</span>
          <span>Selected Work</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 hidden md:block">
          Mockup → Live build
        </div>
      </div>

      <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-20 max-w-4xl leading-[1.05]">
        Designs that
        <br />
        <span className="text-zinc-500">compile into</span>{" "}
        <span className="text-accent">products.</span>
      </h2>

      <div ref={trackRef} className="space-y-32 md:space-y-44">
        {projects.map((p, i) => (
          <article
            key={p.num}
            className={`project-card grid md:grid-cols-12 gap-6 md:gap-10 items-center ${
              i % 2 === 1 ? "md:[&>.proj-stage]:order-2" : ""
            }`}
          >
            {/* Stage: mockup + live overlay */}
            <div className="proj-stage md:col-span-7 relative aspect-5/4 rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0c]">
              {/* Toolbar */}
              <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 h-10 border-b border-white/5 bg-black/60 z-30 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                <span className="ml-3 truncate">
                  {p.title.toLowerCase().replace(/\s+/g, "-")}.fig
                </span>
                <span className="ml-auto flex items-center gap-1 text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  compiling
                </span>
              </div>

              {/* Mockup layer (Figma frame) */}
              <div className="proj-mockup absolute inset-0 pt-10 bg-dotgrid">
                <div className="relative w-full h-full p-6 md:p-10">
                  <div className="relative w-full h-full border border-accent/60 rounded-md">
                    {/* Selection handles */}
                    {[
                      "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
                      "top-0 right-0 translate-x-1/2 -translate-y-1/2",
                      "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
                      "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
                    ].map((p2) => (
                      <span
                        key={p2}
                        className={`absolute ${p2} w-2 h-2 bg-accent border border-black`}
                      />
                    ))}
                    <div className="absolute -top-6 left-0 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                      {p.title} / desktop
                    </div>

                    {/* Wireframe-ish content */}
                    <div className="absolute inset-0 p-6 md:p-10 flex flex-col gap-4">
                      <div className="h-3 w-32 bg-zinc-700/70 rounded" />
                      <div className="h-8 w-3/4 bg-zinc-600/50 rounded" />
                      <div className="h-8 w-2/3 bg-zinc-600/40 rounded" />
                      <div className="mt-auto grid grid-cols-3 gap-3">
                        <div className="aspect-video bg-zinc-700/40 rounded" />
                        <div className="aspect-video bg-zinc-700/40 rounded" />
                        <div className="aspect-video bg-zinc-700/40 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live layer (rendered preview) */}
              <div className="proj-live absolute inset-0 pt-10">
                <div
                  className="relative w-full h-full"
                  style={{
                    background:
                      i % 4 === 0
                        ? "linear-gradient(135deg,#0a1f12,#070707 60%)"
                        : i % 4 === 1
                          ? "linear-gradient(135deg,#1a1208,#080808 60%)"
                          : i % 4 === 2
                            ? "linear-gradient(135deg,#0a1224,#070707 60%)"
                            : "linear-gradient(135deg,#1a0820,#070707 60%)",
                  }}
                >
                  <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-between">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      <span>{p.category}</span>
                      <span>{p.year}</span>
                    </div>

                    <div>
                      <div className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] mb-3">
                        {p.num} / Live
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-sm md:text-base text-zinc-400 max-w-md leading-relaxed">
                        {p.blurb}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <span
                          key={s}
                          className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm border border-white/10 text-zinc-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Big project number watermark */}
              <span className="pointer-events-none absolute bottom-2 right-3 text-[10rem] md:text-[14rem] leading-none font-bold text-white/4 select-none">
                {p.num}
              </span>
            </div>

            {/* Side meta */}
            <div className="proj-meta md:col-span-5 space-y-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                Project · {p.num}
              </div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                {p.title}
              </h3>
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light max-w-md">
                {p.blurb}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[11px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-white/10 text-zinc-400"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent pt-4 group"
              >
                Open case study
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
