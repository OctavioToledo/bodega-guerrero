import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../fuentes'
import '../index.css'
import { Arrepentimiento } from './Arrepentimiento'
import { Privacidad } from './Privacidad'
import { Terminos } from './Terminos'

/** Entrada común de las páginas legales: cada HTML indica cuál mostrar con `<body data-pagina="…">`. */
const PAGINAS = { terminos: Terminos, privacidad: Privacidad, arrepentimiento: Arrepentimiento }
const Pagina = PAGINAS[document.body.dataset.pagina as keyof typeof PAGINAS] ?? Terminos

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Pagina />
  </StrictMode>,
)
