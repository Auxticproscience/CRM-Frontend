import { Badge } from './Badge.jsx'

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

const COLS = [
  { key: 'fechaCreacion', label: 'Fecha' },
  { key: 'nombre',        label: 'Nombre / Asunto' },
  { key: 'estado',        label: 'Estado' },
  { key: 'tipo',          label: 'Tipo' },
  { key: 'propietario',   label: 'Asesor' },
  { key: 'cliente',       label: 'Cliente' },
  { key: 'lugar',         label: 'Lugar' },
]

export function ActividadesTable({ rows, loading, sortKey, sortDir, toggleSort }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {COLS.map(c => (
              <th
                key={c.key}
                className={sortKey === c.key ? 'sorted' : ''}
                onClick={() => toggleSort(c.key)}
              >
                {c.label}
                <SortIcon active={sortKey === c.key} dir={sortDir} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="loading-row">
              <td colSpan={COLS.length}>
                <div className="spinner" />
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={COLS.length}>
                <div className="empty-state">
                  <div className="icon">◎</div>
                  <p>No hay resultados para los filtros aplicados.</p>
                </div>
              </td>
            </tr>
          ) : rows.map(r => (
            <tr key={r.id}>
              <td className="mono">{fmtFecha(r.fechaCreacion)}</td>
              <td className="primary" style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.nombre || '—'}
              </td>
              <td><Badge value={r.estado} /></td>
              <td><Badge value={r.tipo} /></td>
              <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.propietario || '—'}
              </td>
              <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.cliente || '—'}
              </td>
              <td>{r.lugar || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
