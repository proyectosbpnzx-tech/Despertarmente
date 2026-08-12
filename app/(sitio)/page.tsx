import { landing } from "@/content/landing";
import { Hero } from "@/components/sections/Hero";
import { ParaQuien } from "@/components/sections/ParaQuien";
import { QueEs } from "@/components/sections/QueEs";
import { ComoEsUnaSesion } from "@/components/sections/ComoEsUnaSesion";
import { Servicios } from "@/components/sections/Servicios";
import { Credenciales } from "@/components/sections/Credenciales";
import { Testimonios } from "@/components/sections/Testimonios";
import { FAQ } from "@/components/sections/FAQ";
import { CierreCta } from "@/components/sections/CierreCta";

/**
 * Landing para deportistas individuales.
 * Orden narrativo → llevar al WhatsApp. Todo el copy viene de content/landing.ts.
 * Para Fase 2 (/clubes): app/clubes/page.tsx con las MISMAS secciones + content/clubes.ts.
 */
export default function Home() {
  return (
    <>
      <Hero content={landing.hero} />
      <ParaQuien content={landing.paraQuien} />
      <QueEs content={landing.queEs} />
      <ComoEsUnaSesion content={landing.sesion} />
      <Servicios content={landing.servicios} />
      <Credenciales content={landing.credenciales} />
      <Testimonios content={landing.testimonios} />
      <FAQ content={landing.faq} />
      <CierreCta content={landing.cierre} />
    </>
  );
}
