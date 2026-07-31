/** Contenido real del portafolio de Yair Vergara — sin datos inventados. */

export const profile = {
  name: 'Yair Vergara',
  role: 'Full-Stack Developer',
  greeting: 'Hola, soy',
  tagline:
    'Construyo experiencias web que combinan diseño intuitivo con código limpio y escalable. Especializado en JavaScript, PHP y MySQL.',
  bio: [
    'Desarrollador full-stack con experiencia en JavaScript, PHP y MySQL. Me especializo en crear aplicaciones web funcionales con interfaces intuitivas.',
    'Mi background diverso —desde atención al cliente hasta soldadura industrial— me ha dado una perspectiva única: entiendo que el código debe resolver problemas reales de forma práctica.',
    'Cada línea de código que escribo viene respaldada por años de experiencia en precisión, atención al detalle y servicio al cliente.',
  ],
  email: 'yandrey2007@gmail.com',
  github: 'https://github.com/yairV1',
  githubUser: 'yairV1',
  linkedin: 'https://www.linkedin.com/in/yair-vergara-163043309/',
  whatsapp: 'https://wa.me/573212569376',
  cv: '/hojaV/hoja-de-vida-yair-vergara.pdf',
  memberSince: '2024',
  memberId: 'YV-2024-001',
} as const;

export const stack = [
  'JavaScript',
  'PHP',
  'MySQL',
  'Laravel',
  'HTML5',
  'CSS3',
  'Bootstrap',
  'Git/GitHub',
  'n8n',
] as const;

export type Skill = {
  name: string;
  percent: number;
  description: string;
};

export type SkillCategory = {
  id: string;
  label: string;
  items: Skill[];
};

/** Copiados tal cual de index.html (sección #habilidades) del sitio actual. */
export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      { name: 'HTML', percent: 90, description: 'Estructura semántica de páginas web.' },
      { name: 'CSS', percent: 85, description: 'Estilos y diseño responsivo.' },
      { name: 'JavaScript', percent: 75, description: 'Interactividad y lógica en el navegador.' },
      { name: 'Figma', percent: 70, description: 'Diseño UI/UX profesional.' },
      { name: 'n8n', percent: 20, description: 'Automatización de flujos de trabajo.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    items: [
      { name: 'PHP', percent: 50, description: 'Lenguaje de servidor robusto.' },
      { name: 'MySQL', percent: 55, description: 'Gestión de bases de datos relacionales.' },
      { name: 'Git & GitHub', percent: 85, description: 'Control de versiones y colaboración.' },
      { name: 'Laravel', percent: 20, description: 'Framework PHP para desarrollo web.' },
    ],
  },
];

export type NavSection = {
  id: string;
  label: string;
};

/** Orden pedido para la nav de puntos de la reconstrucción. */
export const navSections: NavSection[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'skills', label: 'Skills' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'contacto', label: 'Contacto' },
];

export type Project = {
  title: string;
  tech: string[];
  description: string;
  demoUrl: string;
  codeUrl: string;
};

/** Copiados tal cual de index.html (sección #proyectos) del sitio actual. */
export const featuredProjects: Project[] = [
  {
    title: 'Gym Landing Page',
    tech: ['HTML5', 'CSS3', 'Bootstrap'],
    description:
      'Landing page optimizada para gimnasio con diseño responsivo y animaciones ligeras. Enfoque en conversión de clientes con CTAs estratégicos.',
    demoUrl: 'https://yairv1.github.io/mi-gym/',
    codeUrl: 'https://github.com/yairV1/mi-gym',
  },
  {
    title: 'Panto Marketing',
    tech: ['JavaScript', 'CSS3', 'Performance'],
    description:
      'Página de marketing digital con animaciones fluidas y alto rendimiento. Optimizada para tiempos de carga rápidos y experiencia de usuario superior.',
    demoUrl: 'https://yairv1.github.io/boostrap/',
    codeUrl: 'https://github.com/yairV1/boostrap',
  },
  {
    title: 'Calculadora de Figuras',
    tech: ['JavaScript', 'Math', 'UI/UX'],
    description:
      'Aplicación web educativa para calcular áreas y perímetros de figuras geométricas con resultados en tiempo real y diseño intuitivo.',
    demoUrl: 'https://yairv1.github.io/figuras_JS/',
    codeUrl: 'https://github.com/yairV1/figuras_JS',
  },
  {
    title: 'Simulador de Inversión',
    tech: ['JavaScript', 'Finance', 'Interactive'],
    description:
      'Calculadora interactiva de rendimientos de inversión con interfaz moderna y cálculos en tiempo real. Incluye visualizaciones dinámicas.',
    demoUrl: 'https://yairv1.github.io/similador_invercion_js/',
    codeUrl: 'https://github.com/yairV1/similador_invercion_js',
  },
  {
    title: 'To-Do List',
    tech: ['JavaScript', 'LocalStorage', 'CRUD'],
    description:
      'Gestor de tareas con persistencia de datos usando LocalStorage. Permite crear, editar y eliminar tareas con interfaz intuitiva.',
    demoUrl: 'https://yairv1.github.io/To_do_list_js/',
    codeUrl: 'https://github.com/yairV1/To_do_list_js',
  },
  {
    title: 'Base de Vehículos',
    tech: ['JavaScript', 'LocalStorage', 'Dynamic UI'],
    description:
      'Sistema de gestión de vehículos con generación dinámica de tarjetas, almacenamiento local y funcionalidades CRUD completas.',
    demoUrl: 'https://yairv1.github.io/base-vehiculos-dinamicos/',
    codeUrl: 'https://github.com/yairV1/base-vehiculos-dinamicos',
  },
];

export type ExperienceItem = {
  title: string;
  period: string;
  description: string;
  learningLabel: string;
  learning: string;
};

/** Copiado tal cual de index.html (sección #experiencia) del sitio actual. */
export const experience: ExperienceItem[] = [
  {
    title: 'Desarrollador Web',
    period: 'Actual · Proyectos independientes',
    description:
      'Desarrollo de aplicaciones web completas con JavaScript, PHP y MySQL. Enfoque en código limpio, responsive design y experiencia de usuario.',
    learningLabel: 'Aplicando:',
    learning: 'Todas las habilidades de mis experiencias anteriores en cada línea de código.',
  },
  {
    title: 'Atención al Cliente',
    period: '2 años · Sector servicios',
    description:
      'Gestión de múltiples tareas bajo presión, desarrollo de habilidades de comunicación y comprensión profunda de las necesidades del usuario.',
    learningLabel: 'Hoy aplico esto en:',
    learning: 'UX/UI thinking, priorización de features y empatía con el usuario final.',
  },
  {
    title: 'Soldador Industrial',
    period: '1 año · Manufactura',
    description:
      'Precisión milimétrica, seguimiento estricto de estándares de calidad y protocolos de seguridad en entornos de alta responsabilidad.',
    learningLabel: 'Hoy aplico esto en:',
    learning: 'Clean code, testing, documentación y atención al detalle en cada proyecto.',
  },
];

export type Hobby = {
  title: string;
  description: string;
  image: string;
};

/** Copiado tal cual de index.html (sección #hobbis) del sitio actual. */
export const hobbies: Hobby[] = [
  {
    title: 'Leer',
    description: 'Disfruto de la lectura porque me permite aprender, inspirarme y relajarme.',
    image: '/img/libti.jpg',
  },
  {
    title: 'Música',
    description: 'Escuchar música me ayuda a concentrarme y disfrutar de mis momentos libres.',
    image: '/img/musi.jpg',
  },
  {
    title: 'Naturaleza',
    description: 'Me encanta explorar y conectarme con la tranquilidad de los paisajes.',
    image: '/img/paisaje.jpg',
  },
];

export type Stat = {
  value: string;
  label: string;
};

/** Derivados de los datos reales de arriba — ninguna cifra inventada. */
export const aboutStats: Stat[] = [
  { value: String(experience.length), label: 'Etapas de trayectoria' },
  { value: `${featuredProjects.length}+`, label: 'Proyectos destacados' },
  { value: String(stack.length), label: 'Tecnologías activas' },
  { value: '∞', label: 'Siempre aprendiendo' },
];
