import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { LanyardCard } from './LanyardCard';

/**
 * Contenedor del canvas 3D del hero. `active` controla el `frameloop`:
 * cuando el hero sale del viewport o la pestaña no está visible, se pone
 * en `'never'` y R3F deja de renderizar/step-ear la física por completo
 * (en vez de solo dejar de dibujar), ahorrando CPU/GPU de verdad.
 */
export function Scene3D({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 6.2], fov: 32 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#e9d9ff" castShadow={false} />
      <pointLight position={[-4, -2, 3]} intensity={0.6} color="#a855f7" />
      <Environment preset="city" environmentIntensity={0.35} />
      <ParticleField />
      <LanyardCard />
    </Canvas>
  );
}
