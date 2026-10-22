/**
 * Configuración de la bodega: datos de contacto, textos del sitio y reglas de venta.
 * Todo lo que está acá es editable sin tocar los componentes. Los vinos van en `src/data/vinos.json`.
 */

/** Número de WhatsApp que recibe los pedidos: formato internacional, sin "+" ni espacios (54 9 + característica sin 0 + número sin 15). */
export const WHATSAPP_NUMBER = '5492634409143'

/** Botellas por caja. El pedido siempre es múltiplo de este número. */
export const BOX_SIZE: number = 6

/** De a cuántas botellas se elige cada vino dentro de una caja mixta. Tiene que dividir a BOX_SIZE (1, 2, 3 o 6). */
export const MIX_STEP: number = 1

/** Precio de cualquier caja (de un mismo vino o mixta), en pesos, con envío incluido. */
export const PRECIO_CAJA: number = 55000

export const BODEGA = {
  nombre: 'Bodega Guerrero',
  /** Cómo se muestra el WhatsApp en el sitio */
  whatsappVisible: '263 440-9143',
  /** Quién atiende las consultas y los pedidos */
  contacto: 'Luciana',
  localidad: 'Medrano, Junín',
  provincia: 'Mendoza',
  horarios: ['Lunes a viernes, de 9 a 18 h', 'Sábados, de 10 a 16 h'],
  envio: 'A todo el país, sin cargo',
  pago: 'Transferencia bancaria',
  email: 'aaguerrero00@gmail.com',
  /** Usuarios, sin @ ni URL. Dejar en '' para ocultar la red. */
  instagram: 'bodega.guerrero',
  facebook: '',
  /** Crédito discreto en el footer. Dejar nombre en '' para ocultarlo. */
  desarrollador: { nombre: 'Octavio Toledo', url: '' },
}

/**
 * Datos para las páginas legales (términos, privacidad, arrepentimiento) y el footer.
 * Si un dato queda vacío, el sitio lo omite o usa un texto general: se puede publicar antes de tenerlos todos.
 */
export const LEGAL = {
  /** Razón social o nombre y apellido del titular, como figura en ARCA. Vacío: se usa el nombre de la bodega. */
  titular: '',
  /** CUIT del titular, con guiones (ej. "20-12345678-9"). */
  cuit: '',
  /** Domicilio legal o fiscal. Vacío: se muestra la localidad. */
  domicilio: '',
  /** Plazo estimado de entrega, completa la frase "El envío demora …" (ej. "entre 3 y 7 días hábiles, según la localidad"). */
  plazoEntrega: '',
  /** Data Fiscal de ARCA (Formulario 960/D): el link y la imagen del código que da ARCA para sitios web. Vacío: no se muestra. */
  dataFiscal: { enlace: '', imagen: '' },
  /** Fecha de la última actualización de términos y privacidad */
  actualizacion: '22 de octubre de 2026',
}

/** Textos del sitio. */
export const TEXTOS = {
  hero: {
    etiqueta: 'Medrano · Junín · Mendoza',
    titulo: 'Vinos dulces naturales, hechos en familia',
    bajada: 'Bodega familiar especializada en vinos dulces naturales. Armá tu caja de 6 como quieras y te la llevamos sin cargo a todo el país.',
  },
  bodega: {
    titulo: 'Cinco generaciones, una misma pasión',
    parrafos: [
      'Somos una pequeña bodega familiar ubicada en Medrano, Junín. Nuestra historia en el mundo del vino viene de principios del siglo XX, cuando Lorenzo Guerrero se convirtió en el primer enólogo de la familia.',
      'Hoy, ya en la quinta generación, elegimos una mirada más moderna y descontracturada del vino, sin perder la calidad, que es uno de nuestros estandartes.',
      'Trabajamos con una materia prima muy cuidada y una excelente relación calidad/precio, con una misión: recorrer la Argentina dando a conocer nuestros vinos.',
    ],
  },
  fotos: {
    /** Imagen de fondo del hero (horizontal, idealmente 1920×1080) */
    hero: '/fotos/hero-vinedo.jpg',
  },
}
