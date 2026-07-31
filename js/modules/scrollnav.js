/**
 * Navegación lateral de puntos ("dot nav"). Se construye dinámicamente
 * a partir de cada <section data-nav-label="..."> del documento, así
 * que si agregas o quitas una sección, la nav se actualiza sola.
 * Solo se muestra en pantallas grandes (ver CSS); en móvil se sigue
 * usando el menú hamburguesa de la navbar.
 */
export function initScrollNav() {
  const sections = Array.from(document.querySelectorAll('section[id][data-nav-label]'));
  if (!sections.length) return;

  const nav = document.createElement('nav');
  nav.className = 'dot-nav';
  nav.setAttribute('aria-label', 'Progreso de la página');

  const dots = sections.map(section => {
    const label = section.dataset.navLabel || section.id;
    const button = document.createElement('button');
    button.className = 'dot';
    button.type = 'button';
    button.setAttribute('aria-label', 'Ir a ' + label);
    button.dataset.target = section.id;

    const tooltip = document.createElement('span');
    tooltip.className = 'dot-tooltip';
    tooltip.textContent = label;
    button.appendChild(tooltip);

    button.addEventListener('click', () => scrollToSection(section));
    nav.appendChild(button);
    return button;
  });

  document.body.appendChild(nav);

  function scrollToSection(section) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function setActive(id) {
    dots.forEach(d => d.classList.toggle('active', d.dataset.target === id));
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(sec => observer.observe(sec));
  } else {
    setActive(sections[0].id);
  }
}
