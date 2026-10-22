import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { vinos } from '../lib/datos'
import { IconoFlecha, IconoPausa, IconoPlay } from './Iconos'

/** Cuánto queda cada vino al frente, en milisegundos. */
const INTERVALO = 4000

const botellas = vinos.filter((v) => v.recorte)
const total = botellas.length

/** Distancia de la botella `i` a la del frente, por el camino más corto (negativa a la izquierda). */
function desplazamiento(i: number, frente: number): number {
  let d = (i - frente + total) % total
  if (d > total / 2) d -= total
  return d
}

/**
 * Mostrador en 3D: las botellas paradas en fila sobre una repisa, la elegida al frente y las demás
 * alejándose hacia los costados. Gira solo; se detiene con el mouse encima, con el foco adentro,
 * fuera de pantalla, con la pestaña oculta o con "reducir movimiento" activado.
 */
export function Mostrador() {
  const [{ frente, anterior }, setPosicion] = useState({ frente: 0, anterior: 0 })
  const [pausaManual, setPausaManual] = useState(false)
  const [encima, setEncima] = useState(false)
  const [foco, setFoco] = useState(false)
  const [enVista, setEnVista] = useState(false)
  const [pestanaOculta, setPestanaOculta] = useState(false)
  const [sinMovimiento] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const raiz = useRef<HTMLDivElement>(null)
  const arrastre = useRef<number | null>(null)

  const pausado = pausaManual || encima || foco || !enVista || pestanaOculta || sinMovimiento
  const ir = (i: number) => setPosicion((p) => ({ frente: (i + total) % total, anterior: p.frente }))

  useEffect(() => {
    if (pausado) return
    const t = setTimeout(() => setPosicion((p) => ({ frente: (p.frente + 1) % total, anterior: p.frente })), INTERVALO)
    return () => clearTimeout(t)
  }, [frente, pausado])

  useEffect(() => {
    const el = raiz.current
    if (!el || !('IntersectionObserver' in window)) return setEnVista(true)
    const observador = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.35 })
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    const alCambiar = () => setPestanaOculta(document.hidden)
    document.addEventListener('visibilitychange', alCambiar)
    return () => document.removeEventListener('visibilitychange', alCambiar)
  }, [])

  // Deslizar con el dedo en mobile
  const alApoyar = (ev: PointerEvent) => {
    if (ev.pointerType !== 'mouse') arrastre.current = ev.clientX
  }
  const alSoltar = (ev: PointerEvent) => {
    if (arrastre.current === null) return
    const dx = ev.clientX - arrastre.current
    arrastre.current = null
    if (Math.abs(dx) > 40) ir(frente + (dx < 0 ? 1 : -1))
  }

  if (total === 0) return null
  const actual = botellas[frente]

  return (
    <div
      ref={raiz}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Nuestros vinos"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setFoco(true)}
      onBlur={(ev) => !ev.currentTarget.contains(ev.relatedTarget as Node | null) && setFoco(false)}
    >
      <div className="relative">
        <div
          className="mostrador relative h-[23rem] touch-pan-y overflow-hidden md:h-[27rem]"
          onPointerDown={alApoyar}
          onPointerUp={alSoltar}
          onPointerCancel={() => (arrastre.current = null)}
        >
          {/* Repisa: filete dorado y una luz suave detrás de la botella del frente */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[3.75rem] h-px bg-gradient-to-r from-transparent via-dorado/60 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute bottom-[3.75rem] left-1/2 h-[80%] w-2/3 -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(255_255_255/0.85),transparent)]" aria-hidden />

          {botellas.map((v, i) => {
            const d = desplazamiento(i, frente)
            const distancia = Math.abs(d)
            // La que da la vuelta de un extremo al otro no cruza volando: se desvanece y aparece del otro lado.
            const salta = Math.abs(d - desplazamiento(i, anterior)) > total / 2
            const estilo = {
              '--d': d,
              zIndex: 10 - distancia,
              opacity: distancia > 2 ? 0 : 1 - distancia * 0.18,
              transition: salta ? 'opacity 700ms ease' : undefined,
            } as CSSProperties
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => ir(i)}
                tabIndex={distancia === 0 || distancia > 2 ? -1 : 0}
                aria-hidden={distancia > 2 || undefined}
                aria-label={distancia === 0 ? v.nombre : `Ver ${v.nombre}`}
                className="botella-mostrador group absolute bottom-[3.75rem] left-1/2 h-[72%]"
                style={estilo}
              >
                <img
                  src={v.recorte!}
                  alt=""
                  height={1000}
                  loading={distancia <= 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className="h-full w-auto select-none drop-shadow-[0_18px_18px_rgb(20_17_15/0.22)] transition-transform duration-500 ease-(--ease-suave) group-hover:-translate-y-1.5"
                />
                {/* Reflejo sobre la repisa */}
                <img
                  src={v.recorte!}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="absolute top-full left-0 h-full w-auto -scale-y-100 opacity-20 select-none [mask-image:linear-gradient(to_top,black,transparent_30%)]"
                />
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => ir(frente - 1)}
          className="boton-icono absolute top-[42%] left-0 z-20 -translate-y-1/2 rounded-full border border-dorado/50 bg-crema/90 text-azul shadow-sm backdrop-blur-sm hover:bg-blanco"
          aria-label="Vino anterior"
        >
          <IconoFlecha className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => ir(frente + 1)}
          className="boton-icono absolute top-[42%] right-0 z-20 -translate-y-1/2 rounded-full border border-dorado/50 bg-crema/90 text-azul shadow-sm backdrop-blur-sm hover:bg-blanco"
          aria-label="Vino siguiente"
        >
          <IconoFlecha />
        </button>
      </div>

      <div className="relative -mt-4 flex items-start justify-center px-12 text-center">
        {/* Cuando está quieto, los lectores de pantalla anuncian el vino al cambiarlo */}
        <div key={actual.id} className="aparecer min-w-0" aria-live={pausado ? 'polite' : 'off'}>
          <p className="etiqueta text-[11px] text-bordo">{actual.linea}</p>
          <p className="mt-1.5 font-serif text-[1.75rem] leading-tight">{actual.nombre}</p>
          <p className="mt-0.5 text-sm text-texto/70">{actual.varietal}</p>
        </div>
        {!sinMovimiento && (
          <button
            type="button"
            onClick={() => setPausaManual((p) => !p)}
            className="boton-icono absolute top-0 right-0 rounded-full border border-azul/20 text-azul hover:bg-blanco"
            aria-label={pausaManual ? 'Reanudar el carrusel' : 'Pausar el carrusel'}
          >
            {pausaManual ? <IconoPlay /> : <IconoPausa />}
          </button>
        )}
      </div>
    </div>
  )
}
