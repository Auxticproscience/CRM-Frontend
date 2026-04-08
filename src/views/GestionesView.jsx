import { useState, useEffect } from 'react'
import { useActividades } from '../hooks/useActividades.js'
import { FilterBar }        from '../components/FilterBar.jsx'
import { ActividadesTable } from '../components/ActividadesTable.jsx'
import { Pagination }       from '../components/Pagination.jsx'
import { StatsBar } from '../components/StatsBar'

const PAGE_SIZE = 25

export default function GestionesView() {
  const crm = useActividades()
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
      {/* Topbar ORIGINAL */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="dot" />
          CRM · Gestión por Zonas
        </div>
        <span className="topbar-meta">{now}</span>
      </header>

      <div className="main">
        {/* TODO lo demás igual */}
        <StatsBar crm={crm} />
      </div>

        <FilterBar
          options={crm.options}
          search={crm.search} setSearch={crm.setSearch}
          filterEstado={crm.filterEstado} setFilterEstado={crm.setFilterEstado}
          filterTipo={crm.filterTipo} setFilterTipo={crm.setFilterTipo}
          filterPropietario={crm.filterPropietario} setFilterPropietario={crm.setFilterPropietario}
          filterCliente={crm.filterCliente} setFilterCliente={crm.setFilterCliente}
          dateFrom={crm.dateFrom} setDateFrom={crm.setDateFrom}
          dateTo={crm.dateTo} setDateTo={crm.setDateTo}
          activeFilters={crm.activeFilters}
          clearFilters={crm.clearFilters}
          onChangePage={crm.setPage}
        />

        <div className="table-section">
          <div className="table-header">
            <span className="table-title">
              Actividades
              <span className="count-badge">{crm.filtered.length}</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              Página {crm.page} de {crm.totalPages}
            </span>
          </div>

          <ActividadesTable
            rows={crm.paginated}
            loading={crm.loading}
            sortKey={crm.sortKey}
            sortDir={crm.sortDir}
            toggleSort={crm.toggleSort}
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
          <div className="toast">
            ⚠ {crm.error}
          </div>
        )}
    </>
  )
}