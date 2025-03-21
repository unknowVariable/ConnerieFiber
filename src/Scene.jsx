import React, { Suspense, useRef } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'three';

function FloatingIsland() {
  const groupRef = useRef();

  const materials = useLoader(MTLLoader, '/A_poly_cat_on_a_float_0321080644_texture.mtl');
  const obj = useLoader(OBJLoader, '/A_poly_cat_on_a_float_0321080644_texture.obj', loader => {
    materials.preload();
    loader.setMaterials(materials);
  });

  obj.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t) * 0.3;
    state.camera.position.x = Math.sin(t * 0.3) * 3;
    state.camera.position.z = Math.cos(t * 0.3) * 3;
    state.camera.lookAt(0, 0, 0);
  });

  return <primitive ref={groupRef} object={obj} scale={0.5} position={[0, 0, 0]} />;
}

function Walls() {
  const texture = useLoader(TextureLoader, 'https://cdn.intra.42.fr/users/1fc91fc6de55d68d122844c5a2fd59b1/gmarquis.jpg');

  return (
    <group>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh position={[0, 0, 5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

function RotatingSun() {
  const sunRef = useRef();
  const materials = useLoader(MTLLoader, '/Starburst_Sun_0321084337_texture.mtl');
  const obj = useLoader(OBJLoader, '/Starburst_Sun_0321084337_texture.obj', loader => {
    materials.preload();
    loader.setMaterials(materials);
  });

  useFrame(() => {
    sunRef.current.rotation.z += 0.005;
  });

  return <primitive ref={sunRef} object={obj} scale={0.3} position={[-2, 1.1, 0]} rotation={[0, Math.PI / 4, 0]} />;
}

export default function Scene() {
  const floorTexture = useLoader(TextureLoader, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXfAZMOWHDQ3DKE63A9jWhIqQaKcKqUIXvzg&s');
  floorTexture.repeat.set(4, 4);
  floorTexture.wrapS = floorTexture.wrapT = 1000;

  return (
    <Canvas shadows camera={{ position: [0, 1, 2], fov: 50 }} style={{ background: 'white' }}>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
        shadow-camera-right={10}
      />

      <Suspense fallback={null}>
        <FloatingIsland />
        <Walls />
        <RotatingSun />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
    </Canvas>
  );
}
