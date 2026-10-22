import type { SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement>

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

/** Caja de vinos, para el botón del pedido. */
export function IconoCaja(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <path d="M3.5 8.5 12 4l8.5 4.5v9L12 22l-8.5-4.5v-9Z" />
      <path d="M3.5 8.5 12 13l8.5-4.5M12 13v9" />
    </svg>
  )
}

export function IconoCopa(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <path d="M7 3h10l-.6 5.2A4.4 4.4 0 0 1 12 12a4.4 4.4 0 0 1-4.4-3.8L7 3Z" />
      <path d="M7.4 7h9.2M12 12v8M8.5 21h7" />
    </svg>
  )
}

export function IconoMenu(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconoReloj(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function IconoPin(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

export function IconoMail(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  )
}

export function IconoMas(props: Props) {
  return (
    <svg {...base} width={18} height={18} strokeWidth={2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconoMenos(props: Props) {
  return (
    <svg {...base} width={18} height={18} strokeWidth={2} {...props}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconoTacho(props: Props) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
    </svg>
  )
}

export function IconoCerrar(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconoFlecha(props: Props) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconoWhatsApp(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill="currentColor" aria-hidden focusable={false} {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  )
}

export function IconoInstagram(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

export function IconoFacebook(props: Props) {
  return (
    <svg {...base} width={24} height={24} {...props}>
      <path d="M14.5 8H16V4.5h-2a4 4 0 0 0-4 4V11H8v3.5h2V21h3.5v-6.5H16l.5-3.5h-3V9a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function IconoPausa(props: Props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M9 5v14M15 5v14" />
    </svg>
  )
}

export function IconoPlay(props: Props) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M7 5v14l12-7Z" />
    </svg>
  )
}
