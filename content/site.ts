import { P, type SiteInfo } from "./types";

/**
 * Fuente ÚNICA de datos de negocio (NAP). Footer, JSON-LD y metadata leen de acá.
 * Los campos con datos reales pendientes usan P(...) o "" — nunca inventar.
 */
export const site: SiteInfo = {
  name: "Despertarmente",
  tagline: "Neurociencia aplicada al deporte",

  // TODO: reemplazar por el dominio real de producción antes de publicar.
  url: "https://despertarmente.com.ar",

  // Formato internacional sin '+' ni espacios. Ej AR: 5491122334455
  whatsappNumber: "541155270609",
  whatsappDefaultMessage:
    "¡Hola Jonatan! Te escribo desde la web. Quiero saber más sobre las sesiones de Despertarmente.",

  instagram: {
    handle: "@despertarmente.gr",
    url: "https://www.instagram.com/despertarmente.gr/",
    seguidores: "5.300",
  },

  facebook: {
    url: "https://www.facebook.com/people/Despertarmente/100063557409651/",
  },

  localidad: "General Rodríguez",
  region: "Buenos Aires",
  pais: "AR",
  direccion: "Güemes 480, B1748 Gral. Rodríguez, Buenos Aires",
  horarios: P("días y horarios de atención"),
  email: P("email de contacto (opcional)"),
};
