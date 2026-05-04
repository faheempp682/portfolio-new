"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { prefix: "$", text: "whoami", accent: false },
  {
    prefix: ">",
    text: "faheem — frontend developer · ui/ux designer",
    accent: false,
  },
  { prefix: "$", text: "ping dev@faheem.site", accent: false },
  {
    prefix: ">",
    text: "64 bytes from faheem: time=instant, status=available",
    accent: true,
  },
  { prefix: "$", text: "open mailto:faheempp@kimp.com", accent: false },
];

export default function ContactTerminal() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".term-line",
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.35,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".term-window",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        ".cta-headline span",
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          stagger: 0.06,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-headline",
            start: "top 90%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const headline = "LET’S BUILD".split("");

  return (
    <section
      id="contact"
      ref={root}
      className="relative px-6 md:px-12 py-32 md:py-44 border-t border-white/5 overflow-hidden"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-16">
        <span className="w-8 h-px bg-zinc-700" />
        <span className="text-accent">06</span>
        <span>Contact</span>
      </div>

      <div className="grid md:grid-cols-12 gap-10 items-center">
        {/* Terminal */}
        <div className="md:col-span-6">
          <div className="term-window rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]">
            <div className="flex items-center gap-2 px-4 h-10 border-b border-white/5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              <span className="ml-3">~ / contact.sh</span>
              <span className="ml-auto text-zinc-600">zsh</span>
            </div>
            <pre className="font-mono text-[12px] md:text-[13px] leading-7 p-6 md:p-8 text-zinc-300">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={`term-line ${l.accent ? "text-accent" : ""}`}
                >
                  <span className="text-zinc-600 mr-3">{l.prefix}</span>
                  {l.text}
                </div>
              ))}
              <div className="term-line">
                <span className="text-zinc-600 mr-3">$</span>
                <span className="caret text-accent">▎</span>
              </div>
            </pre>
          </div>
        </div>

        {/* CTA */}
        <div className="md:col-span-6 md:pl-8">
          <h2 className="cta-headline text-[16vw] md:text-[8vw] leading-[0.85] font-bold tracking-tight mb-8 overflow-hidden">
            {headline.map((ch, i) => (
              <span
                key={i}
                className={`inline-block ${ch === "’" ? "text-accent" : ""}`}
                style={{ whiteSpace: ch === " " ? "pre" : undefined }}
              >
                {ch}
              </span>
            ))}
          </h2>

          <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed mb-10 font-light">
            I&apos;m taking on select frontend &amp; UI/UX work for 2026. If
            you&apos;re shipping something ambitious, I&apos;d love to hear
            about it.
          </p>

          <a
            href="mailto:dev@faheem.site"
            className="group inline-flex items-center gap-3 px-6 py-4 rounded-full border border-white/15 hover:border-accent hover:bg-accent hover:text-black transition-all duration-300"
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em]">
              dev@faheem.site
            </span>
            <span className="w-6 h-px bg-current transition-all group-hover:w-10" />
            <span className="text-lg">→</span>
          </a>

          <div className="mt-12 hidden flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            <a href="#" className="hover:text-accent transition-colors">
              GitHub ↗
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              LinkedIn ↗
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Dribbble ↗
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Read.cv ↗
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-32 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600">
        <div>© 2026 — faheem.dev</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Open for select work
        </div>
        <div>Bangalore, IN</div>
      </footer>
    </section>
  );
}
