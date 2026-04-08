import { useState } from "react";
/* import GestionesView from "./views/GestionesView"; */

// Pantalla temporal para módulos en construcción
function ComingSoon({ title }) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-icon">🚧</div>
      <h2>{title}</h2>
      <p>Módulo en construcción. Próximamente disponible.</p>
    </div>
  );
}

// Barra de navegación superior
function Navbar({ page, setPage }) {
  const tabs = [
    { id: "gestiones", label: "Gestiones" },
    { id: "pedidos",   label: "Pedidos" },
    { id: "cotizaciones", label: "Cotizaciones" },
  ];
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setPage("landing")} style={{ cursor: "pointer" }}>
        <img src="/images/logo.png" alt="Logo" className="navbar-logo" />
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
  );
}

// Landing principal
function LandingView({ setPage }) {
  const modules = [
    {
      id: "gestiones",
      label: "Gestiones",
      desc: "Actividades diarias por zona y asesor",
      icon: "📋",
      ready: true,
    },
    {
      id: "pedidos",
      label: "Pedidos",
      desc: "Seguimiento de pedidos por cliente",
      icon: "📦",
      ready: false,
    },
    {
      id: "cotizaciones",
      label: "Cotizaciones",
      desc: "Registro y estado de cotizaciones",
      icon: "💰",
      ready: false,
    },
  ];

  return (
    <div className="landing">
      <div className="landing-header">
        <img src="/images/logo.png" alt="Logo" className="landing-logo" />
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
            <span className="module-icon">{m.icon}</span>
            <span className="module-label">{m.label}</span>
            <span className="module-desc">{m.desc}</span>
            {!m.ready && <span className="module-badge">Próximamente</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");

  const showNavbar = page !== "landing";

  return (
    <div className="app-root">
      {showNavbar && <Navbar page={page} setPage={setPage} />}
      <main className="app-main">
        {page === "landing"      && <LandingView setPage={setPage} />}
        {page === "gestiones"    && <GestionesView />}
        {page === "pedidos"      && <ComingSoon title="Pedidos" />}
        {page === "cotizaciones" && <ComingSoon title="Cotizaciones" />}
      </main>
    </div>
  );
}