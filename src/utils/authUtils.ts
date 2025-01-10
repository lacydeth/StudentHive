import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string; // Role claim
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string; // User ID claim
  exp?: number; // Expiration time
  iss?: string; // Issuer
  aud?: string; // Audience
  [key: string]: any; // For additional claims
}

export const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    console.log("Decoded Token:", decoded);
    
    // Access the role claim
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
