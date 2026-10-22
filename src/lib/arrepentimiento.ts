/** Días corridos que tiene el cliente para arrepentirse de una compra a distancia (Ley 24.240, art. 34). */
export const DIAS_ARREPENTIMIENTO = 10

export interface SolicitudArrepentimiento {
  nombre: string
  telefono: string
  email: string
  /** Fecha en que recibió el pedido, "AAAA-MM-DD" (como la da un <input type="date">) */
  fechaEntrega: string
  productos: string
  motivo: string
}

// Sin 0/O, 1/I/L: el código se dicta o se copia a mano sin confundirse.
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/** Código de gestión que el cliente recibe en el momento: "ARR-20261022-4F7K". */
export function generarCodigo(fecha = new Date(), azar: () => number = Math.random): string {
  const dia = `${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}`
  const sufijo = Array.from({ length: 4 }, () => ALFABETO[Math.floor(azar() * ALFABETO.length)]).join('')
  return `ARR-${dia}-${sufijo}`
}

/** Días corridos desde la entrega hasta hoy. `null` si la fecha no es válida o es futura. */
export function diasDesde(fechaEntrega: string, hoy = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaEntrega)
  if (!m) return null
  const entrega = Date.UTC(+m[1], +m[2] - 1, +m[3])
  const dias = Math.floor((Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - entrega) / 86_400_000)
  return dias >= 0 ? dias : null
}

/** "2026-10-22" → "22/10/2026" */
function fechaLegible(fecha: string): string {
  const [a, m, d] = fecha.split('-')
  return d && m && a ? `${d}/${m}/${a}` : fecha
}

export function mensajeArrepentimiento(nombreBodega: string, codigo: string, s: SolicitudArrepentimiento): string {
  const lineas = [
    `¡Hola ${nombreBodega}! Quiero ejercer mi derecho de arrepentimiento sobre una compra (botón de arrepentimiento).`,
    '',
    `Código de gestión: ${codigo}`,
    `Nombre: ${s.nombre.trim()}`,
    `Teléfono: ${s.telefono.trim()}`,
  ]
  if (s.email.trim()) lineas.push(`Email: ${s.email.trim()}`)
  lineas.push(`Fecha de entrega del pedido: ${fechaLegible(s.fechaEntrega)}`, `Productos: ${s.productos.trim()}`)
  if (s.motivo.trim()) lineas.push(`Motivo: ${s.motivo.trim()}`)
  return lineas.join('\n')
}
