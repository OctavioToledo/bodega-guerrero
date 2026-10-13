/** Un vino del catálogo. Coincide con las columnas de la planilla de carga de la bodega. */
export interface Vino {
  id: string
  nombre: string
  linea: string
  varietal: string
  /** Año de cosecha. `null` para vinos sin añada. */
  anada: number | null
  /** En mililitros */
  volumen: number
  /** Precio por botella, en pesos */
  precio: number
  descripcion: string
  /** Ruta dentro de `public/` (ej. "/fotos/malbec-reserva.jpg"). `null` muestra una botella ilustrada. */
  foto: string | null
  destacado: boolean
  /** Si es `false`, el vino no aparece en el sitio. Si se omite, se considera disponible. */
  disponible?: boolean
}

export type TipoVino = 'tinto' | 'blanco' | 'rosado'
