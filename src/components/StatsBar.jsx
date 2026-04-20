export function StatsBar({ crm, filterPropietario, totalAsesores }) {

  const META_DIARIA_GESTION  = 25;
  const META_DIARIA_VISITAS  = 100;
  const META_DIARIA_LLAMADAS = 125;

  const calcDias = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (crm.dateFrom && crm.dateTo) {
      const from = new Date(crm.dateFrom);
      const to   = new Date(crm.dateTo);
      return Math.max(1, Math.round((to - from) / 86_400_000) + 1);
    }
    if (crm.dateFrom) {
      const from = new Date(crm.dateFrom);
      return Math.max(1, Math.round((hoy - from) / 86_400_000) + 1);
    }

    return hoy.getDate();
  };

  const dias = calcDias();
  const numAsesores = filterPropietario ? 1 : (totalAsesores || 1);

  const metaGestion  = META_DIARIA_GESTION  * dias * numAsesores;
  const metaVistas   = META_DIARIA_VISITAS  * dias * numAsesores;
  const metaLlamadas = META_DIARIA_LLAMADAS * dias * numAsesores;

  const stats = crm.stats;

  const pGestion  = Math.min((stats.gestion  / metaGestion)  * 100, 100);
  const pVistas   = Math.min((stats.visitas  / metaVistas)   * 100, 100);
  const pLlamadas = Math.min((stats.llamadas / metaLlamadas) * 100, 100);

  const labelAsesor = filterPropietario
    ? filterPropietario
    : `${numAsesores} asesores`;

  const ProgressGroup = ({ pct, actual, meta }) => (
    <div className="progress-group">
      <p>{pct.toFixed(1)}% · {actual.toLocaleString('es-CO')} / {meta.toLocaleString('es-CO')}</p>
      <div className="progress-barGesti">
        <div
          className="progress-fillGesti"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 100
              ? 'rgb(19,199,28)'
              : pct >= 60
                ? 'rgb(255,180,0)'
                : 'rgb(220,50,50)'
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="stats-bar">

      <div className="stat-card">
        <span className="stat-label">
          Total · {crm.dateFrom && crm.dateTo
            ? `${crm.dateFrom} → ${crm.dateTo}`
            : crm.dateFrom ? `desde ${crm.dateFrom}`
              : crm.dateTo  ? `hasta ${crm.dateTo}`
                : 'período'}
        </span>
        <span className="stat-value accent">
          {crm.loading ? '…' : stats.totalMes.toLocaleString('es-CO')}
        </span>
      </div>

      {/* ── Gestión ── */}
      <div className="fiel-progres1">
        {crm.loading ? '…' : <ProgressGroup pct={pGestion} actual={stats.gestion} meta={metaGestion} />}
        <div className="stat-card">
          <span className="stat-label">Gestión · {dias}d · {labelAsesor}</span>
          <span className="stat-value green">
            {crm.loading ? '…' : stats.gestion.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* ── Visitas ── */}
      <div className="fiel-progres2">
        {crm.loading ? '…' : <ProgressGroup pct={pVistas} actual={stats.visitas} meta={metaVistas} />}
        <div className="stat-card">
          <span className="stat-label">Visitas · {dias}d · {labelAsesor}</span>
          <span className="stat-value amber">
            {crm.loading ? '…' : stats.visitas.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* ── Llamadas ── */}
      <div className="fiel-progres3">
        {crm.loading ? '…' : <ProgressGroup pct={pLlamadas} actual={stats.llamadas} meta={metaLlamadas} />}
        <div className="stat-card">
          <span className="stat-label">Llamadas · {dias}d · {labelAsesor}</span>
          <span className="stat-value">
            {crm.loading ? '…' : stats.llamadas.toLocaleString('es-CO')}
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
  );
}