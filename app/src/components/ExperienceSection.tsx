import { motion } from 'framer-motion';
import { experience } from '../data/content';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function ExperienceSection() {
  return (
    <section
      id="experiencia"
      data-nav-label="Experiencia"
      className="mx-auto w-full max-w-4xl px-6 py-28 md:px-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="mb-14 text-center"
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          Experiencia
        </p>
        <h2 className="text-4xl font-extrabold tracking-tight text-text md:text-5xl">
          Mi trayectoria única
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-text-muted">
          Distintas etapas que forman mi perspectiva como desarrollador.
        </p>
      </motion.div>

      <div className="relative border-l border-border pl-8">
        {experience.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: index * 0.1 }}
            className="relative mb-10 last:mb-0"
          >
            <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />
            <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur">
              <h3 className="text-lg font-bold text-text">{item.title}</h3>
              <p className="mb-3 text-sm font-medium text-accent">{item.period}</p>
              <p className="mb-4 text-sm leading-relaxed text-text-muted">{item.description}</p>
              <div className="rounded-xl border border-accent-border bg-accent-soft px-4 py-3 text-sm text-text-muted">
                <strong className="text-text">{item.learningLabel}</strong> {item.learning}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
