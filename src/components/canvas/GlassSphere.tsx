'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GlassSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Mouse Parallax Effect
    const mouseX = (state.pointer.x * Math.PI) / 8;
    const mouseY = (state.pointer.y * Math.PI) / 8;

    // Smoothly interpolate towards target rotation (mouse parallax)
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouseY, delta * 2);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouseX, delta * 2);

    // Apply the parallax on top of the base GSAP rotation
    // Note: We'll let GSAP handle position and base rotation, and just add parallax offset via a group if needed, 
    // or directly sum them here. For simplicity, GSAP will animate the meshRef, we add parallax on top in useFrame.
    // Actually, letting GSAP control it directly is cleaner. We will animate properties via GSAP in useEffect.
    // For small parallax, we could wrap the mesh in a group and animate the group.

    // Let's implement parallax on the mesh itself without fighting GSAP by animating a wrapping group.
  });

  useEffect(() => {
    if (!meshRef.current) return;

    // Sync Scroll with 3D Object Rotation and Scale
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // Smooth scrubbing
      },
    });

    tl.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      x: Math.PI / 4,
      ease: 'none',
    }, 0)
    .to(meshRef.current.position, {
      y: -2,
      ease: 'power1.inOut',
    }, 0)
    .to(meshRef.current.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      ease: 'power1.inOut',
    }, 0.5);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={1}
          anisotropy={0.1}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}
