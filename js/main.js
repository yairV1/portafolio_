/* ═══════════════════════════════════════════════════
   YAIR VERGARA — Portfolio
   Punto de entrada: arranca cada módulo de forma aislada
   para que un fallo en uno no tumbe a los demás.
   ═══════════════════════════════════════════════════ */

import { initNavbar } from './modules/navbar.js';
import { initCursor } from './modules/cursor.js';
import { initReveal } from './modules/reveal.js';
import { initTabs } from './modules/tabs.js';
import { initCarnet } from './modules/carnet.js';
import { initHero3D } from './modules/hero3d.js';
import { initMagneticButtons } from './modules/magnetic.js';
import { initTilt } from './modules/tilt.js';

const modules = [
  ['navbar', initNavbar],
  ['cursor', initCursor],
  ['reveal', initReveal],
  ['tabs', initTabs],
  ['carnet', initCarnet],
  ['hero3d', initHero3D],
  ['magnetic', initMagneticButtons],
  ['tilt', initTilt],
];

modules.forEach(([name, init]) => {
  try {
    init();
  } catch (err) {
    console.error(`[portafolio] Falló el módulo "${name}":`, err);
  }
});
