import { apiRequest } from "./apiClient";

export const customerProfileService = {
  // GET /customers/profile
  getProfile: () => apiRequest("/customers/profile", { auth: true }),

  // POST /customers/profile (multipart/form-data: "request" JSON part + optional "image" file)
  saveProfile: ({ image, ...profile }) => {
    const form = new FormData();
    form.append("request", new Blob([JSON.stringify(profile)], { type: "application/json" }));
    if (image) form.append("image", image);
    return apiRequest("/customers/profile", { method: "POST", body: form, auth: true });
  },
};

