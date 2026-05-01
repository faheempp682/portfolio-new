"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const framePath = (i: number) =>
  `/images/about/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

const HARD_SKILLS = [
  "React",
  "TypeScript",
  "Next.js",

  "Three.js / WebGL",
  "React Native",
  "WordPress",
  "SQL",
  "Node.js",
  "GSAP",
  "Bootstrap",
  "Tailwind",
];

const SOFT_SKILLS = [
  "Problem Solving",
  "Critical Thinking",
  "Autonomy",
  "Curiosity",
  "Collaboration",
  "Creativity",
];

export default function AboutSplit() {
  const root = useRef<HTMLElement>(null);
  const canvasBlockRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndex = useRef(0);

  useEffect(() => {
    if (!root.current || !canvasRef.current || !canvasBlockRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = Array.from(
      { length: FRAME_COUNT },
      (_, i) => {
        const img = new Image();
        img.src = framePath(i);
        return img;
      },
    );
    framesRef.current = images;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    };

    // Crop bottom 7% of each source frame — that's where the Veo watermark
    // sits. Source-cropping (rather than a CSS mask) keeps the canvas free
    // of the watermark pixels so mix-blend-mode lighten can merge the
    // remaining dark backdrop into the page background cleanly.
    const VEO_CROP = 0.07;

    const drawFrame = (idx: number) => {
      const img = framesRef.current[idx];
      if (!img || !img.complete || !img.naturalWidth) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const sourceH = ih * (1 - VEO_CROP);
      // Wrapper aspect matches the cropped source aspect, so we can fill
      // the canvas edge-to-edge with no letterbox and no visible stretch.
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, iw, sourceH, 0, 0, cw, ch);
    };

    sizeCanvas();

    images.forEach((img, i) => {
      const onReady = () => {
        if (i === frameIndex.current) drawFrame(i);
      };
      if (img.complete && img.naturalWidth) onReady();
      else img.addEventListener("load", onReady, { once: true });
    });

    const ctxGsap = gsap.context(() => {
      gsap.fromTo(
        ".about-bio p",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-bio",
            start: "top 85%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.fromTo(
        ".about-tag",
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-tag",
            start: "top 90%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.to(".float-cursor", {
        y: 12,
        x: 8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Pin the canvas block while scroll drives the 240-frame sequence.
      // end: '+=300%' = 3 viewports of pinned scroll-runway. The pin means
      // even a fast scroll input is converted into frame progress instead
      // of skipping the section.
      ScrollTrigger.create({
        trigger: canvasBlockRef.current!,
        start: "top top",
        end: "+=300%",
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const target = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.round(self.progress * (FRAME_COUNT - 1))),
          );
          if (target !== frameIndex.current) {
            frameIndex.current = target;
            drawFrame(target);
          }
        },
      });

      // Skills timeline — fully scrub-driven and tied to the canvas pin so
      // the whole sequence is married to scroll. Lead beat is the panel
      // zoom-out → zoom-in + unblur (user's main ask). Headings, hard
      // cards, and soft cards layer on top at sub-positions, each with its
      // own personality so they don't feel like one bulk reveal.
      const skillsTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: canvasBlockRef.current!,
          start: "top top",
          end: "+=180%",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      skillsTl
        // 1. The whole panel: small + blurry → full size + crisp
        .fromTo(
          ".skills-panel",
          {
            scale: 0.68,
            opacity: 0.22,
            filter: "blur(18px)",
            transformOrigin: "50% 50%",
          },
          { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power2.out" },
          0,
        )
        // 2. Headings slide in from the right, tracking opens up
        .fromTo(
          ".skill-heading",
          { x: 36, opacity: 0, letterSpacing: "0.05em" },
          { x: 0, opacity: 1, letterSpacing: "0.3em", stagger: 0.06 },
          0.35,
        )
        // 3. Hard skills — diagonal wave, slight rotate + back-out overshoot
        .fromTo(
          ".hard-skill",
          { y: 36, x: 14, rotate: -8, scale: 0.72, opacity: 0 },
          {
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            ease: "back.out(1.6)",
            stagger: { grid: [7, 2], from: "start", amount: 0.45 },
          },
          0.45,
        )
        // 4. Soft skills — pop from the center outward
        .fromTo(
          ".soft-skill",
          { scale: 0.4, rotate: 12, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            ease: "back.out(2.2)",
            stagger: { grid: [3, 2], from: "center", amount: 0.4 },
          },
          0.6,
        );
    }, root);

    const onResize = () => {
      sizeCanvas();
      drawFrame(frameIndex.current);
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctxGsap.revert();
      window.removeEventListener("resize", onResize);
      images.forEach((img) => {
        img.onload = null;
        img.src = "";
      });
    };
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="relative px-6 md:px-12 py-32 md:py-44"
    >
      {/* Bio content — scrolls normally */}
      <div className="relative">
        {/* Section label */}
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-16">
          <span className="w-8 h-px bg-zinc-600" />
          <span className="text-accent">02</span>
          <span>About</span>
        </div>

        <div className="grid md:grid-cols-12 gap-10">
          {/* Left: tags / role split */}
          <div className="md:col-span-4 md:sticky md:top-28 self-start">
            <div className="space-y-3">
              <div className="about-tag inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Designer
              </div>
              <div className="about-tag inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Developer
              </div>
              <div className="about-tag inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-accent/50 bg-black/30 backdrop-blur-sm text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                AI-augmented
              </div>
            </div>

            {/* Floating cursor pointing to the bio */}
            <div className="float-cursor mt-12 hidden md:flex items-center gap-1.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="-rotate-12"
              >
                <path
                  d="M3 2 L21 12 L13 13 L11 21 Z"
                  fill="#fff"
                  stroke="#000"
                  strokeWidth="1"
                />
              </svg>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-accent text-black">
                faheem
              </span>
            </div>
          </div>

          {/* Right: bio */}
          <div className="about-bio md:col-span-8 max-w-3xl space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Senior Frontend Developer
              <br />
              <span className="text-zinc-400">&amp; UI/UX Designer.</span>
              <br />
              <span className="text-accent">10+ years</span>
              <span className="text-zinc-400"> of crafting</span>
              <br />
              <span className="text-zinc-400">
                high-performance web experiences.
              </span>
            </h2>

            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
              With over a decade of experience at the intersection of aesthetic
              design and technical engineering, I specialize in building
              scalable, user-centric web applications. My process bridges the
              gap between high-fidelity UI/UX design and clean, production-ready
              code.
            </p>

            <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">
              I thrive in the modern web ecosystem, leveraging{" "}
              <span className="text-white">Next.js</span> and{" "}
              <span className="text-white">React.js</span> to build performant
              interfaces that don&apos;t just look good but perform
              exceptionally. Beyond traditional development, I&apos;m an early
              adopter of{" "}
              <span className="text-accent">AI-augmented workflows</span>,
              integrating tools like Claude to accelerate coding speed, refine
              architectural logic, and optimize complex feature sets.
            </p>

            {/* JSDoc-style annotation */}
            <pre className="font-mono text-[12px] md:text-[13px] leading-relaxed text-zinc-300 border-l-2 border-accent/60 pl-4 mt-10 bg-black/30 backdrop-blur-sm py-3 rounded-sm">
              {`/**
 * @author  Faheem
 * @role    Frontend Developer · UI/UX Designer
 * @based   Bangalore, IN
 * @status  Available for select work, 2026
 */`}
            </pre>
          </div>
        </div>
      </div>

      {/* Pinned canvas + skills panel at the bottom of the section.
          GSAP pins this for +=300% so the 240-frame sequence plays out
          fully — fast scroll just advances frames, never skips. */}
      <div
        ref={canvasBlockRef}
        className="relative mt-32 md:mt-44 h-screen w-full overflow-hidden"
      >
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12 max-w-7xl mx-auto">
          {/* LEFT: scroll-scrubbed frame canvas.
              The Veo watermark is removed in two places working together:
              drawFrame() crops the bottom 7% of the *source* before it ever
              reaches the canvas, and the wrapper aspect (9 / 14.88) matches
              the cropped image so there's no letterbox or stretch.
              mix-blend-mode: lighten makes the dark studio backdrop merge
              with the page background instead of sitting as a black box. */}
          <div className="flex h-full items-center justify-center md:justify-start md:pl-2">
            <div
              className="relative h-[78vh] max-w-[88vw] md:max-w-none overflow-hidden"
              style={{ aspectRatio: "9 / 14.88" }}
            >
              <canvas
                ref={canvasRef}
                className="block h-full w-full"
                style={{ mixBlendMode: "lighten" }}
              />
            </div>
          </div>

          {/* RIGHT: skills panel — different animation (stagger pop-in) */}
          <div className="skills-panel flex h-full items-center">
            <div className="w-full max-h-[82vh] overflow-y-auto pr-1 [scrollbar-width:thin] space-y-8">
              <div>
                <h3 className="skill-heading inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-red-500 mb-4">
                  Hard Skills
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {HARD_SKILLS.map((s) => (
                    <div
                      key={s}
                      className="skill-card hard-skill border border-white/15 bg-black/50 backdrop-blur-sm rounded-md py-3 px-3 text-center text-sm md:text-base text-zinc-200 hover:border-accent/60 hover:text-white transition-colors will-change-transform"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="skill-heading inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-red-500 mb-4">
                  Soft Skills
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {SOFT_SKILLS.map((s) => (
                    <div
                      key={s}
                      className="skill-card soft-skill border border-white/15 bg-black/50 backdrop-blur-sm rounded-md py-3 px-3 text-center text-sm md:text-base text-zinc-200 hover:border-accent/60 hover:text-white transition-colors will-change-transform"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
