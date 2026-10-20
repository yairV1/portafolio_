# Credencial de acceso — Portafolio de Yair Vergara

Portafolio interactivo: una credencial 3D con física real y un recorrido por zonas.
React + Three.js (React Three Fiber + Rapier) + GSAP.

**En vivo:** https://yairv1.github.io/portafolio_/

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173/portafolio_/
npm run build    # genera /dist
```

## Publicación

Cada `push` a `main` compila y publica el sitio en GitHub Pages con el workflow
`.github/workflows/deploy.yml`. En el repositorio, **Settings → Pages → Source** debe estar en
**GitHub Actions**.

La app vive en la subruta `/portafolio_/` (ver `base` en `vite.config.js`). Para enlazar archivos
de `public/` desde el código usa `asset('archivo.ext')` de `src/lib/asset.js`, nunca rutas que
empiecen con `/`.

## Editar el contenido

**Todo el texto vive en `src/data/content.js`.** Regla: solo información real y verificable.

| Qué cambiar | Dónde |
|---|---|
| Nombre, rol, descripción, stack del hero | `identity` |
| Textos y fichas de "Sobre mí" | `perfil` |
| Áreas de trabajo | `capacidades` |
| Formación y experiencia | `trayectoria` |
| Proyectos (los 4 primeros salen en la home) | `expedientes` |
| Hobbies | `fueraDeHorario` |
| Email, ubicación, redes | `contacto` |

- **Foto:** `public/foto.webp` (vertical, unos 720×960 px).
- **Hoja de vida:** `public/cv/Hoja_de_Vida_Yair_Vergara.pdf`.
- **Colores:** tokens al inicio de `src/styles/app.css`.

## Estructura

```
src/
  data/content.js      ← contenido
  three/Lanyard.jsx    ← credencial con física (Rapier + meshline)
  three/Guide.jsx      ← escena 3D de "Perfil"
  three/Assistant.jsx  ← asistente YAIR // AI (usa public/models/yair-ai.glb si existe)
  sections/Zones.jsx   ← las 7 zonas
  pages/Archive.jsx    ← archivo de proyectos con buscador
  styles/app.css       ← sistema de diseño
```

## Notas

- El formulario de contacto abre el cliente de correo del visitante. Para recibir mensajes en un
  servidor, conéctalo a Formspree o EmailJS.
- La física de la credencial se desactiva si el sistema pide `prefers-reduced-motion`.
