import { Container } from "@/components/ui/Container";
import { esPendiente, type CierreContent } from "@/content/types";

/** Empuje final a WhatsApp. */
export function CierreCta({ content }: { content: CierreContent }) {
  return (
    <section
      id={content.id}
      aria-labelledby={`${content.id}-title`}
      className="relative overflow-hidden bg-bg py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]"
      />
      <Container className="relative text-center">
        <h2
          id={`${content.id}-title`}
          className="text-3xl font-bold sm:text-5xl"
        >
          {content.heading}
        </h2>
        {!esPendiente(content.body) && (
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
            {content.body}
          </p>
        )}
      </Container>
    </section>
  );
}
