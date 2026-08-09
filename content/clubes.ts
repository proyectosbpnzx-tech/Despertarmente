import { P, type LandingContent } from "./types";

/**
 * FASE 2 — STUB. Segmento institucional (clubes).
 *
 * Conforma el MISMO tipo `LandingContent` que landing.ts. La página /clubes NO
 * existe todavía y NO se debe crear ahora. Este módulo demuestra que agregarla
 * después es solo: crear app/clubes/page.tsx importando las mismas <Section/> +
 * este contenido. Cero refactor. Ver README → "Activar /clubes".
 *
 * Todo el contenido acá es [[PENDIENTE]]: definirlo con Jonatan cuando arranque Fase 2.
 */
export const clubes: LandingContent = {
  hero: {
    eyebrow: "Neurociencia aplicada al deporte · Clubes e instituciones",
    title: P("propuesta de valor para clubes en una frase"),
    subtitle: P("qué ofrece Despertarmente a un club y a su cuerpo técnico"),
    cta: {
      label: "Escribinos por WhatsApp",
      whatsappMessage:
        "¡Hola Jonatan! Represento a un club y quiero información sobre Despertarmente.",
    },
  },
  paraQuien: {
    id: "para-quien",
    heading: "¿Para qué clubes?",
    intro: P("a qué tipo de clubes/instituciones apunta la propuesta"),
    disciplinas: [],
    outro: undefined,
  },
  queEs: {
    id: "que-es",
    heading: "¿Qué aporta al club?",
    intro: P("qué gana el club al incorporar neurociencia aplicada"),
    puntos: [],
    pendiente: P("beneficios concretos para el club y su plantel"),
  },
  sesion: {
    id: "sesion",
    heading: "¿Cómo se trabaja con un plantel?",
    intro: P("formato del trabajo con equipos/planteles"),
    pasos: [],
    pendiente: P("modalidad de trabajo institucional: alcance, frecuencia, entregables"),
  },
  servicios: {
    id: "servicios",
    heading: "Programas para clubes",
    intro: P("programas o paquetes institucionales"),
    items: [],
    pendiente: P("programas para clubes: alcance, duración y valores"),
  },
  credenciales: {
    id: "quien",
    heading: "Quién lo dirige",
    nombre: "Jonatan Rodríguez",
    rol: "Director de Despertarmente",
    bio: [
      "Jonatan trabaja hace años en el deporte como preparador físico, con un compromiso fuerte con el deporte inclusivo.",
    ],
    credenciales: [
      "Preparador físico en el cuerpo técnico de la Selección Argentina de Fútbol de Sordos (“Los Toros”), designado por AFA.",
      "Trayectoria en deporte inclusivo (fútbol para ciegos, sordos e inclusivo) a través de la dirección de deportes municipal.",
    ],
    foto: null,
  },
  pruebaSocial: {
    id: "prensa",
    heading: "En los medios",
    intro: P("cobertura o antecedentes relevantes para clubes"),
    prensa: [],
    comunidad: { plataforma: "Instagram", seguidores: "5.300" },
  },
  testimonios: {
    id: "testimonios",
    heading: "Clubes que confiaron",
    items: [],
    pendiente: P("testimonios de clubes o cuerpos técnicos, con consentimiento"),
  },
  faq: {
    id: "faq",
    heading: "Preguntas frecuentes",
    items: [],
  },
  cierre: {
    id: "cierre",
    heading: "Hablemos",
    body: P("cierre orientado a la coordinación institucional"),
    cta: {
      label: "Escribinos por WhatsApp",
      whatsappMessage:
        "¡Hola Jonatan! Quiero coordinar una charla sobre Despertarmente para nuestro club.",
    },
  },
};
