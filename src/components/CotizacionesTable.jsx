function SortIcon({ active, dir }) {
  if (!active) return <span className="sort-icon">↕</span>
  return <span className="sort-icon">{dir === 'asc' ? '↑' : '↓'}</span>
}

function fmtFecha(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch { return iso }
}

function fmtFechaSolo(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
  } catch { return iso }
}

function fmtMoneda(val) {
  if (val == null || val === '') return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(val)
}

// Definición de todas las columnas posibles
// key debe coincidir exactamente con los keys del DTO
const TODAS_LAS_COLS = [
  {
    key: 'fechaCreacion',
    label: 'Fecha creación',
    render: r => <span className="mono">{fmtFecha(r.fechaCreacion)}</span>,
    sortable: true,
  },
  {
    key: 'numeroCotizacion',
    label: 'Cotización',
    render: r => <span className="primary">{r.numeroCotizacion || '—'}</span>,
    sortable: true,
  },
  {
    key: 'propietario',
    label: 'Propietario',
    render: r => <span className="truncate">{r.propietario || '—'}</span>,
    sortable: true,
  },
  {
    key: 'cliente',
    label: 'Cliente',
    render: r => <span className="truncate">{r.cliente || '—'}</span>,
    sortable: true,
  },
  {
    key: 'valorTotal',
    label: 'Valor total',
    render: r => <span className="mono money">{fmtMoneda(r.valorTotal)}</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'centroOperacion',
    label: 'Centro operación',
    render: r => <span className="truncate">{r.centroOperacion || '—'}</span>,
    sortable: true,
  },
  {
    key: 'creadoPor',
    label: 'Creado por',
    render: r => <span className="truncate">{r.creadoPor || '—'}</span>,
    sortable: true,
  },
  {
    key: 'vendedor',
    label: 'Vendedor',
    render: r => <span className="truncate">{r.vendedor || '—'}</span>,
    sortable: true,
  },
  {
    key: 'puntoEnvio',
    label: 'Punto de envío',
    render: r => <span className="truncate">{r.puntoEnvio || '—'}</span>,
    sortable: false,
  },
  {
    key: 'tipoCliente',
    label: 'Tipo cliente',
    render: r => r.tipoCliente
      ? <span className="badge badge--neutral">{r.tipoCliente}</span>
      : '—',
    sortable: true,
  },
  {
    key: 'listaPrecio',
    label: 'Lista de precios',
    render: r => <span className="truncate">{r.listaPrecio || '—'}</span>,
    sortable: true,
  },
  {
    key: 'condicionPago',
    label: 'Condición pago',
    render: r => <span className="truncate">{r.condicionPago || '—'}</span>,
    sortable: true,
  },
  {
    key: 'fechaEntrega',
    label: 'Fecha entrega',
    render: r => <span className="mono">{fmtFechaSolo(r.fechaEntrega)}</span>,
    sortable: true,
  },
  {
    key: 'valorBruto',
    label: 'Valor bruto',
    render: r => <span className="mono money">{fmtMoneda(r.valorBruto)}</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'valorSubtotal',
    label: 'Subtotal',
    render: r => <span className="mono money">{fmtMoneda(r.valorSubtotal)}</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'impuestos',
    label: 'Impuestos',
    render: r => <span className="mono money">{fmtMoneda(r.impuestos)}</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'descuentos',
    label: 'Descuentos',
    render: r => <span className="mono money">{fmtMoneda(r.descuentos)}</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'pedidoErp',
    label: 'Pedido ERP',
    render: r => r.pedidoErp
      ? <span className="badge badge--info">{r.pedidoErp}</span>
      : '—',
    sortable: true,
  },
]

export function CotizacionesTable({
  rows, loading, sortKey, sortDir, toggleSort,
  colsVisibles, COLS_DISPONIBLES,
}) {
  
  const cols = TODAS_LAS_COLS.filter(c => colsVisibles.has(c.key))

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {cols.map(c => (
              <th
                key={c.key}
                className={[
                  sortKey === c.key ? 'sorted' : '',
                  c.align === 'right' ? 'text-right' : '',
                  c.sortable ? 'sortable' : '',
                ].join(' ').trim()}
                onClick={() => c.sortable && toggleSort(c.key)}
                style={c.align === 'right' ? { textAlign: 'right' } : undefined}
              >
                {c.label}
                {c.sortable && <SortIcon active={sortKey === c.key} dir={sortDir} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="loading-row">
              <td colSpan={cols.length}>
                <div className="spinner" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={cols.length}>
                <div className="empty-state">
                  <div className="icon">◎</div>
                  <p>No hay resultados para los filtros aplicados.</p>
                </div>
              </td>
            </tr>
          ) : rows.map(r => (
            <tr key={r.id}>
              {cols.map(c => (
                <td
                  key={c.key}
                  style={c.align === 'right' ? { textAlign: 'right' } : undefined}
                >
                  {c.render(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}