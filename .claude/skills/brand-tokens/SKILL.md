---
name: brand-tokens
description: Sistema de tokens semánticos de Despertarmente. La identidad visual se cambia editando un solo archivo (styles/tokens.css). Cero valores hardcodeados en componentes.
---

# Tokens de marca

La identidad visual completa vive en **un solo archivo**: `styles/tokens.css`. Cambiar colores,
tipografías o espaciados = editar ese archivo y nada más. Ningún componente hardcodea color,
fuente ni radio.

## Tres capas

1. **Primitivos** — paleta cruda, NO se usan en componentes. Ej: `--blue-500: #2E7BFF`,
   `--ink-950`, `--cyan-400`, `--white`. Son el "material".
2. **Semánticos** — lo que consumen los componentes vía Tailwind. Describen rol, no apariencia:
   `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`,
   `--color-accent-strong`, `--color-cta`, `--color-on-cta`, `--color-border`, `--color-focus`,
   más `--font-display`, `--font-body`, escala tipográfica, `--radius-*`, `--space-*`, sombras.
3. **Puente Tailwind v4** — bloque `@theme inline` que mapea los semánticos a utilidades
   (`--color-bg` → `bg-bg`, `--color-accent` → `text-accent`/`bg-accent`, etc.).

## Reglas

- En componentes usá SOLO utilidades semánticas: `bg-bg`, `bg-surface`, `text-text`,
  `text-muted`, `text-accent`, `bg-cta`, `border-border`, `ring-focus`. Nunca `bg-[#...]`
  ni `text-blue-500`.
- Tema **oscuro** por defecto (negro + azul eléctrico + cian, coherente con el logo). Texto claro.
- El CTA de WhatsApp usa `--color-cta` (verde WhatsApp) para reconocimiento inmediato; el azul
  de marca (`--color-accent`) queda para acentos y énfasis.
- Todo par texto/fondo debe pasar contraste WCAG AA (ver skill `a11y-wcag`). Verificar al tocar tokens.

## Tipografía

- `--font-display`: headings y wordmark. `--font-body`: texto corrido.
- Cargar fuentes vía `next/font` en el layout y exponerlas como variables CSS que estos tokens consumen.
