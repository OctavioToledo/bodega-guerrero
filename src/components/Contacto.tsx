import type { ReactNode } from 'react'
import { BODEGA } from '../config'
import { linkWhatsApp } from '../lib/whatsapp'
import { Encabezado } from './Encabezado'
import { IconoFacebook, IconoInstagram, IconoMail, IconoPin, IconoReloj, IconoWhatsApp } from './Iconos'
import { Revelar } from './Revelar'

const { lat, lng } = BODEGA.coordenadas
const ubicacion = `${lat},${lng}`

function Dato({ icono, titulo, children }: { icono: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-full border border-dorado text-bordo">{icono}</div>
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
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-crema">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <Encabezado id="contacto-titulo" etiqueta="Contacto" titulo="Visitanos o escribinos" bajada="Coordinamos pedidos, envíos y visitas por WhatsApp. Te respondemos a la brevedad." />

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <Revelar className="flex flex-col gap-8">
            <Dato icono={<IconoPin />} titulo="Dirección">
              <p>{BODEGA.direccion}</p>
              <p>
                {BODEGA.localidad}, {BODEGA.provincia}
              </p>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${ubicacion}`} target="_blank" rel="noopener noreferrer" className={`mt-1 inline-block ${claseLink}`}>
                Cómo llegar
              </a>
            </Dato>
            <Dato icono={<IconoReloj />} titulo="Horarios">
              {BODEGA.horarios.map((h) => (
                <p key={h}>{h}</p>
              ))}
            </Dato>
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

          <Revelar retraso={150}>
            <iframe
              title={`Mapa: ${BODEGA.direccion}, ${BODEGA.localidad}`}
              src={`https://www.google.com/maps?q=${ubicacion}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-square w-full border border-dorado/50 grayscale-[35%] md:aspect-auto md:h-full md:min-h-[28rem]"
            />
          </Revelar>
        </div>
      </div>
    </section>
  )
}
