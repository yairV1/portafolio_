import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { profile } from '../data/content';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import { useIntersecting } from '../hooks/useIntersecting';
import { useDocumentVisible } from '../hooks/useDocumentVisible';
import { Scene3D } from './Scene3D';
import { StaticCardFallback } from './StaticCardFallback';
import { DotNav } from './DotNav';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { GithubIcon } from './icons/GithubIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

const socialLinks = [
  { href: profile.github, label: 'GitHub', Icon: GithubIcon },
  { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
  { href: `mailto:${profile.email}`, label: 'Email', Icon: Mail },
  { href: profile.whatsapp, label: 'WhatsApp', Icon: WhatsAppIcon },
];

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function Hero() {
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
      id="inicio"
      data-nav-label="Inicio"
      className="relative flex min-h-svh w-full items-center overflow-hidden"
    >
      {/* Fondo: gradiente estático siempre presente detrás del canvas/fallback */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 75% 30%, rgba(168,85,247,0.16), transparent 60%), radial-gradient(ellipse 50% 40% at 15% 80%, rgba(124,58,237,0.12), transparent 55%)',
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-28 md:grid-cols-2 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          className="flex flex-col justify-center"
        >
          <p className="mb-2 text-lg text-text-muted">{profile.greeting}</p>
          <h1 className="mb-1 text-5xl font-extrabold tracking-tight text-text md:text-6xl">
            {profile.name.split(' ')[0]}
          </h1>
          <p className="mb-6 text-2xl font-semibold text-accent md:text-3xl">
            {profile.role}
          </p>
          <p className="mb-8 max-w-md text-base leading-relaxed text-text-muted">
            {profile.tagline}
          </p>

          <div className="mb-8 flex flex-wrap gap-4">
            <a
              href="#proyectos"
              className="rounded-xl bg-accent px-6 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.35)] transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:bg-accent-2"
            >
              Ver proyectos
            </a>
            <a
              href="#sobre-mi"
              className="rounded-xl border border-border-strong px-6 py-3 font-semibold text-text transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              Sobre mí
            </a>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </motion.div>

        <div className="relative min-h-[420px] md:min-h-[560px]">
          {use3D ? (
            <Scene3D active={sceneActive} />
          ) : (
            <StaticCardFallback />
          )}
        </div>
      </div>

      <DotNav />
    </section>
  );
}
