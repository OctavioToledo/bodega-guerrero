# Bodega Guerrero — Catálogo y pedidos por WhatsApp

Sitio de una sola página: catálogo de vinos, pedido por cajas de 6 (por vino o mixtas) y envío del pedido armado por WhatsApp. Sin backend ni cobro online.

Stack: Vite + React + TypeScript + Tailwind CSS. Sitio 100 % estático.

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm test         # tests de las reglas de venta y del mensaje
npm run build    # genera dist/
```

## Publicar en Vercel

1. Subir el proyecto a GitHub e importarlo en Vercel. Detecta Vite solo (build `npm run build`, salida `dist`).
2. Cuando esté el dominio propio, cargar la variable `VITE_SITE_URL` (ej. `https://bodegaguerrero.com.ar`) en *Settings → Environment Variables*. Se usa para la imagen de vista previa al compartir el link. Mientras no esté, se usa sola la URL de Vercel.

## Qué se edita y dónde

Todo lo editable vive en **dos archivos**. No hace falta tocar componentes.

### `src/config.ts` — contacto, textos y reglas de venta

| Qué | Dónde |
|---|---|
| Número de WhatsApp que recibe los pedidos | `WHATSAPP_NUMBER`. Formato internacional sin `+` ni espacios: `549` + característica sin 0 + número sin 15. Ej.: (261) 15 555-1234 → `5492615551234`. |
| Número como se muestra en el sitio | `BODEGA.whatsappVisible` |
| Dirección, horarios, email, Instagram, Facebook | `BODEGA` (dejar una red en `''` para ocultarla) |
| Ubicación del mapa | `BODEGA.coordenadas` (en Google Maps: clic derecho sobre la bodega → copiar las coordenadas) |
| Título y bajada del hero, texto institucional | `TEXTOS.hero` y `TEXTOS.bodega` |
| Fotos del hero y de "La bodega" | `TEXTOS.fotos` |
| Crédito del desarrollador en el footer | `BODEGA.desarrollador` |

#### Reglas de venta

```ts
export const BOX_SIZE: number = 6      // botellas por caja
export const MIX_STEP: number = 3      // de a cuántas botellas se elige cada vino en la caja mixta
export const BOX_DISCOUNT: number = 0  // descuento por caja, en %
```

- **`BOX_SIZE`**: los vinos se venden siempre en cajas de este tamaño y el pedido total siempre es múltiplo de este número.
- **`MIX_STEP`**: con `3`, la caja mixta se arma con 3 + 3. Con `2` se puede hacer 2 + 2 + 2, y con `1`, cualquier combinación. Tiene que dividir a `BOX_SIZE` (con 6: 1, 2, 3 o 6).
- **`BOX_DISCOUNT`**: con `10`, todas las cajas (por vino y mixtas) salen 10 % menos. El sitio muestra el descuento en las tarjetas, la caja mixta, el resumen y el mensaje de WhatsApp.

Si se cambian estas reglas, los pedidos que los clientes tengan guardados en el navegador y ya no cumplan las reglas nuevas se descartan solos.

### `src/data/vinos.json` — catálogo y precios

Un bloque por vino, con las mismas columnas que la planilla de carga:

```json
{
  "id": "malbec-reserva",
  "nombre": "Malbec Reserva",
  "linea": "Reserva",
  "varietal": "Malbec",
  "anada": 2022,
  "volumen": 750,
  "precio": 17800,
  "descripcion": "Rojo intenso con reflejos violáceos…",
  "foto": "/fotos/malbec-reserva.jpg",
  "destacado": true,
  "disponible": true
}
```

- **Cambiar un precio**: editar `precio` (por botella, sin puntos ni `$`). La caja se calcula sola.
- **Agregar un vino**: copiar un bloque, cambiar el `id` (único, en minúsculas y con guiones) y los datos. Ojo con las comas entre bloques.
- **Quitar un vino temporalmente**: `"disponible": false`. Para sacarlo del todo, borrar el bloque.
- **`anada`**: `null` si el vino no tiene añada.
- **`destacado`**: muestra la etiqueta "Destacado" y lo prioriza en las sugerencias de la caja mixta.
- Los filtros por línea se arman solos con los valores de `linea`. Tinto, blanco o rosado se deduce del varietal.

## Fotos

Van en `public/fotos/`. Las que hay ahora son ilustraciones provisorias (`.svg`).

- **Botellas**: vertical, botella completa, fondo claro y liso, idealmente 600×800 px, en `.jpg` o `.webp`. Copiar el archivo a `public/fotos/` y poner el nombre en el campo `foto` del vino (ej. `"/fotos/malbec-reserva.jpg"`). Con `"foto": null` se muestra una botella ilustrada.
- **Hero**: horizontal, 1920×1080 aprox. Cambiar `TEXTOS.fotos.hero`.
- **La bodega**: 2 o 3 fotos horizontales 4:3 (1200×900). Cambiar `TEXTOS.fotos.bodega`, cada una con su texto alternativo (`alt`).
- **Vista previa al compartir** (`public/og.jpg`, 1200×630), **favicon** (`public/favicon.svg`) y **ícono de iPhone** (`public/apple-touch-icon.png`, 180×180): reemplazar cuando esté el logo.
- **Logo**: hoy es el nombre en texto, en `src/components/Header.tsx`, `Footer.tsx` y `AvisoEdad.tsx`.

Para el título y la descripción de la vista previa (WhatsApp, Instagram, Google), editar las etiquetas `<title>`, `description`, `og:*` y `twitter:*` de `index.html`.

## Cómo funciona el pedido

- **Cajas por vino**: "Agregar caja x6" suma 6 botellas del mismo vino; el selector suma y resta de a una caja.
- **Caja mixta**: se eligen vinos de a `MIX_STEP` botellas hasta llenar la caja. "Agregar caja al pedido" se habilita solo con la caja completa. Se pueden armar varias.
- El pedido queda guardado en el navegador (`localStorage`): si el cliente cierra y vuelve, lo encuentra igual.
- "Enviar pedido por WhatsApp" abre `wa.me` con el mensaje redactado. Se deshabilita si el pedido está vacío o si hay una caja mixta sin terminar.
- El aviso "¿Sos mayor de 18 años?" se recuerda en el navegador después de responder que sí.
