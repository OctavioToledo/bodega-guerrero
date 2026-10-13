import { useState } from 'react'
import { ProveedorCarrito, useCarrito } from './carrito/Carrito'
import { ArmaTuCaja } from './components/ArmaTuCaja'
import { Aviso } from './components/Aviso'
import { AvisoEdad, yaConfirmoEdad } from './components/AvisoEdad'
import { BarraPedido } from './components/BarraPedido'
import { Bodega } from './components/Bodega'
import { BotonWhatsApp } from './components/BotonWhatsApp'
import { Catalogo } from './components/Catalogo'
import { Contacto } from './components/Contacto'
import { DrawerPedido } from './components/DrawerPedido'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'

function Pagina() {
  const { vacio } = useCarrito()
  const [mayorDeEdad, setMayorDeEdad] = useState(yaConfirmoEdad)

  return (
    <>
      {/* Mientras no se confirme la edad, el sitio queda inerte detrás del aviso */}
      <div inert={!mayorDeEdad}>
        <a href="#vinos" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blanco focus:p-3">
          Saltar a los vinos
        </a>
        <Header />
        <main>
          <Hero />
          <Bodega />
          <Catalogo />
          <ArmaTuCaja />
          <Contacto />
        </main>
        <Footer />
        {/* Espacio para que la barra inferior no tape el footer en mobile */}
        {!vacio && <div className="h-20 bg-negro md:hidden" aria-hidden />}
        <BotonWhatsApp />
        <BarraPedido />
        <DrawerPedido />
        <Aviso />
      </div>
      {!mayorDeEdad && <AvisoEdad onConfirmar={() => setMayorDeEdad(true)} />}
    </>
  )
}

export default function App() {
  return (
    <ProveedorCarrito>
      <Pagina />
    </ProveedorCarrito>
  )
}
