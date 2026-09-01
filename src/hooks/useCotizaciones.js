import { useState, useEffect, useMemo } from 'react'
import { fetchCotizaciones } from '../services/api'

function mesActual() {
  const now  = new Date()
  const y    = now.getFullYear()
  const m    = String(now.getMonth() + 1).padStart(2, '0')
  const last = new Date(y, now.getMonth() + 1, 0).getDate()

  return {
    from: `${y}-${m}-01`,
    to: `${y}-${m}-${last}`,
  }
}

export function useCotizaciones() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const [search, setSearch]                       = useState('')
  const [filterPropietario, setFilterPropietario] = useState('')
  const [filterCliente, setFilterCliente]         = useState('')
  const [filterCentro, setFilterCentro]           = useState('')
  const [filterTipoCliente, setFilterTipoCliente] = useState('')
  const [filterCondicion, setFilterCondicion]     = useState('')
  const [filterListaPrecio, setFilterListaPrecio] = useState('')

  const defaults = mesActual()

  const [dateFrom, setDateFrom] = useState(defaults.from)
  const [dateTo, setDateTo]     = useState(defaults.to)

  const [sortKey, setSortKey] = useState('fechaCreacion')
  const [sortDir, setSortDir] = useState('desc')

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 25

  const COLS_DISPONIBLES = [
    { key: 'fechaCreacion',    label: 'Fecha creación',   default: true },
    { key: 'numeroCotizacion', label: 'Cotización',       default: true },
    { key: 'propietario',      label: 'Propietario',      default: true },
    { key: 'cliente',          label: 'Cliente',          default: true },
    { key: 'valorTotal',       label: 'Valor total',      default: true },
    { key: 'centroOperacion',  label: 'Centro operación', default: true },
    { key: 'creadoPor',        label: 'Creado por',       default: false },
    { key: 'vendedor',         label: 'Vendedor',         default: false },
    { key: 'puntoEnvio',       label: 'Punto de envío',   default: false },
    { key: 'tipoCliente',      label: 'Tipo cliente',     default: false },
    { key: 'listaPrecio',      label: 'Lista de precios', default: false },
    { key: 'condicionPago',    label: 'Condición pago',   default: false },
    { key: 'fechaEntrega',     label: 'Fecha entrega',    default: false },
    { key: 'valorBruto',       label: 'Valor bruto',      default: false },
    { key: 'valorSubtotal',    label: 'Subtotal',         default: false },
    { key: 'impuestos',        label: 'Impuestos',        default: false },
    { key: 'descuentos',       label: 'Descuentos',       default: false },
    { key: 'pedidoErp',        label: 'Pedido ERP',       default: false },
  ]

  const [colsVisibles, setColsVisibles] = useState(
    () => new Set(
      COLS_DISPONIBLES
        .filter(col => col.default)
        .map(col => col.key)
    )
  )

  function toggleCol(key) {
    setColsVisibles(previous => {
      const next = new Set(previous)

      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }

      return next
    })
  }

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setLoading(true)
    setError(null)
    setPage(1)

    fetchCotizaciones({
      desde: dateFrom || undefined,
      hasta: dateTo || undefined,
      signal: controller.signal,
    })
      .then(rows => {
        if (!active) return

        setData(rows)
        setLoading(false)
      })
      .catch(error => {
        if (!active || error.name === 'AbortError') return

        setError(error.message)
        setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [dateFrom, dateTo])

  const options = useMemo(() => {
    const uniqueValues = key => [
      ...new Set(data.map(row => row[key]).filter(Boolean)),
    ].sort()

    return {
      propietarios: uniqueValues('propietario'),
      clientes: uniqueValues('cliente'),
      centros: uniqueValues('centroOperacion'),
      tiposCliente: uniqueValues('tipoCliente'),
      condiciones: uniqueValues('condicionPago'),
      listasPrecio: uniqueValues('listaPrecio'),
    }
  }, [data])

  const filtered = useMemo(() => {
    let rows = data

    if (search.trim()) {
      const query = search.trim().toLowerCase()

      rows = rows.filter(row =>
        String(row.numeroCotizacion || '').toLowerCase().includes(query) ||
        String(row.cliente || '').toLowerCase().includes(query) ||
        String(row.propietario || '').toLowerCase().includes(query) ||
        String(row.pedidoErp || '').toLowerCase().includes(query) ||
        String(row.puntoEnvio || '').toLowerCase().includes(query)
      )
    }

    if (filterPropietario) {
      rows = rows.filter(row =>
        row.propietario === filterPropietario
      )
    }

    if (filterCliente) {
      rows = rows.filter(row =>
        row.cliente === filterCliente
      )
    }

    if (filterCentro) {
      rows = rows.filter(row =>
        row.centroOperacion === filterCentro
      )
    }

    if (filterTipoCliente) {
      rows = rows.filter(row =>
        row.tipoCliente === filterTipoCliente
      )
    }

    if (filterCondicion) {
      rows = rows.filter(row =>
        row.condicionPago === filterCondicion
      )
    }

    if (filterListaPrecio) {
      rows = rows.filter(row =>
        row.listaPrecio === filterListaPrecio
      )
    }

    if (dateFrom) {
      rows = rows.filter(row =>
        row.fechaCreacion >= dateFrom
      )
    }

    if (dateTo) {
      rows = rows.filter(row =>
        row.fechaCreacion <= `${dateTo}T23:59:59`
      )
    }

    return [...rows].sort((a, b) => {
      const valueA = a[sortKey] ?? ''
      const valueB = b[sortKey] ?? ''

      const comparison =
        valueA < valueB
          ? -1
          : valueA > valueB
            ? 1
            : 0

      return sortDir === 'asc'
        ? comparison
        : -comparison
    })
  }, [
    data,
    search,
    filterPropietario,
    filterCliente,
    filterCentro,
    filterTipoCliente,
    filterCondicion,
    filterListaPrecio,
    dateFrom,
    dateTo,
    sortKey,
    sortDir,
  ])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE

    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(current =>
        current === 'asc' ? 'desc' : 'asc'
      )
    } else {
      setSortKey(key)
      setSortDir('asc')
    }

    setPage(1)
  }

  function clearFilters() {
    const currentMonth = mesActual()

    setSearch('')
    setFilterPropietario('')
    setFilterCliente('')
    setFilterCentro('')
    setFilterTipoCliente('')
    setFilterCondicion('')
    setFilterListaPrecio('')
    setDateFrom(currentMonth.from)
    setDateTo(currentMonth.to)
    setPage(1)
  }

  const activeFilters = [
    search && {
      key: 'search',
      label: `"${search}"`,
      clear: () => setSearch(''),
    },
    filterPropietario && {
      key: 'prop',
      label: filterPropietario,
      clear: () => setFilterPropietario(''),
    },
    filterCliente && {
      key: 'cliente',
      label: filterCliente,
      clear: () => setFilterCliente(''),
    },
    filterCentro && {
      key: 'centro',
      label: filterCentro,
      clear: () => setFilterCentro(''),
    },
    filterTipoCliente && {
      key: 'tipo',
      label: filterTipoCliente,
      clear: () => setFilterTipoCliente(''),
    },
    filterCondicion && {
      key: 'cond',
      label: filterCondicion,
      clear: () => setFilterCondicion(''),
    },
    filterListaPrecio && {
      key: 'lista',
      label: filterListaPrecio,
      clear: () => setFilterListaPrecio(''),
    },
    dateFrom && {
      key: 'from',
      label: `Desde ${dateFrom}`,
      clear: () => setDateFrom(''),
    },
    dateTo && {
      key: 'to',
      label: `Hasta ${dateTo}`,
      clear: () => setDateTo(''),
    },
  ].filter(Boolean)

  const stats = useMemo(() => {
    const conPedido = filtered.filter(row => row.pedidoErp)
    const sinPedido = filtered.filter(row => !row.pedidoErp)

    return {
      total: filtered.length,

      valorSubtotal: filtered.reduce(
        (total, row) =>
          total + Number(row.valorSubtotal || 0),
        0
      ),

      conPedido: conPedido.length,

      valorConPedido: conPedido.reduce(
        (total, row) =>
          total + Number(row.valorSubtotal || 0),
        0
      ),

      sinPedido: sinPedido.length,

      valorSinPedido: sinPedido.reduce(
        (total, row) =>
          total + Number(row.valorSubtotal || 0),
        0
      ),
    }
  }, [filtered])

  return {
    loading,
    error,
    data,
    options,
    filtered,
    paginated,
    stats,

    totalPages,
    page,
    setPage,

    sortKey,
    sortDir,
    toggleSort,

    search,
    setSearch,

    filterPropietario,
    setFilterPropietario,

    filterCliente,
    setFilterCliente,

    filterCentro,
    setFilterCentro,

    filterTipoCliente,
    setFilterTipoCliente,

    filterCondicion,
    setFilterCondicion,

    filterListaPrecio,
    setFilterListaPrecio,

    dateFrom,
    setDateFrom,

    dateTo,
    setDateTo,

    activeFilters,
    clearFilters,

    COLS_DISPONIBLES,
    colsVisibles,
    toggleCol,
  }
}

export default useCotizaciones