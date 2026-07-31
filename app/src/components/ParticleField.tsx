import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import type { Group } from 'three';

/**
 * Campo de partículas violeta con parallax sutil según la posición del
 * mouse. Usa `Sparkles` de drei (instanced, ligero) en vez de un sistema
 * de partículas manual.
 */
export function ParticleField() {
  const group = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.35;
    };
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += (target.current.x - g.rotation.y) * 0.03;
    g.rotation.x += (-target.current.y - g.rotation.x) * 0.03;
  });

  return (
    <group ref={group}>
      <Sparkles count={140} scale={[9, 6, 6]} size={2.5} speed={0.25} color="#a855f7" opacity={0.7} />
      <Sparkles count={70} scale={[10, 7, 7]} size={1.2} speed={0.15} color="#7c3aed" opacity={0.5} />
    </group>
  );
}
