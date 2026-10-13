import vinosJson from '../data/vinos.json'
import type { TipoVino, Vino } from './tipos'

export const vinos = (vinosJson as Vino[]).filter((v) => v.disponible !== false)

const porId = new Map(vinos.map((v) => [v.id, v]))

export function buscarVino(id: string): Vino | undefined {
  return porId.get(id)
}

const precioMinimo = (linea: string) => Math.min(...vinos.filter((v) => v.linea === linea).map((v) => v.precio))

/** Líneas de la gama de entrada a la más alta (según el vino más económico de cada una). */
export const lineas = [...new Set(vinos.map((v) => v.linea))].sort((a, b) => precioMinimo(a) - precioMinimo(b))

/** Tinto, blanco o rosado, deducido del varietal (no hace falta cargarlo en la planilla). */
export function tipoDe(vino: Pick<Vino, 'varietal' | 'nombre'>): TipoVino {
  const texto = `${vino.varietal} ${vino.nombre}`.toLowerCase()
  if (/rosado|ros[eé]\b/.test(texto)) return 'rosado'
  if (/chardonnay|torront[eé]s|sauvignon blanc|viognier|semill[oó]n|chenin|riesling|pinot gris|blanco/.test(texto)) return 'blanco'
  return 'tinto'
}

export const TIPOS: { id: TipoVino; nombre: string }[] = [
  { id: 'tinto', nombre: 'Tintos' },
  { id: 'blanco', nombre: 'Blancos' },
  { id: 'rosado', nombre: 'Rosados' },
]
