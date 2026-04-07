export function FilterBar({
  options,
  search, setSearch,
  filterEstado, setFilterEstado,
  filterTipo, setFilterTipo,
  filterPropietario, setFilterPropietario,
  filterCliente, setFilterCliente,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  activeFilters, clearFilters,
  onChangePage,
}) {
  function handle(setter) {
    return e => { setter(e.target.value); onChangePage(1) }
  }

  return (
    <div className="filter-section">
      <div className="filter-top">
        <span className="filter-label">Filtros</span>
        {activeFilters.length > 0 && (
          <button className="btn btn-ghost" onClick={clearFilters}>
            Limpiar todo ×
          </button>
        )}
      </div>

      <div className="filter-grid">
        {/* Búsqueda libre */}
        <div className="field">
          <span className="field-lbl">Buscar</span>
          <input
            type="text"
            placeholder="Nombre, cliente, descripción..."
            value={search}
            onChange={handle(setSearch)}
          />
        </div>

        {/* Estado */}
        <div className="field">
          <span className="field-lbl">Estado</span>
          <select value={filterEstado} onChange={handle(setFilterEstado)}>
            <option value="">Todos</option>
            {options.estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Tipo */}
        <div className="field">
          <span className="field-lbl">Tipo</span>
          <select value={filterTipo} onChange={handle(setFilterTipo)}>
            <option value="">Todos</option>
            {options.tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Propietario */}
        <div className="field">
          <span className="field-lbl">Asesor</span>
          <select value={filterPropietario} onChange={handle(setFilterPropietario)}>
            <option value="">Todos</option>
            {options.propietarios.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Segunda fila: cliente + fechas */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
        <div className="field">
          <span className="field-lbl">Cliente</span>
          <select value={filterCliente} onChange={handle(setFilterCliente)}>
            <option value="">Todos</option>
            {options.clientes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <span className="field-lbl">Desde</span>
          <input type="date" value={dateFrom} onChange={handle(setDateFrom)} />
        </div>
        <div className="field">
          <span className="field-lbl">Hasta</span>
          <input type="date" value={dateTo} onChange={handle(setDateTo)} />
        </div>
      </div>

      {/* Chips activos */}
      {activeFilters.length > 0 && (
        <div className="active-filters">
          {activeFilters.map(f => (
            <span key={f.key} className="filter-chip">
              {f.label}
              <button onClick={() => { f.clear(); onChangePage(1) }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
