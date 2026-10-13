import { useEffect, useRef } from 'react'
import { useCarrito } from '../carrito/Carrito'
import { BOX_SIZE } from '../config'
import { plural } from '../lib/formato'
import type { Vino } from '../lib/tipos'
import { IconoMas, IconoMenos } from './Iconos'

/** Botón "Agregar caja x6" que, una vez en el pedido, se convierte en un selector de a una caja (6, 12, 18…). */
export function ControlCajas({ vino }: { vino: Vino }) {
  const { cajasDe, sumarCaja, restarCaja, avisar } = useCarrito()
  const cajas = cajasDe(vino.id)
  const enfocar = useRef<'mas' | 'agregar' | null>(null)
  const refMas = useRef<HTMLButtonElement>(null)
  const refAgregar = useRef<HTMLButtonElement>(null)

  // Al cambiar de "Agregar" al selector (o al revés) el botón apretado desaparece:
  // se pasa el foco al control equivalente para no perderlo al navegar con teclado.
  useEffect(() => {
    if (enfocar.current === 'mas') refMas.current?.focus()
    if (enfocar.current === 'agregar') refAgregar.current?.focus()
    enfocar.current = null
  }, [cajas])

  const agregar = () => {
    if (cajas === 0) enfocar.current = 'mas'
    sumarCaja(vino.id)
    avisar(`Agregaste una caja de ${vino.nombre}`)
  }

  const quitar = () => {
    if (cajas === 1) enfocar.current = 'agregar'
    restarCaja(vino.id)
  }

  if (cajas === 0) {
    return (
      <button ref={refAgregar} type="button" onClick={agregar} className="boton boton-primario w-full" aria-label={`Agregar caja de ${BOX_SIZE} de ${vino.nombre}`}>
        <IconoMas />
        Agregar caja x{BOX_SIZE}
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between border border-bordo" role="group" aria-label={`Cantidad de ${vino.nombre}`}>
      <button type="button" onClick={quitar} className="boton-icono size-12 text-bordo hover:bg-bordo/8" aria-label={`Quitar una caja de ${vino.nombre}`}>
        <IconoMenos />
      </button>
      <p className="text-center leading-tight" aria-live="polite">
        <span className="block font-semibold">{cajas * BOX_SIZE} botellas</span>
        <span className="text-xs text-texto/70">{plural(cajas, 'caja')}</span>
      </p>
      <button ref={refMas} type="button" onClick={agregar} className="boton-icono size-12 text-bordo hover:bg-bordo/8" aria-label={`Agregar otra caja de ${vino.nombre}`}>
        <IconoMas />
      </button>
    </div>
  )
}
