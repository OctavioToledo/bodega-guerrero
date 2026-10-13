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
      const { lat, lng } = BODEGA.coordenadas
      const datos = {
        '@context': 'https://schema.org',
        '@type': 'Winery',
        name: BODEGA.nombre,
        ...(sitio && { url: sitio, image: `${sitio}/og.jpg` }),
        telephone: `+${WHATSAPP_NUMBER}`,
        email: BODEGA.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: BODEGA.direccion,
          addressLocality: BODEGA.localidad,
          addressRegion: BODEGA.provincia,
          addressCountry: 'AR',
        },
        geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng },
        hasMap: `https://www.google.com/maps?q=${lat},${lng}`,
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
  // Si no se cargó VITE_SITE_URL, en Vercel se usa el dominio de producción que Vercel expone en el build.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const sitio = (loadEnv(mode, process.cwd()).VITE_SITE_URL || (vercel ? `https://${vercel}` : '')).replace(/\/$/, '')
  return {
    plugins: [react(), tailwindcss(), seoBodega(sitio)],
    test: {
      environment: 'node',
    },
  }
})
