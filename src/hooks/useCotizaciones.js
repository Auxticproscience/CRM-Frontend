import { useState, useEffect, useMemo } from 'react'
import { fetchCotizaciones } from '../services/api'

function mesActual() {
  const now  = new Date()
  const y    = now.getFullYear()
  const m    = String(now.getMonth() + 1).padStart(2, '0')
  const last = new Date(y, now.getMonth() + 1, 0).getDate()
  return { from: `${y}-${m}-01`, to: `${y}-${m}-${last}` }
}

export function useCotizaciones() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Filtros
  const [search, setSearch]                         = useState('')
  const [filterPropietario, setFilterPropietario]   = useState('')
  const [filterCliente, setFilterCliente]           = useState('')
  const [filterCentro, setFilterCentro]             = useState('')
  const [filterTipoCliente, setFilterTipoCliente]   = useState('')
  const [filterCondicion, setFilterCondicion]       = useState('')
  const [filterListaPrecio, setFilterListaPrecio]   = useState('')

  const defaults = mesActual()
  const [dateFrom, setDateFrom] = useState(defaults.from)
  const [dateTo,   setDateTo]   = useState(defaults.to)

  const [sortKey, setSortKey] = useState('fechaCreacion')
  const [sortDir, setSortDir] = useState('desc')

  const [page, setPage] = useState(1)
  const PAGE_SIZE       = 25

  const COLS_DISPONIBLES = [
    { key: 'fechaCreacion',      label: 'Fecha creación',   default: true  },
    { key: 'numeroCotizacion',   label: 'Cotización',       default: true  },
    { key: 'propietario',        label: 'Propietario',      default: true  },
    { key: 'cliente',            label: 'Cliente',          default: true  },
    { key: 'valorTotal',         label: 'Valor total',      default: true  },
    { key: 'centroOperacion',    label: 'Centro operación', default: true  },
    { key: 'creadoPor',          label: 'Creado por',       default: false },
    { key: 'vendedor',           label: 'Vendedor',         default: false },
    { key: 'puntoEnvio',         label: 'Punto de envío',   default: false },
    { key: 'tipoCliente',        label: 'Tipo cliente',     default: false },
    { key: 'listaPrecio',        label: 'Lista de precios', default: false },
    { key: 'condicionPago',      label: 'Condición pago',   default: false },
    { key: 'fechaEntrega',       label: 'Fecha entrega',    default: false },
    { key: 'valorBruto',         label: 'Valor bruto',      default: false },
    { key: 'valorSubtotal',      label: 'Subtotal',         default: false },
    { key: 'impuestos',          label: 'Impuestos',        default: false },
    { key: 'descuentos',         label: 'Descuentos',       default: false },
    { key: 'pedidoErp',          label: 'Pedido ERP',       default: false },
  ]

  const [colsVisibles, setColsVisibles] = useState(
    () => new Set(COLS_DISPONIBLES.filter(c => c.default).map(c => c.key))
  )

  function toggleCol(key) {
    setColsVisibles(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchCotizaciones()
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  const options = useMemo(() => {
    const set = k => [...new Set(data.map(r => r[k]).filter(Boolean))].sort()
    return {
      propietarios:  set('propietario'),
      clientes:      set('cliente'),
      centros:       set('centroOperacion'),
      tiposCliente:  set('tipoCliente'),
      condiciones:   set('condicionPago'),
      listasPrecio:  set('listaPrecio'),
    }
  }, [data])

  const filtered = useMemo(() => {
    let rows = data

    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(r =>
        (r.numeroCotizacion || '').toLowerCase().includes(q) ||
        (r.cliente          || '').toLowerCase().includes(q) ||
        (r.propietario      || '').toLowerCase().includes(q) ||
        (r.pedidoErp        || '').toLowerCase().includes(q) ||
        (r.puntoEnvio       || '').toLowerCase().includes(q)
      )
    }

    if (filterPropietario) rows = rows.filter(r => r.propietario    === filterPropietario)
    if (filterCliente)     rows = rows.filter(r => r.cliente         === filterCliente)
    if (filterCentro)      rows = rows.filter(r => r.centroOperacion === filterCentro)
    if (filterTipoCliente) rows = rows.filter(r => r.tipoCliente     === filterTipoCliente)
    if (filterCondicion)   rows = rows.filter(r => r.condicionPago   === filterCondicion)
    if (filterListaPrecio) rows = rows.filter(r => r.listaPrecio     === filterListaPrecio)

    if (dateFrom) rows = rows.filter(r => r.fechaCreacion >= dateFrom)
    if (dateTo)   rows = rows.filter(r => r.fechaCreacion <= dateTo + 'T23:59:59')

    rows = [...rows].sort((a, b) => {
      const va = a[sortKey] ?? ''
      const vb = b[sortKey] ?? ''
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

    return rows
  }, [data, search, filterPropietario, filterCliente, filterCentro,
      filterTipoCliente, filterCondicion, filterListaPrecio,
      dateFrom, dateTo, sortKey, sortDir])

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
    setFilterPropietario('')
    setFilterCliente('')
    setFilterCentro('')
    setFilterTipoCliente('')
    setFilterCondicion('')
    setFilterListaPrecio('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  const activeFilters = [
    search            && { key: 'search',   label: `"${search}"`,         clear: () => setSearch('') },
    filterPropietario && { key: 'prop',     label: filterPropietario,     clear: () => setFilterPropietario('') },
    filterCliente     && { key: 'cliente',  label: filterCliente,         clear: () => setFilterCliente('') },
    filterCentro      && { key: 'centro',   label: filterCentro,          clear: () => setFilterCentro('') },
    filterTipoCliente && { key: 'tipo',     label: filterTipoCliente,     clear: () => setFilterTipoCliente('') },
    filterCondicion   && { key: 'cond',     label: filterCondicion,       clear: () => setFilterCondicion('') },
    filterListaPrecio && { key: 'lista',    label: filterListaPrecio,     clear: () => setFilterListaPrecio('') },
    dateFrom          && { key: 'from',     label: `Desde ${dateFrom}`,   clear: () => setDateFrom('') },
    dateTo            && { key: 'to',       label: `Hasta ${dateTo}`,     clear: () => setDateTo('') },
  ].filter(Boolean)

  const stats = useMemo(() => {
  const conPedido     = filtered.filter(r => r.pedidoErp)
  const sinPedido     = filtered.filter(r => !r.pedidoErp)

  return {
    total:           filtered.length,
    valorTotal:      filtered.reduce((s, r) => s + (r.valorTotal || 0), 0),
    conPedido:       conPedido.length,
    valorConPedido:  conPedido.reduce((s, r) => s + (r.valorTotal || 0), 0),
    sinPedido:       sinPedido.length,
    valorSinPedido:  sinPedido.reduce((s, r) => s + (r.valorTotal || 0), 0),
  }
}, [filtered])

  return {
    loading, error, data, options,
    filtered, paginated, stats,
    totalPages, page, setPage,
    sortKey, sortDir, toggleSort,
    search, setSearch,
    filterPropietario, setFilterPropietario,
    filterCliente, setFilterCliente,
    filterCentro, setFilterCentro,
    filterTipoCliente, setFilterTipoCliente,
    filterCondicion, setFilterCondicion,
    filterListaPrecio, setFilterListaPrecio,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    activeFilters, clearFilters,
    COLS_DISPONIBLES, colsVisibles, toggleCol,
  }
}