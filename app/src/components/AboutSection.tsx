import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { profile, aboutStats } from '../data/content';
import { asset } from '../lib/asset';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import { useIntersecting } from '../hooks/useIntersecting';
import { useDocumentVisible } from '../hooks/useDocumentVisible';
import { AvatarScene } from './AvatarScene';
import { AvatarStaticFallback } from './AvatarStaticFallback';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useIntersecting(sectionRef, 0.1);
  const tabVisible = useDocumentVisible();
  const reducedMotion = usePrefersReducedMotion();
  const hasWebGL = useWebGLSupport();

  const use3D = hasWebGL && !reducedMotion;
  const sceneActive = inView && tabVisible;

  return (
    <section
      ref={sectionRef}
      id="sobre-mi"
      data-nav-label="Sobre mí"
      className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 py-28 md:px-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 45% 40% at 85% 20%, rgba(124,58,237,0.14), transparent 60%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
            Sobre mí
          </p>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-text md:text-5xl">
            Conoce más sobre mí
          </h2>
          <div className="mb-8 space-y-4 text-base leading-relaxed text-text-muted">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <a
            href={asset(profile.cv)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.35)] transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-2"
          >
            <Download className="h-4 w-4" />
            Descargar CV
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.1 }}
        >
          <div className="relative min-h-[280px]">
            {use3D ? <AvatarScene active={sceneActive} /> : <AvatarStaticFallback />}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {aboutStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface/60 p-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-extrabold text-accent">{stat.value}</div>
                <div className="mt-1 text-xs text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
