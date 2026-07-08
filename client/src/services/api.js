const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function sendContactMessage(payload) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitVolunteerApplication(payload) {
  return request("/volunteers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function subscribeToNewsletter(payload) {
  return request("/newsletter", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function recordDonationInterest(payload) {
  return request("/donations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
