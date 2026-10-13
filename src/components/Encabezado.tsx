import { Ornamento } from './Ornamento'
import { Revelar } from './Revelar'

/** Etiqueta en mayúsculas + título serif + bajada, centrados, para abrir cada sección. */
export function Encabezado({
  id,
  etiqueta,
  titulo,
  bajada,
  oscuro = false,
}: {
  id: string
  etiqueta: string
  titulo: string
  bajada?: string
  oscuro?: boolean
}) {
  return (
    <Revelar className="mx-auto max-w-2xl text-center">
      <p className={`etiqueta ${oscuro ? 'text-dorado' : 'text-bordo'}`}>{etiqueta}</p>
      <h2 id={id} className="mt-4 text-titulo-sm leading-tight md:text-titulo">
        {titulo}
      </h2>
      <Ornamento className="mt-5" />
      {bajada && <p className={`mt-5 text-lg leading-relaxed ${oscuro ? 'text-crema/75' : 'text-texto/75'}`}>{bajada}</p>}
    </Revelar>
  )
}
