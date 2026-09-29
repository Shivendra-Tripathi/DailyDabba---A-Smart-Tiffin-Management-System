// Reads settings from the ".env" file. Never put secrets here: everything in a frontend is public.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
