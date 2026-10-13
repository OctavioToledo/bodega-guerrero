import { WHATSAPP_NUMBER } from '../config'

export function linkWhatsApp(texto: string, numero = WHATSAPP_NUMBER): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}
