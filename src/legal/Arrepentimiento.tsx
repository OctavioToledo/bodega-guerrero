import { useState, type FormEvent, type ReactNode } from 'react'
import { BODEGA } from '../config'
import { IconoMail, IconoWhatsApp } from '../components/Iconos'
import { DIAS_ARREPENTIMIENTO, diasDesde, generarCodigo, mensajeArrepentimiento, type SolicitudArrepentimiento } from '../lib/arrepentimiento'
import { linkWhatsApp } from '../lib/whatsapp'
import { PaginaLegal } from './PaginaLegal'

const VACIA: SolicitudArrepentimiento = { nombre: '', telefono: '', email: '', fechaEntrega: '', productos: '', motivo: '' }

function Campo({ id, etiqueta, opcional = false, ayuda, children }: { id: string; etiqueta: string; opcional?: boolean; ayuda?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {etiqueta} {opcional && <span className="font-normal text-texto/65">(opcional)</span>}
      </label>
      {children}
      {ayuda && (
        <p id={`${id}-ayuda`} className="mt-1 text-sm text-texto/65">
          {ayuda}
        </p>
      )}
    </div>
  )
}

const hoy = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function Arrepentimiento() {
  const [datos, setDatos] = useState<SolicitudArrepentimiento>(VACIA)
  const [codigo, setCodigo] = useState<string | null>(null)

  const cambiar = (campo: keyof SolicitudArrepentimiento, valor: string) => setDatos((d) => ({ ...d, [campo]: valor }))
  const dias = diasDesde(datos.fechaEntrega)
  const fueraDePlazo = dias !== null && dias > DIAS_ARREPENTIMIENTO

  const enviar = (ev: FormEvent) => {
    ev.preventDefault()
    setCodigo(generarCodigo())
    window.scrollTo({ top: 0 })
  }

  const mensaje = codigo ? mensajeArrepentimiento(BODEGA.nombre, codigo, datos) : ''

  return (
    <PaginaLegal titulo="Botón de arrepentimiento" actualizacion={false}>
      {codigo ? (
        <div className="flex flex-col gap-5" role="status">
          <p>Listo. Este es el código de gestión de tu solicitud:</p>
          <p className="border border-dorado/60 bg-blanco px-5 py-4 text-center font-serif text-3xl tracking-[0.12em] text-bordo select-all">{codigo}</p>
          <p>
            <strong>Para que nos llegue, envianos la solicitud</strong> por WhatsApp o por email con el botón de abajo (el mensaje ya está escrito, con el
            código). Guardá el código: te sirve para seguir el trámite. Te respondemos para coordinar el retiro, sin costo, y la devolución del dinero.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={linkWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer" className="boton boton-primario no-underline">
              <IconoWhatsApp width={20} height={20} />
              Enviar por WhatsApp
            </a>
            <a
              href={`mailto:${BODEGA.email}?subject=${encodeURIComponent(`Arrepentimiento de compra ${codigo}`)}&body=${encodeURIComponent(mensaje)}`}
              className="boton boton-contorno no-underline"
            >
              <IconoMail width={20} height={20} />
              Enviar por email
            </a>
          </div>
          <button type="button" onClick={() => setCodigo(null)} className="min-h-11 self-start text-sm text-texto/70 underline underline-offset-4 hover:text-bordo">
            Corregir los datos
          </button>
        </div>
      ) : (
        <>
          <p>
            Si compraste a distancia, tenés <strong>{DIAS_ARREPENTIMIENTO} días corridos desde que recibiste el pedido</strong> para arrepentirte de la
            compra, sin dar explicaciones (Ley 24.240, art. 34). No hace falta registrarse ni hacer otro trámite: completá estos datos y te damos un código
            de gestión en el momento.
          </p>
          <ul>
            <li>Los productos tienen que estar sin abrir y en el estado en que los recibiste.</li>
            <li>El retiro corre por nuestra cuenta y te devolvemos el dinero por el mismo medio con el que pagaste.</li>
          </ul>

          <form onSubmit={enviar} className="mt-8 flex flex-col gap-5 border border-crema-oscuro bg-blanco p-5 md:p-8">
            <Campo id="nombre" etiqueta="Nombre y apellido">
              <input id="nombre" required autoComplete="name" value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} className="campo" />
            </Campo>
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo id="telefono" etiqueta="Teléfono">
                <input id="telefono" type="tel" required autoComplete="tel" value={datos.telefono} onChange={(e) => cambiar('telefono', e.target.value)} className="campo" />
              </Campo>
              <Campo id="email" etiqueta="Email" opcional>
                <input id="email" type="email" autoComplete="email" value={datos.email} onChange={(e) => cambiar('email', e.target.value)} className="campo" />
              </Campo>
            </div>
            <Campo id="fecha" etiqueta="¿Cuándo recibiste el pedido?" ayuda={fueraDePlazo ? undefined : 'Si no recordás el día exacto, poné uno aproximado.'}>
              <input
                id="fecha"
                type="date"
                required
                max={hoy()}
                value={datos.fechaEntrega}
                onChange={(e) => cambiar('fechaEntrega', e.target.value)}
                aria-describedby={fueraDePlazo ? 'fecha-plazo' : 'fecha-ayuda'}
                className="campo"
              />
              {fueraDePlazo && (
                <p id="fecha-plazo" className="mt-1 text-sm font-medium text-bordo">
                  Pasaron {dias} días desde la entrega, más que el plazo de {DIAS_ARREPENTIMIENTO}. Igual podés enviarnos la solicitud y la revisamos.
                </p>
              )}
            </Campo>
            <Campo id="productos" etiqueta="¿Qué querés devolver?">
              <textarea
                id="productos"
                required
                rows={2}
                value={datos.productos}
                onChange={(e) => cambiar('productos', e.target.value)}
                placeholder="Ej. 1 caja de Los Teritos Malbec"
                className="campo"
              />
            </Campo>
            <Campo id="motivo" etiqueta="Motivo" opcional>
              <textarea id="motivo" rows={2} value={datos.motivo} onChange={(e) => cambiar('motivo', e.target.value)} className="campo" />
            </Campo>
            <button type="submit" className="boton boton-primario mt-1 self-start">
              Generar código de gestión
            </button>
          </form>
          <p className="mt-6 text-sm text-texto/70">
            También podés pedirlo directamente por WhatsApp al {BODEGA.whatsappVisible} o por email a <a href={`mailto:${BODEGA.email}`}>{BODEGA.email}</a>.
          </p>
        </>
      )}
    </PaginaLegal>
  )
}
