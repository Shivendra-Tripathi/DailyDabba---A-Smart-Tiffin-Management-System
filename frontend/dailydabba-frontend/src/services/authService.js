// One function per auth endpoint. Shapes match the backend contract exactly.
import { apiRequest } from "./apiClient";

export const authService = {
  // POST /auth/login  -> { accessToken, tokenType }
  login: ({ email, password }) => apiRequest("/auth/login", { method: "POST", body: { email, password } }),

  // POST /auth/register (multipart) with a "request" (JSON) part and optional "image" file.
  register: ({ image, ...user }) => {
    const form = new FormData();
    // The "request" part must be application/json, so we wrap the JSON in a typed Blob.
    form.append("request", new Blob([JSON.stringify(user)], { type: "application/json" }));
    if (image) form.append("image", image);
    return apiRequest("/auth/register", { method: "POST", body: form });
  },
};
