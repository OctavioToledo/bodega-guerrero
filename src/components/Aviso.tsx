import { useCarrito } from '../carrito/Carrito'

/** Toast corto ("Agregaste una caja de Malbec Reserva"). La región viva existe siempre para que los lectores de pantalla la anuncien. */
export function Aviso() {
  const { aviso } = useCarrito()
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center px-4 md:top-24">
      {aviso && (
        <p key={aviso.id} className="fundido border border-dorado/50 bg-negro px-5 py-3 text-sm text-crema shadow-lg">
          {aviso.texto}
        </p>
      )}
    </div>
  )
}
