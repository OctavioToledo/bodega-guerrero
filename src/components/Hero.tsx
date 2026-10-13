import { TEXTOS } from '../config'
import { Ornamento } from './Ornamento'

export function Hero() {
  const { hero } = TEXTOS
  return (
    <section id="inicio" className="oscuro relative isolate flex min-h-[100svh] items-center overflow-hidden bg-negro text-crema">
      <img
        src={TEXTOS.fotos.hero}
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-negro/70 via-negro/55 to-negro" aria-hidden />

      <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-20 text-center md:px-8">
        <p className="aparecer etiqueta text-dorado">{hero.etiqueta}</p>
        <h1 className="aparecer mt-6 text-titulo leading-[1.05] [--retraso:150ms] md:text-titulo-lg lg:text-[5.25rem]">{hero.titulo}</h1>
        <Ornamento className="aparecer mt-8 [--retraso:300ms]" />
        <p className="aparecer mx-auto mt-8 max-w-xl text-lg leading-relaxed text-crema/80 [--retraso:400ms] md:text-xl">{hero.bajada}</p>
        <div className="aparecer mt-10 flex flex-col justify-center gap-3 [--retraso:550ms] sm:flex-row sm:gap-4">
          <a href="#vinos" className="boton boton-primario">
            Ver vinos
          </a>
          <a href="#arma-tu-caja" className="boton boton-dorado">
            Armá tu caja
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-dorado/70" aria-hidden />
    </section>
  )
}
