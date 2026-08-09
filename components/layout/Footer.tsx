import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/content/site";
import { esPendiente } from "@/content/types";

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56a5.89 5.89 0 0 0-2.13 1.38A5.89 5.89 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.89 5.89 0 0 0 2.13-1.38 5.89 5.89 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.89 5.89 0 0 0-1.38-2.13A5.89 5.89 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.77l-.44 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

/** Footer con NAP consistente (fuente única: site) e Instagram. */
export function Footer() {
  const anio = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <Logo size="md" showTagline />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text">
                Dónde
              </h2>
              <address className="mt-3 not-italic text-muted">
                {site.direccion && !esPendiente(site.direccion) ? (
                  <span className="block">{site.direccion}</span>
                ) : (
                  <span className="block">
                    {site.localidad}, {site.region}
                  </span>
                )}
                {!esPendiente(site.horarios) && (
                  <span className="mt-2 block">{site.horarios}</span>
                )}
              </address>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-text">
                Seguinos
              </h2>
              <div className="mt-3 flex items-center gap-4">
                {site.instagram.url && !esPendiente(site.instagram.url) ? (
                  <a
                    href={site.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram ${site.instagram.handle}`}
                    className="inline-flex text-muted transition-colors hover:text-text"
                  >
                    <InstagramIcon />
                  </a>
                ) : (
                  <span className="text-muted">{site.instagram.handle}</span>
                )}
                {site.facebook.url && !esPendiente(site.facebook.url) && (
                  <a
                    href={site.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook de Despertarmente"
                    className="inline-flex text-muted transition-colors hover:text-text"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-sm text-muted">
          © {anio} {site.name}. {site.tagline}.
        </p>
      </Container>
    </footer>
  );
}
