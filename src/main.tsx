import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contextos/AuthContext.tsx'
import App from './App.tsx'
import logoPreta from './imagens/logos/logo-preta.png'
import logoBranca from './imagens/logos/logo-branca.png'

function definirIconeDaAba() {
  const consultaTema = window.matchMedia?.('(prefers-color-scheme: dark)')
  const href = consultaTema?.matches ? logoBranca : logoPreta
  const iconeExistente = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (iconeExistente) {
    iconeExistente.href = href
    iconeExistente.type = 'image/png'
    return
  }

  const icon = document.createElement('link')
  icon.rel = 'icon'
  icon.type = 'image/png'
  icon.href = href
  document.head.appendChild(icon)
}

definirIconeDaAba()

const consultaTemaEscuro = window.matchMedia?.('(prefers-color-scheme: dark)')
consultaTemaEscuro?.addEventListener?.('change', definirIconeDaAba)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
