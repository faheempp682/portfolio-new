'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RevealText({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    
    // Initial state: clip the element from top down so it's hidden
    gsap.set(el, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      y: 50,
      opacity: 0,
    });

    // Animate to full visibility on scroll
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%', // Trigger animation when top of element hits 85% from top of viewport
        toggleActions: 'play none none reverse', // play when entering, reverse when leaving backward
      },
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      y: 0,
      opacity: 1,
      duration: 2.5,
      ease: 'power3.out',
    });

  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
