/**
 * Buscador tipo "command palette" (Ctrl/Cmd+K). No usa un LLM: es
 * búsqueda local por palabras clave sobre secciones, proyectos
 * destacados (ya en el DOM) y repositorios de GitHub (si ya cargaron).
 * Da la sensación de un asistente inteligente sin backend, sin costo
 * por request y sin exponer ninguna API key en el navegador.
 */
import { getCachedRepos } from './github.js';

const MAX_RESULTS = 8;

export function initPalette() {
  const trigger = document.getElementById('paletteTrigger');
  const palette = document.getElementById('commandPalette');
  const backdrop = palette ? palette.querySelector('.command-palette-backdrop') : null;
  const input = document.getElementById('paletteInput');
  const resultsEl = document.getElementById('paletteResults');
  const emptyEl = document.getElementById('paletteEmpty');

  if (!trigger || !palette || !input || !resultsEl || !emptyEl) return;

  let selectedIndex = 0;
  let currentResults = [];

  trigger.addEventListener('click', open);
  backdrop?.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    const isShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
    if (isShortcut) {
      e.preventDefault();
      palette.hidden ? open() : close();
    } else if (e.key === 'Escape' && !palette.hidden) {
      close();
    }
  });

  input.addEventListener('input', () => renderResults(input.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSelection(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSelection(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = currentResults[selectedIndex];
      if (item) activate(item);
    }
  });

  function open() {
    palette.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    renderResults('');
    input.focus();
  }

  function close() {
    palette.hidden = true;
    document.body.style.overflow = '';
    trigger.focus();
  }

  function moveSelection(delta) {
    if (!currentResults.length) return;
    selectedIndex = (selectedIndex + delta + currentResults.length) % currentResults.length;
    highlightSelection();
  }

  function highlightSelection() {
    [...resultsEl.children].forEach((li, i) => {
      li.classList.toggle('active', i === selectedIndex);
    });
  }

  function renderResults(query) {
    const dataset = buildDataset();
    const q = query.trim().toLowerCase();
    currentResults = q ? rank(dataset, q).slice(0, MAX_RESULTS) : dataset.slice(0, MAX_RESULTS);
    selectedIndex = 0;

    resultsEl.innerHTML = '';
    emptyEl.hidden = currentResults.length > 0;

    currentResults.forEach((item, i) => {
      const li = document.createElement('li');
      li.className = 'command-palette-item' + (i === 0 ? ' active' : '');
      li.setAttribute('role', 'option');
      li.innerHTML = `
        <i class="bi ${iconFor(item.type)}" aria-hidden="true"></i>
        <div class="command-palette-item-text">
          <span class="cp-title">${item.title}</span>
          ${item.subtitle ? `<span class="cp-subtitle">${item.subtitle}</span>` : ''}
        </div>
        <span class="cp-type">${item.type}</span>
      `;
      li.addEventListener('click', () => activate(item));
      resultsEl.appendChild(li);
    });
  }

  function activate(item) {
    close();
    item.action();
  }

  function iconFor(type) {
    if (type === 'sección') return 'bi-signpost-split';
    if (type === 'repositorio') return 'bi-github';
    return 'bi-code-slash';
  }

  /** Construye el índice de búsqueda en el momento (siempre fresco). */
  function buildDataset() {
    const items = [];

    document.querySelectorAll('section[id][data-nav-label]').forEach(sec => {
      const label = sec.dataset.navLabel;
      items.push({
        type: 'sección',
        title: label,
        subtitle: 'Ir a esta sección',
        keywords: label.toLowerCase(),
        action: () => scrollToSection(sec),
      });
    });

    document.querySelectorAll('.project-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent.trim() || '';
      const desc = card.querySelector('.project-description')?.textContent.trim() || '';
      const tags = [...card.querySelectorAll('.tech-tag')].map(t => t.textContent.trim());
      const demoLink = card.querySelector('.project-links a')?.getAttribute('href');
      items.push({
        type: 'proyecto',
        title,
        subtitle: tags.join(' · '),
        keywords: `${title} ${desc} ${tags.join(' ')}`.toLowerCase(),
        action: () => demoLink
          ? window.open(demoLink, '_blank', 'noopener')
          : scrollToSection(document.getElementById('proyectos')),
      });
    });

    getCachedRepos().forEach(repo => {
      items.push({
        type: 'repositorio',
        title: repo.name,
        subtitle: repo.language || 'GitHub',
        keywords: `${repo.name} ${repo.description || ''} ${repo.language || ''}`.toLowerCase(),
        action: () => window.open(repo.html_url, '_blank', 'noopener'),
      });
    });

    return items;
  }

  function rank(items, q) {
    return items
      .map(item => {
        const titleMatch = item.title.toLowerCase().includes(q);
        const kwMatch = item.keywords.includes(q);
        if (!titleMatch && !kwMatch) return null;
        const score = (titleMatch ? 3 : 0) + (kwMatch ? 1 : 0);
        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .map(r => r.item);
  }

  function scrollToSection(section) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
}
