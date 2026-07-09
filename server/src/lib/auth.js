import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "node:crypto";
import { readCollection, writeCollection, generateId } from "./store.js";

// No JWT/bcrypt dependency is used on purpose - this keeps the backend
// lightweight while still hashing passwords properly (scrypt) and signing
// session tokens (HMAC-SHA256) so they cannot be forged or tampered with.

const AUTH_SECRET = process.env.AUTH_SECRET || "chadi-dev-secret-change-me";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

if (!process.env.AUTH_SECRET) {
  console.warn(
    "[auth] AUTH_SECRET is not set. Using an insecure default - set AUTH_SECRET in your environment before deploying this anywhere real."
  );
}

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@chadi-international.org";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChadiAdmin!2026";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;

  const derived = scryptSync(password, salt, 64);
  const stored64 = Buffer.from(hash, "hex");

  if (derived.length !== stored64.length) return false;
  return timingSafeEqual(derived, stored64);
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(payloadB64) {
  return createHmac("sha256", AUTH_SECRET).update(payloadB64).digest("base64url");
}

export function createToken(payload, ttlMs = TOKEN_TTL_MS) {
  const body = { ...payload, exp: Date.now() + ttlMs };
  const payloadB64 = base64url(JSON.stringify(body));
  const signature = sign(payloadB64);
  return `${payloadB64}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  const [payloadB64, signature] = token.split(".");
  const expected = sign(payloadB64);

  const sigBuf = Buffer.from(signature || "", "base64url");
  const expBuf = Buffer.from(expected, "base64url");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const body = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!body.exp || Date.now() > body.exp) return null;
    return body;
  } catch {
    return null;
  }
}

function seedUsers() {
  return [
    {
      id: generateId("user"),
      name: "CHADI Admin",
      email: DEFAULT_ADMIN_EMAIL,
      role: "admin",
      passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
      createdAt: new Date().toISOString(),
      resetToken: null,
      resetTokenExpires: null,
    },
  ];
}

export async function getUsers() {
  return readCollection("users", seedUsers);
}

export async function saveUsers(users) {
  return writeCollection("users", users);
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, resetToken, resetTokenExpires, ...safe } = user;
  return safe;
}

export async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());
}

export async function createPasswordResetToken(email) {
  const users = await getUsers();
  const user = users.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());
  if (!user) return null;

  const token = randomBytes(24).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + RESET_TOKEN_TTL_MS;
  await saveUsers(users);
  return token;
}

export async function resetPasswordWithToken(token, newPassword) {
  const users = await getUsers();
  const user = users.find((u) => u.resetToken && u.resetToken === token);

  if (!user || !user.resetTokenExpires || Date.now() > user.resetTokenExpires) {
    return false;
  }

  user.passwordHash = hashPassword(newPassword);
  user.resetToken = null;
  user.resetTokenExpires = null;
  await saveUsers(users);
  return true;
}

/** Express middleware requiring a valid Bearer session token. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  req.user = payload;
  next();
}
