import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ComingSoon } from "./components/ComingSoon";
import LandingView from "./views/LandingView";
import GestionesView from "./views/GestionesView";
import CotizacionesView from "./views/CotizacionesView";
import AppLoader from "./components/AppLoader";

export default function App() {
  const [page, setPage] = useState("landing");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-root">

      <AppLoader loading={loading} />

      {page !== "landing" && <Navbar page={page} setPage={setPage} />}

      <main className="app-main">
        {page === "landing" && <LandingView setPage={setPage} />}
        {page === "gestiones" && <GestionesView />}
        {page === "cotizaciones" && <CotizacionesView />}
        {page === "pedidos" && <ComingSoon title="Pedidos" />}
      </main>
    </div>
  );
}