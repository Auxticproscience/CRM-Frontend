const BASE = '/api'

export async function fetchActividades(propietarioId = null) {
  const url = propietarioId
    ? `${BASE}/actividades?propietarioId=${propietarioId}`
    : `${BASE}/actividades`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error ${res.status} al cargar actividades`)
  return res.json()
}
