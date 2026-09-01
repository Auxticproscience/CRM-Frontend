import { useState } from "react";
import { Navbar } from "./components/Navbar";
import LandingView from "./views/LandingView";
import GestionesView from "./views/GestionesView";
import CotizacionesView from "./views/CotizacionesView";
import DashboardView from "./views/DashboardView";

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="app-root">
      {page !== "landing" && <Navbar page={page} setPage={setPage} />}

      <main className="app-main">
        {page === "landing" && <LandingView setPage={setPage} />}
        {page === "gestiones" && <GestionesView />}
        {page === "cotizaciones" && <CotizacionesView />}
        {page === "dashboard" && <DashboardView />}
      </main>
    </div>
  );
}
