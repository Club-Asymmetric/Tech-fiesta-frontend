// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return await response.json();
}

// Authenticated API request function
async function authenticatedApiRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// Events API
export const eventsApi = {
  getAll: async () => {
    const response = await apiRequest("/events");
    return response.data;
  },

  getTechEvents: async () => {
    const response = await apiRequest("/events/tech");
    return response.data;
  },

  getNonTechEvents: async () => {
    const response = await apiRequest("/events/non-tech");
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await apiRequest("/events/upcoming");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiRequest(`/events/${id}`);
    return response.data;
  },
};

// Workshops API
export const workshopsApi = {
  getAll: async () => {
    const response = await apiRequest("/workshops");
    return response.data;
  },

  getByCategory: async (category: string) => {
    const response = await apiRequest(`/workshops/category/${category}`);
    return response.data;
  },

  getByLevel: async (level: string) => {
    const response = await apiRequest(`/workshops/level/${level}`);
    return response.data;
  },

  getAvailable: async () => {
    const response = await apiRequest("/workshops/available");
    return response.data;
  },

  getCategories: async () => {
    const response = await apiRequest("/workshops/categories");
    return response.data;
  },

  getLevels: async () => {
    const response = await apiRequest("/workshops/levels");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiRequest(`/workshops/${id}`);
    return response.data;
  },
};

// Registration API
export const registrationApi = {
  checkDuplicate: async (email: string, whatsapp: string, token: string) => {
    const response = await authenticatedApiRequest(
      "/registration/check-duplicate",
      token,
      {
        method: "POST",
        body: JSON.stringify({ email, whatsapp }),
      }
    );
    return response.data;
  },

  submit: async (formData: any, token: string) => {
    const response = await authenticatedApiRequest(
      "/registration/submit",
      token,
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );
    return response;
  },

  getMyRegistrations: async (token: string) => {
    const response = await authenticatedApiRequest(
      "/registration/my-registrations",
      token
    );
    return response.data;
  },
};

export default {
  eventsApi,
  workshopsApi,
  registrationApi,
};
