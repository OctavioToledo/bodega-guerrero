import { useEffect, useState } from 'react'
import { useCarrito } from '../carrito/Carrito'
import { BODEGA } from '../config'
import { IconoCaja, IconoCerrar, IconoMenu } from './Iconos'

const LINKS = [
  { href: '#bodega', texto: 'Bodega' },
  { href: '#vinos', texto: 'Vinos' },
  { href: '#arma-tu-caja', texto: 'Armá tu caja' },
  { href: '#contacto', texto: 'Contacto' },
]

export function Header() {
  const { botellas, abrir } = useCarrito()
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (!menuAbierto) return
    const alTeclear = (ev: KeyboardEvent) => ev.key === 'Escape' && setMenuAbierto(false)
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [menuAbierto])

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="oscuro fixed inset-x-0 top-0 z-30 border-b border-dorado/25 bg-negro/95 text-crema backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-[72px] md:px-8">
        {/* Placeholder de texto hasta tener el logo definitivo */}
        <a href="#inicio" onClick={cerrarMenu} className="font-serif text-xl leading-none font-semibold tracking-[0.2em] uppercase md:text-2xl">
          {BODEGA.nombre}
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="etiqueta inline-flex min-h-11 items-center text-crema/85 transition-colors hover:text-dorado">
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            id="boton-carrito"
            type="button"
            onClick={abrir}
            className="boton-icono relative hover:bg-crema/10"
            aria-label={botellas > 0 ? `Ver pedido, ${botellas} botellas` : 'Ver pedido, vacío'}
          >
            <IconoCaja />
            {botellas > 0 && (
              <span
                key={botellas}
                className="latir absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-dorado px-1 text-[11px] font-bold text-negro"
              >
                {botellas}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuAbierto((a) => !a)}
            className="boton-icono hover:bg-crema/10 md:hidden"
            aria-expanded={menuAbierto}
            aria-controls="menu-mobile"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuAbierto ? <IconoCerrar /> : <IconoMenu />}
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav id="menu-mobile" aria-label="Principal" className="fundido border-t border-dorado/20 md:hidden">
          <ul className="flex flex-col px-4 py-3">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-crema/10 last:border-0">
                <a href={l.href} onClick={cerrarMenu} className="flex min-h-13 items-center font-serif text-2xl hover:text-dorado">
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
