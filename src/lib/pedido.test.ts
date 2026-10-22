import { describe, expect, it } from 'vitest'
import { BOX_SIZE, MIX_STEP, PRECIO_CAJA } from '../config'
import { tipoDe } from './datos'
import {
  armarMensaje,
  botellasDe,
  cajaCompleta,
  restarDelArmado,
  sanearPedido,
  subtotalVino,
  sugerencias,
  sumarAlArmado,
  totales,
  type LineaMixta,
  type LineaVino,
} from './pedido'
import type { Vino } from './tipos'

const vino = (id: string, nombre: string, extra: Partial<Vino> = {}): Vino => ({
  id,
  nombre,
  linea: 'Reserva',
  varietal: nombre,
  anada: 2022,
  volumen: 750,
  descripcion: '',
  foto: null,
  destacado: false,
  ...extra,
})

const malbec = vino('malbec', 'Malbec Reserva')
const cabernet = vino('cabernet', 'Cabernet Sauvignon', { anada: 2021 })
const torrontes = vino('torrontes', 'Torrontés', { varietal: 'Torrontés', anada: null })
const blend = vino('blend', 'Blend Gran Reserva', { destacado: true })
const catalogo = [malbec, cabernet, torrontes, blend]

// Los formatos de moneda de Intl usan espacio duro entre "$" y el número.
const normal = (s: string) => s.replace(/ /g, ' ')

describe('configuración', () => {
  it('MIX_STEP divide a BOX_SIZE', () => {
    expect(BOX_SIZE % MIX_STEP).toBe(0)
  })
})

describe('precios', () => {
  it('cada caja vale lo mismo, sin importar los vinos', () => {
    expect(subtotalVino({ cajas: 2 }, 55000)).toBe(110000)
    expect(subtotalVino({ cajas: 1 })).toBe(PRECIO_CAJA)
  })

  it('totales cuentan siempre cajas completas, por vino y mixtas al mismo precio', () => {
    const porVino: LineaVino[] = [{ vino: malbec, cajas: 2 }]
    const mixtas: LineaMixta[] = [{ id: 'a', items: [{ vino: malbec, botellas: 3 }, { vino: cabernet, botellas: 3 }] }]
    expect(totales(porVino, mixtas, 55000)).toEqual({ cajas: 3, botellas: 18, total: 165000 })
  })
})

describe('caja mixta', () => {
  it('de a 1: cada botella puede ser un vino distinto', () => {
    let caja = sumarAlArmado([], 'malbec', 1)
    expect(caja).toEqual([{ vinoId: 'malbec', botellas: 1 }])
    for (const id of ['cabernet', 'torrontes', 'blend', 'malbec', 'cabernet']) caja = sumarAlArmado(caja, id, 1)
    expect(caja).toEqual([
      { vinoId: 'malbec', botellas: 2 },
      { vinoId: 'cabernet', botellas: 2 },
      { vinoId: 'torrontes', botellas: 1 },
      { vinoId: 'blend', botellas: 1 },
    ])
    expect(cajaCompleta(caja)).toBe(true)
    expect(sumarAlArmado(caja, 'torrontes', 1)).toBe(caja)
  })

  it('de a 3: suma de a 3 y no se pasa de la caja', () => {
    let caja = sumarAlArmado([], 'malbec', 3)
    expect(caja).toEqual([{ vinoId: 'malbec', botellas: 3 }])
    caja = sumarAlArmado(caja, 'cabernet', 3)
    expect(cajaCompleta(caja)).toBe(true)
    expect(sumarAlArmado(caja, 'torrontes', 3)).toBe(caja)
    expect(botellasDe(caja)).toBe(6)
  })

  it('el mismo vino puede llenar la caja entera', () => {
    let caja = sumarAlArmado([], 'malbec')
    for (let i = MIX_STEP; i < BOX_SIZE; i += MIX_STEP) caja = sumarAlArmado(caja, 'malbec')
    expect(caja).toEqual([{ vinoId: 'malbec', botellas: BOX_SIZE }])
  })

  it('restar saca el vino cuando llega a cero', () => {
    expect(restarDelArmado([{ vinoId: 'malbec', botellas: 3 }, { vinoId: 'cabernet', botellas: 3 }], 'malbec', 3)).toEqual([{ vinoId: 'cabernet', botellas: 3 }])
    expect(restarDelArmado([{ vinoId: 'malbec', botellas: 2 }, { vinoId: 'cabernet', botellas: 4 }], 'malbec', 1)).toEqual([
      { vinoId: 'malbec', botellas: 1 },
      { vinoId: 'cabernet', botellas: 4 },
    ])
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
      3,
    )
    expect(p.porVino).toEqual([{ vinoId: 'malbec', cajas: 2 }])
    expect(p.mixtas.map((m) => m.id)).toEqual(['ok'])
    expect(p.armado).toEqual([{ vinoId: 'blend', botellas: 3 }])
  })

  it('de a 1 acepta cualquier reparto que complete la caja', () => {
    const p = sanearPedido({ mixtas: [{ id: 'a', items: [{ vinoId: 'malbec', botellas: 4 }, { vinoId: 'cabernet', botellas: 1 }, { vinoId: 'blend', botellas: 1 }] }] }, existe, 1)
    expect(p.mixtas.map((m) => m.id)).toEqual(['a'])
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
    const texto = armarMensaje('Bodega Guerrero', porVino, mixtas, { nombre: ' Ana ', zona: 'Godoy Cruz', comentarios: 'Después de las 17' }, 55000)
    expect(normal(texto)).toBe(
      [
        '¡Hola Bodega Guerrero! Quiero hacer el siguiente pedido:',
        '',
        '🍷 CAJAS POR VINO',
        '- Malbec Reserva 2022 (750 ml) — 1 caja x6 — $ 55.000',
        '- Cabernet Sauvignon 2021 (750 ml) — 2 cajas x6 — $ 110.000',
        '',
        '📦 CAJAS MIXTAS',
        '- Caja mixta 1: 3 Malbec Reserva + 3 Cabernet Sauvignon — $ 55.000',
        '',
        'Total: 24 botellas (4 cajas)',
        'TOTAL: $ 220.000 (envío incluido)',
        '',
        'Nombre: Ana',
        'Zona de entrega: Godoy Cruz',
        'Comentarios: Después de las 17',
      ].join('\n'),
    )
  })

  it('omite secciones y datos vacíos, y muestra vinos sin añada', () => {
    const texto = armarMensaje('Bodega Guerrero', [{ vino: torrontes, cajas: 1 }], [], { nombre: '', zona: '  ', comentarios: '' }, 55000)
    expect(normal(texto)).toBe(
      [
        '¡Hola Bodega Guerrero! Quiero hacer el siguiente pedido:',
        '',
        '🍷 CAJAS POR VINO',
        '- Torrontés (750 ml) — 1 caja x6 — $ 55.000',
        '',
        'Total: 6 botellas (1 caja)',
        'TOTAL: $ 55.000 (envío incluido)',
      ].join('\n'),
    )
  })

  it('usa el precio de caja configurado', () => {
    const texto = armarMensaje('Bodega Guerrero', [{ vino: malbec, cajas: 1 }], [], { nombre: '', zona: '', comentarios: '' }, 60000)
    expect(normal(texto)).toContain('TOTAL: $ 60.000 (envío incluido)')
  })
})
