export function StatsBar({ crm }) {

  const metaGestion = 25;
  const metaVistas = 100;
  const metaLlamadas = 125;
  const actualGestion = crm.stats.gestion;
  const actualVistas = crm.stats.visitas;
  const actualLlamadas = crm.stats.llamadas;


  const porcentajes = metaGestion > 0 ? [Math.min((actualGestion / metaGestion) * 100, 100)] : [0];
  const porcestajesVistas = metaVistas > 0 ? [Math.min((actualVistas / metaVistas) * 100, 100)] : [0];
  const porcentajesLlamadas = metaLlamadas > 0 ? [Math.min((actualLlamadas / metaLlamadas) * 100, 100)] : [0];

  return (
    <div className="stats-bar">

        <div className="stat-card">
          <span className="stat-label">
            Total · {crm.dateFrom && crm.dateTo
              ? `${crm.dateFrom} → ${crm.dateTo}`
              : crm.dateFrom ? `desde ${crm.dateFrom}`
                : crm.dateTo ? `hasta ${crm.dateTo}`
                  : 'período'}
          </span>
          <span className="stat-value accent">
            {crm.loading ? '…' : crm.stats.totalMes.toLocaleString('es-CO')}
          </span>
        </div>
        

      <div className="fiel-progres1">

        {crm.loading ? '…' : (
          <div className="progress-group">
            <p>{porcentajes[0].toFixed(1)}% completado</p>
            {porcentajes.map((p, i) => (
              <div key={i} className="progress-barGesti">
                <div
                  className="progress-fillGesti"
                  style={{ width: `${p}%` }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="stat-card">
          <span className="stat-label">Gestión</span>
          <span className="stat-value green">
            {crm.loading ? '…' : crm.stats.gestion.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      <div className="fiel-progres2">
        {crm.loading ? '…' : (
          <div className="progress-group">
            <p>{porcestajesVistas[0].toFixed(1)}% completado</p>
            {porcestajesVistas.map((p, i) => (
              <div key={i} className="progress-barGesti">
                <div
                  className="progress-fillGesti"
                  style={{ width: `${p}%` }}
                />
              </div>
            ))}
          </div>
        )}

        <div className="stat-card">
          <span className="stat-label">Visitas</span>
          <span className="stat-value amber">
            {crm.loading ? '…' : crm.stats.visitas.toLocaleString('es-CO')}
          </span>
        </div>
      </div>


      <div className="fiel-progres3">
         {crm.loading ? '…' : (
          <div className="progress-group">
            <p>{porcentajesLlamadas[0].toFixed(1)}% completado</p>
            {porcentajesLlamadas.map((p, i) => (
              <div key={i} className="progress-barGesti">
                <div
                  className="progress-fillGesti"
                  style={{ width: `${p}%` }}
                />
              </div>
            ))}
          </div>
        )}
        <div className="stat-card">
          <span className="stat-label">Llamadas</span>
          <span className="stat-value">
            {crm.loading ? '…' : crm.stats.llamadas.toLocaleString('es-CO')}
          </span>
        </div>
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