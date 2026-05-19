import node from '@astrojs/node'
import React from '@astrojs/react'
import Sitemap from '@astrojs/sitemap'
import Vue from '@astrojs/vue'
import AstroFontPicker from 'astro-font-picker'
import Icon from 'astro-icon'
import { defineConfig } from 'astro/config'
import AuthAstro from 'auth-astro'
import UnoCSS from 'unocss/astro'
import { loadEnv } from 'vite'

const { PORT: PROCESS_PORT, HOST: PROCESS_HOST } = process.env
const { PORT: LOADED_PORT, HOST: LOADED_HOST } = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  ''
)

/** Normaliza host a URL absoluta con protocolo (Astro `site`). */
function toAbsoluteSiteUrl(raw: string | undefined): string | undefined {
  const v = raw?.trim()
  if (!v) return undefined
  if (/^https?:\/\//i.test(v)) return v.replace(/\/$/, '')
  return `https://${v.replace(/\/$/, '')}`
}

/**
 * Orden: SITE_URL explícita → dominio de producción Vercel → preview VERCEL_URL → .env local.
 * En Vercel no hay `.env` en el build; define SITE_URL en el dashboard o usa VERCEL_*.
 */
function resolveSiteUrl(): string | undefined {
  const fromEnv = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '').SITE_URL
  const explicit = toAbsoluteSiteUrl(
    process.env.SITE_URL || fromEnv || process.env.PUBLIC_SITE_URL
  )
  if (explicit) return explicit

  const vercelProd = toAbsoluteSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  if (vercelProd) return vercelProd

  const vercelPreview = toAbsoluteSiteUrl(process.env.VERCEL_URL)
  if (vercelPreview) return vercelPreview

  return undefined
}

const SITE_URL = resolveSiteUrl()
const PORT = PROCESS_PORT || LOADED_PORT || '3000'
const HOST = PROCESS_HOST || LOADED_HOST || 'localhost'

if (process.env.NODE_ENV === 'production' && !SITE_URL) {
  throw new Error(
    'SITE_URL is required. Set SITE_URL in Vercel Environment Variables, or rely on VERCEL_URL during build.'
  )
}

console.log('\x1b[34m%s\x1b[0m', `Astro's SITE_URL: ${SITE_URL}`)

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: parseInt(PORT),
    host: HOST,
  },
  site: SITE_URL,
  integrations: [
    UnoCSS({
      injectReset: true,
    }),
    // Font Picker for Astro's dev toolbar
    AstroFontPicker(),
    Sitemap(),
    // https://github.com/natemoo-re/astro-icon
    Icon(),

    // React integration
    React(),

    // Vue integration
    Vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    AuthAstro(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ['elysia', 'elysia-http-error', '@elysiajs/eden', 'fsevents'],
    },
    ssr: {
      external: ['elysia', '@elysiajs/eden'],
      noExternal: ['elysia-http-error'],
    },
  },
})
