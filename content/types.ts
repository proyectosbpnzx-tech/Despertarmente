/* =============================================================================
   Contrato de contenido compartido.
   landing.ts (deportistas) y clubes.ts (Fase 2) conforman el MISMO tipo
   `LandingContent`. Los componentes de sections/ consumen estos tipos, así que
   agregar /clubes en Fase 2 = otro módulo de contenido, sin tocar la UI.
   ============================================================================= */

/**
 * Marca un hueco de contenido real que Jonatan debe aportar.
 * Se renderiza visible vía <Pendiente>. Nunca reemplazar por texto inventado.
 */
export const P = (que: string): string => `[[PENDIENTE: ${que}]]`;

/** Detecta si un string es un marcador [[PENDIENTE: ...]] */
export const esPendiente = (valor: string): boolean =>
  typeof valor === "string" && valor.trimStart().startsWith("[[PENDIENTE");

export interface Cta {
  /** Texto visible y nombre accesible del botón. */
  label: string;
  /** Mensaje pre-cargado en WhatsApp al abrir el chat. */
  whatsappMessage: string;
}

/** CTA secundario que ancla a otra sección de la misma página (sin WhatsApp). */
export interface AnchorCta {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: Cta;
  /** Acción secundaria de menor compromiso (ej. "Ver cómo es una sesión"). */
  secondaryCta?: AnchorCta;
  /** Nota chica bajo el CTA (opcional). */
  note?: string;
}

export interface ParaQuienContent {
  id: string;
  heading: string;
  intro: string;
  /** Disciplinas transversales — el público NO es solo fútbol. */
  disciplinas: string[];
  outro?: string;
}

export interface Punto {
  title: string;
  body: string;
}

export interface QueEsContent {
  id: string;
  heading: string;
  intro: string;
  puntos: Punto[];
  /** Descripción concreta, en palabras de Jonatan, de en qué se basa el método. */
  pendiente?: string;
}

export interface Paso {
  title: string;
  body: string;
}

export interface SesionContent {
  id: string;
  heading: string;
  intro: string;
  pasos: Paso[];
  duracion?: string;
  /** Descripción del hueco si aún no hay pasos reales. */
  pendiente?: string;
}

export interface Servicio {
  nombre: string;
  descripcion: string;
  modalidad?: string;
  precio?: string;
}

export interface ServiciosContent {
  id: string;
  heading: string;
  intro: string;
  items: Servicio[];
  pendiente?: string;
}

export interface CredencialesContent {
  id: string;
  heading: string;
  nombre: string;
  rol: string;
  bio: string[];
  /** Solo credenciales verificables. */
  credenciales: string[];
  foto: { src: string; alt: string } | null;
}

export interface NotaPrensa {
  medio: string;
  titulo?: string;
  url?: string;
}

export interface PruebaSocialContent {
  id: string;
  heading: string;
  intro: string;
  prensa: NotaPrensa[];
  comunidad: { plataforma: string; seguidores: string; url?: string };
}

export interface Testimonio {
  nombre: string;
  disciplina: string;
  texto: string;
}

export interface TestimoniosContent {
  id: string;
  heading: string;
  items: Testimonio[];
  pendiente?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqContent {
  id: string;
  heading: string;
  items: FaqItem[];
}

export interface CierreContent {
  id: string;
  heading: string;
  body: string;
  cta: Cta;
}

export interface LandingContent {
  hero: HeroContent;
  paraQuien: ParaQuienContent;
  queEs: QueEsContent;
  sesion: SesionContent;
  servicios: ServiciosContent;
  credenciales: CredencialesContent;
  pruebaSocial: PruebaSocialContent;
  testimonios: TestimoniosContent;
  faq: FaqContent;
  cierre: CierreContent;
}

/** Datos de negocio — fuente ÚNICA de NAP (Name/Address/Phone) para SEO + footer. */
export interface SiteInfo {
  /** Nombre canónico exacto del wordmark. */
  name: string;
  tagline: string;
  /** URL absoluta de producción (para canonical / OG / JSON-LD). */
  url: string;
  /** Número en formato internacional sin '+' ni espacios (wa.me). "" si pendiente. */
  whatsappNumber: string;
  /** Mensaje por defecto si un CTA no define el suyo. */
  whatsappDefaultMessage: string;
  instagram: { handle: string; url: string; seguidores: string };
  facebook: { url: string };
  localidad: string;
  region: string;
  pais: string;
  /** Dirección de calle exacta, o "" si aún pendiente. */
  direccion: string;
  horarios: string;
  email: string;
}
