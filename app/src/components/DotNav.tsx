import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { navSections } from '../data/content';

/**
 * Nav de puntos vertical. El punto de la sección activa siempre muestra su
 * etiqueta (no solo en hover); el resto la muestra solo al pasar el mouse.
 * Solo hace scroll-spy sobre las secciones que ya existen en el DOM, así
 * que se puede montar antes de que todas las secciones estén construidas
 * (fases posteriores) sin romperse.
 */
export function DotNav() {
  const [activeId, setActiveId] = useState(navSections[0].id);

  useEffect(() => {
    const existingSections = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!existingSections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    existingSections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Progreso de la página"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {navSections.map((section) => {
        const isActive = section.id === activeId;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            aria-label={`Ir a ${section.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-3"
          >
            <motion.span
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 8 }}
              className="rounded-md border border-border bg-surface/80 px-2.5 py-1 text-xs font-medium text-text-muted opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
            >
              {section.label}
            </motion.span>
            <motion.span
              initial={false}
              animate={{
                scale: isActive ? 1.35 : 1,
                backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border-strong)',
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-2.5 w-2.5 rounded-full border-2"
            />
          </button>
        );
      })}
    </nav>
  );
}
