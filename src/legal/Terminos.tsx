import { BODEGA, BOX_SIZE, LEGAL, PRECIO_CAJA } from '../config'
import { DIAS_ARREPENTIMIENTO } from '../lib/arrepentimiento'
import { formatoPrecio } from '../lib/formato'
import { domicilio, identificacionTitular } from './datos'
import { PaginaLegal } from './PaginaLegal'

export function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones">
      <p>
        Estos términos explican cómo funciona la compra de nuestros vinos a través de este sitio. Al hacer un pedido, aceptás estas condiciones. Si tenés
        cualquier duda, escribinos antes de comprar.
      </p>

      <h2>1. Quiénes somos</h2>
      <p>
        El sitio y las ventas están a cargo de {identificacionTitular()}, con domicilio en {domicilio}. Podés contactarnos por WhatsApp al{' '}
        {BODEGA.whatsappVisible} o por email a <a href={`mailto:${BODEGA.email}`}>{BODEGA.email}</a>, {BODEGA.horarios.join(' y ').toLowerCase()}.
      </p>

      <h2>2. Venta solo a mayores de 18 años</h2>
      <p>
        Vendemos bebidas alcohólicas, cuya venta está prohibida a menores de 18 años (Ley 24.788). Al comprar declarás ser mayor de edad. Al momento de la
        entrega se puede pedir un documento a quien reciba el pedido, y no se entregará a menores. Nuestro jugo de uva sin alcohol también se vende por
        este medio y con las mismas condiciones.
      </p>

      <h2>3. Cómo se hace un pedido</h2>
      <ul>
        <li>
          Los vinos se venden por caja de {BOX_SIZE} botellas: de un mismo vino o combinando los que quieras en una caja mixta.
        </li>
        <li>
          En el sitio armás tu pedido y lo enviás por WhatsApp. Ese mensaje es una solicitud: <strong>la compra queda confirmada cuando te confirmamos la
          disponibilidad y recibimos el pago</strong>.
        </li>
        <li>Si algún vino no tuviera stock, te avisamos antes de cobrar para que elijas otro o ajustes el pedido.</li>
      </ul>

      <h2>4. Precios</h2>
      <p>
        Los precios están en pesos argentinos y son finales. Hoy, cualquier caja de {BOX_SIZE} botellas cuesta {formatoPrecio(PRECIO_CAJA)}, con el envío
        incluido. Los precios pueden cambiar sin previo aviso, pero se respeta el precio vigente al momento en que confirmamos tu pedido.
      </p>

      <h2>5. Pago</h2>
      <p>
        El pago se hace por {BODEGA.pago.toLowerCase()}. Te pasamos los datos por WhatsApp al confirmar el pedido. Nunca te vamos a pedir datos de
        tarjetas ni claves.
      </p>

      <h2>6. Envíos</h2>
      <ul>
        <li>Enviamos {BODEGA.envio.toLowerCase()}.</li>
        <li>
          {LEGAL.plazoEntrega
            ? `El envío demora ${LEGAL.plazoEntrega}, contado desde la confirmación del pago.`
            : 'Te informamos el plazo estimado de entrega al confirmar el pedido, según tu localidad.'}
        </li>
        <li>
          Al recibir el pedido, revisá que las cajas estén en buen estado. Si llega alguna botella rota o un producto equivocado, avisanos por WhatsApp lo
          antes posible, con fotos, y lo resolvemos sin costo para vos.
        </li>
      </ul>

      <h2>7. Derecho de arrepentimiento</h2>
      <p>
        Como toda compra a distancia, tenés {DIAS_ARREPENTIMIENTO} días corridos desde que recibís el pedido para arrepentirte, sin dar motivos (Ley
        24.240, art. 34, y Código Civil y Comercial, art. 1110). Los productos tienen que estar sin abrir y en el estado en que los recibiste. Los gastos
        de devolución corren por nuestra cuenta y te devolvemos el dinero por el mismo medio de pago.
      </p>
      <p>
        Podés hacerlo desde el <a href="/arrepentimiento/">botón de arrepentimiento</a>, sin registrarte ni hacer otros trámites: te damos un código de
        gestión en el momento.
      </p>

      <h2>8. Garantía y reclamos</h2>
      <p>
        Si un producto tiene un defecto, escribinos y lo cambiamos o te devolvemos el dinero, según prefieras, de acuerdo con la Ley 24.240 de Defensa
        del Consumidor. También podés hacer reclamos ante la autoridad de Defensa del Consumidor de tu provincia.
      </p>

      <h2>9. Datos personales</h2>
      <p>
        Usamos los datos que nos das solo para gestionar tu pedido. Los detalles están en la <a href="/privacidad/">política de privacidad</a>.
      </p>

      <h2>10. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de la República Argentina. Podemos actualizarlos: la versión vigente es la publicada en esta página, y cada
        pedido se rige por la versión vigente al momento de confirmarlo.
      </p>
    </PaginaLegal>
  )
}
