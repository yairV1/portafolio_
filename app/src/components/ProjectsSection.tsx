import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { featuredProjects, profile } from '../data/content';
import { GithubIcon } from './icons/GithubIcon';

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function ProjectsSection() {
  return (
    <section
      id="proyectos"
      data-nav-label="Proyectos"
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
          Proyectos destacados
        </p>
        <h2 className="text-4xl font-extrabold tracking-tight text-text md:text-5xl">
          Soluciones que resuelven problemas reales
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: easeOutExpo, delay: (index % 3) * 0.08 }}
            className="group flex flex-col rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur transition-colors duration-300 hover:border-accent-border"
          >
            <h3 className="mb-2 text-lg font-bold text-text">{project.title}</h3>
            <div className="mb-3 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border-strong px-2.5 py-0.5 text-xs font-medium text-text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-text-muted">
              {project.description}
            </p>
            <div className="flex items-center gap-4 border-t border-border pt-4 text-sm font-semibold">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-accent transition-colors hover:text-accent-2"
              >
                Ver proyecto <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-text-muted transition-colors hover:text-text"
              >
                Código <GithubIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className="mt-12 text-center"
      >
        <a
          href={`${profile.github}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-accent transition-colors hover:text-accent-2"
        >
          Ver todo en GitHub <ExternalLink className="h-4 w-4" />
        </a>
      </motion.p>
    </section>
  );
}
