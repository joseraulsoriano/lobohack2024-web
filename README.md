# LoboHack 2024 — sitio web (solo front)

Landing de la **primera edición** Lobo Hackathon BUAP (2024). **Astro estático** — sin API ni base de datos en este despliegue.

| Despliegue | Qué incluye |
|------------|-------------|
| **Este repo (Vercel)** | Página informativa: speakers, agenda, patrocinadores, FAQs |
| **Monorepo 2026** (`aweb`, `api-hack`, `hack-app`) | Registro, admin y operación en sede |

## Requisitos

- Node.js 22+
- pnpm 11

## Desarrollo local

```bash
cp .env.example .env
pnpm install
pnpm dev
```

http://localhost:3000

## Build estático

```bash
pnpm run build
pnpm run preview
```

Salida: carpeta `dist/` (HTML/CSS/JS).

## Vercel

1. Conecta el repo `lobohack2024-web`.
2. Framework: **Astro** (o usa `vercel.json` incluido).
3. Variables opcionales:
   - `SITE_URL` — `https://tu-dominio.vercel.app` (si no, se usa `VERCEL_URL`).
   - `PUBLIC_REGISTRATION_URL` — enlace externo al registro actual (ej. tu `aweb` en producción).

No configures base de datos ni secrets de OAuth en Vercel para este proyecto.

## Backend archivado

El código SSR/API de la edición 2024 está en [`_archive/server-pages/`](./_archive/server-pages/) por si quieres consultarlo localmente con Docker; **no** forma parte del deploy en Vercel.

## Licencia

[MIT](./LICENSE)
