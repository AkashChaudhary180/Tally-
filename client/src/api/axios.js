import axios from "axios";

// One shared axios instance so we don't repeat the baseURL everywhere.
const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// This runs before EVERY request made with `api`. It automatically
// attaches the JWT token (if we have one) to the Authorization header,
// so we never have to remember to do it manually in each component.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;