'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSplit() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !stage.current) return;

    const ctx = gsap.context(() => {
      // Intro reveals (one-shot, on mount)
      gsap.from('.hero-figma', { x: -60, opacity: 0, duration: 1.1, ease: 'power3.out' });
      gsap.from('.hero-code', { x: 60, opacity: 0, duration: 1.1, ease: 'power3.out' });
      gsap.from('.hero-portrait', { y: 30, opacity: 0, duration: 1.2, delay: 0.15, ease: 'power3.out' });

      // Type each code line in sequence
      const lines = gsap.utils.toArray<HTMLElement>('.code-line');
      lines.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.45, delay: 0.6 + i * 0.16, ease: 'power2.out' }
        );
      });

      // PIN the hero until the mask is done.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current!,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
          pin: stage.current!,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // The mask: image1 (designer) wipes top→bottom revealing image2 (developer).
      // Plays across the FULL pinned scroll, ends at progress=1 (mask done = ready to leave).
      tl.fromTo(
        '.hero-portrait-mask',
        { clipPath: 'inset(0% 0% 0% 0%)' },
        { clipPath: 'inset(100% 0% 0% 0%)', ease: 'none' },
        0
      );

      // Sweep line follows the cut
      tl.fromTo('.hero-sweep', { top: '0%' }, { top: '100%', ease: 'none' }, 0);

      // Role badges swap during the mask
      tl.to('.hero-label-design', { opacity: 0.25, ease: 'none' }, 0);
      tl.fromTo(
        '.hero-label-dev',
        { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' },
        {
          backgroundColor: 'rgba(181,255,58,1)',
          color: '#000',
          ease: 'none',
        },
        0
      );

      // Code line highlight pulses with progress so the right side feels alive too
      tl.to('.code-cursor', { y: 18 * 8, ease: 'none' }, 0); // walk caret down 8 lines
      tl.fromTo(
        '.code-progress-bar',
        { width: '0%' },
        { width: '100%', ease: 'none' },
        0
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative w-full"
      style={{ height: '250vh' }}
    >
      {/* Pinned stage — full viewport with padding for the gap, inner card holds visuals */}
      <div
        ref={stage}
        className="relative w-full h-screen"
        style={{
          paddingTop: 'calc(4rem + 1rem)', // nav height + 1rem breathing room
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingBottom: '1rem',
        }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-black">
        {/* Center divider */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/10 z-10 hidden md:block" />

        {/* ─────────── LEFT: Portrait + Figma chrome ─────────── */}
        <div className="hero-figma absolute left-0 top-0 w-full md:w-1/2 h-1/2 md:h-full bg-[#0a0a0a] bg-dotgrid">
          {/* Toolbar */}
          <div className="absolute top-5 left-5 right-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 z-10">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-3">portfolio.fig — Hero</span>
            <span className="ml-auto text-accent">● live</span>
          </div>

          {/* Layers panel (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-5 w-36 font-mono text-[10px] text-zinc-500 space-y-1.5 z-10">
            <div className="text-zinc-300">▾ Hero / Frame</div>
            <div className="pl-3 text-accent">▸ portrait.image</div>
            <div className="pl-3">▸ heading.text</div>
            <div className="pl-3">▸ tag.chip</div>
          </div>

          {/* Portrait centered in LEFT half — feathered into bg, no hard box */}
          <div className="hero-portrait absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[78%] max-w-[480px] aspect-4/5">
              {/* Image stack with feathered radial mask so edges blend into bg */}
              <div
                className="absolute inset-0"
                style={{
                  maskImage:
                    'radial-gradient(ellipse 70% 80% at 50% 45%, #000 55%, rgba(0,0,0,0.6) 78%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 70% 80% at 50% 45%, #000 55%, rgba(0,0,0,0.6) 78%, transparent 100%)',
                }}
              >
                {/* BASE: developer/live render */}
                <Image
                  src="/images/me/mehero/image2.png"
                  alt="Faheem — live render"
                  fill
                  priority
                  sizes="(max-width: 768px) 78vw, 480px"
                  className="object-cover object-center"
                />

                {/* TOP: designer mockup, wipes top→bottom on scroll */}
                <div
                  className="hero-portrait-mask absolute inset-0 will-change-[clip-path]"
                  style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                >
                  <Image
                    src="/images/me/mehero/image1.png"
                    alt="Faheem — designer mockup"
                    fill
                    priority
                    sizes="(max-width: 768px) 78vw, 480px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 mix-blend-overlay bg-accent/5" />
                </div>

                {/* Inner vignette: deepens dark edges so the photo "sits" in the page */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 80% 90% at center, transparent 50%, rgba(5,5,5,0.65) 90%, #050505 100%)',
                  }}
                />
              </div>

              {/* Sweep line — sits above the image, snaps to its edges */}
              <div
                className="hero-sweep absolute left-[6%] right-[6%] h-[2px] bg-accent shadow-[0_0_28px_rgba(181,255,58,0.85)] z-20"
                style={{ top: '0%' }}
              />

              {/* Role badges — float, no box around them */}
              <div className="absolute -top-2 left-2 z-30 flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className="hero-label-design px-2 py-1 rounded-sm bg-accent text-black self-start">
                  01 · Designer
                </span>
                <span className="hero-label-dev px-2 py-1 rounded-sm bg-white/10 text-white/80 backdrop-blur-sm self-start">
                  02 · Developer
                </span>
              </div>

              {/* File-name caption */}
              <div className="absolute -bottom-6 left-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 z-30">
                hero / faheem.png
              </div>
            </div>
          </div>

          {/* Designer cursor */}
          <div className="absolute bottom-6 left-6 hidden md:flex items-center gap-1.5 pointer-events-none z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" className="-rotate-12">
              <path
                d="M3 2 L21 12 L13 13 L11 21 Z"
                fill="#fff"
                stroke="#000"
                strokeWidth="1"
              />
            </svg>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-accent text-black">
              designer
            </span>
          </div>

          {/* Bottom-left tagline */}
          <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 z-10">
            Aesthetic / Intent
          </div>
        </div>

        {/* ─────────── RIGHT: Code editor ─────────── */}
        <div className="hero-code absolute right-0 bottom-0 md:top-0 w-full md:w-1/2 h-1/2 md:h-full bg-[#0d0d0d]">
          <div className="absolute top-5 left-5 right-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 z-10">
            <span>hero.tsx</span>
            <span className="ml-3 text-zinc-700">— modified</span>
            <span className="ml-auto text-zinc-600">utf-8 · ts</span>
          </div>

          {/* Top-of-editor compile progress bar */}
          <div className="absolute top-12 left-5 right-5 h-px bg-white/5 z-10 overflow-hidden">
            <div className="code-progress-bar h-full bg-accent" style={{ width: '0%' }} />
          </div>

          <div className="absolute inset-0 flex items-center z-10">
            <pre className="relative w-full font-mono text-[12px] md:text-[13px] leading-7 px-8 md:px-14 text-zinc-300">
              <code>
                <div className="code-line">
                  <span className="text-zinc-600">01 </span>
                  <span className="text-pink-400">import</span>{' '}
                  <span className="text-zinc-200">{'{ Hero }'}</span>{' '}
                  <span className="text-pink-400">from</span>{' '}
                  <span className="text-accent">&apos;@/sections&apos;</span>
                  <span className="text-zinc-500">;</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">02 </span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">03 </span>
                  <span className="text-pink-400">export default function</span>{' '}
                  <span className="text-yellow-300">Page</span>
                  <span className="text-zinc-300">() {'{'}</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">04 </span>
                  {'  '}
                  <span className="text-pink-400">return</span>{' '}
                  <span className="text-zinc-300">(</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">05 </span>
                  {'    '}
                  <span className="text-zinc-500">{'<'}</span>
                  <span className="text-sky-300">Hero</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">06 </span>
                  {'      '}
                  <span className="text-emerald-300">name</span>
                  <span className="text-zinc-500">=</span>
                  <span className="text-accent">&quot;Faheem&quot;</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">07 </span>
                  {'      '}
                  <span className="text-emerald-300">role</span>
                  <span className="text-zinc-500">=</span>
                  <span className="text-accent">&quot;Frontend + UI/UX&quot;</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">08 </span>
                  {'      '}
                  <span className="text-emerald-300">years</span>
                  <span className="text-zinc-500">=</span>
                  <span className="text-zinc-300">{'{10}'}</span>{' '}
                  <span className="text-zinc-500">/{'>'}</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">09 </span>
                  {'  '}
                  <span className="text-zinc-300">);</span>
                </div>
                <div className="code-line">
                  <span className="text-zinc-600">10 </span>
                  <span className="text-zinc-300">{'}'}</span>
                </div>
              </code>

              {/* Caret that walks down lines as user scrolls */}
              <span
                className="code-cursor caret absolute text-accent"
                style={{ left: '2.6rem', top: '0' }}
              >
                ▎
              </span>
            </pre>
          </div>

          {/* Bottom-right tagline */}
          <div className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 z-10">
            Logic / Build
          </div>

          {/* Developer cursor */}
          <div className="absolute bottom-6 left-6 hidden md:flex items-center gap-1.5 pointer-events-none z-10">
            <svg width="14" height="14" viewBox="0 0 24 24" className="-rotate-12">
              <path
                d="M3 2 L21 12 L13 13 L11 21 Z"
                fill="#fff"
                stroke="#000"
                strokeWidth="1"
              />
            </svg>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-white text-black">
              developer
            </span>
          </div>
        </div>

        {/* Top-of-stage role label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-1 pointer-events-none">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">
            ✦ × ✦
          </span>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500 z-30 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          scroll to compile
        </div>
        </div>{/* /rounded card */}
      </div>{/* /pinned stage */}
    </section>
  );
}
