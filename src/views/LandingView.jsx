export default function LandingView({ setPage }) {
  const modules = [
    { id: "gestiones", label: "Gestiones", desc: "Actividades por zona", icon: "📋", ready: true },
    { id: "pedidos", label: "Pedidos", desc: "Seguimiento de pedidos", icon: "📦", ready: false },
    { id: "cotizaciones", label: "Cotizaciones", desc: "Estado comercial", icon: "💰", ready: false },
  ]

  return (
    <div className="landing">
      <div className="landing-header">
        <img src="/images/Logo.png" alt="Logo" className="landing-logo" />
        <h1 className="landing-title">CRM ProScience</h1>
        <p className="landing-subtitle">Gestión comercial por zonas</p>
      </div>

      <div className="landing-cards">
        {modules.map((m) => (
          <button
            key={m.id}
            className={`module-card ${!m.ready ? "module-card--soon" : ""}`}
            onClick={() => setPage(m.id)}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
            <span>{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}