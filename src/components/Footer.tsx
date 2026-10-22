import { BODEGA } from '../config'
import { linkWhatsApp } from '../lib/whatsapp'
import { IconoFacebook, IconoInstagram, IconoWhatsApp } from './Iconos'
import { Ornamento } from './Ornamento'

const ANIO = new Date().getFullYear()

const claseRed = 'boton-icono rounded-full border border-dorado/40 text-crema/85 hover:border-dorado hover:text-dorado'

export function Footer() {
  const { desarrollador } = BODEGA
  return (
    <footer className="oscuro bg-negro text-crema">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center md:px-8">
        <img src="/logo-hoja.png" alt="" width={223} height={240} loading="lazy" className="mb-5 h-16 w-auto" />
        <p className="font-serif text-2xl font-semibold tracking-[0.22em] uppercase md:text-3xl">{BODEGA.nombre}</p>
        <p className="etiqueta mt-3 text-[11px] text-dorado">
          {BODEGA.localidad} · {BODEGA.provincia}
        </p>
        <Ornamento className="mt-8" />

        <ul className="mt-8 flex gap-3" aria-label="Redes sociales">
          {BODEGA.instagram && (
            <li>
              <a href={`https://www.instagram.com/${BODEGA.instagram}/`} target="_blank" rel="noopener noreferrer" className={claseRed} aria-label="Instagram">
                <IconoInstagram width={20} height={20} />
              </a>
            </li>
          )}
          {BODEGA.facebook && (
            <li>
              <a href={`https://www.facebook.com/${BODEGA.facebook}`} target="_blank" rel="noopener noreferrer" className={claseRed} aria-label="Facebook">
                <IconoFacebook width={20} height={20} />
              </a>
            </li>
          )}
          <li>
            <a href={linkWhatsApp(`¡Hola ${BODEGA.nombre}!`)} target="_blank" rel="noopener noreferrer" className={claseRed} aria-label="WhatsApp">
              <IconoWhatsApp width={20} height={20} />
            </a>
          </li>
        </ul>

        <p className="mt-10 max-w-md text-sm leading-relaxed text-crema/75">Beber con moderación. Prohibida su venta a menores de 18 años.</p>

        <div className="mt-10 flex w-full flex-col items-center gap-2 border-t border-crema/10 pt-6 text-xs text-crema/55 sm:flex-row sm:justify-between">
          <p>
            © {ANIO} {BODEGA.nombre}
          </p>
          {desarrollador.nombre && (
            <p>
              Sitio por{' '}
              {desarrollador.url ? (
                <a href={desarrollador.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-dorado">
                  {desarrollador.nombre}
                </a>
              ) : (
                desarrollador.nombre
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
