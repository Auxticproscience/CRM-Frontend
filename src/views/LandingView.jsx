import { useEffect, useState } from "react"

const modules = [
  {
    id: "gestiones",
    label: "Gestiones",
    desc: "Actividades diarias por zona y asesor",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
    ready: true,
    stat: "Activo",
  },
  {
    id: "cotizaciones",
    label: "Cotizaciones",
    desc: "Estado comercial y seguimiento",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/>
      </svg>
    ),
    ready: false,
    stat: "Próximamente",
  },
  {
    id: "pedidos",
    label: "Pedidos",
    desc: "Seguimiento de pedidos por cliente",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
        <path d="M16.5 9.4 7.55 4.24M3.29 7 12 12l8.71-5M12 22V12"/>
        <circle cx="18.5" cy="15.5" r="2.5"/>
        <path d="M20.27 17.27 22 19"/>
      </svg>
    ),
    ready: false,
    stat: "Próximamente",
  },
]

export default function LandingView({ setPage }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`lp-root ${visible ? "lp-visible" : ""}`}>
      <div className="lp-bg" aria-hidden="true">
        <div className="lp-grid" />
        <div className="lp-glow lp-glow-1" />
        <div className="lp-glow lp-glow-2" />
      </div>

      <main className="lp-main">
        <header className="lp-header">
          <div className="lp-logo-wrap">
            <img src="/images/Logo.png" alt="ProScience logo" className="lp-logo" />
          </div>
          <div className="lp-eyebrow">Sistema de gestión</div>
          <h1 className="lp-title">
            CRM <span className="lp-title-accent">ProScience</span>
          </h1>
          <p className="lp-subtitle">Gestión comercial por zonas</p>
        </header>

        <div className="lp-cards">
          {modules.map((m, i) => (
            <button
              key={m.id}
              className={`lp-card ${!m.ready ? "lp-card--soon" : ""}`}
              style={{ animationDelay: `${i * 90}ms` }}
              onClick={() => m.ready && setPage(m.id)}
              disabled={!m.ready}
            >
              <div className="lp-card-top">
                <div className="lp-card-icon">{m.icon}</div>
                <span className={`lp-badge ${m.ready ? "lp-badge--ready" : "lp-badge--soon"}`}>
                  {m.stat}
                </span>
              </div>
              <div className="lp-card-body">
                <h2 className="lp-card-title">{m.label}</h2>
                <p className="lp-card-desc">{m.desc}</p>
              </div>
              {m.ready && (
                <div className="lp-card-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <footer className="lp-footer">
          © 2026 ProScience · Datos actualizados diariamente
        </footer>
      </main>
    </div>
  )
}