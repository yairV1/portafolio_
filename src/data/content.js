/* ============================================================
   TODO EL CONTENIDO DEL PORTAFOLIO VIVE AQUÍ.
   Edita solo este archivo para cambiar textos, proyectos, etc.
   Regla: aquí solo va información real y verificable.
   ============================================================ */
import { asset } from '../lib/asset'

export const identity = {
  nombre: 'Yair',
  apellido: 'Vergara Ávila',
  rol: 'Desarrollador de Software',
  especialidad: 'Full-Stack web',
  handle: 'github.com/yairV1',
  descripcion:
    'Construyo aplicaciones de gestión con PHP, Laravel, JavaScript y MySQL: roles y permisos, módulos administrativos y migración de código heredado. Me importa que el software sea claro, seguro y fácil de usar.',
  disponible: 'Abierto a oportunidades',
  cv: asset('cv/Hoja_de_Vida_Yair_Vergara.pdf'),
  foto: asset('foto.webp'),
  stackHero: ['PHP', 'Laravel', 'JavaScript', 'MySQL', 'React', 'Three.js'],
}

export const zones = [
  { id: 'z01', code: 'Z-01', name: 'Recepción' },
  { id: 'z02', code: 'Z-02', name: 'Perfil' },
  { id: 'z03', code: 'Z-03', name: 'Capacidades' },
  { id: 'z04', code: 'Z-04', name: 'Trayectoria' },
  { id: 'z05', code: 'Z-05', name: 'Expedientes' },
  { id: 'z06', code: 'Z-06', name: 'Fuera de horario' },
  { id: 'z07', code: 'Z-07', name: 'Contacto' },
]

export const perfil = {
  titulo: 'Detrás de la credencial',
  parrafos: [
    'Soy aprendiz del SENA en Análisis y Desarrollo de Software y hoy estoy en etapa práctica, desarrollando en equipo un portal institucional. Me gusta entender cómo funciona un proceso real —una matrícula, un expediente, una cita— y convertirlo en un sistema que la gente pueda usar sin manual.',
    'Antes de programar trabajé en atención al cliente y en soldadura industrial. De lo primero me quedó pensar en quién va a usar lo que construyo; de lo segundo, la precisión y el respeto por los estándares de calidad y seguridad.',
  ],
  /* Fichas verificables: nada de cifras infladas. */
  stats: [
    { n: 'ADSO', l: 'Tecnólogo SENA · en curso' },
    { n: 'Laravel 12', l: 'Migración de un sistema real' },
    { n: '50+', l: 'Migraciones SQL en Portal CORE' },
    { n: 'ES · EN · PT', l: 'Interfaz multilenguaje en VetWilling' },
  ],
}

export const capacidades = [
  { titulo: 'Backend', nota: 'Lógica de negocio, rutas y controladores.', items: ['PHP', 'Laravel', 'MVC', 'Express.js', 'REST'] },
  { titulo: 'Frontend', nota: 'Interfaces responsivas y accesibles.', items: ['JavaScript', 'HTML', 'CSS', 'Bootstrap 5', 'React'] },
  { titulo: 'Datos', nota: 'Modelado relacional y esquemas versionados.', items: ['MySQL', 'SQL', 'Migraciones', 'Modelado'] },
  { titulo: 'Seguridad web', nota: 'Control de acceso revisado antes de publicar.', items: ['Roles y permisos', 'CSRF', 'IDOR', 'Autorización'] },
  { titulo: 'Entorno', nota: 'Trabajo en equipo con ramas y contenedores.', items: ['Git', 'GitHub', 'Docker', 'Linux', 'XAMPP'] },
  { titulo: '3D y automatización', nota: 'Experiencias interactivas y flujos automáticos.', items: ['Three.js', 'React Three Fiber', 'GSAP', 'n8n'] },
]

export const trayectoria = [
  {
    cuando: 'Sep 2026 — Presente',
    cargo: 'Aprendiz en etapa práctica',
    donde: 'Contrato de aprendizaje · SENA',
    texto: 'Desarrollo en equipo de Portal CORE: gestión documental, talento humano y permisos por rol para una institución educativa.',
    tags: ['PHP', 'MySQL', 'Docker'],
  },
  {
    cuando: 'En curso',
    cargo: 'Tecnólogo en Análisis y Desarrollo de Software',
    donde: 'SENA',
    texto: 'Análisis, diseño y construcción de software: bases de datos, programación web y trabajo colaborativo con Git.',
    tags: ['ADSO', 'SQL', 'Git'],
  },
  {
    cuando: 'Proyecto formativo',
    cargo: 'Desarrollo web en equipo · VetWilling',
    donde: 'Sistema de gestión veterinaria',
    texto: 'Panel de clientes, notificaciones, permisos temporales al historial clínico, interfaz en tres idiomas y auditoría de seguridad antes de publicar.',
    tags: ['PHP', 'MySQL', 'Bootstrap 5'],
  },
  {
    cuando: 'Finalizado',
    cargo: 'Técnico en Asistencia Administrativa',
    donde: 'SENA',
    texto: 'Procesos administrativos y documentales: la base para entender lo que automatizan los sistemas de gestión.',
    tags: ['Procesos', 'Documentación'],
  },
  {
    cuando: '2 años',
    cargo: 'Ventas y atención al cliente',
    donde: 'Sector comercio y servicios',
    texto: 'Atención directa, resolución de dudas y trabajo bajo presión. Hoy lo aplico al pensar en el usuario final.',
    tags: ['Comunicación', 'Usuario final'],
  },
  {
    cuando: '1 año',
    cargo: 'Soldador industrial',
    donde: 'Manufactura',
    texto: 'Precisión, estándares de calidad y protocolos de seguridad en un entorno de alta responsabilidad.',
    tags: ['Precisión', 'Calidad'],
  },
]

/* estado: 'live' = en línea · 'dev' = en desarrollo · 'mig' = migración en curso
   Los 4 primeros aparecen destacados en la home. Todos aparecen en /expedientes. */
export const expedientes = [
  {
    slug: 'sistema-escolar',
    nombre: 'Sistema de Gestión Escolar',
    sigla: 'SE',
    rol: 'En equipo',
    estado: 'mig',
    categoria: 'Plataforma',
    resumen: 'Administración de un colegio: matrículas, siete roles de usuario, gestión académica, evaluaciones y comunicados.',
    stack: ['PHP 8.2', 'Laravel 12', 'MySQL', 'Vite'],
    tono: ['#3B1D8F', '#8B5CF6'],
    demo: '',
    repo: 'https://github.com/yairV1/sistema-escolar',
    arquitectura: [
      'Migración incremental de PHP sin framework a Laravel 12',
      'Ambas aplicaciones comparten la misma base de datos MySQL',
      'Cada módulo migrado reemplaza su ruta antigua solo cuando ya funciona igual o mejor',
    ],
    retos: [
      'Migrar sin apagar un sistema que está en uso',
      'Ya migrados: autenticación, panel, listados, matrículas, registro y gestión académica',
    ],
  },
  {
    slug: 'portal-core',
    nombre: 'Portal CORE',
    sigla: 'PC',
    rol: 'En equipo · etapa práctica',
    estado: 'dev',
    categoria: 'Plataforma',
    resumen: 'Portal institucional que centraliza procesos administrativos, gestión documental y la información de cada dirección.',
    stack: ['PHP 8.1', 'MySQL', 'JavaScript', 'Docker'],
    tono: ['#0E3B4C', '#22D3EE'],
    demo: '',
    repo: 'https://github.com/yairV1/portal-core',
    arquitectura: [
      'Permisos por rol, módulo y acción',
      'Gestión documental con carga de archivos y conexión opcional con Google Drive',
      'Esquema versionado en más de 50 migraciones SQL y entorno en Docker',
    ],
    retos: [
      'Mantener el esquema sincronizado entre los entornos de todo el equipo',
      'Coordinar el trabajo de varios integrantes con ramas en Git',
    ],
  },
  {
    slug: 'vetwilling',
    nombre: 'VetWilling',
    sigla: 'VW',
    rol: 'Colaboración',
    estado: 'live',
    categoria: 'Plataforma',
    resumen: 'Gestión para clínicas veterinarias: agenda, historial clínico y paneles para clientes y profesionales.',
    stack: ['PHP', 'MySQL', 'Bootstrap 5', 'JavaScript'],
    tono: ['#123B2A', '#34D399'],
    demo: 'https://vetwilling.com/',
    repo: 'https://github.com/WilliamSanchezR/VETWILLING',
    arquitectura: [
      'Notificaciones en tiempo real mediante polling sobre PHP y MySQL',
      'Permisos temporales de acceso al historial clínico con aprobación y expiración',
      'Interfaz completa en español, inglés y portugués',
    ],
    retos: [
      'Auditoría de seguridad que detectó IDOR, CSRF y bypass de autorización antes de publicar',
      'Navegación móvil distinta para clientes y veterinarios',
    ],
  },
  {
    slug: 'portafolio-3d',
    nombre: 'Este portafolio',
    sigla: '3D',
    rol: 'Personal',
    estado: 'live',
    categoria: 'Experimento',
    resumen: 'Experiencia interactiva con una credencial 3D que responde a la física y navegación por zonas.',
    stack: ['React', 'Three.js', 'Rapier', 'GSAP'],
    tono: ['#1B1140', '#C4B5FD'],
    demo: 'https://yairv1.github.io/portafolio_/',
    repo: 'https://github.com/yairV1/portafolio_',
    arquitectura: [
      'Física de cuerpo rígido con Rapier para la credencial',
      'Escenas 3D que solo se montan cuando están cerca de la pantalla',
      'Texturas generadas en el navegador, sin modelos externos',
    ],
    retos: ['Mantener la fluidez en celulares', 'Respetar la preferencia de movimiento reducido'],
  },
  {
    slug: 'mi-gym',
    nombre: 'Gym Landing Page',
    sigla: 'GY',
    rol: 'Personal',
    estado: 'live',
    categoria: 'Práctica',
    resumen: 'Landing page responsiva para un gimnasio, con llamados a la acción y animaciones ligeras.',
    stack: ['HTML', 'CSS', 'Bootstrap'],
    tono: ['#3A1A0E', '#F97316'],
    demo: 'https://yairv1.github.io/mi-gym/',
    repo: 'https://github.com/yairV1/mi-gym',
    arquitectura: ['Maquetación responsiva con Bootstrap', 'Secciones orientadas a conversión'],
    retos: ['Jerarquía visual para que el usuario llegue al contacto'],
  },
  {
    slug: 'simulador-inversion',
    nombre: 'Simulador de Inversión',
    sigla: 'SI',
    rol: 'Personal',
    estado: 'live',
    categoria: 'Práctica',
    resumen: 'Calculadora interactiva de rendimientos de inversión con cálculos en tiempo real.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    tono: ['#0F2E22', '#10B981'],
    demo: 'https://yairv1.github.io/similador_invercion_js/',
    repo: 'https://github.com/yairV1/similador_invercion_js',
    arquitectura: ['Recalcula el resultado con cada cambio del formulario'],
    retos: ['Presentar números de forma clara'],
  },
  {
    slug: 'todo-list',
    nombre: 'To-Do List',
    sigla: 'TD',
    rol: 'Personal',
    estado: 'live',
    categoria: 'Práctica',
    resumen: 'Gestor de tareas con creación, edición y borrado, guardado en el navegador.',
    stack: ['JavaScript', 'LocalStorage'],
    tono: ['#2A1240', '#A78BFA'],
    demo: 'https://yairv1.github.io/To_do_list_js/',
    repo: 'https://github.com/yairV1/To_do_list_js',
    arquitectura: ['CRUD completo con persistencia en LocalStorage'],
    retos: ['Mantener la interfaz sincronizada con los datos guardados'],
  },
  {
    slug: 'base-vehiculos',
    nombre: 'Base de Vehículos',
    sigla: 'BV',
    rol: 'Personal',
    estado: 'live',
    categoria: 'Práctica',
    resumen: 'Registro de vehículos con tarjetas generadas dinámicamente y almacenamiento local.',
    stack: ['JavaScript', 'LocalStorage'],
    tono: ['#3B0E22', '#F472B6'],
    demo: 'https://yairv1.github.io/base-vehiculos-dinamicos/',
    repo: 'https://github.com/yairV1/base-vehiculos-dinamicos',
    arquitectura: ['Generación dinámica del DOM a partir de los datos'],
    retos: ['Estructurar los datos para filtrarlos y editarlos'],
  },
]

export const estados = {
  live: 'En línea',
  dev: 'En desarrollo',
  mig: 'Migración en curso',
}

export const fueraDeHorario = [
  { k: 'H-01', t: 'Leer', d: 'Me permite aprender, inspirarme y desconectar un rato de la pantalla.' },
  { k: 'H-02', t: 'Música', d: 'Me ayuda a concentrarme mientras programo y a disfrutar el tiempo libre.' },
  { k: 'H-03', t: 'Naturaleza', d: 'Salir a explorar paisajes es mi forma de bajar el ritmo y aclarar ideas.' },
  { k: 'H-04', t: 'Robótica', d: 'Armo y programo un robot LEGO Mindstorms EV3: código que se mueve en el mundo real.' },
  { k: 'H-05', t: 'Modelado 3D', d: 'Creo a NYX, mi mascota digital, en Blender para llevarla a la web.' },
  { k: 'H-06', t: 'Videojuegos', d: 'Buena parte de mi curiosidad por cómo funcionan los sistemas empezó ahí.' },
]

export const contacto = {
  email: 'yandrey2007@gmail.com',
  ubicacion: 'Bogotá, Colombia',
  redes: [
    { n: 'GitHub', u: 'https://github.com/yairV1' },
    { n: 'LinkedIn', u: 'https://www.linkedin.com/in/yair-vergara-163043309/' },
    { n: 'WhatsApp', u: 'https://wa.me/573212569376' },
  ],
}
