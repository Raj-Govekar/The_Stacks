import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api`,
  withCredentials: true,
});

let refreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry && !original?.url?.includes("/auth/")) {
      original._retry = true;
      if (!refreshing) {
        refreshing = true;
        try {
          await api.post("/auth/refresh");
          refreshing = false;
          return api(original);
        } catch (refreshError) {
          refreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

export function formatApiErrorDetail(detail) {
  if (Array.isArray(detail)) return detail.map(x => x.msg || String(x)).join(", ");
  return detail || "";
}

export default api;
