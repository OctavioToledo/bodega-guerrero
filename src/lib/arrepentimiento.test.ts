import { describe, expect, it } from 'vitest'
import { diasDesde, generarCodigo, mensajeArrepentimiento } from './arrepentimiento'

describe('generarCodigo', () => {
  it('lleva la fecha y cuatro caracteres sin letras ambiguas', () => {
    expect(generarCodigo(new Date(2026, 9, 22), () => 0)).toBe('ARR-20261022-AAAA')
    expect(generarCodigo(new Date(2026, 0, 5), () => 0.999)).toBe('ARR-20260105-9999')
    expect(generarCodigo()).toMatch(/^ARR-\d{8}-[A-HJKMNP-Z2-9]{4}$/)
  })
})

describe('diasDesde', () => {
  const hoy = new Date(2026, 9, 22)

  it('cuenta días corridos', () => {
    expect(diasDesde('2026-10-22', hoy)).toBe(0)
    expect(diasDesde('2026-10-12', hoy)).toBe(10)
    expect(diasDesde('2026-09-30', hoy)).toBe(22)
  })

  it('descarta fechas inválidas o futuras', () => {
    expect(diasDesde('', hoy)).toBeNull()
    expect(diasDesde('22/10/2026', hoy)).toBeNull()
    expect(diasDesde('2026-10-23', hoy)).toBeNull()
  })
})

describe('mensajeArrepentimiento', () => {
  const base = { nombre: ' Ana Pérez ', telefono: '261 555-1234', email: '', fechaEntrega: '2026-10-20', productos: '1 caja de Los Teritos Malbec', motivo: '' }

  it('arma el mensaje con el código y omite los campos vacíos', () => {
    expect(mensajeArrepentimiento('Bodega Guerrero', 'ARR-20261022-4F7K', base)).toBe(
      [
        '¡Hola Bodega Guerrero! Quiero ejercer mi derecho de arrepentimiento sobre una compra (botón de arrepentimiento).',
        '',
        'Código de gestión: ARR-20261022-4F7K',
        'Nombre: Ana Pérez',
        'Teléfono: 261 555-1234',
        'Fecha de entrega del pedido: 20/10/2026',
        'Productos: 1 caja de Los Teritos Malbec',
      ].join('\n'),
    )
  })

  it('incluye email y motivo cuando están', () => {
    const texto = mensajeArrepentimiento('Bodega Guerrero', 'X', { ...base, email: 'ana@mail.com', motivo: 'Me equivoqué de vino' })
    expect(texto).toContain('Email: ana@mail.com\nFecha')
    expect(texto.endsWith('Motivo: Me equivoqué de vino')).toBe(true)
  })
})
