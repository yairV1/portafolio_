import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { identity } from '../data/content'

/* Barra superior: identidad + accesos directos. Transparente arriba, vidrio al hacer scroll. */
export default function TopBar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const home = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <div className="topbar-inner">
        <Link to="/" className="brand" aria-label={`${identity.nombre} ${identity.apellido} — inicio`} data-cursor>
          <span className="brand-mark" aria-hidden="true">
            YV
          </span>
          <span className="brand-name">
            {identity.nombre} {identity.apellido.split(' ')[0]}
          </span>
        </Link>

        <nav className="topbar-nav" aria-label="Principal">
          {home ? (
            <>
              <a href="#z05" data-cursor>
                Proyectos
              </a>
              <a href="#z07" data-cursor>
                Contacto
              </a>
            </>
          ) : (
            <Link to="/" data-cursor>
              Recepción
            </Link>
          )}
          <a className="topbar-cv" href={identity.cv} download data-cursor>
            Hoja de vida <span aria-hidden="true">↓</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
