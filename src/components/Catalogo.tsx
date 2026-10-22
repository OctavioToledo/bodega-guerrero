import { useState } from 'react'
import { BOX_SIZE, PRECIO_CAJA } from '../config'
import { TIPOS, lineas, tipoDe, vinos } from '../lib/datos'
import { formatoPrecio } from '../lib/formato'
import type { TipoVino, Vino } from '../lib/tipos'
import { ControlCajas } from './ControlCajas'
import { Encabezado } from './Encabezado'
import { FotoVino } from './FotoVino'

/** Filete superior de cada tarjeta, en el color de etiqueta de su tipo. */
const ACENTO_TIPO: Record<TipoVino, string> = { tinto: 'border-t-bordo', blanco: 'border-t-celeste', rosado: 'border-t-rosa' }

function TarjetaVino({ vino }: { vino: Vino }) {
  return (
    <li className={`group flex flex-col border border-t-[3px] border-crema-oscuro bg-blanco ${ACENTO_TIPO[tipoDe(vino)]} transition-[border-color,box-shadow] duration-300 hover:border-dorado hover:shadow-[0_18px_40px_-24px_rgb(20_17_15/0.35)]`}>
      <div className="relative">
        <FotoVino vino={vino} />
        {vino.destacado && <span className="etiqueta absolute top-4 left-4 bg-rosa px-2.5 py-1 text-[10px] text-bordo">Destacado</span>}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="etiqueta text-[11px] text-bordo">{vino.linea}</p>
        <h3 className="mt-2 text-[1.75rem] leading-tight">{vino.nombre}</h3>
        <p className="mt-1 text-sm text-texto/70">{[vino.varietal, vino.anada, `${vino.volumen} ml`].filter(Boolean).join(' · ')}</p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-texto/85">{vino.descripcion}</p>
        <div className="mb-6">
          {vino.cata && (
            <details className="group/cata mt-3 text-sm">
              <summary className="inline-flex min-h-11 items-center gap-2 font-semibold text-bordo underline decoration-dorado underline-offset-4 marker:content-none hover:decoration-bordo">
                <span className="group-open/cata:hidden">Ver nota de cata</span>
                <span className="hidden group-open/cata:inline">Ocultar nota de cata</span>
              </summary>
              <dl className="mt-2 flex flex-col gap-2.5 leading-relaxed text-texto/85">
                {(['vista', 'nariz', 'boca'] as const).map((k) => (
                  <div key={k}>
                    <dt className="etiqueta text-[10px] text-bordo">{k}</dt>
                    <dd className="mt-0.5">{vino.cata![k]}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
        </div>

        <div className="mt-auto mb-5 flex items-end justify-between gap-3 border-t border-crema-oscuro pt-5">
          <dl>
            <dt className="etiqueta text-[10px] text-texto/65">Caja x{BOX_SIZE}</dt>
            <dd className="mt-1 font-serif text-2xl leading-none font-semibold text-bordo">{formatoPrecio(PRECIO_CAJA)}</dd>
          </dl>
          <p className="text-right text-xs leading-snug text-texto/70">
            Envío incluido
            <br />a todo el país
          </p>
        </div>
        <ControlCajas vino={vino} />
      </div>
    </li>
  )
}

export function Catalogo() {
  const [linea, setLinea] = useState<string | null>(null)
  const [tipo, setTipo] = useState<TipoVino | null>(null)

  const tiposPresentes = TIPOS.filter((t) => vinos.some((v) => tipoDe(v) === t.id))
  const visibles = vinos.filter((v) => (!linea || v.linea === linea) && (!tipo || tipoDe(v) === tipo))

  return (
    <section id="vinos" aria-labelledby="vinos-titulo" className="bg-crema">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <Encabezado
          id="vinos-titulo"
          etiqueta="Nuestros vinos"
          titulo="El catálogo"
          bajada={`Todas las cajas de ${BOX_SIZE} botellas salen ${formatoPrecio(PRECIO_CAJA)}, con envío incluido a todo el país. Llevá ${BOX_SIZE} del mismo vino o combinalos en tu caja mixta.`}
        />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filtrar vinos">
          <button type="button" className="chip" aria-pressed={!linea && !tipo} onClick={() => (setLinea(null), setTipo(null))}>
            Todos
          </button>
          {lineas.length > 1 &&
            lineas.map((l) => (
              <button key={l} type="button" className="chip" aria-pressed={linea === l} onClick={() => setLinea(linea === l ? null : l)}>
                {l}
              </button>
            ))}
          {tiposPresentes.length > 1 && (
            <>
              <span className="mx-1 hidden h-6 w-px bg-celeste sm:block" aria-hidden />
              {tiposPresentes.map((t) => (
                <button key={t.id} type="button" className="chip" aria-pressed={tipo === t.id} onClick={() => setTipo(tipo === t.id ? null : t.id)}>
                  {t.nombre}
                </button>
              ))}
            </>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {visibles.length === 1 ? 'Se muestra 1 vino' : `Se muestran ${visibles.length} vinos`}
        </p>

        {visibles.length > 0 ? (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibles.map((v) => (
              <TarjetaVino key={v.id} vino={v} />
            ))}
          </ul>
        ) : (
          <div className="mt-10 py-12 text-center">
            <p className="font-serif text-2xl">No hay vinos con esa combinación.</p>
            <button type="button" className="boton boton-contorno mt-6" onClick={() => (setLinea(null), setTipo(null))}>
              Ver todos
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
