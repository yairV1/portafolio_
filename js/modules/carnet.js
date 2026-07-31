/**
 * Carné profesional 3D interactivo.
 * Soporta: hover pasivo, arrastre con mouse/touch, click para voltear
 * y giroscopio en móvil. Respeta prefers-reduced-motion (deshabilita
 * el hover pasivo y el rebote, mantiene el flip por click/tap).
 */
export function initCarnet() {
  const wrap = document.getElementById('card-wrap');
  const scene = document.getElementById('scene');
  const bc = document.getElementById('bc');
  const qr = document.getElementById('qr');

  if (!wrap || !scene) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Código de barras aleatorio decorativo.
  if (bc) {
    const widths = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      s.className = widths[Math.floor(Math.random() * widths.length)];
      bc.appendChild(s);
    }
  }

  // Patrón QR decorativo.
  if (qr) {
    const pat = [
      1, 1, 1, 0, 1, 1, 1,
      1, 0, 1, 0, 1, 0, 1,
      1, 0, 1, 1, 0, 1, 1,
      0, 1, 0, 1, 0, 1, 0,
      1, 1, 0, 0, 1, 0, 1,
      1, 0, 1, 0, 0, 1, 1,
      1, 1, 1, 0, 1, 0, 1
    ];
    pat.forEach(v => {
      const s = document.createElement('span');
      if (!v) s.classList.add('w');
      qr.appendChild(s);
    });
  }

  // Estado de rotación.
  let rotX = 0, rotY = 0;
  let targetX = 0, targetY = 0;
  let isFlipped = false;
  let isDragging = false;
  let startX = 0, startY = 0;
  let baseX = 0, baseY = 0;
  let gyroEnabled = false;

  /** Aplica la rotación (y el flip) actuales como transform CSS. */
  function applyTransform(tx, ty) {
    const flipDeg = isFlipped ? 180 : 0;
    wrap.style.transform = `rotateX(${tx}deg) rotateY(${ty + flipDeg}deg)`;
  }

  /** Bucle de suavizado hacia la rotación objetivo (hover pasivo). */
  function animLoop() {
    if (!prefersReducedMotion && !isDragging && !gyroEnabled) {
      rotX += (targetX - rotX) * 0.1;
      rotY += (targetY - rotY) * 0.1;
      applyTransform(rotX, rotY);
    }
    requestAnimationFrame(animLoop);
  }
  animLoop();

  if (!prefersReducedMotion) {
    scene.addEventListener('mousemove', e => {
      if (isDragging) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = -((e.clientY - cy) / 200) * 18;
      targetY = ((e.clientX - cx) / 200) * 22;
    });

    scene.addEventListener('mouseleave', () => {
      if (!isDragging) { targetX = 0; targetY = 0; }
    });
  }

  wrap.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    baseX = rotX; baseY = rotY;
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    rotX = Math.max(-50, Math.min(50, baseX - dy * 0.45));
    rotY = baseY + dx * 0.45;
    applyTransform(rotX, rotY);
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      targetX = rotX * 0.15;
      targetY = rotY * 0.15;
    }
  });

  wrap.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    baseX = rotX; baseY = rotY;
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    rotX = Math.max(-50, Math.min(50, baseX - dy * 0.45));
    rotY = baseY + dx * 0.45;
    applyTransform(rotX, rotY);
  }, { passive: true });

  document.addEventListener('touchend', () => {
    isDragging = false;
    targetX = rotX * 0.15;
    targetY = rotY * 0.15;
  });

  wrap.addEventListener('click', () => {
    if (Math.abs(rotX - baseX) < 3 && Math.abs(rotY - baseY) < 3) {
      isFlipped = !isFlipped;
      applyTransform(rotX, rotY);
      const hint = document.querySelector('.card-hint');
      if (hint) {
        hint.textContent = isFlipped
          ? '🖱 Arrastra · Click = ver frente'
          : '🖱 Arrastra · Click = voltear';
      }
    }
  });

  /** Activa el giroscopio en dispositivos móviles compatibles. */
  function activarGiroscopio() {
    if (gyroEnabled || prefersReducedMotion) return;
    gyroEnabled = true;
    window.addEventListener('deviceorientation', e => {
      if (isDragging) return;
      const beta = Math.max(-35, Math.min(35, e.beta || 0));
      const gamma = Math.max(-35, Math.min(35, e.gamma || 0));
      rotX = -beta * 0.6;
      rotY = gamma * 0.8;
      applyTransform(rotX, rotY);
    });
  }

  if (window.DeviceOrientationEvent && !prefersReducedMotion) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      scene.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(state => { if (state === 'granted') activarGiroscopio(); })
          .catch(() => {});
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', e => {
        if (e.alpha !== null) activarGiroscopio();
      }, { once: true });
    }
  }

  setTimeout(() => wrap.classList.remove('drop-in'), 1200);
}
