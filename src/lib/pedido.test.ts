import { describe, expect, it } from 'vitest'
import { BOX_SIZE, MIX_STEP } from '../config'
import { tipoDe } from './datos'
import {
  armarMensaje,
  botellasDe,
  cajaCompleta,
  precioCaja,
  restarDelArmado,
  sanearPedido,
  subtotalMixta,
  sugerencias,
  sumarAlArmado,
  totales,
  type LineaMixta,
  type LineaVino,
} from './pedido'
import type { Vino } from './tipos'

const vino = (id: string, nombre: string, precio: number, extra: Partial<Vino> = {}): Vino => ({
  id,
  nombre,
  linea: 'Reserva',
  varietal: nombre,
  anada: 2022,
  volumen: 750,
  precio,
  descripcion: '',
  foto: null,
  destacado: false,
  ...extra,
})

const malbec = vino('malbec', 'Malbec Reserva', 15000)
const cabernet = vino('cabernet', 'Cabernet Sauvignon', 12000, { anada: 2021 })
const torrontes = vino('torrontes', 'Torrontés', 9000, { varietal: 'Torrontés', anada: null })
const blend = vino('blend', 'Blend Gran Reserva', 30000, { destacado: true })
const catalogo = [malbec, cabernet, torrontes, blend]

// Los formatos de moneda de Intl usan espacio duro entre "$" y el número.
const normal = (s: string) => s.replace(/ /g, ' ')

describe('configuración', () => {
  it('MIX_STEP divide a BOX_SIZE', () => {
    expect(BOX_SIZE % MIX_STEP).toBe(0)
  })
})

describe('precios', () => {
  it('la caja es la suma de sus botellas', () => {
    expect(precioCaja(malbec)).toBe(90000)
  })

  it('aplica el descuento por caja', () => {
    expect(precioCaja(malbec, 10)).toBe(81000)
    expect(subtotalMixta([{ vino: malbec, botellas: 3 }, { vino: cabernet, botellas: 3 }], 10)).toBe(72900)
  })

  it('totales cuentan siempre cajas completas', () => {
    const porVino: LineaVino[] = [{ vino: malbec, cajas: 2 }]
    const mixtas: LineaMixta[] = [{ id: 'a', items: [{ vino: malbec, botellas: 3 }, { vino: cabernet, botellas: 3 }] }]
    expect(totales(porVino, mixtas)).toEqual({ cajas: 3, botellas: 18, total: 180000 + 81000 })
  })
})

describe('caja mixta', () => {
  it('suma de a MIX_STEP y no se pasa de BOX_SIZE', () => {
    let caja = sumarAlArmado([], 'malbec')
    expect(caja).toEqual([{ vinoId: 'malbec', botellas: 3 }])
    caja = sumarAlArmado(caja, 'cabernet')
    expect(cajaCompleta(caja)).toBe(true)
    expect(sumarAlArmado(caja, 'torrontes')).toBe(caja)
    expect(botellasDe(caja)).toBe(6)
  })

  it('el mismo vino puede llenar la caja entera', () => {
    const caja = sumarAlArmado(sumarAlArmado([], 'malbec'), 'malbec')
    expect(caja).toEqual([{ vinoId: 'malbec', botellas: 6 }])
  })

  it('restar saca el vino cuando llega a cero', () => {
    const caja = restarDelArmado([{ vinoId: 'malbec', botellas: 3 }, { vinoId: 'cabernet', botellas: 3 }], 'malbec')
    expect(caja).toEqual([{ vinoId: 'cabernet', botellas: 3 }])
  })

  it('sugiere destacados primero, sin repetir lo elegido', () => {
    const s = sugerencias([{ vinoId: 'malbec', botellas: 3 }], catalogo, tipoDe)
    expect(s.map((v) => v.id)).toEqual(['blend', 'cabernet', 'torrontes'])
  })

  it('no sugiere nada con la caja vacía o completa', () => {
    expect(sugerencias([], catalogo, tipoDe)).toEqual([])
    expect(sugerencias([{ vinoId: 'malbec', botellas: 6 }], catalogo, tipoDe)).toEqual([])
  })
})

describe('tipoDe', () => {
  it('distingue tintos, blancos y rosados', () => {
    expect(tipoDe({ nombre: 'Cabernet Sauvignon', varietal: 'Cabernet Sauvignon' })).toBe('tinto')
    expect(tipoDe({ nombre: 'Torrontés', varietal: 'Torrontés' })).toBe('blanco')
    expect(tipoDe({ nombre: 'Rosado de Malbec', varietal: 'Rosado de Malbec' })).toBe('rosado')
  })
})

describe('sanearPedido', () => {
  const existe = (id: string) => catalogo.some((v) => v.id === id)

  it('descarta vinos que ya no existen y cantidades inválidas', () => {
    const p = sanearPedido(
      {
        porVino: [
          { vinoId: 'malbec', cajas: 2 },
          { vinoId: 'borrado', cajas: 1 },
          { vinoId: 'cabernet', cajas: 1.5 },
          { vinoId: 'torrontes', cajas: 0 },
        ],
        mixtas: [
          { id: 'ok', items: [{ vinoId: 'malbec', botellas: 3 }, { vinoId: 'cabernet', botellas: 3 }] },
          { id: 'incompleta', items: [{ vinoId: 'malbec', botellas: 3 }] },
          { id: 'paso-malo', items: [{ vinoId: 'malbec', botellas: 4 }, { vinoId: 'cabernet', botellas: 2 }] },
        ],
        armado: [{ vinoId: 'blend', botellas: 3 }],
      },
      existe,
    )
    expect(p.porVino).toEqual([{ vinoId: 'malbec', cajas: 2 }])
    expect(p.mixtas.map((m) => m.id)).toEqual(['ok'])
    expect(p.armado).toEqual([{ vinoId: 'blend', botellas: 3 }])
  })

  it('tolera basura', () => {
    expect(sanearPedido(null, existe)).toEqual({ porVino: [], mixtas: [], armado: [] })
    expect(sanearPedido('hola', existe)).toEqual({ porVino: [], mixtas: [], armado: [] })
    expect(sanearPedido({ porVino: 'x', mixtas: [null] }, existe)).toEqual({ porVino: [], mixtas: [], armado: [] })
  })
})

describe('armarMensaje', () => {
  const porVino: LineaVino[] = [
    { vino: malbec, cajas: 1 },
    { vino: cabernet, cajas: 2 },
  ]
  const mixtas: LineaMixta[] = [{ id: 'a', items: [{ vino: malbec, botellas: 3 }, { vino: cabernet, botellas: 3 }] }]

  it('arma el mensaje completo', () => {
    const texto = armarMensaje('Bodega Guerrero', porVino, mixtas, { nombre: ' Ana ', zona: 'Godoy Cruz', comentarios: 'Después de las 17' })
    expect(normal(texto)).toBe(
      [
        '¡Hola Bodega Guerrero! Quiero hacer el siguiente pedido:',
        '',
        '🍷 CAJAS POR VINO',
        '- Malbec Reserva 2022 (750 ml) — 1 caja x6 — $ 90.000',
        '- Cabernet Sauvignon 2021 (750 ml) — 2 cajas x6 — $ 144.000',
        '',
        '📦 CAJAS MIXTAS',
        '- Caja mixta 1: 3 Malbec Reserva + 3 Cabernet Sauvignon — $ 81.000',
        '',
        'Total: 24 botellas (4 cajas)',
        'TOTAL: $ 315.000',
        '',
        'Nombre: Ana',
        'Zona de entrega: Godoy Cruz',
        'Comentarios: Después de las 17',
      ].join('\n'),
    )
  })

  it('omite secciones y datos vacíos, y muestra vinos sin añada', () => {
    const texto = armarMensaje('Bodega Guerrero', [{ vino: torrontes, cajas: 1 }], [], { nombre: '', zona: '  ', comentarios: '' })
    expect(normal(texto)).toBe(
      [
        '¡Hola Bodega Guerrero! Quiero hacer el siguiente pedido:',
        '',
        '🍷 CAJAS POR VINO',
        '- Torrontés (750 ml) — 1 caja x6 — $ 54.000',
        '',
        'Total: 6 botellas (1 caja)',
        'TOTAL: $ 54.000',
      ].join('\n'),
    )
  })

  it('aclara el descuento cuando hay', () => {
    const texto = armarMensaje('Bodega Guerrero', [{ vino: malbec, cajas: 1 }], [], { nombre: '', zona: '', comentarios: '' }, 10)
    expect(normal(texto)).toContain('TOTAL: $ 81.000\n(Incluye 10% de descuento por caja)')
  })
})
