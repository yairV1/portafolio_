/* ═══════════════════════════════════════════════════
   YAIR VERGARA — Portfolio JS
   Navbar · Cursor · Reveal · Tabs · 3D Card · Gyro
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. NAVBAR ─────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    allNavLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ─── 2. CURSOR PERSONALIZADO ───────────────────── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateCursor() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .skill-card, .project-card, #card-wrap').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ─── 3. SCROLL REVEAL ──────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

/* ─── TABS HABILIDADES ─── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    // Reanimar las barras del panel que acaba de aparecer
    animateBarsIn(document.getElementById('tab-' + btn.dataset.tab));
  });
});

/* ─── ANIMACIÓN DE BARRAS AL HACER SCROLL ─── */
function animateBarsIn(container) {
  container.querySelectorAll('.skill-fill').forEach(bar => {
    bar.classList.remove('animated');
    void bar.offsetWidth;           // fuerza reflow para reiniciar CSS
    bar.classList.add('animated');
  });
}

// Observer para activar al entrar en pantalla
if ('IntersectionObserver' in window) {
  const skillsSection = document.getElementById('habilidades');
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const activePanel = skillsSection.querySelector('.tab-panel.active');
      if (activePanel) animateBarsIn(activePanel);
      obs.disconnect();
    }
  }, { threshold: 0.2 });

  if (skillsSection) obs.observe(skillsSection);
}

/* ─── HEREDAR --ic al .skill-card desde el hijo ─── */
// Para que el ::before del card tome el color correcto
document.querySelectorAll('.skill-card').forEach(card => {
  const wrap = card.querySelector('.skill-icon-wrap');
  if (wrap) {
    const ic = getComputedStyle(wrap).getPropertyValue('--ic').trim();
    if (ic) card.style.setProperty('--ic', ic);
  }
});

  // Arrastre con mouse
  wrap.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    baseX = rotX; baseY = rotY;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    rotX = Math.max(-50, Math.min(50, baseX - (e.clientY - startY) * 0.45));
    rotY = baseY + (e.clientX - startX) * 0.45;
    applyTransform(rotX, rotY);
  });
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      targetX = rotX * 0.15;
      targetY = rotY * 0.15;
    }
  });

  // Arrastre táctil
  wrap.addEventListener('touchstart', e => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    baseX = rotX; baseY = rotY;
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    rotX = Math.max(-50, Math.min(50, baseX - (e.touches[0].clientY - startY) * 0.45));
    rotY = baseY + (e.touches[0].clientX - startX) * 0.45;
    applyTransform(rotX, rotY);
  }, { passive: true });
  document.addEventListener('touchend', () => {
    isDragging = false;
    targetX = rotX * 0.15;
    targetY = rotY * 0.15;
  });

  // Click para voltear
  wrap.addEventListener('click', () => {
    if (Math.abs(rotX - baseX) < 3 && Math.abs(rotY - baseY) < 3) {
      isFlipped = !isFlipped;
      applyTransform(rotX, rotY);
      const hint = document.querySelector('.card-hint');
      if (hint) hint.textContent = isFlipped
        ? '🖱 Arrastra · Click = ver frente · 📱 Inclina'
        : '🖱 Arrastra · Click = voltear · 📱 Inclina';
    }
  });

  // Giroscopio
  function activarGiroscopio() {
    if (gyroEnabled) return;
    gyroEnabled = true;
    window.addEventListener('deviceorientation', e => {
      if (isDragging) return;
      rotX = -Math.max(-35, Math.min(35, e.beta  || 0)) * 0.6;
      rotY =  Math.max(-35, Math.min(35, e.gamma || 0)) * 0.8;
      applyTransform(rotX, rotY);
    });
  }

  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(s => { if (s === 'granted') activarGiroscopio(); })
          .catch(() => {});
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', e => {
        if (e.alpha !== null) activarGiroscopio();
      }, { once: true });
    }
  }

  // Quitar animación de entrada
  setTimeout(() => wrap.classList.remove('drop-in'), 1200);

})();

