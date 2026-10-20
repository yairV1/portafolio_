import * as THREE from 'three'
import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Environment, Lightformer } from '@react-three/drei'

/* Si el GLB existe pero viene corrupto, mal formado o con un nodo inesperado, esto evita que el
   error tumbe todo el árbol de React — cae al placeholder en vez de romper el sitio entero. */
class ModelErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('YAIR // AI: no se pudo cargar el modelo GLB, usando placeholder.', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/* ============================================================================================
   YAIR // AI — arquitectura del asistente 3D
   ============================================================================================
   Este archivo NO contiene el modelo final. Sirve un busto procedural (mismo lenguaje visual:
   blanco mate, visor negro, reactor morado, LEDs) mientras el archivo GLB no existe, y lo
   reemplaza automáticamente en cuanto aparezca en la ruta de abajo — no hay que tocar código.

   RUTA ESPERADA
     public/models/yair-ai.glb  →  servido en runtime como /models/yair-ai.glb

   ESCALA Y ORIENTACIÓN
     1 unidad three.js = 1 metro. Modelar a ~1 unidad de alto (busto/cabeza) para encajar con la
     cámara por defecto de este archivo. Si el modelo viene a otra escala, ajustar MODEL_SCALE.
     Eje +Y arriba. El personaje debe mirar hacia +Z (de frente a la cámara) en su pose de reposo.

   JERARQUÍA DE NODOS (nombres exactos, sensibles a mayúsculas — se buscan por nombre en la escena)
     Head        hueso o empty — se rota para seguir el cursor. Debe poder rotar de forma
                 independiente del resto del cuerpo (no lo parentes rígido al torso).
     Visor       mesh — la franja/visor negro. Si tiene un morph target llamado "Blink"
                 (0 = abierto, 1 = cerrado) se usa para el parpadeo; si no existe, se simula
                 escalando el visor en Y como sustituto.
     Reactor     mesh — el reactor del pecho. Su material debe tener canal `emissive` (morado).
                 Se le anima escala (respiración) e intensidad emissive (pulso) por código —
                 no necesita animación propia.
     LED_*       cualquier mesh cuyo nombre empiece con "LED_" — se detecta automáticamente y
                 recibe el mismo pulso que el Reactor, con un pequeño desfase por índice.
     Logo        mesh opcional — el símbolo "</>" del pecho. Solo se referencia, no se anima.

   MATERIALES (sugeridos; el modelo debe traer la paleta ya aplicada, el código no la reescribe)
     Mat_Shell_White   blanco mate — carcasa
     Mat_Shell_Black   negro — acentos / visor
     Mat_Reactor       emissive morado — reactor y LED_*
     Paleta de referencia: blanco mate · negro · morado #8B5CF6 (base) / #C4B5FD (brillo)

   EXPORTACIÓN
     Formato glTF Binary (.glb). Exportar SIN compresión Draco (este loader no trae decoder
     configurado) — para un busto de este tamaño el .glb sin comprimir ya es liviano.

   ANIMATION CLIPS (opcionales — si no existen, se usan sustitutos procedurales)
     "Idle"   loop. Se reproduce en cuanto carga el modelo.
     "Wave"   one-shot. Se dispara cuando cambia `greetSignal`. Sin este clip, la cabeza hace un
              breve asentimiento como saludo alternativo.

   QUÉ ANIMA EL CÓDIGO POR SU CUENTA (no depende de que el artista lo anime)
     - Respiración: escala + intensidad emissive de `Reactor`, seno continuo.
     - Parpadeo: morph target "Blink" en `Visor" (o su sustituto), en intervalos irregulares.
     - Mirada: `Head` rota hacia el cursor, con inercia (nunca instantáneo).
     - Idle bob: si no hay clip "Idle", se aplica una flotación sutil al grupo raíz.
   ============================================================================================ */

const MODEL_URL = `${import.meta.env.BASE_URL}models/yair-ai.glb`
const MODEL_SCALE = 1

/* ---------- ¿existe ya el GLB? (HEAD request, sin lanzar 404 al visitante) ---------- */
function useAssetExists(url) {
  const [exists, setExists] = useState(false)
  useEffect(() => {
    let alive = true
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (!alive) return
        // en dev, un servidor SPA puede responder 200 con el index.html de fallback para
        // cualquier ruta que no exista — un content-type que no sea HTML confirma que es
        // realmente el binario del GLB
        const type = res.headers.get('content-type') || ''
        setExists(res.ok && !type.includes('text/html'))
      })
      .catch(() => alive && setExists(false))
    return () => {
      alive = false
    }
  }, [url])
  return exists
}

/* ---------- textura del símbolo "</>" para el pecho (placeholder y decal genérico) ---------- */
function useLogoTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 128
    const g = c.getContext('2d')
    g.fillStyle = 'rgba(196,181,253,0.95)'
    g.font = '700 46px "JetBrains Mono", monospace'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText('</>', 64, 68)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
}

/* ---------- respiración + pulso: aplica a cualquier mesh "reactor" y a los LED_* ---------- */
function useBreathing(reactorRef, ledRefs) {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pulse = 1 + Math.sin(t * 1.2) * 0.06
    if (reactorRef.current) {
      reactorRef.current.scale.setScalar(pulse)
      const mat = reactorRef.current.material
      if (mat) mat.emissiveIntensity = 1.6 + Math.sin(t * 1.2) * 0.5
    }
    ledRefs.current.forEach((led, i) => {
      if (!led?.material) return
      led.material.emissiveIntensity = 1.2 + Math.sin(t * 1.2 + i * 0.8) * 0.6
    })
  })
}

/* ---------- parpadeo con ritmo irregular: devuelve un ref [0..1], 1 = ojos abiertos ---------- */
function useBlinkSignal() {
  const blink = useRef(1)
  useEffect(() => {
    let id
    const schedule = () => {
      id = setTimeout(() => {
        blink.current = 0.05
        setTimeout(() => {
          blink.current = 1
        }, 110)
        schedule()
      }, 2200 + Math.random() * 3400)
    }
    schedule()
    return () => clearTimeout(id)
  }, [])
  return blink
}

/* ---------- saludo procedural (asentimiento de cabeza): usado si no hay clip "Wave" ---------- */
function useProceduralGreet(greetSignal, headRef) {
  const impulse = useRef(0)
  const lastSignal = useRef(greetSignal)
  useEffect(() => {
    if (greetSignal !== lastSignal.current) {
      lastSignal.current = greetSignal
      impulse.current = 1
    }
  }, [greetSignal])
  useFrame((state, delta) => {
    if (impulse.current <= 0.001) return
    impulse.current = Math.max(0, impulse.current - delta * 1.6)
    if (headRef.current) {
      headRef.current.rotation.x += Math.sin(impulse.current * Math.PI) * 0.22 * delta * 6
    }
  })
}

/* ---------- mirada: la cabeza sigue el cursor con inercia, rango acotado ---------- */
function useLookAt(headRef, restRotation) {
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, delta) => {
    if (!headRef.current) return
    target.set(state.pointer.x * 0.5, state.pointer.y * 0.32 + 0.05, 1.4)
    const desiredY = Math.atan2(target.x, target.z)
    const desiredX = -Math.atan2(target.y, target.z)
    headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, desiredY, 4.5, delta)
    headRef.current.rotation.x = THREE.MathUtils.damp(
      headRef.current.rotation.x,
      restRotation + desiredX * 0.6,
      4.5,
      delta
    )
  })
}

/* ================= modelo real: se monta solo cuando el GLB ya existe ================= */
function AssistantModel({ greetSignal }) {
  const group = useRef()
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions, mixer } = useAnimations(animations, group)

  const nodes = useMemo(() => {
    const head = scene.getObjectByName('Head') || null
    const visor = scene.getObjectByName('Visor') || null
    const reactor = scene.getObjectByName('Reactor') || null
    const leds = []
    scene.traverse((o) => {
      if (o.isMesh && o.name.startsWith('LED_')) leds.push(o)
    })
    return { head, visor, reactor, leds }
  }, [scene])

  const reactorRef = useRef(null)
  const ledRefs = useRef([])
  reactorRef.current = nodes.reactor
  ledRefs.current = nodes.leds

  const blink = useBlinkSignal()
  const restRotation = nodes.head?.rotation.x ?? 0

  useBreathing(reactorRef, ledRefs)
  useLookAt(nodes.head ? { current: nodes.head } : { current: null }, restRotation)

  const blinkMorphIndex =
    nodes.visor?.morphTargetDictionary && 'Blink' in nodes.visor.morphTargetDictionary
      ? nodes.visor.morphTargetDictionary.Blink
      : null

  useFrame((state, delta) => {
    if (!nodes.visor) return
    if (blinkMorphIndex !== null && nodes.visor.morphTargetInfluences) {
      const target = 1 - blink.current
      nodes.visor.morphTargetInfluences[blinkMorphIndex] = THREE.MathUtils.damp(
        nodes.visor.morphTargetInfluences[blinkMorphIndex] || 0,
        target,
        22,
        delta
      )
    } else {
      nodes.visor.scale.y = THREE.MathUtils.damp(nodes.visor.scale.y, blink.current, 22, delta)
    }
  })

  // "Idle" en loop si el clip existe
  useEffect(() => {
    const idle = actions?.Idle
    if (!idle) return
    idle.reset().fadeIn(0.4).play()
    return () => idle.fadeOut(0.3)
  }, [actions])

  // "Wave" one-shot al saludar; sin clip, cae al asentimiento procedural
  const hasWaveClip = Boolean(actions?.Wave)
  const lastGreet = useRef(greetSignal)
  useEffect(() => {
    if (!hasWaveClip || greetSignal === lastGreet.current) return
    lastGreet.current = greetSignal
    const wave = actions.Wave
    wave.reset()
    wave.setLoop(THREE.LoopOnce)
    wave.clampWhenFinished = true
    wave.fadeIn(0.15).play()
    const onFinished = () => {
      wave.fadeOut(0.25)
      actions?.Idle?.reset().fadeIn(0.25).play()
    }
    mixer.addEventListener('finished', onFinished)
    return () => mixer.removeEventListener('finished', onFinished)
  }, [greetSignal, hasWaveClip, actions, mixer])

  useProceduralGreet(hasWaveClip ? -1 : greetSignal, nodes.head ? { current: nodes.head } : { current: null })

  // idle bob procedural si el modelo no trae su propio clip "Idle"
  useFrame((state) => {
    if (actions?.Idle || !group.current) return
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.03
  })

  return <primitive ref={group} object={scene} scale={MODEL_SCALE} />
}

/* ================= placeholder: mismo lenguaje visual, geometría simple ================= */
function AssistantPlaceholder({ greetSignal }) {
  const root = useRef()
  const head = useRef()
  const visor = useRef()
  const reactor = useRef()
  const led1 = useRef()
  const led2 = useRef()
  const logoTex = useLogoTexture()

  const ledRefs = useRef([])
  ledRefs.current = [led1.current, led2.current]

  const blink = useBlinkSignal()
  useBreathing(reactor, { current: [led1.current, led2.current].filter(Boolean) })
  useLookAt(head, 0)
  useProceduralGreet(greetSignal, head)

  useFrame((state, delta) => {
    if (visor.current) {
      visor.current.scale.y = THREE.MathUtils.damp(visor.current.scale.y, blink.current, 22, delta)
    }
    if (root.current) {
      root.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.03
    }
  })

  return (
    <group ref={root}>
      {/* torso: base redondeada */}
      <mesh position={[0, -0.62, 0]}>
        <capsuleGeometry args={[0.34, 0.28, 6, 20]} />
        <meshStandardMaterial color="#EDEDF4" roughness={0.75} metalness={0.04} />
      </mesh>

      {/* reactor en el pecho */}
      <mesh ref={reactor} position={[0, -0.42, 0.33]}>
        <circleGeometry args={[0.075, 32]} />
        <meshStandardMaterial color="#C4B5FD" emissive="#8B5CF6" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>

      {/* símbolo </> */}
      <mesh position={[0, -0.66, 0.335]}>
        <planeGeometry args={[0.16, 0.16]} />
        <meshBasicMaterial map={logoTex} transparent toneMapped={false} />
      </mesh>

      {/* cabeza */}
      <group ref={head} position={[0, 0.05, 0]}>
        <mesh>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshStandardMaterial color="#F2F0FA" roughness={0.7} metalness={0.05} />
        </mesh>

        {/* visor */}
        <mesh ref={visor} position={[0, 0.02, 0.3]}>
          <boxGeometry args={[0.44, 0.13, 0.06]} />
          <meshStandardMaterial color="#0B0A14" roughness={0.25} metalness={0.4} />
        </mesh>

        {/* LEDs en las sienes */}
        <mesh ref={led1} position={[-0.34, 0.02, 0.08]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#C4B5FD" emissive="#8B5CF6" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
        <mesh ref={led2} position={[0.34, 0.02, 0.08]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#C4B5FD" emissive="#8B5CF6" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/* ================= punto de entrada ================= */
export default function Assistant({ greetSignal = 0 }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const modelExists = useAssetExists(MODEL_URL)

  return (
    <Canvas
      camera={{ position: [0, 0, 1.9], fov: 30 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[1.2, 1.4, 1.6]} intensity={9} color="#C4B5FD" distance={8} />
      <pointLight position={[-1.4, -0.6, 1.2]} intensity={6} color="#8B5CF6" distance={8} />

      {modelExists ? (
        <ModelErrorBoundary fallback={<AssistantPlaceholder greetSignal={greetSignal} />}>
          <Suspense fallback={<AssistantPlaceholder greetSignal={greetSignal} />}>
            <AssistantModel greetSignal={greetSignal} />
          </Suspense>
        </ModelErrorBoundary>
      ) : (
        <AssistantPlaceholder greetSignal={greetSignal} />
      )}

      <Environment resolution={64}>
        <Lightformer intensity={2} color="#8B5CF6" position={[-1, 1, 2]} scale={[4, 4, 1]} />
        <Lightformer intensity={1.5} color="#ffffff" position={[2, 0, 1]} scale={[3, 3, 1]} />
      </Environment>
    </Canvas>
  )
}
