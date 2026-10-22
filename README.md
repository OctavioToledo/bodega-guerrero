# Bodega Guerrero — Catálogo y pedidos por WhatsApp

Sitio de una sola página: catálogo de vinos, pedido por cajas de 6 (por vino o mixtas) y envío del pedido armado por WhatsApp. Sin backend ni cobro online.

Stack: Vite + React + TypeScript + Tailwind CSS. Sitio 100 % estático.

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm test         # tests de las reglas de venta y del mensaje
npm run build    # genera dist/
```

## Publicación

El sitio está publicado en Cloudflare (Workers con archivos estáticos), conectado al repo de GitHub: **cada push a `main` lo vuelve a publicar solo**.

- Sitio: https://bodega-guerrero.octatoledo7.workers.dev
- Build: `npm run build`, carpeta de salida `dist`. La versión de Node sale del archivo `.node-version`.

### URL del sitio (`.env.production`)

`VITE_SITE_URL` en `.env.production` es la URL pública, sin barra final. Se usa para la imagen de vista previa al compartir el link por WhatsApp e Instagram, que necesitan una dirección completa. No es un dato secreto, por eso está en el repo.

### Dominio propio

1. En Cloudflare, en el Worker: **Settings → Domains & Routes → Add → Custom domain** y seguir los pasos (con un dominio `.com.ar` de NIC Argentina, hay que delegar los DNS a Cloudflare).
2. Cambiar `VITE_SITE_URL` en `.env.production` por el dominio nuevo (ej. `https://bodegaguerrero.com.ar`) y hacer push, para que la vista previa use el dominio.

## Qué se edita y dónde

Todo lo editable vive en **dos archivos**. No hace falta tocar componentes.

### `src/config.ts` — contacto, textos y reglas de venta

| Qué | Dónde |
|---|---|
| Número de WhatsApp que recibe los pedidos | `WHATSAPP_NUMBER`. Formato internacional sin `+` ni espacios: `549` + característica sin 0 + número sin 15. Ej.: (261) 15 555-1234 → `5492615551234`. |
| Número como se muestra en el sitio | `BODEGA.whatsappVisible` |
| Localidad, horarios, envío, forma de pago, persona de contacto, email, Instagram, Facebook | `BODEGA` (dejar una red en `''` para ocultarla) |
| Título y bajada del hero, texto institucional | `TEXTOS.hero` y `TEXTOS.bodega` |
| Fotos del hero y de "La bodega" | `TEXTOS.fotos` |
| Crédito del desarrollador en el footer | `BODEGA.desarrollador` |

#### Reglas de venta

```ts
export const BOX_SIZE: number = 6      // botellas por caja
export const MIX_STEP: number = 1      // de a cuántas botellas se elige cada vino en la caja mixta
export const PRECIO_CAJA: number = 55000  // precio de cualquier caja, con envío incluido
```

- **`BOX_SIZE`**: los vinos se venden siempre en cajas de este tamaño y el pedido total siempre es múltiplo de este número.
- **`MIX_STEP`**: con `1` (lo actual), el cliente elige las 6 botellas que quiera, de los vinos que quiera. Con `3`, la caja mixta se arma con 3 + 3, y con `2`, con 2 + 2 + 2. Tiene que dividir a `BOX_SIZE` (con 6: 1, 2, 3 o 6).
- **`PRECIO_CAJA`**: todas las cajas valen lo mismo, sean de un mismo vino o mixtas, con envío incluido a todo el país. Para cambiar el precio se edita solo este número (sin puntos ni `$`).

Si se cambian estas reglas, los pedidos que los clientes tengan guardados en el navegador y ya no cumplan las reglas nuevas se descartan solos.

### `src/data/vinos.json` — catálogo y precios

Un bloque por vino, con las mismas columnas que la planilla de carga:

```json
{
  "id": "los-teritos-malbec",
  "nombre": "Los Teritos Malbec",
  "linea": "Seco",
  "varietal": "Malbec",
  "anada": null,
  "volumen": 750,
  "descripcion": "Rojo violáceo intenso y brillante…",
  "cata": { "vista": "…", "nariz": "…", "boca": "…" },
  "foto": "/fotos/los-teritos-malbec.jpg",
  "destacado": false,
  "disponible": true
}
```

- **Agregar un vino**: copiar un bloque, cambiar el `id` (único, en minúsculas y con guiones) y los datos. Ojo con las comas entre bloques.
- **Quitar un vino temporalmente**: `"disponible": false`. Para sacarlo del todo, borrar el bloque.
- **`anada`**: `null` si el vino no tiene añada.
- **`recorte`**: la botella sin fondo para el mostrador de "La bodega". Sin este campo, el vino no aparece en el mostrador.
- **`cata`**: nota de cata (vista, nariz, boca) que se despliega en la tarjeta. Se puede omitir.
- **`destacado`**: muestra la etiqueta "Destacado" y lo prioriza en las sugerencias de la caja mixta.
- Los filtros se arman solos con los valores de `linea` (hoy: Dulce natural, Seco, Sin alcohol). Tinto, blanco o rosado se deduce del varietal.

## Fotos

Van en `public/fotos/`. Las botellas son las fotos de la bodega; el hero es una ilustración de un viñedo con la hoja del logo (`hero-vinedo.jpg`).

- **Botellas**: vertical, botella completa, fondo claro y liso, idealmente 600×800 px, en `.jpg` o `.webp`. Copiar el archivo a `public/fotos/` y poner el nombre en el campo `foto` del vino (ej. `"/fotos/malbec-reserva.jpg"`). Con `"foto": null` se muestra una botella ilustrada.
- **Hero**: horizontal, 1920×1080 aprox. Cambiar `TEXTOS.fotos.hero`.
- **Mostrador de "La bodega"**: las botellas en fila, en 3D, con la elegida al frente. Usa el campo `recorte` de cada vino: la botella sola, sin fondo (`.webp` o `.png` con transparencia, alrededor de 1000 px de alto, recortada justo al borde de la botella), en `public/fotos/botellas/`. Gira solo cada 4 s (`INTERVALO` en `src/components/Mostrador.tsx`); se frena con el mouse encima y tiene flechas y botón de pausa.
- **Vista previa al compartir** (`public/og.jpg`, 1200×630), **favicon** (`public/favicon.png`) e **ícono de iPhone** (`public/apple-touch-icon.png`, 180×180): generados a partir del logo de la bodega.
- **Logo**: la hoja dorada (`public/logo-hoja.png`, con transparencia) junto al nombre en texto, en `src/components/Header.tsx`, `Footer.tsx` y `AvisoEdad.tsx`.

Para el título y la descripción de la vista previa (WhatsApp, Instagram, Google), editar las etiquetas `<title>`, `description`, `og:*` y `twitter:*` de `index.html`.

## Cómo funciona el pedido

- **Cajas por vino**: "Agregar caja x6" suma 6 botellas del mismo vino; el selector suma y resta de a una caja.
- **Caja mixta**: se eligen vinos de a `MIX_STEP` botellas hasta llenar la caja. "Agregar caja al pedido" se habilita solo con la caja completa. Se pueden armar varias.
- El pedido queda guardado en el navegador (`localStorage`): si el cliente cierra y vuelve, lo encuentra igual.
- "Enviar pedido por WhatsApp" abre `wa.me` con el mensaje redactado. Se deshabilita si el pedido está vacío o si hay una caja mixta sin terminar.
- El aviso "¿Sos mayor de 18 años?" se recuerda en el navegador después de responder que sí.
