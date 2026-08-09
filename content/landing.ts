import { P, type LandingContent } from "./types";

/**
 * Contenido de la landing para DEPORTISTAS INDIVIDUALES.
 * Copy en español rioplatense (voseo), estructura síntoma→mecanismo→prueba.
 * NO inventar: lo que falta va como P(...) y se muestra visible en la página.
 * Ver skills: copy-es-ar, a11y-wcag.
 */
export const landing: LandingContent = {
  hero: {
    eyebrow: "Neurociencia aplicada al deporte · General Rodríguez",
    title: "Tu cabeza también se entrena",
    subtitle:
      "Trabajamos lo que te pasa por dentro cuando competís: la concentración, los nervios y la confianza. Con método, no con frases motivacionales.",
    cta: {
      label: "Escribinos por WhatsApp",
      whatsappMessage:
        "¡Hola Jonatan! Vi la web de Despertarmente y quiero saber más sobre las sesiones.",
    },
    secondaryCta: { label: "Ver cómo es una sesión", href: "#sesion" },
    note: "Te responde Jonatan. Contanos tu deporte y qué querés mejorar.",
  },

  paraQuien: {
    id: "para-quien",
    heading: "¿Para quién es?",
    intro:
      "Para deportistas que compiten y quieren que la cabeza les juegue a favor. No importa tu disciplina ni si sos amateur: si entrenás en serio, esto es para vos.",
    disciplinas: [
      "Fútbol",
      "Básquet",
      "Tenis",
      "Atletismo",
      "Natación",
      "Artes marciales",
      "Vóley",
      "Hockey",
      "Ciclismo",
      "Y tu deporte",
    ],
    outro:
      "Trabajamos con deportistas individuales, sobre todo juveniles y amateurs.",
  },

  queEs: {
    id: "que-es",
    heading: "¿Qué es la neurociencia aplicada al deporte?",
    intro:
      "No es charla motivacional ni “pensá positivo”. Es entrenar, con base en cómo funciona tu cerebro, las habilidades mentales que definen una competencia: atención, manejo de la presión, decisión y confianza.",
    puntos: [
      {
        title: "Foco cuando importa",
        body: "Te desconcentrás justo en el momento que define el partido. Entrenás la atención para sostener el foco donde y cuando hace falta.",
      },
      {
        title: "Manejar los nervios",
        body: "La ansiedad antes de competir te tira el rendimiento abajo. Trabajás a regular esa activación para llegar entero al momento clave.",
      },
      {
        title: "Decidir rápido y bien",
        body: "En tu deporte decidís en fracciones de segundo. Entrenás la toma de decisiones para elegir mejor y más rápido bajo presión.",
      },
      {
        title: "Confianza que se sostiene",
        body: "Después de un error se te cae la confianza y arrastrás el bajón. Trabajás a recuperarte rápido y competir seguro.",
      },
    ],
    pendiente: P(
      "descripción concreta, en palabras de Jonatan, de en qué se basa el método (qué disciplinas/ciencia lo sostienen), para anclar esta sección y sacarle lo abstracto"
    ),
  },

  sesion: {
    id: "sesion",
    heading: "¿Cómo es una sesión?",
    intro:
      "Acá te contamos exactamente qué pasa en una sesión: qué hacés, cuánto dura y con qué se trabaja. Esta es la parte que responde “¿qué me van a hacer y para qué me sirve?”.",
    pasos: [], // se completa con el paso a paso real
    duracion: P("duración de una sesión"),
    pendiente: P(
      "paso a paso REAL de una sesión: qué se hace, en qué orden, cuánto dura y con qué herramientas o tecnología. Es el contenido más importante de la landing"
    ),
  },

  servicios: {
    id: "servicios",
    heading: "Formas de trabajar",
    intro:
      "Distintas maneras de acompañarte según tu momento y tus objetivos.",
    items: [], // se completa con los servicios reales
    pendiente: P(
      "servicios reales: nombre, qué incluye cada uno, modalidad (presencial en General Rodríguez y/o online) y precio o rango"
    ),
  },

  credenciales: {
    id: "quien",
    heading: "Quién te acompaña",
    nombre: "Jonatan Rodríguez",
    rol: "Director de Despertarmente",
    bio: [
      "Jonatan trabaja hace años en el deporte como preparador físico, con un compromiso fuerte con el deporte inclusivo.",
      "Desde ese recorrido nace Despertarmente: llevar al deportista de a pie las herramientas mentales que definen el rendimiento.",
    ],
    credenciales: [
      "Preparador físico en el cuerpo técnico de la Selección Argentina de Fútbol de Sordos (“Los Toros”), designado por AFA.",
      "Trayectoria en deporte inclusivo (fútbol para ciegos, sordos e inclusivo) a través de la dirección de deportes municipal.",
    ],
    foto: null, // [[PENDIENTE: retrato real de Jonatan]] — se muestra placeholder visible
  },

  pruebaSocial: {
    id: "prensa",
    heading: "En los medios",
    intro: "El trabajo de Despertarmente tuvo cobertura en medios locales.",
    prensa: [
      { medio: "La Posta", url: P("URL de la nota en La Posta") },
      { medio: "VDP Noticias", url: P("URL de la nota en VDP Noticias") },
    ],
    comunidad: {
      plataforma: "Instagram",
      seguidores: "5.300",
      url: P("URL exacta del perfil de Instagram"),
    },
  },

  testimonios: {
    id: "testimonios",
    heading: "Lo que dicen los deportistas",
    items: [], // se completa con testimonios reales
    pendiente: P(
      "testimonios reales de deportistas: nombre, disciplina y su experiencia, con consentimiento para publicarlos"
    ),
  },

  faq: {
    id: "faq",
    heading: "Preguntas frecuentes",
    items: [
      {
        q: "¿Tengo que jugar al fútbol para venir?",
        a: "Para nada. El fútbol es parte de la trayectoria de Jonatan, pero trabajamos con deportistas de cualquier disciplina: tenis, básquet, atletismo, natación, artes marciales y más.",
      },
      {
        q: "¿Sirve si soy amateur o juvenil?",
        a: "Sí. Trabajamos sobre todo con deportistas amateurs y juveniles que compiten y quieren mejorar su rendimiento mental.",
      },
      {
        q: "¿Cómo empiezo?",
        a: "Escribinos por WhatsApp, contanos tu deporte y qué querés mejorar. Jonatan te responde y coordinan cómo seguir.",
      },
      {
        q: "¿Es presencial u online?",
        a: P(
          "aclarar modalidad: presencial en General Rodríguez, online, o ambas"
        ),
      },
    ],
  },

  cierre: {
    id: "cierre",
    heading: "¿Arrancamos?",
    body: "Contanos tu deporte y qué querés mejorar. El primer paso es un mensaje.",
    cta: {
      label: "Escribinos por WhatsApp",
      whatsappMessage:
        "¡Hola Jonatan! Quiero empezar a trabajar con Despertarmente. Mi deporte es:",
    },
  },
};
