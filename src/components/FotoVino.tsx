import { tipoDe } from '../lib/datos'
import type { TipoVino, Vino } from '../lib/tipos'

const COLORES: Record<TipoVino, { vidrio: string; liquido: string }> = {
  tinto: { vidrio: '#1f2a20', liquido: '#6E1D2B' },
  blanco: { vidrio: '#7d8a5a', liquido: '#e3cf8a' },
  rosado: { vidrio: '#e9d3cf', liquido: '#e3a6b0' },
}

/** Silueta de botella en los colores del tipo de vino. Se usa cuando el vino no tiene foto y en la caja mixta. */
export function SiluetaBotella({ tipo, className = '' }: { tipo: TipoVino; className?: string }) {
  const c = COLORES[tipo]
  return (
    <svg viewBox="0 0 40 120" className={className} aria-hidden focusable={false}>
      <path d="M16 4h8v26c0 6 10 10 10 22v60a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V52c0-12 10-16 10-22V4Z" fill={c.vidrio} />
      <path d="M7 70h26v42a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4V70Z" fill={c.liquido} opacity={tipo === 'tinto' ? 0.55 : 0.85} />
      <rect x="15.5" y="2" width="9" height="16" rx="1.5" fill="#C9A227" />
      <rect x="9" y="66" width="22" height="26" fill="#F7F3EC" />
      <path d="M12 72h16M14 86h12" stroke="#6E1D2B" strokeWidth="1.2" />
    </svg>
  )
}

/** Fondo de la foto, apenas teñido con el color de etiqueta del tipo. */
const FONDO: Record<TipoVino, string> = {
  tinto: 'from-crema to-crema-oscuro',
  blanco: 'from-crema to-celeste-claro',
  rosado: 'from-crema to-rosa-claro',
}

/** Foto vertical de la botella sobre fondo claro. */
export function FotoVino({ vino }: { vino: Vino }) {
  return (
    <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-b ${FONDO[tipoDe(vino)]} p-5 sm:aspect-[3/4] sm:p-6`}>
      {vino.foto ? (
        <img
          src={vino.foto}
          alt={`Botella de ${vino.nombre}${vino.anada ? ` ${vino.anada}` : ''}`}
          width={600}
          height={800}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 ease-(--ease-suave) group-hover:scale-[1.03]"
        />
      ) : (
        <SiluetaBotella tipo={tipoDe(vino)} className="h-[85%]" />
      )}
    </div>
  )
}
