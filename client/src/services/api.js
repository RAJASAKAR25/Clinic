import axios from 'axios';

/**
 * Configured Axios instance.
 * Base URL comes from the VITE_API_URL env variable (defaults to /api).
 * In development Vite proxies /api → http://localhost:5000.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach Bearer token for admin routes ────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token && config.url?.startsWith('/admin')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — clear stale admin session on 401 ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.startsWith('/admin')) {
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(error);
  }
);

// ── Public endpoints ──────────────────────────────────────────────────────────

/** Book a new appointment */
export const bookAppointment  = (data) => api.post('/appointments', data);

/** Fetch all dental services */
export const getServices      = ()     => api.get('/services');

/** Fetch all FAQs (public) */
export const getFaqs          = ()     => api.get('/faqs');

/** Fetch all testimonials (public) */
export const getTestimonials  = ()     => api.get('/testimonials');

/** Send a contact message */
export const sendContactMessage = (data) => api.post('/contact', data);

// ── Admin endpoints ───────────────────────────────────────────────────────────

/** Authenticate as admin */
export const adminLogin          = (credentials)  => api.post('/admin/login', credentials);

/** Fetch all appointments (admin) */
export const getAdminAppointments = ()             => api.get('/admin/appointments');

/** Fetch all contact messages (admin) */
export const getAdminMessages     = ()             => api.get('/admin/messages');

/** Update read status of a contact message (admin) */
export const updateAdminMessageReadStatus = (id, read) =>
  api.patch(`/admin/messages/${id}/read`, { read });

/** Update appointment status (admin) */
export const updateAppointmentStatus = (id, status) =>
  api.patch(`/admin/appointments/${id}/status`, { status });

/** Create billing record (admin) */
export const createAdminBill = (data) => api.post('/admin/bills', data);

/** Fetch all billing records (admin) */
export const getAdminBills = () => api.get('/admin/bills');

/** Fetch single billing record by id (admin) */
export const getAdminBillById = (id) => api.get(`/admin/bills/${id}`);

/** Update billing record by id (admin) */
export const updateAdminBill = (id, data) => api.put(`/admin/bills/${id}`, data);

/** Delete billing record by id (admin) */
export const deleteAdminBill = (id) => api.delete(`/admin/bills/${id}`);

// ── Admin FAQ CRUD ────────────────────────────────────────────────────────────

/** Create FAQ (admin) */
export const createAdminFaq = (data) => api.post('/admin/faqs', data);

/** Fetch all FAQs (admin) */
export const getAdminFaqs = () => api.get('/admin/faqs');

/** Fetch single FAQ (admin) */
export const getAdminFaqById = (id) => api.get(`/admin/faqs/${id}`);

/** Update FAQ (admin) */
export const updateAdminFaq = (id, data) => api.put(`/admin/faqs/${id}`, data);

/** Delete FAQ (admin) */
export const deleteAdminFaq = (id) => api.delete(`/admin/faqs/${id}`);

// ── Admin Testimonial CRUD ────────────────────────────────────────────────────

/** Create Testimonial (admin) */
export const createAdminTestimonial = (data) => api.post('/admin/testimonials', data);

/** Fetch all Testimonials (admin) */
export const getAdminTestimonials = () => api.get('/admin/testimonials');

/** Fetch single Testimonial (admin) */
export const getAdminTestimonialById = (id) => api.get(`/admin/testimonials/${id}`);

/** Update Testimonial (admin) */
export const updateAdminTestimonial = (id, data) => api.put(`/admin/testimonials/${id}`, data);

/** Delete Testimonial (admin) */
export const deleteAdminTestimonial = (id) => api.delete(`/admin/testimonials/${id}`);

// ── Admin Service CRUD ────────────────────────────────────────────────────────

/** Create Service (admin) */
export const createAdminService = (data) => api.post('/admin/services', data);

/** Fetch all Services (admin) */
export const getAdminServices = () => api.get('/admin/services');

/** Fetch single Service (admin) */
export const getAdminServiceById = (id) => api.get(`/admin/services/${id}`);

/** Update Service (admin) */
export const updateAdminService = (id, data) => api.put(`/admin/services/${id}`, data);

/** Delete Service (admin) */
export const deleteAdminService = (id) => api.delete(`/admin/services/${id}`);

export default api;
