---
name: a11y-wcag
description: Checklist WCAG 2.2 AA obligatorio para Despertarmente. La marca trabaja en deporte inclusivo; una landing inaccesible es una contradicción de marca directa.
---

# Accesibilidad — WCAG 2.2 AA (obligatorio)

Jonatan trabaja en deporte inclusivo (ciegos, sordos, inclusivo). Una landing inaccesible
contradice la marca. Esto **no es opcional**. Todo lo de abajo se cumple y se verifica.

## Estructura semántica

- `<html lang="es-AR">`.
- Un solo `<h1>` por página (el del Hero). Jerarquía de headings sin saltos (h1→h2→h3).
- Landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`, y `<section>` con nombre accesible
  (`aria-labelledby` apuntando al heading de la sección).
- **Skip link** como primer elemento focuseable: "Saltar al contenido" → `#contenido`.

## Teclado y foco

- Todo lo interactivo es alcanzable y operable por teclado, en orden lógico.
- **Foco visible** siempre: `:focus-visible` con anillo desde el token `--color-focus`.
  Nunca `outline: none` sin reemplazo visible.
- Objetivos táctiles ≥ 44×44px en mobile (WCAG 2.2 – 2.5.8 Target Size).

## Color y contraste

- Contraste de texto ≥ 4.5:1 (normal) y ≥ 3:1 (texto grande / ≥24px o ≥18.66px bold).
- Componentes UI y estados de foco ≥ 3:1 contra su entorno.
- **Nunca** transmitir información solo por color. En tema oscuro, verificar cada par
  texto/fondo (incluido `--color-text-muted` sobre `--color-bg` y sobre `--color-surface`).

## Imágenes y media

- `alt` real y descriptivo en imágenes informativas; `alt=""` en decorativas.
- El logo tipográfico expone el nombre como texto real (no solo imagen).

## Movimiento

- Respetar `prefers-reduced-motion: reduce`: desactivar/menguar animaciones y parallax.
- Sin contenido que parpadee más de 3 veces por segundo.

## Formularios / enlaces

- El CTA de WhatsApp es un `<a href="wa.me/...">` con **nombre accesible explícito**
  ("Escribinos por WhatsApp") y `rel="noopener noreferrer"` si abre en pestaña nueva.
- Enlaces con texto significativo (no "hacé clic acá").

## Verificación

- Pasar axe DevTools / Lighthouse a11y (objetivo 100, sin violaciones críticas).
- Navegar toda la página solo con teclado.
- Probar con zoom 200% sin pérdida de contenido ni scroll horizontal.
