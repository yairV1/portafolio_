/* Rutas a /public que funcionan igual en local (/) y en GitHub Pages (/portafolio_/). */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
