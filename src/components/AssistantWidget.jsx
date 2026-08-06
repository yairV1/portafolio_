import { Suspense, lazy, useEffect, useState } from 'react'

const Assistant = lazy(() => import('../three/Assistant'))

/* Widget flotante y persistente (misma instancia en / y /expedientes). El canvas se monta con un
   pequeño retraso tras el primer render para no competir con el Hero por el primer frame. */
export default function AssistantWidget() {
  const [mounted, setMounted] = useState(false)
  const [greetSignal, setGreetSignal] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 1400)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="assistant-widget">
      <button
        type="button"
        className="assistant-trigger"
        onClick={() => setGreetSignal((n) => n + 1)}
        aria-label="Saludar a YAIR // AI"
        data-cursor
      >
        <span className="assistant-stage">
          {mounted && (
            <Suspense fallback={null}>
              <Assistant greetSignal={greetSignal} />
            </Suspense>
          )}
        </span>
      </button>
      <span className="assistant-tag">
        <i className="assistant-dot" />
        YAIR&nbsp;//&nbsp;AI
      </span>
    </div>
  )
}
