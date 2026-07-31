/**
 * Catálogo automático de proyectos: trae los repos públicos desde la
 * API de GitHub (sin backend, sin token — endpoint público) y los
 * renderiza como cards. Se cachean en localStorage por 1 hora para
 * no gastar el rate limit de la API (60 req/hora sin autenticar) ni
 * hacer esperar al usuario en visitas repetidas.
 */
const USERNAME = 'yairV1';
const CACHE_KEY = `gh_repos_cache_${USERNAME}`;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

let repoCache = [];

/** Repos ya cargados en memoria (para que otros módulos, como el buscador, los reutilicen). */
export function getCachedRepos() {
  return repoCache;
}

export function initGithubRepos() {
  const grid = document.getElementById('repoGrid');
  const filterInput = document.getElementById('repoFilter');
  if (!grid) return;

  loadRepos()
    .then(repos => {
      repoCache = repos;
      renderRepos(grid, repos);
      if (filterInput) {
        filterInput.addEventListener('input', () => {
          const q = filterInput.value.trim().toLowerCase();
          const filtered = q ? repos.filter(r => matchesQuery(r, q)) : repos;
          renderRepos(grid, filtered);
        });
      }
    })
    .catch(err => {
      console.error('[github] No se pudieron cargar los repositorios:', err);
      grid.innerHTML = `
        <p class="repo-status repo-status-error">
          No se pudieron cargar los repositorios en este momento.
          <a href="https://github.com/${USERNAME}?tab=repositories" target="_blank" rel="noopener noreferrer">
            Ver directamente en GitHub →
          </a>
        </p>`;
    });
}

function matchesQuery(repo, q) {
  const haystack = `${repo.name} ${repo.description || ''} ${repo.language || ''}`.toLowerCase();
  return haystack.includes(q);
}

async function loadRepos() {
  const cached = readCache();
  if (cached) return cached;

  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );

  if (!res.ok) throw new Error(`GitHub API respondió ${res.status}`);

  const data = await res.json();
  const repos = data
    .filter(r => !r.fork)
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

  writeCache(repos);
  return repos;
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, repos } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return repos;
  } catch (e) {
    return null;
  }
}

function writeCache(repos) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), repos }));
  } catch (e) {
    // localStorage puede fallar en modo privado o si está lleno; no es crítico.
  }
}

function renderRepos(grid, repos) {
  if (!repos.length) {
    grid.innerHTML = `<p class="repo-status">No encontré repositorios con ese filtro.</p>`;
    return;
  }

  grid.innerHTML = repos.map(repo => `
    <article class="repo-card">
      <div class="repo-card-header">
        <h3>${escapeHtml(prettyName(repo.name))}</h3>
        ${repo.stargazers_count > 0
          ? `<span class="repo-stars"><i class="bi bi-star-fill" aria-hidden="true"></i> ${repo.stargazers_count}</span>`
          : ''}
      </div>
      <p class="repo-description">${escapeHtml(repo.description || 'Sin descripción todavía.')}</p>
      <div class="repo-meta">
        ${repo.language ? `<span class="tech-tag">${escapeHtml(repo.language)}</span>` : ''}
        <span class="repo-updated">Actualizado ${relativeDate(repo.pushed_at)}</span>
      </div>
      <div class="project-links">
        ${repo.homepage
          ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Demo</a>`
          : ''}
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Código</a>
      </div>
    </article>
  `).join('');
}

/** Convierte "mi-gym-landing" en "Mi Gym Landing" para mostrar. */
function prettyName(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function relativeDate(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
