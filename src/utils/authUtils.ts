import axios from "axios";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string; // Role claim
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string; // User ID claim
  exp?: number; 
  iss?: string; 
  aud?: string; 
  [key: string]: any;
}

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
