import { useState } from "react"
import { Navbar } from "./components/Navbar"
import { ComingSoon } from "./components/ComingSoon"
import LandingView from "./views/LandingView"
import GestionesView from "./views/GestionesView"

export default function App() {
  const [page, setPage] = useState("landing")

  return (
    <div className="app-root">
      {page !== "landing" && <Navbar page={page} setPage={setPage} />}

      <main className="app-main">
        {page === "landing" && <LandingView setPage={setPage} />}
        {page === "gestiones" && <GestionesView />}
        {page === "pedidos" && <ComingSoon title="Pedidos" />}
        {page === "cotizaciones" && <ComingSoon title="Cotizaciones" />}
      </main>
    </div>
  )
}