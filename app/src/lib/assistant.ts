import {
  profile,
  stack,
  featuredProjects,
  experience,
  hobbies,
  skillCategories,
} from '../data/content';

/**
 * Asistente 100% local: sin API key, sin backend, sin costo. Responde por
 * coincidencia de palabras clave contra el contenido real de `content.ts`
 * — nunca inventa proyectos, cifras ni experiencia que no estén ahí.
 */
type Rule = {
  keywords: string[];
  answer: () => string;
};

const rules: Rule[] = [
  {
    keywords: ['hola', 'buenas', 'hey', 'saludos'],
    answer: () =>
      `¡Hola! Soy el asistente de ${profile.name}. Pregúntame por sus proyectos, tecnologías, experiencia o cómo contactarlo.`,
  },
  {
    keywords: ['proyecto', 'proyectos', 'portafolio', 'trabajos'],
    answer: () =>
      `He trabajado en varios proyectos, entre ellos: ${featuredProjects
        .map((p) => p.title)
        .join(', ')}. ¿Quieres que te cuente más sobre alguno en específico?`,
  },
  {
    keywords: ['skill', 'skills', 'tecnolog', 'stack', 'lenguaje', 'herramienta'],
    answer: () =>
      `Las tecnologías que domino son: ${stack.join(', ')}. En frontend destaco en ${skillCategories[0].items
        .slice(0, 2)
        .map((s) => s.name)
        .join(' y ')}, y en backend en ${skillCategories[1].items
        .slice(0, 2)
        .map((s) => s.name)
        .join(' y ')}.`,
  },
  {
    keywords: ['experiencia', 'trayectoria', 'trabajo', 'background', 'historia'],
    answer: () =>
      `Mi trayectoria incluye: ${experience.map((e) => `${e.title} (${e.period})`).join(', ')}. Cada etapa aportó algo distinto a cómo desarrollo software hoy.`,
  },
  {
    keywords: ['hobbie', 'hobby', 'hobbies', 'tiempo libre', 'gustos'],
    answer: () =>
      `Fuera del código disfruto: ${hobbies.map((h) => h.title.toLowerCase()).join(', ')}.`,
  },
  {
    keywords: ['contacto', 'contactar', 'email', 'correo', 'whatsapp', 'escribir'],
    answer: () =>
      `Puedes escribirme a ${profile.email} o por WhatsApp. También tienes el formulario en la sección "Contacto" al final de la página.`,
  },
  {
    keywords: ['cv', 'hoja de vida', 'curriculum', 'currículum', 'resume'],
    answer: () => 'Puedes descargar mi hoja de vida en PDF desde el botón "Descargar CV" en la sección Sobre mí.',
  },
  {
    keywords: ['github', 'repositorio', 'repositorios', 'código', 'codigo'],
    answer: () => `Todo mi código está en GitHub: ${profile.github}`,
  },
  {
    keywords: ['gracias', 'ok', 'listo', 'genial'],
    answer: () => '¡De nada! Si quieres, sigue explorando el portafolio o pregúntame algo más.',
  },
];

const fallback =
  'No estoy seguro de eso. Puedes preguntarme por proyectos, tecnologías, experiencia, hobbies o cómo contactar.';

export function answerQuestion(rawQuery: string): string {
  const query = rawQuery.toLowerCase();
  const rule = rules.find((r) => r.keywords.some((k) => query.includes(k)));
  return rule ? rule.answer() : fallback;
}
