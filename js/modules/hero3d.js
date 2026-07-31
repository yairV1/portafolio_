/**
 * Fondo 3D del hero: un campo de partículas conectadas (estilo
 * constelación) que reacciona sutilmente al movimiento del mouse.
 *
 * Decisiones de performance / accesibilidad:
 * - Three.js se importa dinámicamente y solo cuando el hero entra
 *   en el viewport (IntersectionObserver), nunca de entrada.
 * - El loop de animación se pausa cuando el hero sale del viewport
 *   o cuando la pestaña no está visible (visibilitychange).
 * - Si el usuario prefiere movimiento reducido, o si WebGL no está
 *   disponible, se usa el fondo estático `.hero-static` en su lugar.
 * - Las conexiones entre partículas se calculan una sola vez al
 *   iniciar (no en cada frame) para mantener el costo bajo.
 */

const THREE_CDN_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export function initHero3D() {
  const container = document.querySelector('.hero-3d-bg');
  const heroSection = document.getElementById('inicio');
  if (!container || !heroSection) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsWebGL = checkWebGLSupport();

  if (prefersReducedMotion || !supportsWebGL) {
    container.classList.add('hero-static');
    return;
  }

  let started = false;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        bootstrapScene(container).catch((err) => {
          // Si algo falla en runtime (contexto WebGL perdido, CDN
          // bloqueado, etc.), degradamos con gracia al fondo estático,
          // pero dejamos el error visible en consola para poder
          // diagnosticarlo en vez de fallar en silencio.
          console.error('[hero3d] No se pudo iniciar la escena 3D, usando fallback estático:', err);
          container.classList.add('hero-static');
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.1 });

  io.observe(heroSection);
}

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

async function bootstrapScene(container) {
  const THREE = await import(/* webpackIgnore: true */ THREE_CDN_URL);

  const heroSection = document.getElementById('inicio');
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || heroSection.clientHeight || window.innerHeight;

  if (width === 0 || height === 0) {
    throw new Error(`hero3d: contenedor con tamaño inválido (${width}x${height})`);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 260;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // ── Partículas ──
  const particleCount = Math.max(50, Math.min(130, Math.floor(width / 12)));
  const positions = new Float32Array(particleCount * 3);
  const spread = { x: 480, y: 300, z: 220 };

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread.x;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x79c0ff,
    size: 6,
    transparent: true,
    opacity: 1,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(particleGeometry, particleMaterial);

  // ── Líneas de conexión (calculadas una sola vez) ──
  const linkDistance = 110;
  const linePositions = [];
  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < linkDistance) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x58a6ff,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

  const group = new THREE.Group();
  group.add(points, lines);
  scene.add(group);

  // ── Interacción con el mouse (parallax sutil) ──
  let mouseNormX = 0, mouseNormY = 0;
  let targetRotX = 0, targetRotY = 0;

  function handleMouseMove(e) {
    mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNormY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = mouseNormX * 0.18;
    targetRotX = mouseNormY * 0.1;
  }
  window.addEventListener('mousemove', handleMouseMove);

  // ── Loop de animación (pausable) ──
  let rafId = null;
  let isRunning = false;
  let autoRotY = 0;
  const clock = new THREE.Clock();

  function animate() {
    if (!isRunning) return;
    const delta = clock.getDelta();
    autoRotY += delta * 0.02;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.03;
    group.rotation.y += (autoRotY + targetRotY - group.rotation.y) * 0.03;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  function play() {
    if (isRunning) return;
    isRunning = true;
    clock.start();
    animate();
  }

  function pause() {
    isRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  play();

  // Pausar cuando el hero sale del viewport.
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) play();
      else pause();
    });
  }, { threshold: 0 });
  visibilityObserver.observe(heroSection);

  // Pausar cuando la pestaña no está visible.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else if (isElementInViewport(heroSection)) play();
  });

  // Reajustar en resize (debounced).
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }, 150);
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}
