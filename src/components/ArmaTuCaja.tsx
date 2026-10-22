import { useCarrito } from '../carrito/Carrito'
import { BOX_SIZE, MIX_STEP, PRECIO_CAJA } from '../config'
import { tipoDe, vinos } from '../lib/datos'
import { formatoPrecio, plural } from '../lib/formato'
import { sugerencias } from '../lib/pedido'
import { SiluetaBotella } from './FotoVino'
import { Encabezado } from './Encabezado'
import { IconoMas, IconoMenos } from './Iconos'
import { Revelar } from './Revelar'

const COLOR_TIPO = { tinto: 'bg-vino-tinto', blanco: 'bg-vino-blanco', rosado: 'bg-vino-rosado' } as const

const comoElegir = MIX_STEP === 1 ? 'elegí las botellas que quieras, de los vinos que quieras' : `elegí de a ${MIX_STEP} botellas de cada vino`

export function ArmaTuCaja() {
  const { armado, botellasArmado, botellasEnArmado, sumarAlArmado, restarDelArmado, descartarArmado, confirmarArmado, mixtas, avisar } = useCarrito()
  const faltan = BOX_SIZE - botellasArmado
  const completa = faltan === 0
  const lugar = faltan >= MIX_STEP
  // Una entrada por botella, en el orden en que se eligieron, para llenar los casilleros.
  const casilleros = armado.flatMap((i) => Array.from({ length: i.botellas }, () => i.vino))
  const sugeridos = sugerencias(
    armado.map((i) => ({ vinoId: i.vino.id, botellas: i.botellas })),
    vinos,
    tipoDe,
  )

  const confirmar = () => {
    confirmarArmado()
    avisar(`Caja mixta ${mixtas.length + 1} agregada al pedido`)
  }

  return (
    <section id="arma-tu-caja" aria-labelledby="arma-titulo" className="oscuro bg-azul text-crema">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <Encabezado
          oscuro
          id="arma-titulo"
          etiqueta="Caja mixta"
          titulo="Armá tu caja"
          bajada={`Combiná vinos distintos en una caja de ${BOX_SIZE} botellas: ${comoElegir}. Cualquier combinación sale ${formatoPrecio(PRECIO_CAJA)}, con envío incluido.`}
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-start lg:gap-14">
          {/* Lista de vinos */}
          <Revelar as="ul" className="divide-y divide-crema/10 border-y border-crema/10">
            {vinos.map((v) => {
              const enCaja = botellasEnArmado(v.id)
              return (
                <li key={v.id} className="flex items-center gap-4 py-4">
                  <span className={`size-3 shrink-0 rotate-45 ${COLOR_TIPO[tipoDe(v)]}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xl leading-tight">
                      {v.nombre}
                      {v.anada && <span className="text-crema/60"> {v.anada}</span>}
                    </p>
                    <p className="mt-0.5 text-sm text-crema/65">
                      {v.linea} · {v.varietal}
                    </p>
                  </div>
                  {enCaja === 0 ? (
                    <button
                      type="button"
                      onClick={() => sumarAlArmado(v.id)}
                      disabled={!lugar}
                      className="boton boton-dorado min-h-11 shrink-0 px-4 tracking-[0.08em]"
                      aria-label={`Sumar ${MIX_STEP} de ${v.nombre} a la caja`}
                    >
                      <IconoMas width={16} height={16} />
                      {MIX_STEP}
                    </button>
                  ) : (
                    <div className="flex shrink-0 items-center border border-dorado" role="group" aria-label={`${v.nombre} en la caja`}>
                      <button type="button" onClick={() => restarDelArmado(v.id)} className="boton-icono hover:bg-dorado/15" aria-label={`Quitar ${MIX_STEP} de ${v.nombre}`}>
                        <IconoMenos />
                      </button>
                      <span className="min-w-7 text-center font-semibold" aria-live="polite">
                        {enCaja}
                      </span>
                      <button type="button" onClick={() => sumarAlArmado(v.id)} disabled={!lugar} className="boton-icono hover:bg-dorado/15" aria-label={`Sumar ${MIX_STEP} más de ${v.nombre}`}>
                        <IconoMas />
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </Revelar>

          {/* La caja */}
          <Revelar retraso={150} className="border border-dorado/40 bg-azul-suave p-6 md:p-8 lg:sticky lg:top-28">
            <div className="flex items-baseline justify-between">
              <h3 className="font-serif text-2xl">Tu caja mixta</h3>
              <p className="etiqueta text-dorado">
                {botellasArmado}/{BOX_SIZE}
              </p>
            </div>

            <ol className="mt-6 grid grid-cols-3 gap-2.5" aria-label="Casilleros de la caja">
              {Array.from({ length: BOX_SIZE }, (_, i) => {
                const v = casilleros[i]
                return (
                  <li
                    key={v ? `${i}-${v.id}` : i}
                    className={`flex aspect-[3/4] flex-col items-center justify-center gap-2 border p-2 text-center ${
                      v ? 'llenar border-dorado/50 bg-crema/5' : 'border-dashed border-crema/20'
                    }`}
                  >
                    {v ? (
                      <>
                        <SiluetaBotella tipo={tipoDe(v)} className="h-[58%]" />
                        <span className="line-clamp-2 text-[11px] leading-tight text-crema/85">{v.nombre}</span>
                      </>
                    ) : (
                      <span className="font-serif text-xl text-crema/30">
                        {i + 1}
                        <span className="sr-only"> vacío</span>
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>

            <div
              className="mt-6 h-1 overflow-hidden bg-crema/10"
              role="progressbar"
              aria-label="Botellas en la caja"
              aria-valuemin={0}
              aria-valuemax={BOX_SIZE}
              aria-valuenow={botellasArmado}
            >
              <div className="h-full bg-dorado transition-[width] duration-500 ease-(--ease-suave)" style={{ width: `${(botellasArmado / BOX_SIZE) * 100}%` }} />
            </div>
            <p className="mt-3 text-sm text-crema/80" aria-live="polite">
              {botellasArmado === 0
                ? 'Elegí vinos de la lista para empezar.'
                : completa
                  ? '¡Tu caja está completa!'
                  : `Te ${faltan === 1 ? 'falta 1 botella' : `faltan ${faltan} botellas`} para completar tu caja.`}
            </p>

            {sugeridos.length > 0 && (
              <div className="mt-6 border-t border-crema/10 pt-5">
                <p className="etiqueta text-[11px] text-dorado">{MIX_STEP === 1 ? 'Sumá una de…' : `Completá con x${MIX_STEP} de…`}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {sugeridos.map((v) => (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => sumarAlArmado(v.id)}
                        className="flex min-h-11 w-full items-center justify-between gap-3 border border-crema/15 px-3 py-2 text-left transition-colors hover:border-dorado"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`size-2 rotate-45 ${COLOR_TIPO[tipoDe(v)]}`} aria-hidden />
                          {v.nombre}
                        </span>
                        <span className="shrink-0 text-sm text-dorado">+{MIX_STEP}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-baseline justify-between border-t border-crema/10 pt-5">
              <span className="text-crema/80">
                Precio de la caja
                <span className="block text-xs text-crema/60">Envío incluido</span>
              </span>
              <span className="font-serif text-3xl text-dorado">{formatoPrecio(PRECIO_CAJA)}</span>
            </div>

            <button type="button" onClick={confirmar} disabled={!completa} className="boton boton-primario mt-6 w-full" aria-describedby="ayuda-caja">
              Agregar caja al pedido
            </button>
            <p id="ayuda-caja" className="sr-only">
              {completa ? '' : `Se habilita cuando la caja tiene ${BOX_SIZE} botellas.`}
            </p>
            {botellasArmado > 0 && (
              <button type="button" onClick={descartarArmado} className="mt-2 min-h-11 w-full text-sm text-crema/70 underline underline-offset-4 hover:text-crema">
                Vaciar caja
              </button>
            )}
            {mixtas.length > 0 && (
              <p className="mt-4 text-center text-sm text-crema/65">Ya tenés {plural(mixtas.length, 'caja mixta', 'cajas mixtas')} en el pedido.</p>
            )}
          </Revelar>
        </div>
      </div>
    </section>
  )
}
