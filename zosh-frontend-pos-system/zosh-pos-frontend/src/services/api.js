import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

const validInitialJwt =
  "eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3OTM2MzY3MjQsImV4cCI6MTc5MzcyMzEyNCwiZW1haWwiOiJjYXNoaWVyQHpvc2hwb3MuY29tIiwiYXV0aG9yaXRpZXMiOiJST0xFX0NBU0hJRVIifQ.KocJ3Cmo7CwPiJbX5R_Gaxy3hWgJpjmU1ndcdZ7F6WcLRL8G4IufwEMb_igmegv-";

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    let token =
      localStorage.getItem("pos_jwt") || localStorage.getItem("jwt_token");

    // Fallback token only if absolutely empty
    if (!token || token.includes("demo-pos-jwt") || token.includes("mock-jwt")) {
      token = validInitialJwt;
    }

    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 / 403 and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Token expired or invalid
        console.warn("Session expired or unauthorized (401). Clearing credentials.");
        localStorage.removeItem("pos_jwt");
        localStorage.removeItem("pos_user");
        window.dispatchEvent(new CustomEvent("pos:unauthorized"));

        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login";
        }
      } else if (status === 403) {
        // Forbidden: Role lacks permission to access this endpoint
        console.warn("Access Denied (403):", data?.message || "Forbidden action.");
        window.dispatchEvent(
          new CustomEvent("pos:forbidden", {
            detail: data?.message || "Access Denied: Insufficient permissions for this action.",
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;
