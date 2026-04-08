export function StatsBar({ crm }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">
          Total · {crm.dateFrom && crm.dateTo
            ? `${crm.dateFrom} → ${crm.dateTo}`
            : crm.dateFrom ? `desde ${crm.dateFrom}`
            : crm.dateTo   ? `hasta ${crm.dateTo}`
            : 'período'}
        </span>
        <span className="stat-value accent">
          {crm.loading ? '…' : crm.stats.totalMes.toLocaleString('es-CO')}
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Gestión</span>
        <span className="stat-value green">
          {crm.loading ? '…' : crm.stats.gestion.toLocaleString('es-CO')}
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Visitas</span>
        <span className="stat-value amber">
          {crm.loading ? '…' : crm.stats.visitas.toLocaleString('es-CO')}
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Llamadas</span>
        <span className="stat-value">
          {crm.loading ? '…' : crm.stats.llamadas.toLocaleString('es-CO')}
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Filtrados</span>
        <span className="stat-value">
          {crm.loading ? '…' : crm.filtered.length.toLocaleString('es-CO')}
        </span>
      </div>
    </div>
  )
}