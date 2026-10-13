import { useEffect, useRef, useState } from 'react'
import { BODEGA } from '../config'
import { Ornamento } from './Ornamento'

const CLAVE = 'bodega-guerrero-mayor-de-edad'

// eslint-disable-next-line react/only-export-components
export function yaConfirmoEdad(): boolean {
  try {
    return localStorage.getItem(CLAVE) === 'si'
  } catch {
    return false
  }
}

/** "¿Sos mayor de 18 años?" al entrar. La respuesta afirmativa queda guardada en el navegador. */
export function AvisoEdad({ onConfirmar }: { onConfirmar: () => void }) {
  const [rechazado, setRechazado] = useState(false)
  const botonSi = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    botonSi.current?.focus()
    return () => {
      document.body.style.overflow = overflowPrevio
    }
  }, [])

  const confirmar = () => {
    try {
      localStorage.setItem(CLAVE, 'si')
    } catch {
      // Sin almacenamiento se vuelve a preguntar en la próxima visita.
    }
    onConfirmar()
  }

  return (
    <div className="oscuro fixed inset-0 z-[60] grid place-items-center bg-negro/90 p-4 backdrop-blur-md">
      <div role="dialog" aria-modal="true" aria-labelledby="edad-titulo" aria-describedby="edad-texto" className="fundido w-full max-w-md border border-dorado/40 bg-negro px-6 py-10 text-center text-crema md:px-10">
        <p className="font-serif text-lg font-semibold tracking-[0.22em] uppercase">{BODEGA.nombre}</p>
        <Ornamento className="mt-5" />
        {rechazado ? (
          <>
            <h2 id="edad-titulo" className="mt-6 text-3xl">
              Lo sentimos
            </h2>
            <p id="edad-texto" className="mt-3 text-crema/80">
              Este sitio es solo para mayores de 18 años. Te esperamos más adelante.
            </p>
            <button type="button" onClick={() => setRechazado(false)} className="boton boton-dorado mt-8">
              Volver
            </button>
          </>
        ) : (
          <>
            <h2 id="edad-titulo" className="mt-6 text-3xl md:text-4xl">
              ¿Sos mayor de 18 años?
            </h2>
            <p id="edad-texto" className="mt-3 text-crema/80">
              Para ingresar tenés que tener la edad legal para consumir alcohol.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button ref={botonSi} type="button" onClick={confirmar} className="boton boton-primario min-w-28">
                Sí
              </button>
              <button type="button" onClick={() => setRechazado(true)} className="boton boton-dorado min-w-28">
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
