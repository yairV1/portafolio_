import { useRef } from 'react';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Avatar 3D estilizado (no fotorrealista): un "buddy" geométrico en la
 * misma paleta violeta del carné, construido solo con primitivas de Three.
 * Evita depender de un modelo externo (glb/Ready Player Me) que no existe
 * en el repo, a cambio de una identidad visual coherente con el resto del
 * sitio. Reacciona al cursor (cabeza) y saluda periódicamente (brazo).
 */
function AvatarModel({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const armLeft = useRef<THREE.Group>(null!);
  const armRight = useRef<THREE.Group>(null!);

  useFrame((state: RootState, delta: number) => {
    if (!active || !group.current) return;
    const t = state.clock.elapsedTime;

    group.current.position.y = Math.sin(t * 1.1) * 0.08;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.18;

    const targetX = state.pointer.y * 0.15;
    const targetY = state.pointer.x * 0.25;
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, targetX, 4, delta);
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, targetY, 4, delta);

    armLeft.current.rotation.z = -0.35 + Math.sin(t * 1.4) * 0.06;

    const cycle = t % 6;
    if (cycle < 1.6) {
      const p = cycle / 1.6;
      const wave = Math.sin(p * Math.PI);
      armRight.current.rotation.z = 0.9 + wave * 0.9 + Math.sin(t * 9) * wave * 0.25;
    } else {
      armRight.current.rotation.z = THREE.MathUtils.damp(armRight.current.rotation.z, 0.35, 4, delta);
    }
  });

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      <RoundedBox args={[1.1, 1.25, 0.55]} radius={0.18} smoothness={4} position={[0, -0.55, 0]}>
        <meshStandardMaterial color="#1a1330" roughness={0.5} metalness={0.25} />
      </RoundedBox>

      <mesh position={[0, -0.35, 0.29]}>
        <planeGeometry args={[0.22, 0.16]} />
        <meshStandardMaterial color="#cdb8f7" emissive="#a855f7" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>

      <group ref={armLeft} position={[-0.62, -0.15, 0]}>
        <mesh position={[0, -0.35, 0]} rotation={[0, 0, Math.PI / 16]}>
          <capsuleGeometry args={[0.11, 0.55, 4, 8]} />
          <meshStandardMaterial color="#221a3d" roughness={0.55} />
        </mesh>
      </group>

      <group ref={armRight} position={[0.62, -0.15, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.11, 0.55, 4, 8]} />
          <meshStandardMaterial color="#221a3d" roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.68, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#2a2148" roughness={0.5} />
        </mesh>
      </group>

      <group ref={head} position={[0, 0.42, 0]}>
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#1e1638" roughness={0.4} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.02, 0.36]}>
          <boxGeometry args={[0.5, 0.14, 0.06]} />
          <meshStandardMaterial
            color="#cdb8f7"
            emissive="#a855f7"
            emissiveIntensity={1.1}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.36, -0.03]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.16, 0.22, 6]} />
          <meshStandardMaterial color="#120b21" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

export function AvatarScene({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4.2], fov: 32 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 4]} intensity={1.3} color="#e9d9ff" />
      <pointLight position={[-3, -1, 2]} intensity={0.7} color="#a855f7" />
      <Environment preset="city" environmentIntensity={0.3} />
      <AvatarModel active={active} />
    </Canvas>
  );
}
