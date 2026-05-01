'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frameCount = 240;

export default function ImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    
    // We preload silently to avoid blocking the main thread too intensely, 
    // waiting only a beat before pushing what we have.
    const loadImages = async () => {
      const imgArray: HTMLImageElement[] = [];
      
      const promises = [];
      for (let i = 1; i <= frameCount; i++) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image();
          const indexStr = i.toString().padStart(3, '0');
          img.src = `/images/me/ezgif-frame-${indexStr}.jpg`;
          img.onload = () => {
             // We can push directly or map. It's safer to store them in a fixed-size array by index.
             imgArray[i - 1] = img;
             resolve();
          };
          img.onerror = () => resolve(); // continue even if one fails
        });
        promises.push(promise);
      }
      
      await Promise.all(promises);
      if(active) {
        setImages(imgArray);
        setLoaded(true);
      }
    };

    loadImages();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Better performance
    if (!ctx) return;

    // Use standard full HD resolution
    canvas.width = 1920;
    canvas.height = 1080;

    const render = (index: number) => {
      const img = images[index];
      if (img) {
        // Calculate crop to cover the canvas (object-fit: cover equivalent)
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;  
        
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Safe background
        ctx.drawImage(img, 0, 0, img.width, img.height,
                      centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
      }
    };

    render(0);

    const playhead = { frame: 0 };
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero-sequence', // This must exist in the parent
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
      }
    });

    tl.to(playhead, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => render(playhead.frame),
    });

    return () => {
      tl.kill();
    };
  }, [loaded, images]);

  return (
    <div className="w-full h-screen sticky top-0 bg-black flex justify-center items-center overflow-hidden z-0">
      {!loaded && <div className="absolute text-white/40 text-sm tracking-[0.2em] font-light uppercase animate-pulse">Initializing Sequence...</div>}
      <canvas ref={canvasRef} className="w-full h-full object-cover mix-blend-screen opacity-100" />
      {/* Vignette/Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#050505] opacity-90 pointer-events-none" />
    </div>
  );
}
