'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';
import GlowingMoon from './GlowingMoon';
import BackgroundShader from './BackgroundShader';

export default function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#050505']} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        
        {/* Environment for reflections */}
        <Suspense fallback={null}>
          <Environment preset="city" />
          <BackgroundShader />
          <GlowingMoon />
        </Suspense>
      </Canvas>
    </div>
  );
}
