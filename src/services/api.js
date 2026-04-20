const BASE_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json();
}

export function fetchActividades(propietarioId = null) {
  const query = propietarioId ? `?propietarioId=${propietarioId}` : '';
  return request(`/api/actividades${query}`);
}

export function fetchCotizaciones() {
  return request('/api/cotizaciones');
}

export function fetchCotizacionById(id) {
  return request(`/api/cotizaciones/${id}`);
}

export function createCotizacion(data) {
  return request('/api/cotizaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function updateCotizacion(id, data) {
  return request(`/api/cotizaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function deleteCotizacion(id) {
  return request(`/api/cotizaciones/${id}`, {
    method: 'DELETE',
  });
}