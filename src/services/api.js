import axios from "axios";

// This expects VITE_API_BASE_URL to be set in your Vercel environment variables.
// If it's not set (e.g. running locally without .env), it falls back to localhost.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString()?.trim() ||
  "http://localhost:8000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
