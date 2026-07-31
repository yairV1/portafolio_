/**
 * Tilt 3D en las tarjetas de proyecto: la card rota en X/Y según
 * la posición del cursor dentro de ella. Se desactiva en touch y
 * si el usuario prefiere movimiento reducido.
 */
const MAX_TILT = 8; // grados máximos de rotación

export function initTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = !window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || isTouch) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width; // 0-1
      const py = (e.clientY - rect.top) / rect.height; // 0-1
      const rotateY = (px - 0.5) * MAX_TILT * 2;
      const rotateX = (0.5 - py) * MAX_TILT * 2;

      card.style.transition = 'transform 0.05s ease-out';
      card.style.transform =
        `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
      card.style.transform = '';
    });
  });
}
