import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string; // Role claim
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string; // User ID claim
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

// Helper function to check if the token is expired
const isTokenExpired = (token: string): boolean => {
  const decoded: any = jwtDecode(token);
  return decoded.exp < Date.now() / 1000;
};

// Function to refresh the token
const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post("https://localhost:7067/api/auth/refresh", {}, { 
      withCredentials: true  // Optional: depending on your setup
    });

    if (response.status === 200 && response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } else {
      console.error("Token refresh failed.");
      return null;
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
    return null;
  }
};

// Create an Axios instance
const api = axios.create({
  baseURL: "https://localhost:7067/api",
});

// Add request interceptor to check for expired token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token && isTokenExpired(token)) {
      console.log("Token expired, refreshing...");
      const newToken = await refreshToken();

      if (newToken) {
        config.headers["Authorization"] = `Bearer ${newToken}`;
      } else {
        console.error("Failed to refresh token.");
        // Optionally, you can log the user out here
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject("Failed to refresh token.");
      }
    } else if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (optional) to handle token-related errors (like 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - maybe token expired or invalid
      console.error("Unauthorized, attempting to refresh token...");
      const newToken = await refreshToken();

      if (newToken) {
        // Retry the original request with the new token
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(error.config); // Retry the request
      } else {
        // If refreshing the token fails, log the user out
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Export API instance
export const apiInstance = api;

// Token-related utility functions
export const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch (error) {
    console.error("Hiba a dekódolás során:", error);
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
  } catch (error) {
    console.error("Hiba a token dekódolás során:", error);
    return null;
  }
};

export const handleLogout = async () => {
  try {
    const response = await axios.post("https://localhost:7067/api/auth/logout");

    if (response.status === 200) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      console.error("Sikertelen kijelentkezés");
    }
  } catch (error) {
    console.error("Hiba történt a kijelentkezés közben:", error);
  }
};
