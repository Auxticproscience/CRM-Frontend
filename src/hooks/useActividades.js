import { useState, useEffect, useMemo } from 'react'
import { fetchActividades } from '../services/api'


function mesActual() {
  const now   = new Date()
  const y     = now.getFullYear()
  const m     = String(now.getMonth() + 1).padStart(2, '0')
  const last  = new Date(y, now.getMonth() + 1, 0).getDate()
  return { from: `${y}-${m}-01`, to: `${y}-${m}-${last}` }
}

function useActividades() {
  const [filterZona, setFilterZona] = useState('');
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  

  const [onlyGerentes, setOnlyGerentes] = useState(false);
  const [search, setSearch]                       = useState('')
  const [filterEstado, setFilterEstado]           = useState('')
  const [filterTipo, setFilterTipo]               = useState('')
  const [filterPropietario, setFilterPropietario] = useState('')
  const [filterCliente, setFilterCliente]         = useState('')

  const defaults = mesActual()
  const [dateFrom, setDateFrom] = useState(defaults.from)
  const [dateTo,   setDateTo]   = useState(defaults.to)

  const [sortKey, setSortKey] = useState('fechaCreacion')
  const [sortDir, setSortDir] = useState('desc')

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 25

  useEffect(() => {
      setLoading(true)
      setError(null)

      fetchActividades()
        .then(d => {
          setData(d)
          setLoading(false)
        })
        .catch(e => {
          setError(e.message)
          setLoading(false)
        })
    }, [])

  const ASESORES_GERENTES = ['JULIO CESAR DIAZ COLORADO','MICHAEL JHESIT OSORIO RIOS']
  const ZONAS = {
    ORIENTE: [
      'JUAN SEBASTIAN LOPEZ JAIMES',
      'CINDY GUAVITA DIAZ',
      'LUIS EDUARDO RODRIGUEZ DAZA',
      'STEWAR ALEXANDER MORALES HERRERA',
      'JUAN DAVID MARTINEZ DIOSA',
      'MICHAEL JHESIT OSORIO RIOS'
    ],
    OCCIDENTE: [
      'ALEJANDRO CERON PUENTES',
      'SIMON ARIAS ROGELES',
      'MARTHA PATRICIA AVELLANEDA CASTAÑEDA',
      'LEYNER DALLAN DITTA VALLEJO',
      'JULIO CESAR DIAZ COLORADO'
    ]
  };
  
  const options = useMemo(() => {
  const normalizar = (nombre = '') =>
    nombre
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .split(/\s+/)
      .sort()
      .join(' ');

  const propietarios = [
    ...new Set(data.map(r => r.propietario).filter(Boolean))
  ].sort();

  const nombresGerentes = new Set(
    ASESORES_GERENTES.map(normalizar)
  );

  const asesoresGerentes = propietarios.filter(p =>
    nombresGerentes.has(normalizar(p))
  );

  const asesores = propietarios.filter(p =>
    !nombresGerentes.has(normalizar(p))
  );

  const set = key => [
    ...new Set(data.map(r => r[key]).filter(Boolean))
  ].sort();

  return {
    estados: set('estado'),
    tipos: set('tipo'),
    clientes: set('cliente'),
    propietarios,
    asesores,
    asesoresGerentes,

    asesoresFiltro: propietarios,
  };
}, [data]);
  
  const filtered = useMemo(() => {
  let rows = data

    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(r =>
        (r.nombre      || '').toLowerCase().includes(q) ||
        (r.descripcion || '').toLowerCase().includes(q) ||
        (r.cliente     || '').toLowerCase().includes(q) ||
        (r.lugar       || '').toLowerCase().includes(q)
      )
    }

  const normalizeWords = (str) =>
  (str || '')
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');

  if (filterZona) {
    const zonaList = ZONAS[filterZona].map(normalizeWords);

    rows = rows.filter(r =>
      zonaList.includes(normalizeWords(r.propietario))
    );
  }

  if (filterEstado) rows = rows.filter(r => r.estado === filterEstado)
  if (filterTipo)   rows = rows.filter(r => r.tipo === filterTipo)

  if (onlyGerentes) {
    rows = rows.filter(r => ASESORES_GERENTES.includes(r.propietario))
  }

  if (filterPropietario) rows = rows.filter(r => r.propietario === filterPropietario)
  if (filterCliente)     rows = rows.filter(r => r.cliente === filterCliente)

  if (dateFrom) rows = rows.filter(r => r.fechaCreacion >= dateFrom)
  if (dateTo)   rows = rows.filter(r => r.fechaCreacion <= dateTo + 'T23:59:59')

  rows = [...rows].sort((a, b) => {
    const va = a[sortKey] ?? ''
    const vb = b[sortKey] ?? ''
    const cmp = va < vb ? -1 : va > vb ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  return rows
}, [
  data,
  search,
  filterEstado,
  filterTipo,
  filterPropietario,
  filterCliente,
  dateFrom,
  dateTo,
  sortKey,
  sortDir,
  onlyGerentes,
  filterZona
])
  

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  function clearFilters() {
  setSearch('')
  setFilterEstado('')
  setFilterTipo('')
  setFilterPropietario('')
  setFilterCliente('')
  setDateFrom('')
  setDateTo('')
  setOnlyGerentes(false)
  setPage(1)
}

  const activeFilters = [
    search            && { key: 'search',  label: `"${search}"`,       clear: () => setSearch('') },
    filterEstado      && { key: 'estado',  label: filterEstado,        clear: () => setFilterEstado('') },
    filterTipo        && { key: 'tipo',    label: filterTipo,          clear: () => setFilterTipo('') },
    filterPropietario && { key: 'prop',    label: filterPropietario,   clear: () => setFilterPropietario('') },
    filterCliente     && { key: 'cliente', label: filterCliente,       clear: () => setFilterCliente('') },
    dateFrom          && { key: 'from',    label: `Desde ${dateFrom}`, clear: () => setDateFrom('') },
    dateTo            && { key: 'to',      label: `Hasta ${dateTo}`,   clear: () => setDateTo('') },
  ].filter(Boolean)

  
  const stats = useMemo(() => {
    const gestion  = filtered.filter(r => r.tipo === 'Gestión').length
    const visitas  = filtered.filter(r => r.tipo === 'Visita').length
    const llamadas = filtered.filter(r => r.tipo === 'Llamadas').length
    const totalMes = gestion + visitas + llamadas;
    return { totalMes, gestion, visitas, llamadas }
  }, [filtered])

  return {
    loading, error, options, filtered, paginated,
    stats, totalPages, page, setPage,
    sortKey, sortDir, toggleSort,
    search, setSearch,
    filterEstado, setFilterEstado,
    filterTipo, setFilterTipo,
    filterPropietario, setFilterPropietario,
    filterCliente, setFilterCliente,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    activeFilters, clearFilters,
    onlyGerentes, setOnlyGerentes,
    filterZona, setFilterZona,
  }
}

export { useActividades }
export default useActividades