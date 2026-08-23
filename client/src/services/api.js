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

export function submitEventSignup(payload) {
  return request("/event-signups", { method: "POST", body: JSON.stringify(payload) });
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

/** Admin-only: cross-checks Paystack's own transaction list against local donations, surfacing anything missing. */
export function reconcilePayments() {
  return request("/payments/reconcile");
}

/** Admin-only: records one specific transaction a reconcile check found on Paystack but not recorded locally. */
export function importReconciledPayment(reference) {
  return request("/payments/reconcile/import", { method: "POST", body: JSON.stringify({ reference }) });
}

/** Admin-only: issues a full Paystack refund for a completed donation. */
export function refundDonation(donationId) {
  return request(`/payments/donations/${encodeURIComponent(donationId)}/refund`, { method: "POST" });
}

/** Reported by the Donate page when a payment succeeds on Paystack's side but the server can't confirm it - see ManagePaymentIssues. */
export function reportPaymentIssue(payload) {
  return request("/payment-issues", { method: "POST", body: JSON.stringify(payload) });
}

/** Downloads a receipt right after paying, using the transaction reference as the capability (no donor login yet at this point). */
export async function downloadReceiptByReference(reference, filename) {
  const response = await fetch(`${API_BASE_URL}/payments/receipt/${encodeURIComponent(reference)}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Could not download receipt");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "receipt.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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

/** Admin-only: every project's raised total/donor count in one call, keyed by projectId. */
export function getProjectDonationSummaries() {
  return request("/payments/project-summaries");
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

/**
 * `list`/`get` take an optional `lang` so public pages can request
 * machine-translated content (see server/src/lib/translate.js) by passing
 * the current i18n language. Deliberately opt-in, not automatic from a
 * global "current language" - the admin dashboard calls these same
 * functions to load content for editing, and must always get the original
 * text back, never a translated copy, or a save-without-changes would
 * silently overwrite the source with a machine translation.
 */
export function createResourceApi(resource) {
  return {
    list: (lang) => request(`/${resource}${lang ? `?lang=${encodeURIComponent(lang)}` : ""}`),
    get: (id, lang) => request(`/${resource}/${id}${lang ? `?lang=${encodeURIComponent(lang)}` : ""}`),
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
export const blogApi = createResourceApi("blog");
export const usersApi = createResourceApi("users");
export const messagesApi = createResourceApi("contact");
export const volunteersApi = createResourceApi("volunteers");
export const eventSignupsApi = createResourceApi("event-signups");
export const newsletterApi = createResourceApi("newsletter");
export const donationsApi = createResourceApi("donations");
export const paymentIssuesApi = createResourceApi("payment-issues");

export function getAdminSummary() {
  return request("/admin/summary");
}

// ---- Donor self-service portal ----
// Deliberately separate from the admin `request()`/token above - a donor
// session token is a different, much lower-privilege scope (see
// server/src/lib/auth.js) and must never be sent as the admin Bearer token.

const DONOR_TOKEN_KEY = "chadi_donor_token";

export function getDonorToken() {
  return localStorage.getItem(DONOR_TOKEN_KEY);
}

export function setDonorToken(token) {
  if (token) localStorage.setItem(DONOR_TOKEN_KEY, token);
  else localStorage.removeItem(DONOR_TOKEN_KEY);
}

async function donorRequest(path, options = {}) {
  const token = getDonorToken();

  const response = await fetch(`${API_BASE_URL}/donor-portal${path}`, {
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

export function requestDonorLink(email) {
  return donorRequest("/request-link", { method: "POST", body: JSON.stringify({ email }) });
}

export async function verifyDonorLink(token) {
  const data = await donorRequest("/verify", { method: "POST", body: JSON.stringify({ token }) });
  setDonorToken(data.token);
  return data.email;
}

export function getDonorDonations() {
  return donorRequest("/donations");
}

export function cancelDonorSubscription(donationId) {
  return donorRequest(`/subscriptions/${encodeURIComponent(donationId)}/cancel`, { method: "POST" });
}

export function donorLogout() {
  setDonorToken(null);
}

/** Downloads a donation receipt PDF, triggering a browser save-as. */
export async function downloadDonorReceipt(donationId, filename) {
  const token = getDonorToken();
  const response = await fetch(`${API_BASE_URL}/donor-portal/receipt/${encodeURIComponent(donationId)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Could not download receipt");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "receipt.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
