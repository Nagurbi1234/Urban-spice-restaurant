import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("urban-spice-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can read err.message directly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// Mongoose documents come back with `_id`; the UI is written against `id`.
// This keeps every component simple by normalizing the shape in one place.
export function normalize(doc) {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(normalize);
  if (typeof doc !== "object") return doc;
  const { _id, __v, ...rest } = doc;
  return _id ? { id: _id, ...rest } : rest;
}

export default api;
