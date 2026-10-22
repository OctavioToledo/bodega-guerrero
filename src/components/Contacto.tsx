import type { ReactNode } from 'react'
import { BODEGA } from '../config'
import { linkWhatsApp } from '../lib/whatsapp'
import { Encabezado } from './Encabezado'
import { IconoCaja, IconoCopa, IconoFacebook, IconoInstagram, IconoMail, IconoPin, IconoReloj, IconoWhatsApp } from './Iconos'
import { Revelar } from './Revelar'

function Dato({ icono, titulo, children }: { icono: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-full border border-rosa bg-blanco text-bordo">{icono}</div>
      <div>
        <h3 className="etiqueta text-[11px] text-texto/70">{titulo}</h3>
        <div className="mt-1.5 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

const claseLink = 'underline decoration-dorado underline-offset-4 hover:text-bordo hover:decoration-bordo'

export function Contacto() {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-rosa-claro">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <Encabezado
          id="contacto-titulo"
          etiqueta="Contacto"
          titulo="Escribinos"
          bajada={`Coordinamos pedidos y envíos por WhatsApp. ${BODEGA.contacto ? `Te atiende ${BODEGA.contacto}, ` : ''}te respondemos a la brevedad.`}
        />

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <Revelar className="flex flex-col gap-8">
            <Dato icono={<IconoWhatsApp />} titulo="WhatsApp">
              <a href={linkWhatsApp(`¡Hola ${BODEGA.nombre}! Quería hacerles una consulta.`)} target="_blank" rel="noopener noreferrer" className={claseLink}>
                {BODEGA.whatsappVisible}
              </a>
            </Dato>
            <Dato icono={<IconoMail />} titulo="Email">
              <a href={`mailto:${BODEGA.email}`} className={`break-all ${claseLink}`}>
                {BODEGA.email}
              </a>
            </Dato>
            <Dato icono={<IconoReloj />} titulo="Horarios de atención">
              {BODEGA.horarios.map((h) => (
                <p key={h}>{h}</p>
              ))}
            </Dato>
            {(BODEGA.instagram || BODEGA.facebook) && (
              <div className="flex flex-wrap gap-3 pl-15">
                {BODEGA.instagram && (
                  <a href={`https://www.instagram.com/${BODEGA.instagram}/`} target="_blank" rel="noopener noreferrer" className="boton boton-contorno">
                    <IconoInstagram width={18} height={18} />
                    Instagram
                  </a>
                )}
                {BODEGA.facebook && (
                  <a href={`https://www.facebook.com/${BODEGA.facebook}`} target="_blank" rel="noopener noreferrer" className="boton boton-contorno">
                    <IconoFacebook width={18} height={18} />
                    Facebook
                  </a>
                )}
              </div>
            )}
          </Revelar>

          <Revelar retraso={150} className="flex flex-col gap-8">
            <Dato icono={<IconoCaja />} titulo="Envíos">
              <p>{BODEGA.envio}.</p>
              <p className="text-texto/75">Solo vendemos online, con envío a domicilio.</p>
            </Dato>
            <Dato icono={<IconoCopa />} titulo="Forma de pago">
              <p>{BODEGA.pago}.</p>
              <p className="text-texto/75">Te pasamos los datos al confirmar el pedido.</p>
            </Dato>
            <Dato icono={<IconoPin />} titulo="Dónde estamos">
              <p>
                {BODEGA.localidad}, {BODEGA.provincia}
              </p>
            </Dato>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
