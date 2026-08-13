import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/tokens.css'
import './styles/base.css'

const domNode = document.getElementById('root')

if (domNode === null) {
  throw new Error('Élément racine #root introuvable dans le document')
}

createRoot(domNode).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
