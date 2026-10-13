import { useCarrito } from '../carrito/Carrito'
import { formatoPrecio } from '../lib/formato'
import { IconoFlecha } from './Iconos'

/** Barra fija inferior en mobile cuando hay cajas en el pedido. */
export function BarraPedido() {
  const { vacio, botellas, total, abrir, abierto } = useCarrito()
  if (vacio || abierto) return null

  return (
    <div className="oscuro fundido fixed inset-x-0 bottom-0 z-20 border-t border-dorado/40 bg-negro px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-crema md:hidden">
      <button type="button" onClick={abrir} className="flex min-h-12 w-full items-center justify-between gap-3 text-left">
        <span>
          <span className="font-semibold">{botellas} botellas</span>
          <span className="text-crema/60"> · </span>
          <span className="text-dorado">{formatoPrecio(total)}</span>
        </span>
        <span className="etiqueta inline-flex items-center gap-2 bg-bordo px-4 py-3 text-[11px] text-blanco">
          Ver pedido
          <IconoFlecha width={16} height={16} />
        </span>
      </button>
    </div>
  )
}
