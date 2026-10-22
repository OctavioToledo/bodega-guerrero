import type { ReactNode } from 'react'
import { BODEGA, LEGAL } from '../config'
import { Footer } from '../components/Footer'
import { Ornamento } from '../components/Ornamento'
import { PAGINAS_LEGALES } from './datos'

/** Estructura común de las páginas legales: header simple, título, contenido y footer del sitio. */
export function PaginaLegal({ titulo, actualizacion = true, children }: { titulo: string; actualizacion?: boolean; children: ReactNode }) {
  const actual = typeof window !== 'undefined' ? window.location.pathname : ''
  return (
    <>
      <header className="oscuro border-b border-dorado/25 bg-negro text-crema">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[72px] md:px-8">
          <a href="/" className="flex items-center gap-2.5 font-serif text-xl leading-none font-semibold tracking-[0.2em] uppercase md:text-2xl">
            <img src="/logo-hoja.png" alt="" width={223} height={240} className="h-8 w-auto md:h-9" />
            {BODEGA.nombre}
          </a>
          <a href="/" className="etiqueta inline-flex min-h-11 items-center text-[11px] text-crema/85 hover:text-dorado">
            Volver al sitio
          </a>
        </div>
      </header>

      <main className="bg-crema">
        <article className="mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20">
          <p className="etiqueta text-bordo">Información legal</p>
          <h1 className="mt-4 text-titulo-sm leading-tight md:text-titulo">{titulo}</h1>
          {actualizacion && <p className="mt-3 text-sm text-texto/65">Última actualización: {LEGAL.actualizacion}</p>}
          <Ornamento className="mt-6 justify-start" />
          <div className="texto-legal mt-8">{children}</div>

          <nav aria-label="Información legal" className="mt-14 border-t border-crema-oscuro pt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {PAGINAS_LEGALES.filter((p) => p.href !== actual).map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="inline-flex min-h-11 items-center text-bordo underline decoration-dorado underline-offset-4 hover:decoration-bordo">
                    {p.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  )
}
