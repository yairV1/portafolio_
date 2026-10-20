import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './styles/app.css'

/* Pantalla de carga: se retira cuando las fuentes están listas (mín. 450 ms, máx. 1,6 s). */
const boot = document.getElementById('boot')
if (boot) {
  const t0 = performance.now()
  const hide = () => {
    const wait = Math.max(0, 450 - (performance.now() - t0))
    setTimeout(() => {
      boot.classList.add('boot-out')
      setTimeout(() => boot.remove(), 600)
    }, wait)
  }
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1600))]).then(hide)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
