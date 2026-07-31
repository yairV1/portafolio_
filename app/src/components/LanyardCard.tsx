import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree, extend, type ThreeEvent } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from '@react-three/rapier';
import { Html, RoundedBox } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { profile } from '../data/content';
import { asset } from '../lib/asset';

extend({ MeshLineGeometry, MeshLineMaterial });

const SEGMENT_LENGTH = 0.55;
const ANCHOR_Y = 3.2;
const CARD_WIDTH = 1.55;
const CARD_HEIGHT = 2.0;
const CARD_DEPTH = 0.06;
const CARD_GAP = 0.18;

const segmentProps = {
  canSleep: true,
  colliders: false as const,
  angularDamping: 4,
  linearDamping: 4,
};

/** Textura procedural (canvas) con "DEVELOPER" repetido para la cinta. */
function useStrapTexture(): THREE.CanvasTexture | null {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#171126';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#cdb8f7';
    ctx.font = '700 38px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D E V E L O P E R', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function CardFace() {
  return (
    <div
      style={{ width: 300, height: 386 }}
      className="pointer-events-none flex select-none flex-col rounded-[22px] border border-white/10 bg-gradient-to-br from-[#1a1330] via-[#221a3d] to-[#140f24] p-5 shadow-2xl"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-border bg-accent-soft text-sm font-bold text-accent">
          YV
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-dim">Identificación</div>
          <div className="text-xs font-semibold text-text-muted">{profile.role}</div>
        </div>
      </div>

      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-accent-border">
        <img
          src={asset('img/yotas.png')}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="text-center">
        <div className="text-lg font-bold text-text">{profile.name}</div>
        <div className="text-xs text-accent">Web Developer</div>
        <div className="mt-1 text-[10px] text-text-dim">
          Desarrollando soluciones con código y creatividad
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3 text-[9px] text-text-dim">
        <span>Miembro desde {profile.memberSince}</span>
        <span>{profile.memberId}</span>
      </div>
    </div>
  );
}

/**
 * Carné colgante 3D. La cinta se simula como una cadena de cuerpos rígidos
 * unidos por `useRopeJoint`, terminando en un `useSphericalJoint` hacia el
 * carné para que cuelgue con balanceo tipo péndulo. Al arrastrar el carné,
 * su cuerpo pasa a `kinematicPosition` (sigue al cursor 1:1); al soltar,
 * vuelve a `dynamic` con un impulso derivado de la velocidad de arrastre,
 * para que el rebote/amortiguación se sienta natural en vez de un corte
 * abrupto.
 *
 * Envuelve el `<Physics>` mundo: los hooks de joints (`useRopeJoint`, etc.)
 * necesitan ejecutarse en un componente que sea *hijo* de `<Physics>`, no
 * en el mismo componente que lo renderiza — por eso la lógica vive en
 * `LanyardRig`, montado como hijo.
 */
export function LanyardCard() {
  return (
    <Physics gravity={[0, -11, 0]} interpolate>
      <LanyardRig />
    </Physics>
  );
}

function LanyardRig() {
  const { camera, gl } = useThree();
  const strapTexture = useStrapTexture();

  // `useRopeJoint`/`useSphericalJoint` tipan sus refs como `RefObject<RigidBody>`
  // (sin null) aunque en la práctica sí pueden ser null antes del montaje;
  // `null!` calza con esa firma y sigue siendo seguro porque los joints solo
  // se resuelven una vez montados los RigidBody.
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const lineGeometry = useRef<MeshLineGeometry>(null);

  const [dragging, setDragging] = useState(false);
  const dragPlane = useRef(new THREE.Plane());
  const raycaster = useRef(new THREE.Raycaster());
  const lastPointerWorld = useRef(new THREE.Vector3());
  const lastPointerTime = useRef(0);
  const pendingVelocity = useRef(new THREE.Vector3());

  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ],
    [],
  );

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_HEIGHT / 2 + CARD_GAP, 0],
  ]);

  useFrame(() => {
    if (fixed.current) curvePoints[0].copy(fixed.current.translation());
    if (j1.current) curvePoints[1].copy(j1.current.translation());
    if (j2.current) curvePoints[2].copy(j2.current.translation());
    if (j3.current) curvePoints[3].copy(j3.current.translation());
    if (card.current) {
      const t = card.current.translation();
      curvePoints[4].set(t.x, t.y + CARD_HEIGHT / 2 + CARD_GAP, t.z);
    }
    lineGeometry.current?.setPoints(curvePoints);
  });

  const pointerToWorld = (clientX: number, clientY: number, out: THREE.Vector3) => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.current.setFromCamera(ndc, camera);
    raycaster.current.ray.intersectPlane(dragPlane.current, out);
    return out;
  };

  useEffect(() => {
    if (!dragging) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!card.current) return;
      const point = pointerToWorld(e.clientX, e.clientY, new THREE.Vector3());
      const now = performance.now();
      const dt = (now - lastPointerTime.current) / 1000;
      if (dt > 0) {
        pendingVelocity.current
          .copy(point)
          .sub(lastPointerWorld.current)
          .divideScalar(Math.max(dt, 1 / 120));
      }
      lastPointerWorld.current.copy(point);
      lastPointerTime.current = now;
      card.current.setNextKinematicTranslation(point);
    };

    const onPointerUp = () => setDragging(false);

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  // Al soltar, el body ya volvió a "dynamic" (el prop `type` se sincronizó
  // en el commit anterior) — ahora sí podemos inyectarle velocidad.
  useEffect(() => {
    if (dragging || !card.current) return;
    card.current.setLinvel(
      {
        x: pendingVelocity.current.x * 0.4,
        y: pendingVelocity.current.y * 0.4,
        z: pendingVelocity.current.z * 0.4,
      },
      true,
    );
    pendingVelocity.current.set(0, 0, 0);
  }, [dragging]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!card.current) return;
    card.current.wakeUp();

    const t = card.current.translation();
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    dragPlane.current.setFromNormalAndCoplanarPoint(camDir, new THREE.Vector3(t.x, t.y, t.z));

    lastPointerWorld.current.set(t.x, t.y, t.z);
    lastPointerTime.current = performance.now();
    pendingVelocity.current.set(0, 0, 0);
    setDragging(true);
  };

  return (
    <>
      <RigidBody ref={fixed} type="fixed" position={[0, ANCHOR_Y, 0]}>
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody ref={j1} position={[0, ANCHOR_Y - SEGMENT_LENGTH, 0]} {...segmentProps}>
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody ref={j2} position={[0, ANCHOR_Y - SEGMENT_LENGTH * 2, 0]} {...segmentProps}>
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody ref={j3} position={[0, ANCHOR_Y - SEGMENT_LENGTH * 3, 0]} {...segmentProps}>
        <BallCollider args={[0.06]} />
      </RigidBody>
      <RigidBody
        ref={card}
        type={dragging ? 'kinematicPosition' : 'dynamic'}
        position={[0, ANCHOR_Y - SEGMENT_LENGTH * 3 - CARD_HEIGHT / 2 - CARD_GAP, 0]}
        angularDamping={2.5}
        linearDamping={1.4}
        restitution={0.35}
        canSleep={false}
      >
        <CuboidCollider args={[CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_DEPTH / 2]} />
        <group
          onPointerDown={handlePointerDown}
          onPointerOver={() => (document.body.style.cursor = 'grab')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <RoundedBox args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} radius={0.06} smoothness={4}>
            <meshPhysicalMaterial
              color="#141026"
              roughness={0.35}
              metalness={0.2}
              clearcoat={0.6}
              clearcoatRoughness={0.25}
            />
          </RoundedBox>

          <mesh position={[0, CARD_HEIGHT / 2 + 0.09, 0]}>
            <boxGeometry args={[0.22, 0.16, 0.05]} />
            <meshStandardMaterial color="#cdb8f7" metalness={0.6} roughness={0.3} />
          </mesh>

          <Html
            transform
            occlude="blending"
            position={[0, 0, CARD_DEPTH / 2 + 0.001]}
            distanceFactor={1.55}
            pointerEvents="none"
          >
            <CardFace />
          </Html>
        </group>
      </RigidBody>

      <mesh>
        <meshLineGeometry ref={lineGeometry} />
        <meshLineMaterial
          map={strapTexture ?? undefined}
          useMap={!!strapTexture}
          repeat={[4, 1]}
          lineWidth={0.14}
          color="#ffffff"
          transparent
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
