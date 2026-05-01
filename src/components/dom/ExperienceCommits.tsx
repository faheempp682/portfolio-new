"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type Commit = {
  hash: string;
  branch: string;
  role: string;
  company: string;
  type: string;
  range: string;
  duration: string;
  location: string;
  body: string;
  tags?: string[];
};

const commits: Commit[] = [
  {
    hash: "a3f9b2c",
    branch: "main",
    role: "Frontend Developer",
    company: "KIMP",
    type: "Full-time",
    range: "Aug 2020 — Present",
    duration: "5 yrs 9 mos",
    location: "Bangalore, IN",
    body: "Lead frontend engineer for KIMP's subscription platform. Built React-based interfaces consumed by thousands of designers daily. Shipped React Native side projects and integrated AI-augmented workflows into core product loops.",
    tags: ["React.js", "React Native", "Next.js", "TypeScript", "AI workflows"],
  },
  {
    hash: "7d12e08",
    branch: "design",
    role: "Web User Interface Designer",
    company: "WhiteMoose Solutions",
    type: "Full-time",
    range: "2017 — 2020",
    duration: "4 yrs 4 mos",
    location: "Bengaluru, IN",
    body: "Crafted UI for a wide spectrum of client products — SaaS dashboards, marketing sites, and mobile apps. Established a reusable design language and component library used across 20+ engagements.",
    tags: ["Figma", "Design systems", "UX research", "Prototyping"],
  },
  {
    hash: "5b81ca4",
    branch: "design",
    role: "Web Designer",
    company: "Greenlemon Internet Marketing & Web Solutions",
    type: "Full-time",
    range: "2014 — 2017",
    duration: "~2 yrs",
    location: "Bengaluru, IN",
    body: "Designed and shipped marketing websites and brand identities for SMB and agency clients. Honed visual fundamentals — typography, layout systems, and conversion-led UI patterns.",
    tags: ["Web design", "Branding", "HTML/CSS"],
  },
];

const education = {
  hash: "0001abc",
  branch: "init",
  role: "B.E. Information Technology",
  company: "CET — College",
  range: "2010 — 2013",
};

export default function ExperienceCommits() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".commit-row",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".commit-list",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.to(".git-line", {
        scaleY: 1,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".commit-list",
          start: "top 85%",
          toggleActions: "play none none none",
          invalidateOnRefresh: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={root}
      className="relative px-6 md:px-12 py-32 md:py-44 border-t border-white/5"
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 mb-16">
        <span className="w-8 h-px bg-zinc-700" />
        <span className="text-accent">05</span>
        <span>Experience</span>
        <span className="ml-auto hidden md:inline-flex items-center gap-2 text-zinc-600">
          <span className="font-mono">$ git log --oneline</span>
        </span>
      </div>

      <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-20 max-w-4xl leading-[1.05]">
        A history,
        <br />
        <span className="text-zinc-500">committed.</span>
      </h2>

      <div className="commit-list relative max-w-4xl pl-6 md:pl-10">
        {/* Vertical git line */}
        <span
          className="git-line absolute left-1.5 md:left-2 top-2 bottom-2 w-px bg-accent/40 origin-top"
          style={{ transform: "scaleY(0)" }}
        />

        {commits.map((c) => (
          <article key={c.hash} className="commit-row relative pb-16 last:pb-8">
            {/* Node */}
            <span className="absolute -left-[18px] md:-left-[22px] top-1 w-3 h-3 rounded-full bg-accent ring-4 ring-accent/15" />

            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              <span className="text-accent">commit {c.hash}</span>
              <span>· ({c.branch})</span>
              <span className="ml-auto text-zinc-600">{c.range}</span>
            </header>

            <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              {c.role}{" "}
              <span className="text-zinc-500 font-light">@ {c.company}</span>
            </h3>

            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              {c.type} · {c.duration} · {c.location}
            </div>

            <p className="mt-4 text-zinc-400 text-base md:text-lg leading-relaxed font-light max-w-2xl">
              {c.body}
            </p>

            {c.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm border border-white/10 text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}

        {/* Education as initial commit */}
        <article className="commit-row relative pb-2">
          <span className="absolute -left-[18px] md:-left-[22px] top-1 w-3 h-3 rounded-full bg-zinc-700 ring-4 ring-white/5" />
          <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            <span>commit {education.hash}</span>
            <span>· ({education.branch})</span>
            <span className="ml-auto text-zinc-600">{education.range}</span>
          </header>
          <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white">
            {education.role}{" "}
            <span className="text-zinc-500 font-light">
              @ {education.company}
            </span>
          </h3>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            initial commit — where the journey started *
          </p>
        </article>
      </div>
    </section>
  );
}
