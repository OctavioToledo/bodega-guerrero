Necesito construir una landing / catálogo online para "Bodega Guerrero", una bodega argentina. Es un clon funcional de la landing que hicimos para "Verto's Hot Dogs" (te adjunto el proyecto): misma lógica de carrito, mismo flujo de pedido por WhatsApp y mismo stack, adaptados a vinos. Todos los textos deben estar en español rioplatense (voseo), con tono serio, elegante y cálido. Los textos institucionales van genéricos, como placeholder fácil de reemplazar.

## 1. Objetivo
Sitio de una sola página, rápido, mobile-first (la mayoría entra desde el celular). El cliente navega el catálogo, arma su pedido en cajas de 6 botellas y al finalizar se abre WhatsApp con el pedido completo ya redactado (vinos, cantidades, subtotales y total). No hay cobro online: la venta, el pago y la entrega se cierran por WhatsApp.

## 2. Identidad visual
Estilo: serio, sobrio y elegante, de bodega de calidad. Mucho aire, buena jerarquía tipográfica, nada recargado.

Paleta (definila como variables CSS en :root):
- Negro: #14110F (fondos oscuros, hero, footer)
- Bordó / borravino: #6E1D2B (principal) y #7A2436 (hover/variante)
- Dorado: #C9A227 (solo detalles: líneas finas, íconos, bordes, separadores, precios destacados, estados activos). Nunca como fondo grande.
- Blanco / crema: #F7F3EC (fondos claros) y #FFFFFF
- Texto oscuro: #2B2320

Combinación sugerida: hero y footer en negro con detalles dorados; catálogo sobre crema; botones principales en bordó con texto blanco; dorado en filetes, numeración, íconos y bordes de tarjetas al hover. Alternar secciones claras y oscuras para dar ritmo.

Tipografía (Google Fonts): serif elegante para títulos (Cormorant Garamond o Playfair Display) y sans legible para cuerpo y UI (Inter o Montserrat). Títulos con letter-spacing leve; pequeñas etiquetas en mayúsculas espaciadas (ej. "NUESTROS VINOS").

Detalles: filetes dorados finos, ornamento minimalista (por ejemplo una línea con un rombo al centro) entre secciones, animaciones suaves al aparecer en scroll (fade/slide sutil). Nada estridente.

## 3. Secciones (en orden)
1. Header fijo: logo (placeholder "BODEGA GUERRERO" en serif), links ancla (Bodega, Vinos, Armá tu caja, Contacto) e ícono de carrito con contador de botellas. En mobile, menú hamburguesa.
2. Hero: fondo negro con imagen de viñedo (placeholder) y overlay oscuro. Título tipo "Vinos con historia, hechos en Mendoza", bajada breve y dos botones: "Ver vinos" y "Armá tu caja".
3. La bodega: texto institucional genérico de 100–150 palabras (historia, origen, qué la distingue) + 2 o 3 fotos (placeholders) + ubicación.
4. Catálogo de vinos: grilla de tarjetas (1 columna mobile, 2 tablet, 3–4 desktop). Filtros simples por línea/gama o varietal (chips). Cada tarjeta muestra: foto de la botella (vertical, fondo claro), nombre, línea, varietal, añada, volumen, descripción de 30–50 palabras, precio por botella y precio de la caja x6. Botón "Agregar caja x6" y selector de cantidad que va de a 6 (6, 12, 18…).
5. Armá tu caja (caja mixta): ver reglas en sección 4.
6. Contacto: dirección, horarios, WhatsApp, Instagram, Facebook, email y mapa embebido o link a Google Maps (placeholders).
7. Footer: logo, redes, "Beber con moderación. Prohibida su venta a menores de 18 años." y crédito discreto del desarrollador.

## 4. Reglas de venta (IMPORTANTE)
La venta es siempre por cajas de 6 botellas. El total de botellas del pedido siempre es múltiplo de 6 (6, 12, 18, 24…).

A) Vinos individuales: cada vino se agrega en cajas de 6 del mismo vino. El selector suma y resta de a 6. Nunca se puede tener un número de botellas que no sea múltiplo de 6 de un mismo vino comprado en forma individual.

B) Caja mixta ("Armá tu caja"): el cliente combina distintos vinos dentro de una caja de 6.
- Se eligen vinos de a 3 unidades (ej: 3 Malbec + 3 Cabernet Sauvignon = 1 caja de 6).
- Mostrar una caja visual con 6 casilleros que se van llenando con el nombre/color del vino elegido, más una barra de progreso: "Te faltan 3 botellas para completar tu caja".
- Si la caja tiene 3, ofrecer sugerencias directas: "Completá con x3 de…" con 2 o 3 vinos sugeridos en un clic.
- El botón "Agregar caja al pedido" solo se habilita cuando la caja está completa (6 botellas). Se pueden armar y agregar varias cajas mixtas distintas.
- Dejar como constantes configurables BOX_SIZE = 6 y MIX_STEP = 3, por si después se quiere permitir mezclar de a 1 o de a 2.

C) Precios: el precio es por botella; la caja se calcula como suma de las botellas. Dejar preparada una constante opcional BOX_DISCOUNT = 0 (porcentaje) por si la bodega quiere ofrecer descuento por caja. Formato de moneda en pesos argentinos con Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).

## 5. Carrito / resumen del pedido
- Resumen siempre visible: en mobile una barra fija abajo ("12 botellas · $XXX · Ver pedido") que abre un panel/drawer; en desktop un panel lateral o drawer desde el ícono del header.
- Detalle: cajas individuales (vino, cantidad de cajas, botellas, subtotal) y cajas mixtas (composición de cada una, subtotal). Permitir modificar cantidades (de a 6) y eliminar ítems o cajas mixtas.
- Total de botellas, total de cajas y total en pesos calculados automáticamente.
- Persistencia en localStorage: si el cliente cierra la página y vuelve, encuentra el pedido tal como lo dejó. Botón "Vaciar pedido" con confirmación.
- Campos opcionales antes de enviar: nombre y localidad/zona de entrega, y un campo de comentarios.

## 6. Envío por WhatsApp
Botón "Enviar pedido por WhatsApp" que abre https://wa.me/<NUMERO> con el texto prearmado (usar encodeURIComponent). El número va en una constante WHATSAPP_NUMBER (placeholder 5492610000000, formato internacional sin + ni espacios). Formato del mensaje:

```
¡Hola Bodega Guerrero! Quiero hacer el siguiente pedido:

🍷 CAJAS POR VINO
- Malbec Reserva 2022 (750 ml) — 1 caja x6 — $XX.XXX
- Cabernet Sauvignon 2021 (750 ml) — 2 cajas x6 — $XX.XXX

📦 CAJAS MIXTAS
- Caja mixta 1: 3 Malbec Reserva + 3 Cabernet Sauvignon — $XX.XXX

Total: 24 botellas (4 cajas)
TOTAL: $XXX.XXX

Nombre: …
Zona de entrega: …
Comentarios: …
```

El botón se deshabilita si el carrito está vacío o si hay una caja mixta incompleta (avisar con un mensaje claro).

## 7. Datos del catálogo
Los vinos deben salir de un único archivo de datos (ej. data/wines.js o wines.json), así actualizar precios o agregar/quitar vinos es editar solo ese archivo. Estructura por vino, que coincide con la planilla de carga que completa la bodega:
{ id, nombre, linea, varietal, anada, volumen, precio, descripcion, foto, destacado }
Cargá 8 vinos de ejemplo genéricos (Malbec, Cabernet Sauvignon, Cabernet Franc, Syrah, Blend, Chardonnay, Torrontés, Rosado) en 2 o 3 líneas (ej. "Línea Clásica", "Reserva", "Gran Reserva"), con precios ficticios realistas y fotos placeholder. Los datos de contacto también en un archivo de configuración (config.js): nombre, WhatsApp, dirección, horarios, redes, email.

## 8. Extras
- Aviso de edad al ingresar ("¿Sos mayor de 18 años?" Sí / No), recordado en localStorage. Discreto y acorde al diseño.
- SEO: title, meta description, Open Graph y Twitter Card para que el link se vea con vista previa al compartirlo por WhatsApp e Instagram. Favicon placeholder. HTML semántico y lang="es-AR".
- Accesibilidad: contraste suficiente (ojo con el dorado sobre crema: usarlo solo en detalles, no en texto chico), textos alternativos, foco visible, botones de tamaño táctil cómodo.
- Rendimiento: imágenes con lazy loading y dimensiones definidas, sin librerías innecesarias.
- Botón flotante de WhatsApp para consultas generales (sin pedido).

## 9. Entregable
Proyecto listo para publicar en Vercel, con un README breve que explique cómo cambiar el número de WhatsApp, editar vinos y precios, reemplazar fotos y textos, y ajustar BOX_SIZE, MIX_STEP y BOX_DISCOUNT.
