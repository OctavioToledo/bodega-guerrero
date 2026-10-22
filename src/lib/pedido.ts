import { BOX_SIZE, MIX_STEP, PRECIO_CAJA } from '../config'
import { formatoPrecio, plural } from './formato'
import type { Vino } from './tipos'

/** Lo que se guarda en localStorage: solo ids y cantidades, el precio se lee siempre de la configuración. */
export interface CajaVino {
  vinoId: string
  cajas: number
}

export interface ItemMixta {
  vinoId: string
  botellas: number
}

export interface CajaMixta {
  id: string
  items: ItemMixta[]
}

export interface Pedido {
  porVino: CajaVino[]
  mixtas: CajaMixta[]
  /** La caja mixta que se está armando (todavía no está en el pedido) */
  armado: ItemMixta[]
}

export const PEDIDO_VACIO: Pedido = { porVino: [], mixtas: [], armado: [] }

/** Líneas ya resueltas contra el catálogo, listas para mostrar o para armar el mensaje. */
export interface LineaVino {
  vino: Vino
  cajas: number
}

export interface LineaMixta {
  id: string
  items: { vino: Vino; botellas: number }[]
}

export interface DatosCliente {
  nombre: string
  zona: string
  comentarios: string
}

export function botellasDe(items: ItemMixta[]): number {
  return items.reduce((s, i) => s + i.botellas, 0)
}

/** Todas las cajas valen lo mismo, sea de un mismo vino o mixta. */
export function subtotalVino(linea: Pick<LineaVino, 'cajas'>, precio = PRECIO_CAJA): number {
  return precio * linea.cajas
}

export function totales(porVino: LineaVino[], mixtas: LineaMixta[], precio = PRECIO_CAJA) {
  const cajas = porVino.reduce((s, l) => s + l.cajas, 0) + mixtas.length
  return { cajas, botellas: cajas * BOX_SIZE, total: cajas * precio }
}

/* ---------- Caja mixta en armado ---------- */

/** Suma `paso` botellas de un vino, si entran en la caja. */
export function sumarAlArmado(armado: ItemMixta[], vinoId: string, paso = MIX_STEP): ItemMixta[] {
  if (botellasDe(armado) + paso > BOX_SIZE) return armado
  return armado.some((i) => i.vinoId === vinoId)
    ? armado.map((i) => (i.vinoId === vinoId ? { ...i, botellas: i.botellas + paso } : i))
    : [...armado, { vinoId, botellas: paso }]
}

export function restarDelArmado(armado: ItemMixta[], vinoId: string, paso = MIX_STEP): ItemMixta[] {
  return armado.map((i) => (i.vinoId === vinoId ? { ...i, botellas: i.botellas - paso } : i)).filter((i) => i.botellas > 0)
}

export function cajaCompleta(items: ItemMixta[]): boolean {
  return botellasDe(items) === BOX_SIZE
}

/**
 * Vinos para completar la caja en un clic: primero los destacados, después el mismo tipo de vino que ya eligió.
 * No repite los que ya están en la caja.
 */
export function sugerencias(armado: ItemMixta[], catalogo: Vino[], tipoDe: (v: Vino) => string, cantidad = 3): Vino[] {
  if (armado.length === 0 || botellasDe(armado) >= BOX_SIZE) return []
  const elegidos = new Set(armado.map((i) => i.vinoId))
  const tipos = new Set(catalogo.filter((v) => elegidos.has(v.id)).map(tipoDe))
  const puntaje = (v: Vino) => (v.destacado ? 2 : 0) + (tipos.has(tipoDe(v)) ? 1 : 0)
  return catalogo
    .filter((v) => !elegidos.has(v.id))
    .map((v, orden) => ({ v, orden }))
    .sort((a, b) => puntaje(b.v) - puntaje(a.v) || a.orden - b.orden)
    .slice(0, cantidad)
    .map(({ v }) => v)
}

/* ---------- Persistencia ---------- */

const esCantidad = (n: unknown, paso: number): n is number => Number.isInteger(n) && (n as number) > 0 && (n as number) % paso === 0

function sanearItems(crudo: unknown, existe: (id: string) => boolean, paso: number): ItemMixta[] {
  if (!Array.isArray(crudo)) return []
  return crudo.filter((i): i is ItemMixta => typeof i?.vinoId === 'string' && existe(i.vinoId) && esCantidad(i.botellas, paso))
}

/**
 * Valida lo leído de localStorage. Descarta vinos que ya no están en el catálogo y cajas que no
 * cumplen las reglas actuales (por si cambiaron BOX_SIZE o MIX_STEP desde la última visita).
 */
export function sanearPedido(crudo: unknown, existe: (id: string) => boolean, paso = MIX_STEP): Pedido {
  if (typeof crudo !== 'object' || crudo === null) return PEDIDO_VACIO
  const c = crudo as Record<string, unknown>

  const porVino = Array.isArray(c.porVino)
    ? c.porVino.filter((i): i is CajaVino => typeof i?.vinoId === 'string' && existe(i.vinoId) && esCantidad(i.cajas, 1))
    : []

  const mixtas = Array.isArray(c.mixtas)
    ? c.mixtas.flatMap((m) => {
        const items = sanearItems(m?.items, existe, paso)
        return typeof m?.id === 'string' && cajaCompleta(items) ? [{ id: m.id, items }] : []
      })
    : []

  const armado = sanearItems(c.armado, existe, paso)
  return { porVino, mixtas, armado: botellasDe(armado) <= BOX_SIZE ? armado : [] }
}

/* ---------- Mensaje de WhatsApp ---------- */

function nombreCompleto(vino: Vino): string {
  return `${vino.nombre}${vino.anada ? ` ${vino.anada}` : ''} (${vino.volumen} ml)`
}

export function composicion(items: LineaMixta['items']): string {
  return items.map((i) => `${i.botellas} ${i.vino.nombre}`).join(' + ')
}

export function armarMensaje(
  nombreBodega: string,
  porVino: LineaVino[],
  mixtas: LineaMixta[],
  datos: DatosCliente,
  precio = PRECIO_CAJA,
): string {
  const out: string[] = [`¡Hola ${nombreBodega}! Quiero hacer el siguiente pedido:`]

  if (porVino.length > 0) {
    out.push('', '🍷 CAJAS POR VINO')
    for (const l of porVino) {
      out.push(`- ${nombreCompleto(l.vino)} — ${plural(l.cajas, 'caja')} x${BOX_SIZE} — ${formatoPrecio(subtotalVino(l, precio))}`)
    }
  }

  if (mixtas.length > 0) {
    out.push('', '📦 CAJAS MIXTAS')
    mixtas.forEach((m, i) => {
      out.push(`- Caja mixta ${i + 1}: ${composicion(m.items)} — ${formatoPrecio(precio)}`)
    })
  }

  const t = totales(porVino, mixtas, precio)
  out.push('', `Total: ${t.botellas} botellas (${plural(t.cajas, 'caja')})`, `TOTAL: ${formatoPrecio(t.total)} (envío incluido)`)

  const extras = [
    ['Nombre', datos.nombre],
    ['Zona de entrega', datos.zona],
    ['Comentarios', datos.comentarios],
  ].filter(([, v]) => v.trim())
  if (extras.length > 0) {
    out.push('')
    for (const [campo, valor] of extras) out.push(`${campo}: ${valor.trim()}`)
  }

  return out.join('\n')
}
