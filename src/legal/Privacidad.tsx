import { BODEGA } from '../config'
import { domicilio, identificacionTitular } from './datos'
import { PaginaLegal } from './PaginaLegal'

export function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        Cuidamos los datos que nos compartís. Acá te contamos qué datos usamos, para qué y cómo podés pedir que los modifiquemos o los borremos, de acuerdo
        con la Ley 25.326 de Protección de los Datos Personales.
      </p>

      <h2>1. Responsable</h2>
      <p>
        El responsable de tus datos es {identificacionTitular()}, con domicilio en {domicilio}. Contacto: <a href={`mailto:${BODEGA.email}`}>{BODEGA.email}</a>{' '}
        o WhatsApp {BODEGA.whatsappVisible}.
      </p>

      <h2>2. Qué datos usamos</h2>
      <p>
        Este sitio no tiene cuentas de usuario ni formularios que envíen información a un servidor. Los datos nos llegan solo cuando vos nos escribís por
        WhatsApp o por email:
      </p>
      <ul>
        <li>Nombre, teléfono y, si nos lo das, email.</li>
        <li>Dirección y localidad de entrega, y los comentarios que agregues al pedido.</li>
        <li>El comprobante de la transferencia con la que pagás.</li>
      </ul>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Para confirmar y preparar tu pedido, coordinar el pago y hacer el envío.</li>
        <li>Para emitir la factura y cumplir con nuestras obligaciones legales.</li>
        <li>Para responder tus consultas, reclamos o pedidos de arrepentimiento.</li>
      </ul>
      <p>
        No vendemos ni cedemos tus datos. Solo compartimos con la empresa de transporte lo necesario para entregar el pedido (nombre, dirección y
        teléfono), y con organismos públicos cuando la ley lo exige.
      </p>

      <h2>4. Qué guarda el sitio en tu dispositivo</h2>
      <p>
        El sitio <strong>no usa cookies</strong> de seguimiento ni de publicidad. Solo guarda en tu navegador (almacenamiento local) dos cosas
        necesarias para que funcione: el pedido que estás armando y que confirmaste ser mayor de edad. Esa información no nos llega: queda en tu
        dispositivo y la podés borrar con el botón "Vaciar pedido" o borrando los datos del sitio en tu navegador.
      </p>
      <p>
        Al tocar un botón de WhatsApp se abre esa aplicación, que se rige por su propia política de privacidad. El sitio está alojado en Cloudflare,
        que puede registrar datos técnicos de las visitas (como la dirección IP) por seguridad.
      </p>

      <h2>5. Cuánto tiempo los guardamos</h2>
      <p>
        Guardamos los datos de tus pedidos mientras sean necesarios para las finalidades de arriba y durante los plazos que exigen las normas fiscales y
        de defensa del consumidor.
      </p>

      <h2>6. Tus derechos</h2>
      <p>
        Podés pedir en cualquier momento, y sin costo, acceder a tus datos, corregirlos, actualizarlos o que los borremos. Escribinos a{' '}
        <a href={`mailto:${BODEGA.email}`}>{BODEGA.email}</a> o por WhatsApp y te respondemos dentro de los plazos de la ley (10 días corridos para el
        acceso y 5 días hábiles para la rectificación o la supresión).
      </p>
      <p className="aviso-legal">
        El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a
        seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La
        AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias
        y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos
        personales.
      </p>

      <h2>7. Menores de edad</h2>
      <p>Este sitio vende bebidas alcohólicas y no está dirigido a menores de 18 años. No pedimos ni guardamos a sabiendas datos de menores.</p>

      <h2>8. Cambios</h2>
      <p>Si cambiamos esta política, publicamos la versión nueva en esta página con su fecha de actualización.</p>
    </PaginaLegal>
  )
}
