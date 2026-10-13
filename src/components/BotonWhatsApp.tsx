import { useCarrito } from '../carrito/Carrito'
import { BODEGA } from '../config'
import { linkWhatsApp } from '../lib/whatsapp'
import { IconoWhatsApp } from './Iconos'

/** Botón flotante para consultas generales (sin pedido). En mobile sube cuando aparece la barra del pedido. */
export function BotonWhatsApp() {
  const { vacio, abierto } = useCarrito()
  if (abierto) return null
  return (
    <a
      href={linkWhatsApp(`¡Hola ${BODEGA.nombre}! Quería hacerles una consulta.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultanos por WhatsApp"
      className={`fixed right-4 z-20 grid size-14 place-items-center rounded-full border border-dorado/60 bg-bordo text-blanco shadow-[0_10px_30px_-10px_rgb(20_17_15/0.6)] transition-[background-color,bottom] hover:bg-bordo-claro md:right-6 md:bottom-6 ${
        vacio ? 'bottom-4' : 'bottom-24'
      }`}
    >
      <IconoWhatsApp width={28} height={28} />
    </a>
  )
}
