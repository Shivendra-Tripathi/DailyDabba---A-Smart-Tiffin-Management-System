// The single place that talks to the backend. Pages/components never call fetch() directly.
import { API_BASE_URL } from "../config/env";
import { tokenStorage } from "../utils/tokenStorage";

// One error type for everything, so screens can just show `error.message`.
export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors; // e.g. { email: "already used" } if the backend sends it
  }
}

function friendlyMessage(status, data) {
  if (status === 401) return "Incorrect email or password.";
  if (status === 409) return data?.message || "An account with these details already exists.";
  if (status >= 500) return "Something went wrong on our side. Please try again shortly.";
  return data?.message || data?.error || "Please check the details you entered and try again.";
}

/**
 * apiRequest("/auth/login", { method: "POST", body: {...} })
 * - body can be a plain object (sent as JSON) or FormData (sent as multipart).
 * - auth: true adds the "Authorization: Bearer <token>" header (for later protected APIs).
 */
export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (auth) {
    const token = tokenStorage.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let payload = body;
  // For FormData we must NOT set Content-Type: the browser adds it with the multipart boundary.
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError("Cannot reach the server. Check your connection and try again.");
  }

  const data = await response.json().catch(() => null); // some errors have no JSON body
  if (!response.ok) {
    const fieldErrors = data?.errors && !Array.isArray(data.errors) && typeof data.errors === "object" ? data.errors : {};
    throw new ApiError(friendlyMessage(response.status, data), { status: response.status, fieldErrors });
  }
  return data;
}
