const BASE = import.meta.env.VITE_API_URL;

export async function fetchActividades(propietarioId = null) {
  const url = propietarioId
    ? `${BASE}/api/actividades?propietarioId=${propietarioId}`
    : `${BASE}/api/actividades`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status} al cargar actividades`);
  }

  return res.json();
}