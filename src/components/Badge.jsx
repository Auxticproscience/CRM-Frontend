export function Badge({ value }) {
  if (!value) return <span className="badge badge-gray">—</span>

  const map = {
    'Realizada':   'badge-green',
    'En Proceso':  'badge-amber',
    'Asignada':    'badge-blue',
    'Visita':      'badge-blue',
    'Llamadas':    'badge-gray',
    'Gestión':     'badge-gray',
  }
  const cls = map[value] ?? 'badge-gray'
  return <span className={`badge ${cls}`}>{value}</span>
}
