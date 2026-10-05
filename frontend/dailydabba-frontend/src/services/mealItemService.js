import { apiRequest } from "./apiClient";

export const mealItemService = {
  // GET /meal-items/vendor?page=0&size=10
  getMealItems: ({ page = 0, size = 10 } = {}) =>
    apiRequest(`/meal-items/vendor?page=${page}&size=${size}`, { auth: true }),

  // GET /meal-items/vendor/{id}
  getMealItem: (id) =>
    apiRequest(`/meal-items/vendor/${id}`, { auth: true }),

  // POST /meal-items/vendor (multipart/form-data: "request" JSON + optional "image")
  createMealItem: ({ image, ...itemData }) => {
    const form = new FormData();
    form.append("request", new Blob([JSON.stringify(itemData)], { type: "application/json" }));
    if (image) form.append("image", image);
    return apiRequest("/meal-items/vendor", { method: "POST", body: form, auth: true });
  },

  // PUT /meal-items/vendor/{id} (multipart/form-data: "request" JSON + optional "image")
  updateMealItem: (id, { image, ...itemData }) => {
    const form = new FormData();
    form.append("request", new Blob([JSON.stringify(itemData)], { type: "application/json" }));
    if (image) form.append("image", image);
    return apiRequest(`/meal-items/vendor/${id}`, { method: "PUT", body: form, auth: true });
  },

  // DELETE /meal-items/vendor/{id}
  deleteMealItem: (id) =>
    apiRequest(`/meal-items/vendor/${id}`, { method: "DELETE", auth: true }),
};
