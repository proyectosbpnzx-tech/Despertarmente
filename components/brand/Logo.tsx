/**
 * ÚNICO punto de integración del logo: ícono real (/public/logo.jpg) + wordmark
 * tipográfico. El ícono es un badge circular con texto interno; a tamaños chicos
 * (header) ese texto no se lee, por eso se acompaña del wordmark para legibilidad.
 */
import Image from "next/image";
import { site } from "@/content/site";

interface LogoProps {
  /** Tamaño del lockup (ícono + wordmark). */
  size?: "sm" | "md" | "lg";
  /** Mostrar la bajada "Neurociencia aplicada al deporte". */
  showTagline?: boolean;
  className?: string;
}

const textSizes: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl sm:text-5xl",
};

const iconSizes: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14 sm:h-16 sm:w-16",
};

export function Logo({ size = "md", showTagline = false, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.jpg"
        alt="Despertarmente"
        width={447}
        height={447}
        className={`shrink-0 rounded-full ${iconSizes[size]}`}
        priority={size === "lg"}
      />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`font-display font-bold tracking-tight text-text ${textSizes[size]}`}
        >
          Despertar<span className="text-accent">mente</span>
        </span>
        {showTagline && (
          <span className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {site.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
