// The ONLY file that touches the JWT in the browser. To change where it is stored
// (e.g. sessionStorage), edit just this file.
const KEY = "dailydabba_access_token";

// A JWT is 3 parts joined by "."; the middle part holds "exp" (expiry, in seconds).
function isExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp ? payload.exp * 1000 <= Date.now() : false;
  } catch {
    return true; // unreadable token = treat as invalid
  }
}

export const tokenStorage = {
  get() {
    const token = localStorage.getItem(KEY);
    if (token && isExpired(token)) { localStorage.removeItem(KEY); return null; }
    return token;
  },
  set: (token) => localStorage.setItem(KEY, token),
  clear: () => localStorage.removeItem(KEY),
};
