export function Navbar({ page, setPage }) {
  const tabs = [
    { id: "gestiones", label: "Gestiones" },
    { id: "pedidos", label: "Pedidos" },
    { id: "cotizaciones", label: "Cotizaciones" },
  ]

  return (
    <nav className="navbar">
      <div 
        className="navbar-brand"
        onClick={() => setPage("landing")}
        style={{ cursor: "pointer" }}
      >
        <img src="/images/Logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">CRM ProScience</span>
      </div>

      <div className="navbar-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`nav-tab ${page === t.id ? "active" : ""}`}
            onClick={() => setPage(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}