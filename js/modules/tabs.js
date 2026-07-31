/**
 * Tabs de la sección de habilidades: alterna paneles Frontend/Backend
 * y reanima las barras de progreso cada vez que un panel se muestra.
 */
export function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) {
        panel.classList.add('active');
        animateBarsIn(panel);
      }
    });
  });

  /** Reinicia y reproduce la animación CSS de las barras de un panel. */
  function animateBarsIn(container) {
    container.querySelectorAll('.skill-fill').forEach(bar => {
      bar.classList.remove('animated');
      void bar.offsetWidth; // fuerza reflow para reiniciar la animación CSS
      bar.classList.add('animated');
    });
  }

  // Heredar --ic al .skill-card desde el hijo, para que el ::before
  // del card tome el color de acento correcto.
  document.querySelectorAll('.skill-card').forEach(card => {
    const wrap = card.querySelector('.skill-icon-wrap');
    if (wrap) {
      const ic = getComputedStyle(wrap).getPropertyValue('--ic').trim();
      if (ic) card.style.setProperty('--ic', ic);
    }
  });

  // Animar las barras del panel activo al entrar en pantalla.
  if ('IntersectionObserver' in window) {
    const skillsSection = document.getElementById('habilidades');
    if (skillsSection) {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          const activePanel = skillsSection.querySelector('.tab-panel.active');
          if (activePanel) animateBarsIn(activePanel);
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      obs.observe(skillsSection);
    }
  }
}
