# LoboHack 2024 — sitio web (Astro)

Landing y registro de la **primera edición** Lobo Hackathon BUAP (2024). Stack: **Astro** + API interna (Elysia) + PostgreSQL (Drizzle).

La plataforma open source actual (registro 2026, app operativa, API compartida) vive en el monorepo **Lobo hack 2** (`api-hack`, `aweb`, `hack-app`). Este repositorio es **histórico / referencia** de la edición 2024.

## Requisitos

- Node.js 22+
- pnpm 11 (`packageManager` en `package.json`)
- PostgreSQL (local o Docker)

## Desarrollo local

```bash
cp .env.example .env
# Edita SITE_URL y variables de base de datos si aplica

pnpm install
pnpm dev
```

Sitio: http://localhost:3000

## Docker

```bash
docker compose up --build
```

Ver `Dockerfile` y `docker-compose.yml`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `SITE_URL` | URL pública del sitio (ej. `http://localhost:3000`) |

No subas `.env` con secretos; solo `.env.example` va al repositorio.

## Publicar en GitHub

```bash
git remote set-url origin https://github.com/joseraulsoriano/lobohack2024-web.git
git branch -M main
git push -u origin main
```

## Licencia

[MIT](./LICENSE)
