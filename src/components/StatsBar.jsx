export function StatsBar({ crm, filterPropietario }) {

  const ZONAS = {
    ORIENTE: [
      'GUAVITA DIAZ CINDY',
      'RODRIGUEZ DAZA LUIS EDUARDO',
      'MORALES HERRERA STEWAR ALEXANDER',
      'MARTINEZ DIOSA JUAN DAVID',
      'MICHAEL JHESIT OSORIO RIOS',
    ],
    OCCIDENTE: [
      'CERON PUENTES ALEJANDRO',
      'ARIAS ROGELES SIMON',
      'AVELLANEDA CASTAÑEDA MARTHA PATRICIA',
      'DITTA VALLEJO LEYNER DALLAN',
      'JULIO CESAR DIAZ COLORADO',
    ]
  };

  const META_ASESOR = {
  gestion: 25,
  visitas: 100,
  llamadas: 125
  };

  const META_GERENTE = {
    gestion: 0,
    visitas: 0,
    llamadas: 0
  };

  const ASESORES_GERENTES = [
    'JULIO CESAR DIAZ COLORADO',
    'MICHAEL JHESIT OSORIO RIOS'
  ];

 const normalizarNombre = (str = '') =>
  str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .split(/\s+/)
    .sort()
    .join(' ');

const METAS_INDIVIDUALES = {
  [normalizarNombre('JOSE FERNANDO FORERO CARDONA')]: {
    gestion: 50,
    visitas: 70,
    llamadas: 100,
  },
  [normalizarNombre('MONICA ANDREA LOPERA AGUDELO')]: {
    gestion: 100,
    visitas: 25,
    llamadas: 125,
  },
  [normalizarNombre('LUIS GUILLERMO HERNANDEZ BARRAZA')]: {
    gestion: 75,
    visitas: 20,
    llamadas: 100,
  },
  [normalizarNombre('JULIO CESAR DIAZ COLORADO')]: {
    gestion: 101,
    visitas: 60,
    llamdas: 100
  },
  [normalizarNombre('MICHAEL JHESIT OSORIO RIOS')]: {
    gestion: 101,
    visitas: 60,
    llamdas: 100
  },
};

const obtenerMetaAsesor = (nombre) =>
  METAS_INDIVIDUALES[normalizarNombre(nombre)] ?? META_ASESOR;

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

 let asesores = [];
 let gerentes = [];

if (crm.onlyGerentes) {
  gerentes = ASESORES_GERENTES;
}

else if (filterPropietario) {
  if (ASESORES_GERENTES.includes(filterPropietario)) {
    gerentes = [filterPropietario];
  } else {
    asesores = [filterPropietario];
  }
}

else if (crm.filterZona) {
  const zona = ZONAS[crm.filterZona] || [];

  asesores = zona.filter(p => !ASESORES_GERENTES.includes(p));
  gerentes = zona.filter(p => ASESORES_GERENTES.includes(p));
}

else {
  asesores = crm.options.asesores;
  gerentes = crm.options.asesoresGerentes;
}

 const metasAsesores = asesores.reduce(
  (total, asesor) => {
    const meta = obtenerMetaAsesor(asesor);

    return {
      gestion: total.gestion + meta.gestion,
      visitas: total.visitas + meta.visitas,
      llamadas: total.llamadas + meta.llamadas,
    };
  },
  { gestion: 0, visitas: 0, llamadas: 0 }
);

const metaGestion = Math.round(
  metasAsesores.gestion + gerentes.length * META_GERENTE.gestion
);

const metaVisitas = Math.round(
  metasAsesores.visitas + gerentes.length * META_GERENTE.visitas
);

const metaLlamadas = Math.round(
  metasAsesores.llamadas + gerentes.length * META_GERENTE.llamadas
);

  const stats = crm.stats;

  const calcPct = (actual, meta) =>
    meta === 0 ? 0 : Math.min((actual / meta) * 100, 100);

  const pGestion  = calcPct(stats.gestion,  metaGestion);
  const pVisitas  = calcPct(stats.visitas,  metaVisitas);
  const pLlamadas = calcPct(stats.llamadas, metaLlamadas);

  const pTotal = (pGestion + pVisitas + pLlamadas) / 3;

  const getColor = (pct) => {
    if (pct >= 100) return 'rgb(19,199,28)';
    if (pct >= 60)  return 'rgb(255,180,0)';
    return 'rgb(220,50,50)';
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

      {/* CUMPLIMIENTO TOTAL */}
      <div className="fiel-progres4">
        <div className="stat-card">
          <span className="stat-label">Cumplimiento total · {labelAsesor}</span>
          <span className="stat-value">
            {crm.loading ? '…' : `${pTotal.toFixed(1)}%`}
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