import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig, type Plugin } from 'vitest/config'
import { BODEGA, WHATSAPP_NUMBER } from './src/config.ts'

/**
 * Genera el JSON-LD de schema.org a partir de src/config.ts (así los datos viven en un solo lugar)
 * y completa la URL absoluta de la imagen de Open Graph con VITE_SITE_URL.
 */
function seoBodega(sitio: string): Plugin {
  return {
    name: 'bodega-seo',
    transformIndexHtml(html) {
      const datos = {
        '@context': 'https://schema.org',
        '@type': 'Winery',
        name: BODEGA.nombre,
        ...(sitio && { url: sitio, image: `${sitio}/og.jpg` }),
        telephone: `+${WHATSAPP_NUMBER}`,
        email: BODEGA.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: BODEGA.localidad,
          addressRegion: BODEGA.provincia,
          addressCountry: 'AR',
        },
        sameAs: [
          BODEGA.instagram && `https://www.instagram.com/${BODEGA.instagram}/`,
          BODEGA.facebook && `https://www.facebook.com/${BODEGA.facebook}`,
        ].filter(Boolean),
      }
      const script = `<script type="application/ld+json">${JSON.stringify(datos)}</script>`
      return html.replaceAll('__SITE_URL__', sitio).replace('</head>', `    ${script}\n  </head>`)
    },
  }
}

export default defineConfig(({ mode }) => {
  // Si no se cargó VITE_SITE_URL, se usa la URL que expone la plataforma en el build:
  // en Vercel el dominio de producción; en Cloudflare Pages la URL de ese deploy (funciona, pero conviene cargar VITE_SITE_URL).
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const sitio = (loadEnv(mode, process.cwd()).VITE_SITE_URL || (vercel ? `https://${vercel}` : process.env.CF_PAGES_URL) || '').replace(/\/$/, '')
  return {
    plugins: [react(), tailwindcss(), seoBodega(sitio)],
    test: {
      environment: 'node',
    },
  }
})
