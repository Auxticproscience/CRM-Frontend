export function StatsBar({ crm, filterPropietario }) {

  const META_ASESOR = {
  gestion: 25,
  visitas: 100,
  llamadas: 125
  };

  const META_GERENTE = {
    gestion: 25,
    visitas: 50,
    llamadas: 75
  };

  const ASESORES_GERENTES = [
    'JULIO CESAR DIAZ COLORADO',
    'MICHAEL JHESIT OSORIO RIOS'
  ];

  const calcDias = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (crm.dateFrom && crm.dateTo) {
      const from = new Date(crm.dateFrom);
      const to   = new Date(crm.dateTo);
      return Math.max(1, Math.round((to - from) / 86400000) + 1);
    }

    if (crm.dateFrom) {
      const from = new Date(crm.dateFrom);
      return Math.max(1, Math.round((hoy - from) / 86400000) + 1);
    }

    return hoy.getDate();
  };

  const dias = calcDias();

  const asesoresUnicos = [
  ...new Set(crm.filtered.map(r => r.propietario).filter(Boolean))
  ];

  const asesores = crm.options.asesores;
  const gerentes = crm.options.asesoresGerentes;

  let totalAsesores = 0;
let totalGerentes = 0;

if (crm.onlyGerentes) {
  totalGerentes = gerentes.length;
} else if (filterPropietario) {
  if (ASESORES_GERENTES.includes(filterPropietario)) {
    totalGerentes = 1;
  } else {
    totalAsesores = 1;
  }
} else {
  totalAsesores = asesores.length;
  totalGerentes = gerentes.length;
}

  const metaGestion = Math.round(
  ((totalAsesores * META_ASESOR.gestion))
);

const metaVisitas = Math.round(
  ((totalAsesores * META_ASESOR.visitas))
);

const metaLlamadas = Math.round(
  ((totalAsesores * META_ASESOR.llamadas))
);

  const stats = crm.stats;

  const calcPct = (actual, meta) =>
    meta === 0 ? 0 : Math.min((actual / meta) * 100, 100);

  const pGestion  = calcPct(stats.gestion,  metaGestion);
  const pVisitas  = calcPct(stats.visitas,  metaVisitas);
  const pLlamadas = calcPct(stats.llamadas, metaLlamadas);

  const getColor = (pct) => {
    if (pct >= 100) return 'rgb(19,199,28)';   // verde
    if (pct >= 60)  return 'rgb(255,180,0)';   // amarillo
    return 'rgb(220,50,50)';                   // rojo
  };

  const labelAsesor = crm.onlyGerentes
    ? `Gerentes (${gerentes.length})`
    : filterPropietario
      ? filterPropietario
      : `${asesores.length} asesores${gerentes.length ? ` + ${gerentes.length} gerentes` : ''}`;

  const ProgressGroup = ({ pct, actual, meta }) => (
    <div className="progress-group">
      <p>
        {pct.toFixed(1)}% · {actual.toLocaleString('es-CO')} / {meta.toLocaleString('es-CO')}
      </p>
      <div className="progress-barGesti">
        <div
          className="progress-fillGesti"
          style={{
            width: `${pct}%`,
            backgroundColor: getColor(pct)
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="stats-bar">

      {/* TOTAL */}
      <div className="stat-card">
        <span className="stat-label">
          Total · {crm.dateFrom && crm.dateTo
            ? `${crm.dateFrom} → ${crm.dateTo}`
            : crm.dateFrom ? `desde ${crm.dateFrom}`
              : crm.dateTo ? `hasta ${crm.dateTo}`
              : 'período'}
        </span>
        <span className="stat-value accent">
          {crm.loading ? '…' : stats.totalMes.toLocaleString('es-CO')}
        </span>
      </div>

      {/* GESTIÓN */}
      <div className="fiel-progres1">
        {crm.loading ? '…' : (
          <ProgressGroup pct={pGestion} actual={stats.gestion} meta={metaGestion} />
        )}
        <div className="stat-card">
          <span className="stat-label">Gestión · {dias}d · {labelAsesor}</span>
          <span className="stat-value green">
            {crm.loading ? '…' : stats.gestion.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* VISITAS */}
      <div className="fiel-progres2">
        {crm.loading ? '…' : (
          <ProgressGroup pct={pVisitas} actual={stats.visitas} meta={metaVisitas} />
        )}
        <div className="stat-card">
          <span className="stat-label">Visitas · {dias}d · {labelAsesor}</span>
          <span className="stat-value amber">
            {crm.loading ? '…' : stats.visitas.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* LLAMADAS */}
      <div className="fiel-progres3">
        {crm.loading ? '…' : (
          <ProgressGroup pct={pLlamadas} actual={stats.llamadas} meta={metaLlamadas} />
        )}
        <div className="stat-card">
          <span className="stat-label">Llamadas · {dias}d · {labelAsesor}</span>
          <span className="stat-value">
            {crm.loading ? '…' : stats.llamadas.toLocaleString('es-CO')}
          </span>
        </div>
      </div>

      {/* FILTRADOS */}
      <div className="stat-card">
        <span className="stat-label">Filtrados</span>
        <span className="stat-value">
          {crm.loading ? '…' : crm.filtered.length.toLocaleString('es-CO')}
        </span>
      </div>

    </div>
  );
}