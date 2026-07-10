const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:4000/api";

const TOKEN_KEY = "chadi_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// ---- Public form submissions ----

export function sendContactMessage(payload) {
  return request("/contact", { method: "POST", body: JSON.stringify(payload) });
}

export function submitVolunteerApplication(payload) {
  return request("/volunteers", { method: "POST", body: JSON.stringify(payload) });
}

export function subscribeToNewsletter(payload) {
  return request("/newsletter", { method: "POST", body: JSON.stringify(payload) });
}

export function recordDonationInterest(payload) {
  return request("/donations", { method: "POST", body: JSON.stringify(payload) });
}

export function verifyPayment(reference) {
  return request("/payments/verify", { method: "POST", body: JSON.stringify({ reference }) });
}

// ---- Auth ----

export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export function logout() {
  setToken(null);
}

export function getCurrentUser() {
  return request("/auth/me").then((data) => data.user);
}

export function forgotPassword(email) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token, password) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

// ---- Site settings ----

export function getSettings() {
  return request("/settings");
}

export function updateSettings(payload) {
  return request("/settings", { method: "PUT", body: JSON.stringify(payload) });
}

// ---- Read-only reference content ----

export function getPrograms() {
  return request("/programs");
}

export function getNews() {
  return request("/news");
}

// ---- Generic CRUD resource client, used for every CMS-managed collection ----

export function createResourceApi(resource) {
  return {
    list: () => request(`/${resource}`),
    get: (id) => request(`/${resource}/${id}`),
    create: (payload) => request(`/${resource}`, { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
    patch: (id, payload) => request(`/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  };
}

export const projectsApi = createResourceApi("projects");
export const eventsApi = createResourceApi("events");
export const teamApi = createResourceApi("team");
export const galleryApi = createResourceApi("gallery");
export const partnersApi = createResourceApi("partners");
export const storiesApi = createResourceApi("stories");
export const usersApi = createResourceApi("users");
export const messagesApi = createResourceApi("contact");
export const volunteersApi = createResourceApi("volunteers");
export const newsletterApi = createResourceApi("newsletter");
export const donationsApi = createResourceApi("donations");

export function getAdminSummary() {
  return request("/admin/summary");
}
