"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  // { href: '#work', label: 'Work' },
  { href: "#stack", label: "Stack" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b border-white/10"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-16">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="text-accent text-xl leading-none">✦</span>
          <span className="font-mono text-sm tracking-tight text-white">
            faheem<span className="text-accent">.</span>dev
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative hover:text-white transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-all duration-300"
        >
          Let&apos;s talk
        </a>
      </div>
    </header>
  );
}
