import { BODEGA, TEXTOS } from '../config'
import { Mostrador } from './Mostrador'
import { IconoCaja, IconoPin } from './Iconos'
import { Revelar } from './Revelar'

export function Bodega() {
  const { bodega } = TEXTOS

  return (
    <section id="bodega" aria-labelledby="bodega-titulo" className="bg-celeste-claro">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Revelar>
          <p className="etiqueta text-azul">La bodega</p>
          <h2 id="bodega-titulo" className="mt-4 text-titulo-sm leading-tight md:text-titulo">
            {bodega.titulo}
          </h2>
          <div className="franja mt-5" aria-hidden />
          <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed text-texto/85">
            {bodega.parrafos.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 flex flex-col gap-3 border-t border-azul/15 pt-6">
            <li className="flex items-start gap-3">
              <IconoPin className="mt-0.5 shrink-0 text-azul" />
              <span>
                <span className="font-semibold">
                  {BODEGA.localidad}, {BODEGA.provincia}
                </span>
                <br />
                Vendemos online, sin local a la calle.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <IconoCaja className="mt-0.5 shrink-0 text-azul" />
              <span>
                <span className="font-semibold">Envíos {BODEGA.envio.toLowerCase()}</span>
                <br />
                <a href="#vinos" className="text-bordo underline decoration-dorado underline-offset-4 hover:decoration-bordo">
                  Ver los vinos
                </a>
              </span>
            </li>
          </ul>
        </Revelar>

        <Revelar retraso={150} className="min-w-0">
          <Mostrador />
        </Revelar>
      </div>
    </section>
  )
}
