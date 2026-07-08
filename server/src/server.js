import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { events, news, programs, projects, stats } from "./data.js";

const submissionsFile = new URL("../data/submissions.json", import.meta.url);
const port = Number(process.env.PORT || 4000);

const routes = {
  "/api/health": { status: "ok", service: "chadi-api" },
  "/api/programs": programs,
  "/api/projects": projects,
  "/api/news": news,
  "/api/events": events,
  "/api/stats": stats,
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk;

    if (body.length > 1_000_000) {
      throw new Error("Request body is too large");
    }
  }

  return body ? JSON.parse(body) : {};
}

async function readSubmissions() {
  try {
    const file = await readFile(submissionsFile, "utf8");
    return JSON.parse(file);
  } catch {
    return {
      contacts: [],
      volunteers: [],
      newsletter: [],
      donations: [],
    };
  }
}

async function saveSubmission(type, payload) {
  const submissions = await readSubmissions();
  const entry = {
    id: `${type}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  submissions[type] = [entry, ...(submissions[type] || [])];

  await mkdir(new URL("../data/", import.meta.url), { recursive: true });
  await writeFile(submissionsFile, JSON.stringify(submissions, null, 2));

  return entry;
}

function requireFields(payload, fields) {
  const missing = fields.filter((field) => !String(payload[field] || "").trim());

  if (missing.length) {
    return `Missing required field: ${missing.join(", ")}`;
  }

  return "";
}

async function handlePost(path, request, response) {
  const payload = await readJsonBody(request);

  const postRoutes = {
    "/api/contact": {
      type: "contacts",
      fields: ["name", "email", "subject", "message"],
    },
    "/api/volunteers": {
      type: "volunteers",
      fields: ["name", "email", "area"],
    },
    "/api/newsletter": {
      type: "newsletter",
      fields: ["email"],
    },
    "/api/donations": {
      type: "donations",
      fields: ["name", "email", "interest"],
    },
  };

  const config = postRoutes[path];

  if (!config) {
    sendJson(response, 404, { error: "Route not found" });
    return;
  }

  const validationError = requireFields(payload, config.fields);

  if (validationError) {
    sendJson(response, 400, { error: validationError });
    return;
  }

  const entry = await saveSubmission(config.type, payload);
  sendJson(response, 201, { message: "Submission received", data: entry });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  try {
    if (request.method === "GET" && routes[path]) {
      sendJson(response, 200, routes[path]);
      return;
    }

    if (request.method === "POST") {
      await handlePost(path, request, response);
      return;
    }

    sendJson(response, 404, { error: "Route not found" });
  } catch (error) {
    sendJson(response, 500, {
      error: error.message || "Server error",
    });
  }
});

server.listen(port, () => {
  console.log(`CHADI API running on http://127.0.0.1:${port}`);
});
