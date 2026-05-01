'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const haloVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// A soft bluish/white lunar glow
const haloFragmentShader = `
varying vec3 vNormal;
void main() {
  float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
  gl_FragColor = vec4(0.7, 0.8, 1.0, 1.0) * intensity;
}
`;

export default function GlowingMoon() {
  const moonRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (!moonRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Dark moon rises and rotates as you scroll
    tl.to(moonRef.current.rotation, {
      y: Math.PI * 2,
      x: Math.PI / 6,
      ease: 'none',
    }, 0)
    .fromTo(moonRef.current.position, {
      y: -3,
    }, {
      y: 0,
      ease: 'power1.out',
    }, 0)
    .fromTo(moonRef.current.scale, {
      x: 0.8, y: 0.8, z: 0.8
    }, {
      x: 1.4, y: 1.4, z: 1.4,
      ease: 'power1.out',
    }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <group ref={moonRef}>
      {/* The Dark Moon Body */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0a0a0c"
          roughness={0.9}
          metalness={0.2}
          emissive="#050508"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* The Glow/Halo Atmosphere */}
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <shaderMaterial
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
