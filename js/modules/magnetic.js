/**
 * Efecto "magnético" en botones: al acercar el cursor, el botón
 * se desplaza levemente hacia él. Se desactiva en touch y si el
 * usuario prefiere movimiento reducido.
 */
const RADIUS = 70; // px de radio de influencia alrededor del botón
const STRENGTH = 0.35; // qué tan lejos se desplaza el botón (0-1)

export function initMagneticButtons() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = !window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || isTouch) return;

  const buttons = document.querySelectorAll('.btn');
  if (!buttons.length) return;

  let rafId = null;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(updateButtons);
  });

  function updateButtons() {
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const pull = (1 - dist / RADIUS) * STRENGTH;
        btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      } else if (btn.style.transform) {
        btn.style.transform = '';
      }
    });
    rafId = null;
  }
}
