import * as THREE from 'three'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import qrcode from 'qrcode-generator'
import { identity } from '../data/content'

extend({ MeshLineGeometry, MeshLineMaterial })

/* Grosor real del carné: define el resto de coordenadas Z de la escena. */
const CARD_W = 1.62
const CARD_H = 2.28
const CARD_DEPTH = 0.085
const CARD_RADIUS = 0.07
const FACE_Z = CARD_DEPTH / 2 + 0.002
const HOLO_Z = FACE_Z + 0.004

// El carné cuelga cerca del ancla en [0, 4.2, 0] con segmentos de cuerda de 1 unidad: en reposo o
// en un arrastre normal nunca debería alejarse más de ~15 unidades. El solver de física (Rapier) puede,
// muy rara vez, devolver una lectura corrupta de un cuerpo por un instante; si eso no se filtra, ese
// valor absurdo queda "congelado" dentro del rastreador `lerped` (ver Band) durante muchísimos frames.
const MAX_TRACK = 40
function isSaneVec(v) {
  return (
    Number.isFinite(v.x) &&
    Number.isFinite(v.y) &&
    Number.isFinite(v.z) &&
    Math.abs(v.x) < MAX_TRACK &&
    Math.abs(v.y) < MAX_TRACK &&
    Math.abs(v.z) < MAX_TRACK
  )
}

/* ---------- textura de la cinta: "DEVELOPER" repetido ---------- */
function makeBandTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 128
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 128)
  grad.addColorStop(0, '#1b1733')
  grad.addColorStop(0.5, '#2b2352')
  grad.addColorStop(1, '#14112a')
  g.fillStyle = grad
  g.fillRect(0, 0, 1024, 128)
  g.strokeStyle = 'rgba(196,181,253,0.22)'
  g.lineWidth = 2
  g.strokeRect(1, 10, 1022, 108)
  g.font = '700 54px "JetBrains Mono", monospace'
  g.textBaseline = 'middle'
  g.textAlign = 'center'
  const word = 'DEVELOPER'
  for (let i = 0; i < 4; i++) {
    const x = 128 + i * 256
    g.fillStyle = i % 2 ? '#C4B5FD' : '#8B5CF6'
    g.fillText(word, x, 64)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/* ---------- patrón del sello holográfico: anillos + radios, generado en runtime ---------- */
function makeHoloTexture() {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const cx = size / 2
  const cy = size / 2

  g.fillStyle = '#9d9dae'
  g.fillRect(0, 0, size, size)

  for (let r = size * 0.48; r > 6; r -= 9) {
    g.beginPath()
    g.arc(cx, cy, r, 0, Math.PI * 2)
    g.strokeStyle = `rgba(255,255,255,${Math.round(r) % 18 < 9 ? 0.55 : 0.18})`
    g.lineWidth = 3
    g.stroke()
  }

  g.save()
  g.translate(cx, cy)
  const spokes = 28
  for (let i = 0; i < spokes; i++) {
    g.rotate((Math.PI * 2) / spokes)
    g.fillStyle = i % 2 ? 'rgba(255,255,255,0.4)' : 'rgba(10,8,20,0.3)'
    g.fillRect(0, -1.4, size * 0.47, 2.8)
  }
  g.restore()

  g.fillStyle = 'rgba(10,8,20,0.55)'
  g.beginPath()
  g.arc(cx, cy, size * 0.09, 0, Math.PI * 2)
  g.fill()

  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/* ---------- QR real (escaneable), sin imágenes externas ---------- */
function drawQR(g, x, y, size, value) {
  const qr = qrcode(0, 'M')
  qr.addData(value)
  qr.make()
  const count = qr.getModuleCount()
  const cell = size / count

  g.fillStyle = '#F2F0FA'
  g.beginPath()
  g.roundRect(x - 14, y - 14, size + 28, size + 28, 12)
  g.fill()

  g.fillStyle = '#0B0A14'
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        g.fillRect(x + col * cell, y + row * cell, cell + 0.75, cell + 0.75)
      }
    }
  }
}

/* ---------- textura de la cara del carné (foto real + datos + QR) ---------- */
function drawCardFace(img) {
  const W = 620
  const H = 880
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d', { willReadFrequently: true })

  const bg = g.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#191533')
  bg.addColorStop(0.55, '#100E1F')
  bg.addColorStop(1, '#1d1640')
  g.fillStyle = bg
  g.fillRect(0, 0, W, H)

  // banda superior
  g.fillStyle = 'rgba(139,92,246,0.18)'
  g.fillRect(0, 0, W, 96)
  g.strokeStyle = 'rgba(196,181,253,0.35)'
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(0, 96)
  g.lineTo(W, 96)
  g.stroke()

  g.fillStyle = '#C4B5FD'
  g.font = '500 22px "JetBrains Mono", monospace'
  g.textBaseline = 'middle'
  g.fillText('ACCESO · Z-01', 44, 50)
  g.textAlign = 'right'
  g.fillStyle = '#22D3EE'
  g.fillText('2026', W - 44, 50)
  g.textAlign = 'left'

  // ranura del clip
  g.fillStyle = 'rgba(0,0,0,0.55)'
  g.beginPath()
  g.roundRect(W / 2 - 62, 24, 124, 20, 10)
  g.fill()

  // foto real del usuario
  const px = 60
  const py = 140
  const pw = W - 120
  const ph = 430
  g.save()
  g.beginPath()
  g.roundRect(px, py, pw, ph, 22)
  g.clip()
  if (img) {
    const ar = img.width / img.height
    const target = pw / ph
    let sw = img.width
    let sh = img.height
    let sx = 0
    let sy = 0
    if (ar > target) {
      sw = img.height * target
      sx = (img.width - sw) / 2
    } else {
      sh = img.width / target
      sy = (img.height - sh) * 0.18
    }
    g.drawImage(img, sx, sy, sw, sh, px, py, pw, ph)
    const tint = g.createLinearGradient(0, py, 0, py + ph)
    tint.addColorStop(0, 'rgba(139,92,246,0.05)')
    tint.addColorStop(1, 'rgba(7,6,12,0.55)')
    g.fillStyle = tint
    g.fillRect(px, py, pw, ph)
  } else {
    const placeholderGrad = g.createRadialGradient(px + pw / 2, py + ph * 0.42, 10, px + pw / 2, py + ph * 0.5, pw * 0.8)
    placeholderGrad.addColorStop(0, '#2b2358')
    placeholderGrad.addColorStop(1, '#171229')
    g.fillStyle = placeholderGrad
    g.fillRect(px, py, pw, ph)

    const initials = `${identity.nombre?.[0] || ''}${(identity.apellido || '')[0] || ''}`.toUpperCase()
    g.fillStyle = 'rgba(196,181,253,0.85)'
    g.font = '700 130px "Clash Display", system-ui, sans-serif'
    g.textAlign = 'center'
    g.fillText(initials, px + pw / 2, py + ph * 0.5)
    g.textAlign = 'left'
  }
  g.restore()

  g.strokeStyle = 'rgba(255,255,255,0.14)'
  g.lineWidth = 2
  g.beginPath()
  g.roundRect(px, py, pw, ph, 22)
  g.stroke()

  // nombre + rol
  g.fillStyle = '#F2F0FA'
  g.font = '600 62px "Clash Display", system-ui, sans-serif'
  g.fillText(identity.nombre, 60, 640)

  g.fillStyle = '#8B5CF6'
  g.fillRect(60, 672, 74, 3)

  g.fillStyle = '#8A87A6'
  g.font = '500 25px "Satoshi", system-ui, sans-serif'
  g.fillText(identity.rol, 60, 712)

  // QR real: apunta al propio portafolio, escaneable desde el móvil
  const qrValue = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://github.com'
  drawQR(g, 60, 748, 96, qrValue)

  g.fillStyle = '#5D5A77'
  g.font = '400 17px "JetBrains Mono", monospace'
  g.fillText(identity.handle, 178, 796)
  g.fillStyle = '#5D5A77'
  g.font = '400 13px "JetBrains Mono", monospace'
  g.fillText('ESCANEA PARA VER EN VIVO', 178, 818)

  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function useCardTexture(src) {
  const [tex, setTex] = useState(null)
  useEffect(() => {
    let alive = true
    let created = null
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    Promise.all([fetch(src), fontsReady])
      .then(([res]) => {
        if (!res.ok) throw new Error('foto no encontrada')
        return res.blob()
      })
      .then((blob) => createImageBitmap(blob))
      .then((bitmap) => {
        if (!alive) return
        created = drawCardFace(bitmap)
        setTex(created)
      })
      .catch(async () => {
        await fontsReady
        if (!alive) return
        created = drawCardFace(null)
        setTex(created)
      })
    return () => {
      alive = false
      created?.dispose()
    }
  }, [src])
  return tex
}

/* ---------- el carné colgante ---------- */
function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef()
  const fixed = useRef()
  const j1 = useRef()
  const j2 = useRef()
  const j3 = useRef()
  const card = useRef()
  const holo = useRef()

  const vec = useMemo(() => new THREE.Vector3(), [])
  const ang = useMemo(() => new THREE.Vector3(), [])
  const rot = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const lastPointer = useMemo(() => new THREE.Vector2(), [])

  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 1.8, linearDamping: 1.8 }

  const { width, height } = useThree((s) => s.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)

  const bandTex = useMemo(() => makeBandTexture(), [])
  const holoTex = useMemo(() => makeHoloTexture(), [])
  const faceTex = useCardTexture(identity.foto)

  useEffect(() => () => bandTex.dispose(), [bandTex])
  useEffect(() => () => holoTex.dispose(), [holoTex])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 0, -0.05]])

  useEffect(() => {
    if (hovered) document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, dragged])

  // impulso inicial: el carné entra cayendo y se balancea solo
  useEffect(() => {
    const t = setTimeout(() => {
      card.current?.applyImpulse({ x: -1.2, y: 0, z: 0.55 }, true)
    }, 700)
    return () => clearTimeout(t)
  }, [])

  useFrame((state, delta) => {
    if (!fixed.current || !card.current) return

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    } else {
      // "viento" real: cada movimiento del mouse empuja físicamente el carné y la cinta responde en cadena.
      // El delta del puntero se acota por eje: un salto grande (p. ej. al entrar al canvas) se siente
      // como una ráfaga de viento, no como un golpe descontrolado.
      const px = state.pointer.x
      const py = state.pointer.y
      const mx = THREE.MathUtils.clamp(px - lastPointer.x, -0.05, 0.05)
      const my = THREE.MathUtils.clamp(py - lastPointer.y, -0.05, 0.05)
      const moveMag = Math.hypot(mx, my)
      if (moveMag > 0.0009) {
        vec.set(px, py, 0.5).unproject(state.camera)
        dir.copy(vec).sub(state.camera.position).normalize()
        vec.add(dir.multiplyScalar(state.camera.position.length()))
        const cardPos = card.current.translation()
        const dist = Math.hypot(vec.x - cardPos.x, vec.y - cardPos.y)
        const proximity = THREE.MathUtils.clamp(1 - dist / 3.4, 0, 1)
        const strength = moveMag * (0.5 + proximity * 2.2)
        card.current.wakeUp()
        card.current.applyImpulse({ x: mx * strength, y: my * strength, z: 0 }, true)
      }
      lastPointer.set(px, py)

      // velocidad terminal: una ráfaga de movimientos consecutivos no debe acumular momento sin límite,
      // o la cadena de joints puede volverse inestable
      const lv = card.current.linvel()
      const lvMag = Math.hypot(lv.x, lv.y, lv.z)
      if (lvMag > 6) {
        const s = 6 / lvMag
        card.current.setLinvel({ x: lv.x * s, y: lv.y * s, z: lv.z * s }, true)
      }
    }

    ;[j1, j2].forEach((ref) => {
      if (!ref.current) return
      const t = ref.current.translation()
      if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(t)
      // si el solver devuelve una lectura corrupta, se ignora ese frame en vez de contaminar
      // `lerped` con un valor absurdo del que tardaría muchísimos frames en recuperarse
      if (!isSaneVec(t)) return
      const clamped = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(t)))
      ref.current.lerped.lerp(t, delta * (minSpeed + clamped * (maxSpeed - minSpeed)))
    })

    if (!j1.current?.lerped || !j2.current?.lerped || !j3.current) return

    const j3t = j3.current.translation()
    const fixedT = fixed.current.translation()
    if (isSaneVec(j3t)) curve.points[0].copy(j3t)
    curve.points[1].copy(j2.current.lerped)
    curve.points[2].copy(j1.current.lerped)
    if (isSaneVec(fixedT)) curve.points[3].copy(fixedT)
    // el mismo resguardo sobre los puntos ya interpolados: la curva se queda con su última forma
    // válida en vez de mandar NaN/Infinity (por desborde de Float32) a la geometría
    const points = curve.getPoints(32)
    if (points.every(isSaneVec)) {
      band.current?.geometry.setPoints(points)
    }

    ang.copy(card.current.angvel())
    rot.copy(card.current.rotation())
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)

    // el sello holográfico gira levemente sobre sí mismo: el brillo cambia con el ángulo, no con un timer
    if (holo.current) holo.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.06
  })

  curve.curveType = 'chordal'

  return (
    <>
      <group position={[0, 4.2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, CARD_DEPTH / 2 + 0.01]} position={[0, -1.2, -0.05]} />
          <group
            scale={1}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target?.releasePointerCapture?.(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e) => {
              e.target?.setPointerCapture?.(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            {/* cuerpo del carné: geometría real con grosor y bordes redondeados, no un plano */}
            <RoundedBox args={[CARD_W, CARD_H, CARD_DEPTH]} radius={CARD_RADIUS} smoothness={6} castShadow receiveShadow>
              <meshPhysicalMaterial
                color="#0f0d1c"
                roughness={0.32}
                metalness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                iridescence={0.35}
                iridescenceIOR={1.3}
                iridescenceThicknessRange={[100, 300]}
                envMapIntensity={1.1}
              />
            </RoundedBox>

            {/* cara impresa: foto real, nombre, rol y QR */}
            <mesh position={[0, 0, FACE_Z]}>
              <planeGeometry args={[1.56, 2.21]} />
              <meshPhysicalMaterial
                key={faceTex ? 'photo' : 'placeholder'}
                map={faceTex || undefined}
                color={faceTex ? '#ffffff' : '#221c45'}
                roughness={0.55}
                metalness={0.05}
                clearcoat={0.35}
                clearcoatRoughness={0.45}
                envMapIntensity={0.5}
                transparent
              />
            </mesh>

            {/* sello holográfico: material iridiscente real, no una imagen */}
            <mesh ref={holo} position={[0.52, -0.88, HOLO_Z]}>
              <circleGeometry args={[0.16, 48]} />
              <meshPhysicalMaterial
                map={holoTex}
                roughnessMap={holoTex}
                color="#ffffff"
                metalness={0.9}
                roughness={0.3}
                clearcoat={1}
                clearcoatRoughness={0.08}
                iridescence={1}
                iridescenceIOR={1.35}
                iridescenceThicknessRange={[180, 550]}
                envMapIntensity={2.4}
                transparent
                opacity={0.94}
              />
            </mesh>

            {/* clip metálico */}
            <mesh position={[0, 1.2, 0]}>
              <torusGeometry args={[0.13, 0.028, 16, 48]} />
              <meshPhysicalMaterial
                color="#d8d5e8"
                roughness={0.1}
                metalness={1}
                clearcoat={1}
                clearcoatRoughness={0.04}
                envMapIntensity={1.8}
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#ffffff"
          depthTest={false}
          resolution={[width, height]}
          useMap={1}
          map={bandTex}
          repeat={[-4, 1]}
          lineWidth={0.72}
        />
      </mesh>
    </>
  )
}

export default function Lanyard() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="lanyard-stage">
      <Canvas
        camera={{ position: [0, 0, 13], fov: 25 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} castShadow />
        <pointLight position={[-4, -2, 3]} intensity={18} color="#8B5CF6" distance={16} />
        <pointLight position={[5, 1, 4]} intensity={12} color="#22D3EE" distance={16} />

        <Physics gravity={[0, -30, 0]} timeStep={1 / 60} paused={reduced}>
          <Band />
        </Physics>

        <ContactShadows position={[0, -2.6, 0]} opacity={0.5} scale={12} blur={2.8} far={6} resolution={512} color="#050308" />

        <Environment resolution={128}>
          <Lightformer intensity={2.4} color="#C4B5FD" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.15, 1]} />
          <Lightformer intensity={2.6} color="#8B5CF6" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.12, 1]} />
          <Lightformer intensity={2.6} color="#22D3EE" position={[1, 1, -1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.12, 1]} />
          <Lightformer intensity={3.5} color="#ffffff" position={[-8, 4, 12]} scale={[12, 12, 1]} />
        </Environment>
      </Canvas>
      <span className="drag-hint">Arrastra la credencial</span>
    </div>
  )
}
