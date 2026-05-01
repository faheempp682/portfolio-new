'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Project Alpha',
    category: 'Web App',
    description: 'A full-stack platform with real-time collaboration and immersive 3D dashboards.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  },
  {
    title: 'Neon Studio',
    category: 'Creative Dev',
    description: 'WebGL-powered brand experience with scroll-driven animations and particle systems.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  },
  {
    title: 'Pulse Dashboard',
    category: 'SaaS',
    description: 'Enterprise analytics dashboard with live data visualizations and dark mode UI.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    title: 'Echo Commerce',
    category: 'E-Commerce',
    description: 'High-performance storefront with AI-powered recommendations and fluid transitions.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
  },
  {
    title: 'Vertex Motion',
    category: 'Motion Design',
    description: 'Interactive motion graphics portfolio with GSAP-driven scroll choreography.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
  },
];

export default function HorizontalWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const scrollWidth = track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative z-20 bg-[#050505] overflow-hidden"
    >
      {/* Section heading */}
      <div
        ref={trackRef}
        className="flex items-center h-screen will-change-transform"
      >
        {/* Intro panel */}
        <div className="flex-shrink-0 w-screen h-full flex flex-col justify-center px-[5vw] md:px-[10vw]">
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-zinc-500 mb-4">
            Selected Work
          </p>
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-zinc-100 leading-none">
            Portfolio
          </h2>
          <p className="mt-6 text-xl md:text-2xl text-zinc-500 font-light max-w-xl">
            Scroll to explore a curated selection of projects spanning web apps,
            creative development, and interactive experiences.
          </p>
          <div className="mt-12 flex items-center gap-3 text-zinc-600">
            <span className="block w-12 h-px bg-zinc-600" />
            <span className="text-xs tracking-[0.25em] uppercase">
              Scroll to explore
            </span>
          </div>
        </div>

        {/* Project cards */}
        {projects.map((project, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[85vw] md:w-[50vw] h-full flex items-center px-4 md:px-8"
          >
            <div className="group relative w-full h-[70vh] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 transition-colors duration-500">
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
                <span className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-3">
                  {project.category}
                </span>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  {project.title}
                </h3>
                <p className="text-base md:text-lg text-zinc-400 font-light max-w-md leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors duration-500">
                  <span className="text-sm tracking-widest uppercase">
                    View Project
                  </span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>

              {/* Number */}
              <span className="absolute top-6 right-8 text-[8rem] md:text-[12rem] font-bold text-white/[0.03] leading-none select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-[20vw]" />
      </div>
    </section>
  );
}
