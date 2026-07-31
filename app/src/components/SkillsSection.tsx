import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Palette,
  Zap,
  PenTool,
  Workflow,
  FileCode2,
  Database,
  GitBranch,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { skillCategories } from '../data/content';

const skillIcons: Record<string, LucideIcon> = {
  HTML: Code2,
  CSS: Palette,
  JavaScript: Zap,
  Figma: PenTool,
  n8n: Workflow,
  PHP: FileCode2,
  MySQL: Database,
  'Git & GitHub': GitBranch,
  Laravel: Layers,
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export function SkillsSection() {
  const [activeTab, setActiveTab] = useState(skillCategories[0].id);
  const activeCategory = skillCategories.find((c) => c.id === activeTab) ?? skillCategories[0];

  return (
    <section
      id="skills"
      data-nav-label="Skills"
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
          Mis skills
        </p>
        <h2 className="text-4xl font-extrabold tracking-tight text-text md:text-5xl">
          Tecnologías que uso y domino
        </h2>
      </motion.div>

      <div className="mb-10 flex justify-center gap-3">
        {skillCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveTab(category.id)}
            aria-pressed={activeTab === category.id}
            className={`rounded-xl border px-6 py-2.5 font-semibold transition-colors duration-300 ${
              activeTab === category.id
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-text-muted hover:border-border-strong hover:text-text'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {activeCategory.items.map((skill, index) => {
          const Icon = skillIcons[skill.name] ?? Code2;
          return (
            <motion.div
              key={`${activeCategory.id}-${skill.name}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: index * 0.06 }}
              className="rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-border bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <h3 className="font-semibold text-text">{skill.name}</h3>
                  <span className="text-sm font-medium text-accent">{skill.percent}%</span>
                </div>
              </div>
              <p className="mb-4 text-sm text-text-muted">{skill.description}</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percent}%` }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-accent-2 to-accent"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
