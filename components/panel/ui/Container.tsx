import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Ancho máximo + padding lateral mobile-first. */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-3xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
