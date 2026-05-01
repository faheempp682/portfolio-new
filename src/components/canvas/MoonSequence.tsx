'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frameCount = 176;

export default function MoonSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    
    const loadImages = async () => {
      const imgArray: HTMLImageElement[] = [];
      const promises = [];
      
      for (let i = 1; i <= frameCount; i++) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image();
          const indexStr = i.toString().padStart(3, '0');
          img.src = `/images/moon/ezgif-frame-${indexStr}.jpg`;
          img.onload = () => {
             imgArray[i - 1] = img;
             resolve();
          };
          img.onerror = () => resolve();
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
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const render = (index: number) => {
      const img = images[index];
      if (img) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;  
        
        ctx.fillStyle = '#050505'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(img, 0, 0, img.width, img.height,
                      centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
      }
    };

    render(0);

    const playhead = { frame: 0 };
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#contact', 
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, 
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
    <div className="absolute inset-0 w-full h-full -z-10 bg-transparent">
       <div className="sticky top-0 w-full h-screen overflow-hidden">
          {!loaded && <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm tracking-[0.2em] font-light uppercase animate-pulse">Initializing Interface...</div>}
          <canvas ref={canvasRef} className="w-full h-full object-cover mix-blend-screen opacity-90" />
          <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-transparent to-[#050505] opacity-90 pointer-events-none" />
       </div>
    </div>
  );
}
