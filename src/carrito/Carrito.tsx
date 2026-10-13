import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { buscarVino } from '../lib/datos'
import {
  PEDIDO_VACIO,
  botellasDe,
  cajaCompleta,
  restarDelArmado,
  sanearPedido,
  sumarAlArmado,
  totales,
  type LineaMixta,
  type LineaVino,
  type Pedido,
} from '../lib/pedido'
import type { Vino } from '../lib/tipos'

type Accion =
  | { tipo: 'sumarCaja'; vinoId: string }
  | { tipo: 'restarCaja'; vinoId: string }
  | { tipo: 'eliminarVino'; vinoId: string }
  | { tipo: 'sumarAlArmado'; vinoId: string }
  | { tipo: 'restarDelArmado'; vinoId: string }
  | { tipo: 'descartarArmado' }
  | { tipo: 'confirmarArmado'; id: string }
  | { tipo: 'eliminarMixta'; id: string }
  | { tipo: 'vaciar' }

const CLAVE = 'bodega-guerrero-pedido'

function reducer(p: Pedido, accion: Accion): Pedido {
  switch (accion.tipo) {
    case 'sumarCaja':
      return {
        ...p,
        porVino: p.porVino.some((i) => i.vinoId === accion.vinoId)
          ? p.porVino.map((i) => (i.vinoId === accion.vinoId ? { ...i, cajas: i.cajas + 1 } : i))
          : [...p.porVino, { vinoId: accion.vinoId, cajas: 1 }],
      }
    case 'restarCaja':
      return {
        ...p,
        porVino: p.porVino.map((i) => (i.vinoId === accion.vinoId ? { ...i, cajas: i.cajas - 1 } : i)).filter((i) => i.cajas > 0),
      }
    case 'eliminarVino':
      return { ...p, porVino: p.porVino.filter((i) => i.vinoId !== accion.vinoId) }
    case 'sumarAlArmado':
      return { ...p, armado: sumarAlArmado(p.armado, accion.vinoId) }
    case 'restarDelArmado':
      return { ...p, armado: restarDelArmado(p.armado, accion.vinoId) }
    case 'descartarArmado':
      return { ...p, armado: [] }
    case 'confirmarArmado':
      if (!cajaCompleta(p.armado)) return p
      return { ...p, mixtas: [...p.mixtas, { id: accion.id, items: p.armado }], armado: [] }
    case 'eliminarMixta':
      return { ...p, mixtas: p.mixtas.filter((m) => m.id !== accion.id) }
    case 'vaciar':
      return PEDIDO_VACIO
  }
}

const existe = (id: string) => buscarVino(id) !== undefined

function cargar(): Pedido {
  try {
    return sanearPedido(JSON.parse(localStorage.getItem(CLAVE) ?? 'null'), existe)
  } catch {
    return PEDIDO_VACIO
  }
}

const nuevoId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

function resolver<T extends { vinoId: string }>(items: T[]): (Omit<T, 'vinoId'> & { vino: Vino })[] {
  return items.flatMap(({ vinoId, ...resto }) => {
    const vino = buscarVino(vinoId)
    return vino ? [{ ...resto, vino }] : []
  })
}

interface ValorCarrito {
  porVino: LineaVino[]
  mixtas: LineaMixta[]
  armado: LineaMixta['items']
  botellasArmado: number
  botellas: number
  cajas: number
  total: number
  vacio: boolean
  cajasDe: (vinoId: string) => number
  botellasEnArmado: (vinoId: string) => number
  sumarCaja: (vinoId: string) => void
  restarCaja: (vinoId: string) => void
  eliminarVino: (vinoId: string) => void
  sumarAlArmado: (vinoId: string) => void
  restarDelArmado: (vinoId: string) => void
  descartarArmado: () => void
  confirmarArmado: () => void
  eliminarMixta: (id: string) => void
  vaciar: () => void
  abierto: boolean
  abrir: () => void
  cerrar: () => void
  aviso: { texto: string; id: number } | null
  avisar: (texto: string) => void
}

const Contexto = createContext<ValorCarrito | null>(null)

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [pedido, despachar] = useReducer(reducer, undefined, cargar)
  const [abierto, setAbierto] = useState(false)
  const [aviso, setAviso] = useState<{ texto: string; id: number } | null>(null)
  const timerAviso = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(pedido))
    } catch {
      // Sin almacenamiento (modo privado, cuota llena): el pedido sigue andando en memoria.
    }
  }, [pedido])

  // Estables: el drawer depende de `cerrar` en un efecto y no debe re-ejecutarse al cambiar el pedido.
  const abrir = useCallback(() => setAbierto(true), [])
  const cerrar = useCallback(() => setAbierto(false), [])

  const avisar = useCallback((texto: string) => {
    setAviso({ texto, id: Date.now() })
    window.clearTimeout(timerAviso.current)
    timerAviso.current = window.setTimeout(() => setAviso(null), 2400)
  }, [])

  const valor = useMemo<ValorCarrito>(() => {
    const porVino = resolver(pedido.porVino)
    const mixtas = pedido.mixtas.map((m) => ({ id: m.id, items: resolver(m.items) }))
    const t = totales(porVino, mixtas)
    return {
      porVino,
      mixtas,
      armado: resolver(pedido.armado),
      botellasArmado: botellasDe(pedido.armado),
      ...t,
      vacio: t.cajas === 0,
      cajasDe: (vinoId) => pedido.porVino.find((i) => i.vinoId === vinoId)?.cajas ?? 0,
      botellasEnArmado: (vinoId) => pedido.armado.find((i) => i.vinoId === vinoId)?.botellas ?? 0,
      sumarCaja: (vinoId) => despachar({ tipo: 'sumarCaja', vinoId }),
      restarCaja: (vinoId) => despachar({ tipo: 'restarCaja', vinoId }),
      eliminarVino: (vinoId) => despachar({ tipo: 'eliminarVino', vinoId }),
      sumarAlArmado: (vinoId) => despachar({ tipo: 'sumarAlArmado', vinoId }),
      restarDelArmado: (vinoId) => despachar({ tipo: 'restarDelArmado', vinoId }),
      descartarArmado: () => despachar({ tipo: 'descartarArmado' }),
      confirmarArmado: () => despachar({ tipo: 'confirmarArmado', id: nuevoId() }),
      eliminarMixta: (id) => despachar({ tipo: 'eliminarMixta', id }),
      vaciar: () => despachar({ tipo: 'vaciar' }),
      abierto,
      abrir,
      cerrar,
      aviso,
      avisar,
    }
  }, [pedido, abierto, aviso, avisar, abrir, cerrar])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useCarrito(): ValorCarrito {
  const valor = useContext(Contexto)
  if (!valor) throw new Error('useCarrito tiene que usarse dentro de <ProveedorCarrito>')
  return valor
}
