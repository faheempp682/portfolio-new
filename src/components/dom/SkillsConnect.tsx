'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const designSkills = [
  { name: 'Figma', pair: 'react' },
  { name: 'Design Systems', pair: 'tailwind' },
  { name: 'Prototyping', pair: 'gsap' },
  { name: 'User Research', pair: 'typescript' },
  { name: 'Wireframing', pair: 'nextjs' },
  { name: 'Visual Design', pair: 'css' },
];

const devSkills = [
  { name: 'Next.js', id: 'nextjs' },
  { name: 'React.js', id: 'react' },
  { name: 'TypeScript', id: 'typescript' },
  { name: 'Tailwind CSS', id: 'tailwind' },
  { name: 'GSAP / Lenis', id: 'gsap' },
  { name: 'CSS / Motion', id: 'css' },
];

export default function SkillsConnect() {
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skill-row',
        { x: (i) => (i % 2 === 0 ? -30 : 30), opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  // Compute the connection line endpoints when hover state changes
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !root.current) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    if (!hovered) return;

    const designEl = root.current.querySelector(
      `[data-design="${hovered}"]`
    ) as HTMLElement | null;
    const devEl = root.current.querySelector(
      `[data-dev="${hovered}"]`
    ) as HTMLElement | null;

    if (!designEl || !devEl) return;

    const parentRect = svg.getBoundingClientRect();
    const a = designEl.getBoundingClientRect();
    const b = devEl.getBoundingClientRect();

    const x1 = a.right - parentRect.left;
    const y1 = a.top + a.height / 2 - parentRect.top;
    const x2 = b.left - parentRect.left;
    const y2 = b.top + b.height / 2 - parentRect.top;

    const cx = (x1 + x2) / 2;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`
    );
    path.setAttribute('stroke', 'var(--accent)');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', '6 6');
    svg.appendChild(path);

    gsap.fromTo(
      path,
      { strokeDashoffset: 200, opacity: 0 },
      { strokeDashoffset: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    );

    return () => {
      if (path.parentNode === svg) svg.removeChild(path);
    };
  }, [hovered]);

  return (
    <section
      id="stack"
      ref={root}
      className="relative px-6 md:px-12 py-32 md:py-44 border-t border-white/5"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-16">
        <span className="w-8 h-px bg-zinc-700" />
        <span className="text-accent">04</span>
        <span>Stack</span>
      </div>

      <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-4 max-w-4xl leading-[1.05]">
        The two halves,
        <br />
        <span className="text-zinc-500">always connected.</span>
      </h2>
      <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] text-zinc-500 mb-16">
        Hover any item — see its counterpart light up.
      </p>

      <div className="skills-grid relative grid grid-cols-2 gap-6 md:gap-24 max-w-5xl mx-auto">
        {/* Connecting SVG layer */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
        />

        {/* Left: Design tools */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
            ✦ Design
          </div>
          {designSkills.map((s) => {
            const isActive = hovered === s.pair;
            return (
              <div
                key={s.name}
                data-design={s.pair}
                onMouseEnter={() => setHovered(s.pair)}
                onMouseLeave={() => setHovered(null)}
                className={`skill-row group flex items-center justify-between border-b border-white/10 py-4 cursor-pointer transition-all duration-300 ${
                  isActive ? 'border-accent' : ''
                }`}
              >
                <span
                  className={`text-xl md:text-2xl font-medium tracking-tight transition-colors ${
                    isActive ? 'text-accent' : 'text-zinc-300 group-hover:text-white'
                  }`}
                >
                  {s.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  {String(designSkills.indexOf(s) + 1).padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Dev tools */}
        <div className="space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4 text-right">
            Dev ✦
          </div>
          {devSkills.map((s) => {
            const isActive = hovered === s.id;
            return (
              <div
                key={s.id}
                data-dev={s.id}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className={`skill-row group flex items-center justify-between border-b border-white/10 py-4 cursor-pointer transition-all duration-300 ${
                  isActive ? 'border-accent' : ''
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                  {String(devSkills.indexOf(s) + 1).padStart(2, '0')}
                </span>
                <span
                  className={`text-xl md:text-2xl font-medium tracking-tight text-right transition-colors ${
                    isActive ? 'text-accent' : 'text-zinc-300 group-hover:text-white'
                  }`}
                >
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
