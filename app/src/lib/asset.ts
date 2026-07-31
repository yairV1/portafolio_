/**
 * Resuelve una ruta de `public/` respetando el `base` configurado en Vite
 * (necesario porque el sitio se despliega bajo /portafolio_/, no en la raíz
 * del dominio). Los literales de string en el código no pasan por la
 * reescritura automática de Vite, así que hay que prefijarlos a mano.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
