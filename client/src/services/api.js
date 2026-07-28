export const API_BASE_URL =
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

export async function uploadImage(file) {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Upload failed");
  }

  return data.url;
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

/** Gets (or has the server create) a reusable Paystack Plan for a monthly Hope Alive Circle amount. */
export function getOrCreateMonthlyPlan(amount) {
  return request("/payments/plan", { method: "POST", body: JSON.stringify({ amount }) });
}

export function cancelSubscription(donationId) {
  return request(`/payments/subscriptions/${encodeURIComponent(donationId)}/cancel`, { method: "POST" });
}

export function getPaypalStatus() {
  return request("/payments/paypal/status");
}

export function createPaypalOrder(payload) {
  return request("/payments/paypal/create-order", { method: "POST", body: JSON.stringify(payload) });
}

export function capturePaypalOrder(payload) {
  return request("/payments/paypal/capture-order", { method: "POST", body: JSON.stringify(payload) });
}

/** Sends an update email to every newsletter subscriber (new/updated project or news announcement). */
export function sendBroadcast(payload) {
  return request("/broadcast", { method: "POST", body: JSON.stringify(payload) });
}

export function getProjectDonationSummary(projectId) {
  return request(`/payments/project-summary/${encodeURIComponent(projectId)}`);
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
export const testimonialsApi = createResourceApi("testimonials");
export const faqsApi = createResourceApi("faqs");
export const reportsApi = createResourceApi("reports");
export const boardApi = createResourceApi("board");
export const newsApi = createResourceApi("news");
export const usersApi = createResourceApi("users");
export const messagesApi = createResourceApi("contact");
export const volunteersApi = createResourceApi("volunteers");
export const newsletterApi = createResourceApi("newsletter");
export const donationsApi = createResourceApi("donations");

export function getAdminSummary() {
  return request("/admin/summary");
}
