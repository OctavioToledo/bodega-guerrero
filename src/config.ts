/**
 * Configuración de la bodega: datos de contacto, textos del sitio y reglas de venta.
 * Todo lo que está acá es editable sin tocar los componentes. Los vinos van en `src/data/vinos.json`.
 */

/** Número de WhatsApp que recibe los pedidos: formato internacional, sin "+" ni espacios (54 9 + característica sin 0 + número sin 15). */
export const WHATSAPP_NUMBER = '5492634408957'

/** Botellas por caja. El pedido siempre es múltiplo de este número. */
export const BOX_SIZE: number = 6

/** De a cuántas botellas se elige cada vino dentro de una caja mixta. Tiene que dividir a BOX_SIZE (1, 2, 3 o 6). */
export const MIX_STEP: number = 3

/** Descuento por caja, en porcentaje (0 = sin descuento). Se aplica a todas las cajas, por vino y mixtas. */
export const BOX_DISCOUNT: number = 0

export const BODEGA = {
  nombre: 'Bodega Guerrero',
  /** Cómo se muestra el WhatsApp en el sitio */
  whatsappVisible: '263 440-8957',
  direccion: 'Ruta Provincial 15, km 29',
  localidad: 'Luján de Cuyo',
  provincia: 'Mendoza',
  /** Coordenadas del mapa (en Google Maps: clic derecho sobre el lugar → copiar las coordenadas) */
  coordenadas: { lat: -33.0398, lng: -68.8784 },
  horarios: ['Lunes a viernes, de 9 a 18 h', 'Sábados, de 10 a 14 h'],
  email: 'contacto@bodegaguerrero.com.ar',
  /** Usuarios, sin @ ni URL. Dejar en '' para ocultar la red. */
  instagram: 'bodegaguerrero',
  facebook: 'bodegaguerrero',
  /** Crédito discreto en el footer. Dejar nombre en '' para ocultarlo. */
  desarrollador: { nombre: 'Octavio Toledo', url: '' },
}

/** Textos del sitio. Son placeholders genéricos: reemplazarlos por los de la bodega. */
export const TEXTOS = {
  hero: {
    etiqueta: 'Luján de Cuyo · Mendoza',
    titulo: 'Vinos con historia, hechos en Mendoza',
    bajada: 'Elaboramos vinos de pequeña escala, al pie de la cordillera, con el mismo cuidado de siempre. Elegí los tuyos y te los acercamos.',
  },
  bodega: {
    titulo: 'Una familia, una tierra, un oficio',
    parrafos: [
      'Bodega Guerrero nació a fines de los años ochenta, cuando la familia compró unas pocas hectáreas de viñedo viejo en Luján de Cuyo y decidió elaborar su propio vino. Desde entonces, cada cosecha se trabaja a mano y en pequeña escala.',
      'Nuestros viñedos crecen a casi mil metros sobre el nivel del mar, con suelos pedregosos, días soleados y noches frescas que dan uvas de color profundo y buena acidez. En la bodega respetamos esa materia prima: fermentaciones cuidadas, crianza paciente en roble y botellas que salen solo cuando están listas.',
      'Hacemos vinos para compartir en la mesa, con identidad mendocina y sin apuro. Te invitamos a conocerlos.',
    ],
  },
  fotos: {
    /** Imagen de fondo del hero (horizontal, idealmente 1920×1080) */
    hero: '/fotos/hero-vinedo.svg',
    /** 2 o 3 fotos de la sección "La bodega" (horizontales, 4:3) */
    bodega: [
      { src: '/fotos/bodega-vinedo.svg', alt: 'Hileras del viñedo al pie de la cordillera' },
      { src: '/fotos/bodega-barricas.svg', alt: 'Barricas de roble en la cava' },
      { src: '/fotos/bodega-degustacion.svg', alt: 'Copa de vino tinto en la sala de degustación' },
    ],
  },
}
