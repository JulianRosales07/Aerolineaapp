const API_BASE_URL = 'http://localhost:4000/api';

// Configuración base para fetch
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log(`API Request: ${config.method || 'GET'} ${url}`);
  if (options.body) {
    console.log('Request body:', options.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        console.error(`API Error Response for ${endpoint}:`, errorData);
        errorMessage += ` - ${errorData}`;
      } catch (e) {
        console.error('Could not parse error response');
      }
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    console.log(`API Response for ${endpoint}:`, result);
    return result;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// 🛫 Aeronaves API
export const aeronavesAPI = {
  getAll: () => apiRequest('/aeronaves'),
  getById: (id: string) => apiRequest(`/aeronaves/${id}`),
  create: (data: any) => apiRequest('/aeronaves', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/aeronaves/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/aeronaves/${id}`, {
    method: 'DELETE',
  }),
};

// 🏢 Aeropuertos API
export const aeropuertosAPI = {
  getAll: () => apiRequest('/aeropuertos'),
  getById: (id: string) => apiRequest(`/aeropuertos/${id}`),
  create: (data: any) => apiRequest('/aeropuertos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/aeropuertos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/aeropuertos/${id}`, {
    method: 'DELETE',
  }),
};

// 🛂 Check-in API
export const checkinAPI = {
  getAll: () => apiRequest('/checkin'),
  getById: (id: string) => apiRequest(`/checkin/${id}`),
  create: (data: any) => apiRequest('/checkin', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/checkin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/checkin/${id}`, {
    method: 'DELETE',
  }),
};

// 🎒 Equipajes API
export const equipajesAPI = {
  getAll: () => apiRequest('/equipajes'),
  getById: (id: string) => apiRequest(`/equipajes/${id}`),
  create: (data: any) => apiRequest('/equipajes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/equipajes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/equipajes/${id}`, {
    method: 'DELETE',
  }),
};

// 👨‍✈️ Personal API
export const personalAPI = {
  getAll: () => apiRequest('/personal'),
  getById: (id: string) => apiRequest(`/personal/${id}`),
  create: (data: any) => apiRequest('/personal', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/personal/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/personal/${id}`, {
    method: 'DELETE',
  }),
};

// 🗺️ Rutas API
export const rutasAPI = {
  getAll: () => apiRequest('/rutas'),
  getById: (id: string) => apiRequest(`/rutas/${id}`),
  create: (data: any) => apiRequest('/rutas', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/rutas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/rutas/${id}`, {
    method: 'DELETE',
  }),
};

// 🎟️ Tiquetes API
export const tiquetesAPI = {
  getAll: () => apiRequest('/tiquetes'),
  getById: (id: string) => apiRequest(`/tiquetes/${id}`),
  create: (data: any) => apiRequest('/tiquetes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/tiquetes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/tiquetes/${id}`, {
    method: 'DELETE',
  }),
};

// 👤 Usuarios API
export const usuariosAPI = {
  getAll: () => apiRequest('/usuarios'),
  getById: (id: string) => apiRequest(`/usuarios/${id}`),
  create: (data: any) => apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  }),
};

// 🛩️ Vuelos API
export const vuelosAPI = {
  getAll: () => apiRequest('/vuelos'),
  getById: (id: string) => apiRequest(`/vuelos/${id}`),
  search: (searchParams: {
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
  }) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    const queryString = params.toString();
    return apiRequest(`/vuelos${queryString ? `?${queryString}` : ''}`);
  },
  create: (data: any) => apiRequest('/vuelos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/vuelos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/vuelos/${id}`, {
    method: 'DELETE',
  }),
};

// 🛒 Compras API
export const comprasAPI = {
  getAll: () => apiRequest('/compras'),
  getById: (id: string) => apiRequest(`/compras/${id}`),
  create: (data: any) => apiRequest('/compras', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/compras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/compras/${id}`, {
    method: 'DELETE',
  }),
};