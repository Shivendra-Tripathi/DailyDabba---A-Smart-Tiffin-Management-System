import { apiRequest } from "./apiClient";

export const vendorProfileService = {
  getProfile: () => apiRequest("/vendors/profile", { auth: true }),

  saveProfile: ({ image, ...profile }) => {
    const form = new FormData();
    form.append("request", new Blob([JSON.stringify(profile)], { type: "application/json" }));
    if (image) form.append("image", image);
    return apiRequest("/vendors/profile", { method: "POST", body: form, auth: true });
  },
};
