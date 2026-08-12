import { P, type SiteInfo } from "./types";

/**
 * Fuente ÚNICA de datos de negocio (NAP). Footer, JSON-LD y metadata leen de acá.
 * Los campos con datos reales pendientes usan P(...) o "" — nunca inventar.
 */
export const site: SiteInfo = {
  name: "Despertarmente",
  tagline: "Neurociencia aplicada al deporte",

  /**
   * Dirección canónica del sitio: alimenta canonical, og:url, sitemap y JSON-LD.
   *
   * Tiene que ser una URL que RESUELVA. Antes decía despertarmente.com.ar, un
   * dominio que todavía no existe: eso le declaraba a los buscadores que la
   * dirección real del sitio estaba en un lugar muerto, y los previews de link
   * apuntaban ahí.
   *
   * TODO: volver a despertarmente.com.ar cuando el dominio esté registrado y
   * apuntando a Vercel — el resto del SEO ya está preparado para ese cambio.
   */
  url: "https://despertarmente.vercel.app",

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
