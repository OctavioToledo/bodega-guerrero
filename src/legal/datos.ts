import { BODEGA, LEGAL } from '../config'

export const PAGINAS_LEGALES = [
  { href: '/terminos/', texto: 'Términos y condiciones' },
  { href: '/privacidad/', texto: 'Política de privacidad' },
  { href: '/arrepentimiento/', texto: 'Botón de arrepentimiento' },
]

/** "Bodega Guerrero (Juan Pérez, CUIT 20-…)" según los datos que haya. */
export function identificacionTitular(): string {
  const detalle = [LEGAL.titular && LEGAL.titular !== BODEGA.nombre && LEGAL.titular, LEGAL.cuit && `CUIT ${LEGAL.cuit}`].filter(Boolean).join(', ')
  return detalle ? `${BODEGA.nombre} (${detalle})` : BODEGA.nombre
}

export const domicilio = LEGAL.domicilio || `${BODEGA.localidad}, ${BODEGA.provincia}`
