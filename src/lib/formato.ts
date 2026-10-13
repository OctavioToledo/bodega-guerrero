const moneda = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 })

/** 106800 → "$ 106.800" */
export function formatoPrecio(valor: number): string {
  return moneda.format(valor)
}

/** "1 caja" / "3 cajas" */
export function plural(n: number, singular: string, pluralTexto = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : pluralTexto}`
}
