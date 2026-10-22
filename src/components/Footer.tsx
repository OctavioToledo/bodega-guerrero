import { BODEGA, LEGAL } from '../config'
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

        <nav aria-label="Información legal" className="mt-8 flex flex-col items-center gap-3">
          {/* Botón de arrepentimiento: visible desde la página de inicio, sin registro (Disposición 954/2025) */}
          <a href="/arrepentimiento/" className="boton boton-dorado min-h-11 px-5 text-[11px]">
            Botón de arrepentimiento
          </a>
          <ul className="flex flex-wrap justify-center gap-x-5 text-sm text-crema/75">
            <li>
              <a href="/terminos/" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-dorado hover:underline">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href="/privacidad/" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-dorado hover:underline">
                Política de privacidad
              </a>
            </li>
          </ul>
        </nav>

        {LEGAL.dataFiscal.enlace && (
          <a href={LEGAL.dataFiscal.enlace} target="_F960AFIPInfo" rel="noopener" className="mt-6 inline-block bg-blanco p-1" aria-label="Data Fiscal de ARCA">
            <img src={LEGAL.dataFiscal.imagen} alt="Data Fiscal" width={60} height={80} loading="lazy" className="h-20 w-auto" />
          </a>
        )}

        <div className="mt-10 flex w-full flex-col items-center gap-2 border-t border-crema/10 pt-6 text-xs text-crema/55 sm:flex-row sm:justify-between">
          <p>
            © {ANIO} {BODEGA.nombre}
            {LEGAL.titular && LEGAL.titular !== BODEGA.nombre && ` · ${LEGAL.titular}`}
            {LEGAL.cuit && ` · CUIT ${LEGAL.cuit}`}
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
