import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useCarrito } from '../carrito/Carrito'
import { BODEGA, BOX_DISCOUNT, BOX_SIZE } from '../config'
import { formatoPrecio, plural } from '../lib/formato'
import { armarMensaje, composicion, subtotalMixta, subtotalVino, type DatosCliente } from '../lib/pedido'
import { linkWhatsApp } from '../lib/whatsapp'
import { IconoCerrar, IconoMas, IconoMenos, IconoTacho, IconoWhatsApp } from './Iconos'

const VACIO: DatosCliente = { nombre: '', zona: '', comentarios: '' }

const FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Campo({ id, etiqueta, children }: { id: string; etiqueta: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta} <span className="font-normal text-texto/65">(opcional)</span>
      </label>
      {children}
    </div>
  )
}

function Subtitulo({ children }: { children: ReactNode }) {
  return <h3 className="etiqueta mb-3 text-[11px] text-bordo">{children}</h3>
}

export function DrawerPedido() {
  const carrito = useCarrito()
  const { porVino, mixtas, botellas, cajas, total, vacio, botellasArmado, abierto, cerrar } = carrito
  const panel = useRef<HTMLDivElement>(null)
  const botonCerrar = useRef<HTMLButtonElement>(null)
  const [datos, setDatos] = useState<DatosCliente>(VACIO)
  const [enviado, setEnviado] = useState(false)
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false)

  // Foco atrapado, cierre con Escape, scroll de fondo bloqueado y foco devuelto al cerrar.
  useEffect(() => {
    if (!abierto) return
    const previo = document.activeElement as HTMLElement | null
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    botonCerrar.current?.focus()

    const alTeclear = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        ev.preventDefault()
        cerrar()
        return
      }
      if (ev.key !== 'Tab' || !panel.current) return
      const focos = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLES)].filter((el) => el.offsetParent !== null)
      if (focos.length === 0) return
      const primero = focos[0]
      const ultimo = focos[focos.length - 1]
      if (ev.shiftKey && document.activeElement === primero) {
        ev.preventDefault()
        ultimo.focus()
      } else if (!ev.shiftKey && document.activeElement === ultimo) {
        ev.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = overflowPrevio
      setConfirmandoVaciar(false)
      // Si el botón que abrió el drawer ya no existe (la barra inferior se oculta), el foco vuelve al botón del header.
      const destino = previo?.isConnected && previo !== document.body ? previo : document.getElementById('boton-carrito')
      destino?.focus()
    }
  }, [abierto, cerrar])

  if (!abierto) return null

  const armadoIncompleto = botellasArmado > 0
  const motivoBloqueo = vacio
    ? `Agregá al menos una caja de ${BOX_SIZE} para enviar el pedido.`
    : armadoIncompleto
      ? 'Tenés una caja mixta sin terminar. Completala y agregala al pedido, o descartala, para poder enviarlo.'
      : null

  const cambiar = (campo: keyof DatosCliente, valor: string) => setDatos((d) => ({ ...d, [campo]: valor }))

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    if (motivoBloqueo) return
    const mensaje = armarMensaje(BODEGA.nombre, porVino, mixtas, datos)
    window.open(linkWhatsApp(mensaje), '_blank', 'noopener,noreferrer')
    setEnviado(true)
  }

  const vaciar = () => {
    carrito.vaciar()
    setEnviado(false)
    setConfirmandoVaciar(false)
    setDatos(VACIO)
    cerrar()
  }

  const confirmarVaciado = confirmandoVaciar ? (
    <div className="border border-bordo/40 bg-blanco p-4" role="alert">
      <p className="font-semibold">¿Vaciar todo el pedido?</p>
      <p className="mt-1 text-sm text-texto/75">Se van a quitar todas las cajas. Esta acción no se puede deshacer.</p>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={vaciar} className="boton boton-primario flex-1">
          Sí, vaciar
        </button>
        <button type="button" onClick={() => setConfirmandoVaciar(false)} className="boton boton-contorno flex-1">
          Cancelar
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end">
      <div className="fundido absolute inset-0 bg-negro/60" onClick={cerrar} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-titulo"
        className="panel-drawer relative flex max-h-[92dvh] w-full flex-col border-t border-dorado/50 bg-crema md:max-h-none md:w-[30rem] md:border-t-0 md:border-l"
      >
        <div className="oscuro flex items-center justify-between bg-negro px-5 py-3 text-crema">
          <h2 id="drawer-titulo" className="font-serif text-2xl">
            Tu pedido
          </h2>
          <button ref={botonCerrar} type="button" onClick={cerrar} className="boton-icono hover:bg-crema/10" aria-label="Cerrar pedido">
            <IconoCerrar />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
          {enviado ? (
            <div className="flex flex-col gap-4 py-4">
              <p className="font-serif text-2xl">¡Listo! Se abrió WhatsApp con tu pedido.</p>
              <p className="text-texto/80">Si ya lo enviaste, podés vaciar el pedido. Si volviste sin enviarlo, sigue acá tal como lo dejaste.</p>
              {confirmarVaciado ?? (
                <button type="button" onClick={() => setConfirmandoVaciar(true)} className="boton boton-primario">
                  Vaciar pedido
                </button>
              )}
              <button type="button" onClick={() => setEnviado(false)} className="boton boton-contorno">
                Volver al pedido
              </button>
            </div>
          ) : (
            <>
              {armadoIncompleto && (
                <div className="mb-6 border-l-2 border-bordo bg-blanco p-4">
                  <p className="font-semibold">
                    Caja mixta sin terminar ({botellasArmado} de {BOX_SIZE} botellas)
                  </p>
                  <p className="mt-1 text-sm text-texto/75">Para enviar el pedido, completala y agregala, o descartala.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href="#arma-tu-caja" onClick={cerrar} className="boton boton-primario min-h-11 px-4">
                      Completar caja
                    </a>
                    <button type="button" onClick={carrito.descartarArmado} className="boton boton-contorno min-h-11 px-4">
                      Descartar
                    </button>
                  </div>
                </div>
              )}

              {vacio ? (
                <div className="py-8 text-center">
                  <p className="font-serif text-2xl">Todavía no agregaste cajas.</p>
                  <p className="mt-2 text-texto/75">Elegí cajas de {BOX_SIZE} de un mismo vino o armá tu caja mixta.</p>
                  <div className="mt-6 flex flex-col gap-2">
                    <a href="#vinos" onClick={cerrar} className="boton boton-primario">
                      Ver vinos
                    </a>
                    {!armadoIncompleto && (
                      <a href="#arma-tu-caja" onClick={cerrar} className="boton boton-contorno">
                        Armá tu caja
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {porVino.length > 0 && (
                    <section aria-label="Cajas por vino">
                      <Subtitulo>Cajas por vino</Subtitulo>
                      <ul className="flex flex-col gap-3">
                        {porVino.map((l) => (
                          <li key={l.vino.id} className="border border-crema-oscuro bg-blanco p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-serif text-xl leading-tight">
                                  {l.vino.nombre} {l.vino.anada}
                                </p>
                                <p className="mt-0.5 text-sm text-texto/70">
                                  {l.vino.linea} · {l.vino.volumen} ml
                                </p>
                              </div>
                              <p className="font-semibold whitespace-nowrap">{formatoPrecio(subtotalVino(l))}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center border border-texto/25" role="group" aria-label={`Cantidad de ${l.vino.nombre}`}>
                                <button type="button" onClick={() => carrito.restarCaja(l.vino.id)} className="boton-icono hover:bg-crema" aria-label={`Quitar una caja de ${l.vino.nombre}`}>
                                  <IconoMenos />
                                </button>
                                <span className="min-w-28 text-center text-sm" aria-live="polite">
                                  {plural(l.cajas, 'caja')} · {l.cajas * BOX_SIZE} bot.
                                </span>
                                <button type="button" onClick={() => carrito.sumarCaja(l.vino.id)} className="boton-icono hover:bg-crema" aria-label={`Agregar otra caja de ${l.vino.nombre}`}>
                                  <IconoMas />
                                </button>
                              </div>
                              <button type="button" onClick={() => carrito.eliminarVino(l.vino.id)} className="boton-icono text-texto/70 hover:bg-bordo hover:text-blanco" aria-label={`Eliminar ${l.vino.nombre} del pedido`}>
                                <IconoTacho />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {mixtas.length > 0 && (
                    <section aria-label="Cajas mixtas" className={porVino.length > 0 ? 'mt-7' : ''}>
                      <Subtitulo>Cajas mixtas</Subtitulo>
                      <ul className="flex flex-col gap-3">
                        {mixtas.map((m, i) => (
                          <li key={m.id} className="flex items-start justify-between gap-3 border border-crema-oscuro bg-blanco p-4">
                            <div className="min-w-0">
                              <p className="font-serif text-xl leading-tight">Caja mixta {i + 1}</p>
                              <p className="mt-1 text-sm text-texto/75">{composicion(m.items)}</p>
                              <p className="mt-2 font-semibold">{formatoPrecio(subtotalMixta(m.items))}</p>
                            </div>
                            <button type="button" onClick={() => carrito.eliminarMixta(m.id)} className="boton-icono text-texto/70 hover:bg-bordo hover:text-blanco" aria-label={`Eliminar caja mixta ${i + 1}`}>
                              <IconoTacho />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <dl className="mt-7 border-t border-dorado/60 pt-5">
                    <div className="flex justify-between text-texto/80">
                      <dt>Botellas</dt>
                      <dd>{botellas}</dd>
                    </div>
                    <div className="mt-1 flex justify-between text-texto/80">
                      <dt>Cajas</dt>
                      <dd>{cajas}</dd>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between">
                      <dt className="etiqueta text-bordo">Total</dt>
                      <dd className="font-serif text-4xl font-semibold text-bordo">{formatoPrecio(total)}</dd>
                    </div>
                    {BOX_DISCOUNT > 0 && <p className="mt-1 text-right text-sm text-texto/70">Incluye {BOX_DISCOUNT}% de descuento por caja</p>}
                  </dl>
                  <p className="mt-3 text-sm text-texto/70">El pago y la entrega los coordinamos por WhatsApp.</p>
                </>
              )}

              {!vacio && (
                <form onSubmit={enviar} className="mt-8 flex flex-col gap-4">
                  <Campo id="nombre" etiqueta="Nombre">
                    <input id="nombre" type="text" autoComplete="name" value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} className="campo" />
                  </Campo>
                  <Campo id="zona" etiqueta="Localidad o zona de entrega">
                    <input
                      id="zona"
                      type="text"
                      autoComplete="address-level2"
                      value={datos.zona}
                      onChange={(e) => cambiar('zona', e.target.value)}
                      placeholder="Ej. Godoy Cruz, Mendoza"
                      className="campo"
                    />
                  </Campo>
                  <Campo id="comentarios" etiqueta="Comentarios">
                    <textarea id="comentarios" rows={2} value={datos.comentarios} onChange={(e) => cambiar('comentarios', e.target.value)} className="campo" />
                  </Campo>

                  <button type="submit" disabled={!!motivoBloqueo} aria-describedby={motivoBloqueo ? 'motivo-bloqueo' : undefined} className="boton boton-primario mt-2 py-4">
                    <IconoWhatsApp width={20} height={20} />
                    Enviar pedido por WhatsApp
                  </button>
                  {motivoBloqueo && (
                    <p id="motivo-bloqueo" className="text-sm font-medium text-bordo">
                      {motivoBloqueo}
                    </p>
                  )}
                </form>
              )}

              {!vacio && (
                <div className="mt-6 border-t border-crema-oscuro pt-4">
                  {confirmarVaciado ?? (
                    <button type="button" onClick={() => setConfirmandoVaciar(true)} className="min-h-11 text-sm text-texto/70 underline underline-offset-4 hover:text-bordo">
                      Vaciar pedido
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
