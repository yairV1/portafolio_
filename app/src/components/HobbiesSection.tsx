import { motion } from 'framer-motion';
import { hobbies } from '../data/content';
import { asset } from '../lib/asset';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function HobbiesSection() {
  return (
    <section
      id="hobbies"
      data-nav-label="Hobbies"
      className="mx-auto w-full max-w-7xl px-6 py-28 md:px-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          Fuera del código
        </p>
        <h2 className="text-4xl font-extrabold tracking-tight text-text md:text-5xl">Hobbies</h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {hobbies.map((hobby, index) => (
          <motion.div
            key={hobby.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: index * 0.1 }}
            className="group relative h-72 overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={asset(hobby.image)}
              alt={hobby.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-lg font-bold text-text">{hobby.title}</h3>
              <p className="text-sm text-text-muted">{hobby.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
