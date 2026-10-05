import { apiRequest } from "./apiClient";

export const mealService = {
  // GET /meals/vendor?page=0&size=10
  getMeals: ({ page = 0, size = 10 } = {}) =>
    apiRequest(`/meals/vendor?page=${page}&size=${size}`, { auth: true }),

  // GET /meals/vendor/{mealId}
  getMeal: (mealId) =>
    apiRequest(`/meals/vendor/${mealId}`, { auth: true }),

  // POST /meals/vendor (multipart/form-data: "request" JSON + optional "image")
  createMeal: ({ image, ...mealData }) => {
    const form = new FormData();
    form.append("request", new Blob([JSON.stringify(mealData)], { type: "application/json" }));
    if (image) form.append("image", image);
    return apiRequest("/meals/vendor", { method: "POST", body: form, auth: true });
  },

  // PUT /meals/vendor/{mealId} (multipart/form-data: "request" JSON + optional "image")
  updateMeal: (mealId, { image, ...mealData }) => {
    const form = new FormData();
    form.append("request", new Blob([JSON.stringify(mealData)], { type: "application/json" }));
    if (image) form.append("image", image);
    return apiRequest(`/meals/vendor/${mealId}`, { method: "PUT", body: form, auth: true });
  },

  // DELETE /meals/vendor/{mealId}
  deleteMeal: (mealId) =>
    apiRequest(`/meals/vendor/${mealId}`, { method: "DELETE", auth: true }),
};
