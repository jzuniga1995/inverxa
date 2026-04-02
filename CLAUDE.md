# Inversax

Sitio web de contenido financiero en español dirigido a lectores latinoamericanos.

## Stack
- Astro (SSR / SSG)
- Drizzle ORM
- Cloudflare Workers (`cron-worker.ts`, `.wrangler/`)
- Tailwind CSS

## Estructura clave
- `src/pages/` — rutas del sitio
- `src/components/` — componentes Astro/UI
- `src/db/` — esquemas y queries con Drizzle
- `src/lib/` — utilidades compartidas
- `src/layouts/` — layouts base
- `cron-acciones/` — tareas programadas
- `cron-social/` — publicación automática en redes

## Contexto editorial
- Artículos en español, enfoque financiero e inversiones
- Audiencia principal: Colombia y Latinoamérica
- CMS-ready: slug, meta description, HTML body, categorías, keywords

## Convenciones
- TypeScript estricto
- Estilos con Tailwind (pero en el rediseño editorial se usan inline styles para mayor precisión)
- Variables de entorno en `.env` (ver `env.d.ts` para tipos)

---

## Tema visual: editorial claro (Bloomberg-style) — COMPLETADO

Se migró TODO el sitio de un tema oscuro (`#0A0B0D` / `#111318`) a un tema editorial claro.
**NINGUNA página debe tener tokens del tema oscuro.**

### Paleta de diseño
| Token | Valor | Uso |
|---|---|---|
| Fondo principal | `#FAFAF8` | `min-h-screen` background |
| Tarjetas | `#fff` | Cards con `border:1px solid #E5E0D8` |
| Secciones SEO / info | `#F5F1EC` | Bloques de contenido secundario |
| Acento editorial | `#B91C1C` | Botones CTA, badges, hover de artículos |
| Texto principal | `#1C1917` | Títulos, body |
| Texto secundario | `#57534E` | Párrafos, descripciones |
| Texto tenue | `#78716C` | Labels, subtítulos |
| Texto muy tenue | `#A8A29E` / `#C7BFB5` | Timestamps, disclaimers |
| Borde estándar | `#E5E0D8` | Separadores, bordes de tarjeta |
| Borde hover | `#D6D0C8` | Hover de bordes |
| Fondo hover fila | `#F9F7F4` | Hover de tablas |
| Fondo badge warm | `#F0EDE7` | Badges / pills inactivos |

### Fuentes
- **Headings (H1/H2/H3):** `font-family:'Playfair Display',serif` — reemplaza `'Syne'`
- **Body / labels / botones:** `font-family:'DM Sans',sans-serif`

### Colores por tipo de activo
| Activo | Color |
|---|---|
| Cripto | `#1D4ED8` (azul) |
| Forex | `#15803D` (verde) |
| Metales | `#B45309` (ámbar) |
| Acciones | `#374151` (gris oscuro) |

### Tokens eliminados (NO volver a usar)
- `bg-[#0A0B0D]`, `bg-[#111318]`
- `text-white`, `text-white/XX`
- `border-white/[0.07]`, `bg-white/5`
- `font-family:'Syne'`

### Bloques especiales
```
Info block:     background:#F5F1EC; border-left:3px solid #E5E0D8
Warning block:  background:#FEF2F2; border-left:3px solid #B91C1C
Consejo/tip:    background:#F5F1EC; border-left:3px solid #B45309
Table header:   background:#F5F1EC; border-bottom:1px solid #E5E0D8
Skeleton pulse: background:#E5E0D8 (reemplaza bg-white/5)
```

### Páginas migradas (todas completadas)
- `src/pages/index.astro`
- `src/pages/404.astro`
- `src/pages/acerca.astro`
- `src/pages/contacto.astro`
- `src/pages/legal.astro`
- `src/pages/publicidad.astro`
- `src/pages/privacidad.astro`
- `src/pages/paises.astro`
- `src/pages/pais/[codigo].astro`
- `src/pages/autor/jose-zuniga.astro`
- `src/pages/noticias/index.astro` (si existía en sesión anterior)
- `src/pages/noticias/[slug].astro` — prose styles en `<style is:global>` también migrados
- `src/pages/herramientas/index.astro`
- `src/pages/herramientas/calculadora-cripto.astro`
- `src/pages/herramientas/calculadora-trading.astro`
- `src/pages/herramientas/comparar-brokers/index.astro`
- `src/pages/herramientas/acciones/index.astro`
- `src/pages/herramientas/acciones/[slug].astro`
- `src/pages/herramientas/cripto/index.astro`
- `src/pages/herramientas/cripto/[id].astro`
- `src/pages/herramientas/dolar/index.astro`
- `src/pages/herramientas/dolar/[codigo].astro`
- `src/pages/herramientas/forex/index.astro`
- `src/pages/herramientas/forex/[par].astro`
- `src/pages/herramientas/metales/index.astro`
- `src/pages/herramientas/metales/[metal].astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/Hero.astro`
- `src/layouts/Layout.astro`

### Componentes con dark permanente (intencional)
- Footer: fondo `#1C1917` (sección oscura deliberada)
- TradingView widgets: se mantienen en dark (es el widget externo, no se toca)

### Nota sobre JS inline templates
En páginas con `renderVariantes`, `renderDesktop`, `renderMobile` (dolar/[codigo], comparar-brokers):
los strings de innerHTML también fueron migrados a la paleta clara.

---

## Newsletter — COMPLETADO

### Flujo de base de datos
- El proyecto usa **`drizzle-kit push`** (`npm run db:push`), NO `drizzle-kit migrate`.
- `drizzle-kit generate` solo crea el SQL local en `drizzle/` — **no lo aplica**.
- Para crear tablas nuevas en Neon, ejecutar `npm run db:push` (interactivo) o aplicar el SQL directamente con el driver neon vía `node --env-file=.env --input-type=module`.

### Tabla `subscribers` (creada en Neon)
```ts
subscribers (
  id:         serial primary key,
  email:      text not null unique,
  pais:       text,
  created_at: timestamp default now(),
  active:     boolean default true
)
```

### Archivos involucrados
- `src/db/schema.ts` — tabla `subscribers` + tipo `Subscriber` añadidos
- `src/pages/api/newsletter.ts` — endpoint `POST /api/newsletter`
  - Valida formato email con regex
  - 409 si el email ya existe (`"Ya estás suscrito"`)
  - 400 si formato inválido, 200 con `{ success: true }` si OK
  - `prerender = false`
- `src/components/Footer.astro` — formulario conectado con JS client-side
  - Lee el país de `#country-select` (desktop) o `#country-select-mobile`; ignora "global"
  - Deshabilita botón durante el envío
  - Éxito: "¡Listo! Te avisamos cada día." (verde), limpia el campo
  - Error: mensaje en rojo según respuesta del API
  - Enter en el input también dispara el envío

### Notas
- El envío de emails lo maneja Make externamente — el endpoint solo guarda el registro.
- `drizzle/0000_bored_invaders.sql` existe en el repo pero es referencial; la tabla real se creó con `CREATE TABLE IF NOT EXISTS` directo a Neon.
