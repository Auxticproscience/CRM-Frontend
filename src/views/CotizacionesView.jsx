import { useState, useEffect } from 'react'
import { useCotizaciones }    from '../hooks/useCotizaciones.js'
import { CotizacionesTable }  from '../components/CotizacionesTable.jsx'
import { Pagination }         from '../components/Pagination.jsx'

const PAGE_SIZE = 25

function fmtMoneda(val) {
  if (!val) return '$0'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(val)
}

// ── Selector de columnas ──────────────────────────────────────────
function ColSelector({ COLS_DISPONIBLES, colsVisibles, toggleCol }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="col-selector">
      <button
        className="col-selector-btn"
        onClick={() => setOpen(o => !o)}
        title="Mostrar / ocultar columnas"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
        </svg>
        Columnas
        <span className="col-count">{colsVisibles.size}</span>
      </button>

      {open && (
        <>
          <div className="col-selector-backdrop" onClick={() => setOpen(false)} />
          <div className="col-selector-panel">
            <div className="col-selector-header">Columnas visibles</div>
            {COLS_DISPONIBLES.map(c => (
              <label key={c.key} className="col-selector-item">
                <input
                  type="checkbox"
                  checked={colsVisibles.has(c.key)}
                  onChange={() => toggleCol(c.key)}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Stats de cotizaciones ─────────────────────────────────────────
function CotizacionesStats({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-value">{stats.total}</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-label">Valor total</span>
        <span className="stat-value">{fmtMoneda(stats.valorTotal)}</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-label">Con pedido ERP</span>
        <span className="stat-value">{stats.conPedido}</span>
      </div>
    </div>
  )
}

// ── Filtros ───────────────────────────────────────────────────────
function CotizacionesFiltros({ crm }) {
  return (
    <div className="filter-bar">
      {/* Búsqueda libre */}
      <div className="filter-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Buscar cotización, cliente, ERP…"
          value={crm.search}
          onChange={e => { crm.setSearch(e.target.value); crm.setPage(1) }}
        />
      </div>

      {/* Selects */}
      <select value={crm.filterPropietario}
        onChange={e => { crm.setFilterPropietario(e.target.value); crm.setPage(1) }}>
        <option value="">Propietario</option>
        {crm.options.propietarios.map(o => <option key={o}>{o}</option>)}
      </select>

      <select value={crm.filterCliente}
        onChange={e => { crm.setFilterCliente(e.target.value); crm.setPage(1) }}>
        <option value="">Cliente</option>
        {crm.options.clientes.map(o => <option key={o}>{o}</option>)}
      </select>

      <select value={crm.filterCentro}
        onChange={e => { crm.setFilterCentro(e.target.value); crm.setPage(1) }}>
        <option value="">Centro operación</option>
        {crm.options.centros.map(o => <option key={o}>{o}</option>)}
      </select>

      <select value={crm.filterCondicion}
        onChange={e => { crm.setFilterCondicion(e.target.value); crm.setPage(1) }}>
        <option value="">Condición pago</option>
        {crm.options.condiciones.map(o => <option key={o}>{o}</option>)}
      </select>

      {/* Fechas */}
      <input type="date" value={crm.dateFrom}
        onChange={e => { crm.setDateFrom(e.target.value); crm.setPage(1) }} />
      <input type="date" value={crm.dateTo}
        onChange={e => { crm.setDateTo(e.target.value); crm.setPage(1) }} />

      {/* Limpiar */}
      {crm.activeFilters.length > 0 && (
        <button className="btn-clear" onClick={crm.clearFilters}>
          Limpiar filtros
        </button>
      )}

      {/* Chips de filtros activos */}
      {crm.activeFilters.length > 0 && (
        <div className="active-filters">
          {crm.activeFilters.map(f => (
            <span key={f.key} className="filter-chip">
              {f.label}
              <button onClick={f.clear}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CotizacionesView() {
  const crm = useCotizaciones()
  const [now, setNow] = useState('')

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <header className="topbar">
        <div className="topbar-brand">
          <div className="dot" />
        </div>
        <span className="topbar-meta">{now}</span>
      </header>

      <div className="main">
        <CotizacionesStats stats={crm.stats} />
        <CotizacionesFiltros crm={crm} />
       </div>

      <div className="table-section">
        <div className="table-header">
          <span className="table-title">
            Cotizaciones
            <span className="count-badge">{crm.filtered.length}</span>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              Página {crm.page} de {crm.totalPages}
            </span>
            {/* Selector de columnas */}
            <ColSelector
              COLS_DISPONIBLES={crm.COLS_DISPONIBLES}
              colsVisibles={crm.colsVisibles}
              toggleCol={crm.toggleCol}
            />
          </div>
        </div>

        <CotizacionesTable
          rows={crm.paginated}
          loading={crm.loading}
          sortKey={crm.sortKey}
          sortDir={crm.sortDir}
          toggleSort={crm.toggleSort}
          colsVisibles={crm.colsVisibles}
          COLS_DISPONIBLES={crm.COLS_DISPONIBLES}
        />

        <Pagination
          page={crm.page}
          totalPages={crm.totalPages}
          total={crm.filtered.length}
          pageSize={PAGE_SIZE}
          onPage={crm.setPage}
        />
      </div>

      {crm.error && (
        <div className="toast">⚠ {crm.error}</div>
      )}
    </>
  )
}