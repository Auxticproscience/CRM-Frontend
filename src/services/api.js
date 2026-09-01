const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function request(endpoint, options = {}) {
  if (!BASE_URL) {
    throw new Error('No se configuró VITE_API_URL.');
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    let message = `Error ${res.status} al consultar el servidor.`;

    try {
      const payload = await res.json();
      message = payload.mensaje || payload.message || message;
    } catch {
      throw new Error(message, "Error al analizar la respuesta del servidor.");
    }

    throw new Error(message);
  }

  return res.json();
}

export function fetchActividades(propietarioId = null) {
  const query = propietarioId ? `?propietarioId=${propietarioId}` : '';
  return request(`/api/actividades${query}`);
}

export async function fetchCotizaciones({ desde, hasta, signal } = {}) {
  const rows = [];
  let page = 0;

  while (true) {
    const query = new URLSearchParams({
      page: String(page),
      size: '200',
    });

    if (desde) query.set('desde', desde);
    if (hasta) query.set('hasta', hasta);

    const result = await request(`/api/cotizaciones?${query.toString()}`, { signal });

    if (!result || !Array.isArray(result.content)) {
      throw new Error('El servidor devolvió un formato de cotizaciones no válido.');
    }

    rows.push(...result.content);

    const totalPages = Number(result.totalPages) || 0;
    if (result.last === true || page + 1 >= totalPages) break;

    page += 1;
  }

  return rows;
}
