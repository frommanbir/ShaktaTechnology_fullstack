import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('last_contact_count');
      localStorage.removeItem('viewed_contacts');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const checkAuth = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/login', credentials);
  if (response.data.success) {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user_email', credentials.email);
  }
  return response.data;
};

export const getMembers = async (page: number = 1, limit: number = 10) => {
  const response = await api.get(`/members?page=${page}&limit=${limit}`);
  return response.data;
};

export const getMember = async (id: number) => {
  const response = await api.get(`/members/${id}`);
  return response.data.data;
};

export const createMember = async (formData: FormData) => {
  const response = await api.post("/members", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


// FIXED: Use POST with _method=PUT for file uploads
export const updateMember = async (id: number, data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      formData.append(key, data[key]);
    }
  });
  formData.append('_method', 'PUT');
  
  const response = await api.post(`/members/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteMember = async (id: number) => {
  await api.delete(`/members/${id}`);
};

export const getSettings = async () => {
  const response = await api.get('/settings',{
    
  });
  return response.data;
};

export const createSettings = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  const response = await api.post('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateSettings = async (id: number, data: any) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  formData.append("_method", "PUT");

  const response = await api.post(`/settings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


export const deleteSettings = async (id: number) => {
  await api.delete(`/settings/${id}`);
};

export const getCareers = async () => {
  const response = await api.get('/careers');
  return Array.isArray(response.data)
  ? response.data
  : response.data?.data || [];  
};

export const getCareer = async (id: number) => {
  const response = await api.get(`/careers/${id}`);
  return response.data.data;
};

export const createCareer = async (data: any) => {
  const response = await api.post('/careers', data);
  return response.data;
};

export const updateCareer = async (id: number, data: any) => {
  const response = await api.put(`/careers/${id}`, data);
  return response.data;
};

export const deleteCareer = async (id: number) => {
  await api.delete(`/careers/${id}`);
};

export const getContacts = async () => {
  const response = await api.get('/contacts');
  return response.data;
};

export const createContact = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });
  const response = await api.post('/contacts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteContact = async (id: number) => {
  await api.delete(`/contacts/${id}`);
};

export const getFaqs = async () => {
  const response = await api.get('/faqs');
  return response.data;
};

export const getFaq = async (id: number) => {
  const response = await api.get(`/faqs/${id}`);
  return response.data.data;
};

export const createFaq = async (data: any) => {
  const response = await api.post('/faqs', data);
  return response.data;
};

export const updateFaq = async (id: number, data: any) => {
  const response = await api.put(`/faqs/${id}`, data);
  return response.data;
};

export const deleteFaq = async (id: number) => {
  await api.delete(`/faqs/${id}`);
};

export const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProject = async (id: number) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.data;
};

export const createProject = async (data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
      if (Array.isArray(data[key])) {
        data[key].forEach((item: string) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  const response = await api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
export const updateProject = async (id: number, data: any) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !=='') {
      if (Array.isArray(data[key])){
        data[key].forEach((item: string) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  formData.append('_method', 'PUT');
  const response = await api.post(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProject = async (id: number) => {
  await api.delete(`/projects/${id}`);
};

// Service API Methods
export const getServices = async (page: number = 1) => {
  const response = await api.get(`/services?page=${page}&per_page=10`);
  return response.data;
};

export const getService = async (id: number) => {
  const response = await api.get(`/services/${id}`);
  return response.data.data;
};

export const createService = async (data: any) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value !== undefined && value !== null && value !== "") {
      // Handle arrays properly
      if (Array.isArray(value)) {
        value.forEach((item: string) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    }
  });

  const response = await api.post("/services", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export async function updateService(id: number, data: any) {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item: string) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    }
  });

  formData.append("_method", "PUT");

  const response = await api.post(`/services/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export const deleteService = async (id: number) => {
  await api.delete(`/services/${id}`);
};

//Gallery API Methods

export const getGalleries = async () => {
  const response = await api.get('/galleries');
  return Array.isArray(response.data)
  ? response.data
  : response.data?.data || [];
};

export const getGallery = async (id: number) => {
  const response = await api.get(`/galleries/${id}`);
  return response.data;
};

export const createGallery = async (data: FormData) => {
    const response = await api.post('/galleries', data);
    return response.data;
  };


export const updateGallery = async (id: number, data: FormData) => {
    if (!data.has('_method')) {
      data.append('_method', 'PUT');
    }

    const response = await api.post(`/galleries/${id}`, data);
    return response.data;
  };


export const deleteGallery = async (id: number) => {
  await api.delete(`/galleries/${id}`);
};

//NEWS API METHODS

export const getNews = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get(`/news?page=${page}&limit=${limit}`);
    const payload = response.data;

    if (Array.isArray(payload?.data?.data)) {
      return payload.data.data;
    }

    // Non-paginated fallback
    if (Array.isArray(payload?.data)) {
      return payload.data;
    }

    // Raw array fallback (if backend returns [] directly)
    if (Array.isArray(payload)) {
      return payload;
    }

    console.warn("Unexpected news response format:", payload);
    return [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
  }
};
export const getNewsItem = async (id: number) => {
  try {
    const response = await api.get(`/news/${id}`);
    // Always return the data object, fallback to null
    return response.data?.data || null;
  } catch (error) {
    console.error(`Failed to fetch news item ${id}:`, error);
    return null;
  }
};

export const createNews = async (data: FormData) => {
  try {
    const response = await api.post("/news", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Failed to create news:", error.response?.data || error);
    throw error;
  }
};

export const updateNews = async (id: number, formData: FormData) => {
  if (!formData.has("_method")) {
    formData.append("_method", "PUT");
  }

  const response = await api.post(`/news/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};


export const deleteNews = async (id: number) => {
  try {
    await api.delete(`/news/${id}`);
  } catch (error) {
    console.error(`Failed to delete news ${id}:`, error);
    throw error;
  }
};

// Testimonials API Methods
export const getTestimonials = async () => {
  const response = await api.get('/testimonials');
  return Array.isArray(response.data)
    ? response.data
    : response.data?.data || [];
};

export const getTestimonial = async (id: number) => {
  const response = await api.get(`/testimonials/${id}`);
  return response.data.data;
};

export const createTestimonial = async (data: FormData) => {
  const response = await api.post('/testimonials', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateTestimonial = async (id: number, data: FormData) => {
  if (!data.has('_method')) {
    data.append('_method', 'PUT');
  }

  const response = await api.post(`/testimonials/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteTestimonial = async (id: number) => {
  await api.delete(`/testimonials/${id}`);
};

//visit counter api

export const trackVisit = async (page: string = "/") => {
  try{
    await api.post('/track-visit', { page });
  }catch (error){
    console.error('Error tracking visit:', error);
  }
};

export const getVisitCount = async () => {
  try{
    const response = await api.get("/track-visit");
    return response.data.total ?? 0;
  }catch (error){
    console.error('Error fetching visit count:', error);
    return 0;
  }
};

export const apiClient = {
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('last_contact_count');
      localStorage.removeItem('viewed_contacts');
    }
  },
  clearToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('last_contact_count');
    localStorage.removeItem('viewed_contacts');
  },
};