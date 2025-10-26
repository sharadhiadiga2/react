import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, OrbitControls } from '@react-three/drei';

const AnimatedShape = () => {
  const meshRef = useRef();

  // This hook runs on every frame, allowing animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[2.5, 0]}>
      <meshStandardMaterial color="#2563EB" wireframe />
    </Icosahedron>
  );
};

const Scene3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 7] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AnimatedShape />
      {/* Optional: Allows user to rotate the object */}
      <OrbitControls enableZoom={false} enablePan={false} /> 
    </Canvas>
  );
};

export default Scene3D;